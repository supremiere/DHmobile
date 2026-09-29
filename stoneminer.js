var config = require('./config.js');
var vision = require('./lib/vision.js');
var input = require('./lib/input.js');

function challengeIsConfirmedOnce() {
  var screen = vision.capture();
  try {
    var challenge = vision.findBestOnScreen(screen, 'challenge');
    var selected = vision.findBestOnScreen(screen, 'selected');

    if (!challenge) return false;
    if (!selected) return challenge.score >= config.thresholds.challenge;

    return (
      challenge.score >= config.thresholds.challenge &&
      challenge.score >= selected.score + config.challengeMargin
    );
  } finally {
    vision.safeRecycle(screen);
  }
}

function confirmChallenge(control) {
  var confirmed = 0;

  while (!control.stopped && confirmed < config.challengeConfirmCount) {
    if (challengeIsConfirmedOnce()) {
      confirmed += 1;
    } else {
      confirmed = 0;
      return false;
    }

    if (confirmed < config.challengeConfirmCount) {
      sleep(config.challengeConfirmIntervalMs);
    }
  }

  return confirmed >= config.challengeConfirmCount;
}

function disableCoinUntilChallenge(control) {
  var attempt = 0;

  while (!control.stopped) {
    attempt += 1;
    console.log('[동전] 해제 시도 ' + attempt + '회');

    var coin = vision.waitFor('coinoff', 0, null, control);
    if (!coin) return false;

    input.tapMatch(coin, 'coinoff.png');
    sleep(120);

    if (confirmChallenge(control)) {
      console.log('[동전] challenge 2회 확인 완료');
      return true;
    }

    console.log('[동전] challenge 미확인 -> coinoff부터 재시도');
    sleep(120);
  }

  return false;
}

function tryTap(name, timeoutMs, control) {
  var match = vision.waitFor(name, timeoutMs, null, control);
  if (!match) return false;
  return input.tapMatch(match, name + '.png');
}

function run(control) {
  var completedRuns = 0;

  console.log('=== DungeonHelper Android / StoneMiner 시작 ===');
  console.log('볼륨 아래 버튼을 누르면 중지합니다.');

  while (!control.stopped) {
    console.log('[단계] coin');
    if (!disableCoinUntilChallenge(control)) break;

    sleep(340);

    console.log('[단계] dungeon_enter');
    if (!input.enterDungeon(vision, control)) break;
    console.log('[입장] 모바일 입장 버튼 탭 완료');

    console.log('[단계] dungeon_running');
    var complete = vision.waitFor('complete', 0, null, control);
    if (!complete) break;
    input.tapMatch(complete, 'dungeon-complete.png');
    console.log('[완료] 던전 완료 버튼 탭');

    console.log('[단계] skip');
    if (!tryTap('skip', 1500, control)) {
      console.log('[skip] 없음 -> 정상 진행');
    }

    console.log('[단계] clear_wait');
    vision.waitUntilGone('complete', 15000, null, control);
    sleep(350);

    console.log('[단계] again');
    if (!tryTap('again', 0, control)) break;

    console.log('[단계] keep');
    if (!tryTap('keep', 1000, control)) {
      console.log('[keep] 없음 -> 다음 루프');
    }

    completedRuns += 1;
    console.log('[완료] ' + completedRuns + '회 주행 완료');
  }

  console.log('=== StoneMiner 중지 ===');
}

module.exports = {
  run: run
};
