# STRATAGEM TRAINER v2.4.0

슈퍼 어스 전술 터미널 스타일의 WASD 스트라타젬 입력 훈련 웹 앱입니다.

## 훈련 모드

- **노멀 트레이닝 (NORMAL TRAINING)**: 설정한 문제 수만큼 스트라타젬을 무작위로 호출합니다. 대기 화면에서 Space 키를 누르면 시작합니다.
- **데스티니 트레이닝 (DESTINY TRAINING)**: 30초 동안 가능한 많은 스트라타젬을 호출합니다. 제한 시간이 끝나면 자동으로 결과 화면이 표시됩니다.

두 모드 모두 훈련 목록에서 선택한 스트라타젬을 출제 대상으로 사용합니다. 같은 스트라타젬이 반복 출제될 수 있습니다.

## 조작

- `W`: 위쪽
- `A`: 왼쪽
- `S`: 아래쪽
- `D`: 오른쪽
- `Space`: 대기 화면에서 훈련 시작

## 실행

Node.js 20 이상을 설치한 뒤 프로젝트 폴더에서 실행합니다.

```bash
npm install
npm run dev
```

프로덕션 빌드:

```bash
npm run build
```

## 배포

GitHub의 `main` 브랜치에 커밋하면 연결된 Vercel 프로젝트가 자동으로 재배포됩니다. Vercel 설정은 Vite 기본값(`npm run build`, `dist`)을 사용합니다.

## 데이터

훈련 기록과 설정은 브라우저 LocalStorage에 저장됩니다. 브라우저 또는 기기를 변경하면 기록이 자동으로 동기화되지 않습니다.

## 안내

본 프로젝트는 Helldivers 2에서 영감을 받은 팬 제작 훈련 프로젝트이며 Arrowhead Game Studios 및 Sony와 무관합니다. 스트라타젬 데이터와 입력 시퀀스는 게임 업데이트에 따라 달라질 수 있으므로 실제 게임 내 정보를 확인해 주세요.


## Version 2.5.0

- Spacebar and the start button launch a three-second countdown before training begins.
- Normal Training defaults to 10 questions for new installations. Existing saved question-count preferences are preserved.
- Records now show the personal best number of stratagems completed during a 30-second Destiny Training session. The best score is saved in this browser.
