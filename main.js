'auto';

var vision = require('./lib/vision.js');
var stoneminer = require('./stoneminer.js');

var control = {
  stopped: false
};

auto.waitFor();

events.observeKey();
events.onKeyDown('volume_down', function() {
  if (control.stopped) return;
  control.stopped = true;
  console.log('[중지] 볼륨 아래 버튼 감지');
});

device.keepScreenOn(60 * 60 * 1000);

try {
  console.log('[초기화] 화면 캡처 권한 요청');
  if (!vision.requestCapture()) {
    throw new Error('화면 캡처 권한을 얻지 못했습니다.');
  }

  console.log('[초기화] 준비 완료');
  stoneminer.run(control);
} catch (e) {
  console.error('[오류] ' + e);
  if (e && e.stack) console.error(e.stack);
} finally {
  control.stopped = true;
  vision.clearCache();
  device.cancelKeepingAwake();
}
