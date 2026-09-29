# DHmobile — DungeonHelper Android 포팅

현재 단계는 StoneMiner 핵심 루프를 Android / AutoX.js v7에서 실행하는 첫 포팅입니다.

## 이번 1차에 들어간 것

- Android 화면 캡처 + 템플릿 매칭
- PC StoneMiner 템플릿을 우선 그대로 재사용
- 여러 배율(0.65~1.35)로 검색
- coinoff -> challenge 확인 -> 입장 -> complete -> skip -> again -> keep 루프
- PC SPACE 입장 -> enter_solo2.png 화면 탭으로 대체
- PC ESC -> menu.png 화면 탭으로 대체할 공용 함수 추가
- 볼륨 아래 버튼으로 긴급 중지
- PC의 challenge / selected 경쟁 판정을 간단한 형태로 유지

## 중요: PC 이미지 재사용은 실기기 검증 전

assets 폴더의 coinoff, challenge, selected, dungeon-complete, again, keep, skip,
enter_solo2는 현재 PC판에서 쓰던 이미지를 복사한 것입니다.

게임의 Android 렌더링이 PC와 다르면 일부 이미지는 매칭되지 않을 수 있습니다.
그 경우 안 되는 이미지만 Android에서 다시 캡처해서 같은 파일명으로 교체하면 됩니다.
스크립트 로직은 바꿀 필요가 없습니다.

menu.png는 사용자가 제공한 모바일 메뉴 아이콘에서 우측 상단 빨간 알림 배지 영역을 제외해
숫자가 바뀌어도 매칭에 영향을 덜 받도록 잘라낸 템플릿입니다.

## 실행

AutoX.js v7에서 이 저장소 폴더를 프로젝트로 열고 main.js를 실행합니다.

필수 권한:

1. 접근성 서비스
2. 화면 캡처 권한

게임을 먼저 실행해서 던전 입장 준비 화면에 둔 뒤 main.js를 실행합니다.

중지: 볼륨 아래 버튼

## 단축키 치환

PC SPACE -> Android enter_solo2.png 찾아 탭
PC ESC -> Android menu.png 찾아 탭

현재 StoneMiner 본 루프에서는 ESC가 필요 없지만 lib/input.js의 openMenu()로 이미 준비했습니다.
Abyss 포팅 때 기존 ESC 호출을 이 함수로 바꾸면 됩니다.

## 다음 실기기 테스트에서 볼 것

1. coinoff.png가 Android에서 잡히는지
2. challenge.png와 selected.png가 구분되는지
3. enter_solo2.png가 SPACE 대체용으로 잡히는지
4. dungeon-complete.png, again.png, keep.png, skip.png 중 어느 것이 재캡처가 필요한지
5. 기기 해상도별 적정 배율 범위와 ROI

첫 테스트 로그에서 [대기] xxx.png에 오래 멈추는 파일만 Android 캡처본으로 바꾸면 됩니다.
