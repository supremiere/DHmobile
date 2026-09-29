module.exports = {
  // PC 템플릿을 모바일에서 먼저 재사용하기 위한 초기 스케일 범위.
  // 실제 Android 캡처본이 쌓이면 직업/기기별 프리셋으로 좁힐 예정입니다.
  templateScales: [0.65, 0.75, 0.85, 0.95, 1.00, 1.05, 1.15, 1.25, 1.35],

  pollMs: 100,
  tapAfterMs: 180,

  assetFiles: {
    coinoff: 'coinoff.png',
    challenge: 'challenge.png',
    selected: 'selected.png',
    enter_solo2: 'enter_solo2.png',
    complete: 'dungeon-complete.png',
    skip: 'skip.png',
    again: 'again.png',
    keep: 'keep.png',
    menu: 'menu.png'
  },

  thresholds: {
    coinoff: 0.72,
    challenge: 0.68,
    selected: 0.68,
    enter_solo2: 0.72,
    complete: 0.76,
    skip: 0.72,
    again: 0.74,
    keep: 0.72,
    menu: 0.74
  },

  // challenge가 selected보다 이 정도는 더 높아야 도전 상태로 인정합니다.
  challengeMargin: 0.035,
  challengeConfirmCount: 2,
  challengeConfirmIntervalMs: 90,

  // 비율 좌표 [left, top, width, height]. null이면 전체 화면 검색.
  // menu는 알림 배지 변화까지 피하려고 좌상단에서만 찾습니다.
  regions: {
    coinoff: null,
    challenge: null,
    selected: null,
    enter_solo2: null,
    complete: null,
    skip: [0.48, 0.00, 0.52, 0.48],
    again: null,
    keep: null,
    menu: [0.00, 0.00, 0.30, 0.40]
  }
};
