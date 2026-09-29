var config = require('../config.js');

function tapMatch(match, label) {
  if (!match) return false;

  var x = Math.floor(match.x + match.width / 2);
  var y = Math.floor(match.y + match.height / 2);

  click(x, y);
  console.log(
    '[탭] ' + label +
    ' / x=' + x + ' y=' + y +
    ' / score=' + match.score.toFixed(3) +
    ' / scale=' + match.scale.toFixed(2)
  );
  sleep(config.tapAfterMs);
  return true;
}

function waitAndTap(vision, name, timeoutMs, options, control) {
  var match = vision.waitFor(name, timeoutMs, options, control);
  if (!match) return false;
  return tapMatch(match, name + '.png');
}

// Windows의 SPACE 입장 대체.
// 모바일에서는 실제 화면의 입장 버튼을 찾아 누릅니다.
function enterDungeon(vision, control) {
  console.log('[입장] SPACE 대체 -> enter_solo2.png 검색');
  return waitAndTap(vision, 'enter_solo2', 0, null, control);
}

// Windows의 ESC 대체.
// menu.png는 사용자가 제공한 메뉴 아이콘에서 우측 상단 알림 배지를 잘라낸 템플릿입니다.
function openMenu(vision, control) {
  console.log('[메뉴] ESC 대체 -> menu.png 검색');
  return waitAndTap(vision, 'menu', 5000, null, control);
}

module.exports = {
  tapMatch: tapMatch,
  waitAndTap: waitAndTap,
  enterDungeon: enterDungeon,
  openMenu: openMenu
};
