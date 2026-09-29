var config = require('../config.js');

var templateCache = {};

function assetPath(name) {
  var filename = config.assetFiles[name] || (name + '.png');
  return files.join(files.cwd(), 'assets', filename);
}

function safeRecycle(image) {
  if (!image || typeof image.recycle !== 'function') return;
  try {
    image.recycle();
  } catch (e) {
    // 이미 해제된 이미지 등은 무시합니다.
  }
}

function requestCapture() {
  // AutoX.js v7.2.3+의 legacy 방식이 있으면 우선 사용합니다.
  if (images.requestScreenCaptureLegacy) {
    return images.requestScreenCaptureLegacy(true);
  }
  if (images.requestScreenCapture) {
    return images.requestScreenCapture(true);
  }
  return requestScreenCapture(true);
}

function capture() {
  return captureScreen();
}

function ratioRegionToPixels(region, screen) {
  if (!region) return null;
  var width = screen.getWidth();
  var height = screen.getHeight();
  return [
    Math.max(0, Math.floor(width * region[0])),
    Math.max(0, Math.floor(height * region[1])),
    Math.max(1, Math.floor(width * region[2])),
    Math.max(1, Math.floor(height * region[3]))
  ];
}

function getVariants(name) {
  if (templateCache[name]) return templateCache[name];

  var path = assetPath(name);
  if (!files.exists(path)) {
    throw new Error('템플릿 파일이 없습니다: ' + path);
  }

  var source = images.read(path);
  if (!source) {
    throw new Error('템플릿을 읽지 못했습니다: ' + path);
  }

  var variants = [];
  config.templateScales.forEach(function(scale) {
    var image = source;
    if (Math.abs(scale - 1.0) > 0.001) {
      image = images.scale(source, scale, scale);
    }
    variants.push({
      scale: scale,
      image: image
    });
  });

  templateCache[name] = {
    source: source,
    variants: variants
  };
  return templateCache[name];
}

function bestMatchFromResult(result, scale) {
  if (!result || !result.matches || result.matches.length === 0) return null;

  var best = null;
  result.matches.forEach(function(match) {
    var score = Number(
      match.similarity !== undefined ? match.similarity :
      match.score !== undefined ? match.score : 0
    );
    if (!best || score > best.score) {
      best = {
        x: match.point.x,
        y: match.point.y,
        score: score,
        scale: scale
      };
    }
  });
  return best;
}

function findBestOnScreen(screen, name, options) {
  options = options || {};
  var threshold = options.threshold !== undefined
    ? options.threshold
    : (config.thresholds[name] || 0.72);

  var regionRatio = options.region !== undefined
    ? options.region
    : config.regions[name];
  var region = ratioRegionToPixels(regionRatio, screen);

  var cached = getVariants(name);
  var best = null;

  cached.variants.forEach(function(variant) {
    var image = variant.image;
    if (!image) return;

    var opts = {
      threshold: threshold,
      max: 1
    };
    if (region) opts.region = region;

    var result;
    try {
      result = images.matchTemplate(screen, image, opts);
    } catch (e) {
      // 템플릿이 화면보다 커지는 스케일 등은 건너뜁니다.
      return;
    }

    var found = bestMatchFromResult(result, variant.scale);
    if (!found) return;

    found.width = image.getWidth();
    found.height = image.getHeight();

    if (!best || found.score > best.score) {
      best = found;
    }
  });

  return best;
}

function findBest(name, options) {
  var screen = capture();
  try {
    return findBestOnScreen(screen, name, options);
  } finally {
    safeRecycle(screen);
  }
}

function waitFor(name, timeoutMs, options, control) {
  var started = Date.now();
  var lastLog = 0;

  while (!control || !control.stopped) {
    var found = findBest(name, options);
    if (found) return found;

    if (timeoutMs > 0 && Date.now() - started >= timeoutMs) {
      return null;
    }

    if (Date.now() - lastLog >= 5000) {
      console.log('[대기] ' + (config.assetFiles[name] || (name + '.png')));
      lastLog = Date.now();
    }
    sleep(config.pollMs);
  }
  return null;
}

function waitUntilGone(name, timeoutMs, options, control) {
  var started = Date.now();

  while (!control || !control.stopped) {
    if (!findBest(name, options)) return true;
    if (timeoutMs > 0 && Date.now() - started >= timeoutMs) return false;
    sleep(config.pollMs);
  }
  return false;
}

function clearCache() {
  Object.keys(templateCache).forEach(function(name) {
    var cached = templateCache[name];
    cached.variants.forEach(function(variant) {
      if (variant.image !== cached.source) safeRecycle(variant.image);
    });
    safeRecycle(cached.source);
  });
  templateCache = {};
}

module.exports = {
  requestCapture: requestCapture,
  capture: capture,
  findBest: findBest,
  findBestOnScreen: findBestOnScreen,
  waitFor: waitFor,
  waitUntilGone: waitUntilGone,
  safeRecycle: safeRecycle,
  clearCache: clearCache
};
