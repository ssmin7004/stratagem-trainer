export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type Category = "공격" | "지원" | "방어" | "임무";

export interface Stratagem {
  id: string;
  name: string;
  category: Category;
  sequence: Direction[];
  description: string;
  icon: string;
}

// Starter data set. Verify sequences against the current in-game stratagem list before public release.
export const stratagems: Stratagem[] = [
  { id:"machine-gun", name:"기관총", category:"지원", sequence:["DOWN","LEFT","DOWN","UP","RIGHT"], description:"범용 지원 기관총", icon:"⌁" },
  { id:"anti-materiel-rifle", name:"대물 저격총", category:"지원", sequence:["DOWN","LEFT","RIGHT","UP","DOWN"], description:"장거리 정밀 사격용 지원 무기", icon:"⌖" },
  { id:"stalwart", name:"스털워트", category:"지원", sequence:["DOWN","LEFT","DOWN","UP","UP","LEFT"], description:"기동성이 뛰어난 경기관총", icon:"⌁" },
  { id:"recoilless-rifle", name:"무반동 소총", category:"지원", sequence:["DOWN","LEFT","RIGHT","RIGHT","LEFT"], description:"중장갑 목표물 대응 발사기", icon:"➤" },
  { id:"spear", name:"스피어", category:"지원", sequence:["DOWN","DOWN","UP","DOWN","DOWN"], description:"유도 대전차 미사일", icon:"➤" },
  { id:"orbital-precision-strike", name:"궤도 정밀 타격", category:"공격", sequence:["RIGHT","RIGHT","UP"], description:"정밀 궤도 포격", icon:"◎" },
  { id:"orbital-gatling-barrage", name:"궤도 개틀링 폭격", category:"공격", sequence:["RIGHT","DOWN","LEFT","UP","UP"], description:"지속적인 궤도 포격", icon:"✳" },
  { id:"orbital-airburst-strike", name:"궤도 공중폭발 타격", category:"공격", sequence:["RIGHT","RIGHT","RIGHT"], description:"공중 폭발형 궤도 공격", icon:"✳" },
  { id:"orbital-120mm-he-barrage", name:"궤도 120mm 고폭탄 폭격", category:"공격", sequence:["RIGHT","RIGHT","DOWN","LEFT","RIGHT","DOWN"], description:"중형 궤도 포격", icon:"◎" },
  { id:"orbital-380mm-he-barrage", name:"궤도 380mm 고폭탄 폭격", category:"공격", sequence:["RIGHT","DOWN","UP","UP","LEFT","DOWN","DOWN"], description:"대규모 궤도 포격", icon:"◎" },
  { id:"orbital-laser", name:"궤도 레이저", category:"공격", sequence:["RIGHT","DOWN","UP","RIGHT","DOWN"], description:"궤도 레이저 공격", icon:"✧" },
  { id:"orbital-railcannon-strike", name:"궤도 레일캐넌 타격", category:"공격", sequence:["RIGHT","UP","DOWN","DOWN","RIGHT"], description:"목표 지정 레일캐넌 공격", icon:"◎" },
  { id:"eagle-strafing-run", name:"이글 기총소사", category:"공격", sequence:["UP","RIGHT","RIGHT"], description:"빠른 저공 기총소사", icon:"✈" },
  { id:"eagle-airstrike", name:"이글 공습", category:"공격", sequence:["UP","RIGHT","DOWN","RIGHT"], description:"다수 폭탄 공습", icon:"✈" },
  { id:"eagle-cluster-bomb", name:"이글 집속 폭탄", category:"공격", sequence:["UP","RIGHT","DOWN","DOWN","RIGHT"], description:"광역 집속 폭탄 공격", icon:"✈" },
  { id:"eagle-napalm-airstrike", name:"이글 네이팜 공습", category:"공격", sequence:["UP","RIGHT","DOWN","UP"], description:"소이탄 공습", icon:"✈" },
  { id:"eagle-500kg-bomb", name:"이글 500kg 폭탄", category:"공격", sequence:["UP","RIGHT","DOWN","DOWN","DOWN"], description:"대형 폭발물 투하", icon:"✈" },
  { id:"eagle-rearm", name:"이글 재무장", category:"지원", sequence:["UP","UP","LEFT","UP","RIGHT"], description:"이글 전투기 재무장", icon:"✈" },
  { id:"resupply", name:"보급품", category:"지원", sequence:["DOWN","DOWN","UP","RIGHT"], description:"탄약 및 보급품 요청", icon:"▣" },
  { id:"hellbomb", name:"헬밤", category:"임무", sequence:["DOWN","UP","LEFT","DOWN","UP","RIGHT","DOWN","UP"], description:"헬밤 설치 및 기폭 준비", icon:"☢" },
  { id:"reinforce", name:"증원", category:"임무", sequence:["UP","DOWN","RIGHT","LEFT","UP"], description:"전투 불능 분대원 증원", icon:"✚" },
  { id:"sos-beacon", name:"SOS 신호기", category:"임무", sequence:["UP","DOWN","RIGHT","UP"], description:"지원 요청 신호 송출", icon:"⌁" },
  { id:"machine-gun-sentry", name:"기관총 Sentry", category:"방어", sequence:["DOWN","UP","RIGHT","RIGHT","UP"], description:"자동 기관총 방어 포탑", icon:"▤" },
  { id:"gatling-sentry", name:"개틀링 센트리", category:"방어", sequence:["DOWN","UP","RIGHT","LEFT"], description:"고속 연사 방어 포탑", icon:"▤" },
  { id:"mortar-sentry", name:"박격포 센트리", category:"방어", sequence:["DOWN","UP","RIGHT","RIGHT","DOWN"], description:"곡사 지원 방어 포탑", icon:"▤" },
  { id:"autocannon-sentry", name:"오토캐넌 센트리", category:"방어", sequence:["DOWN","UP","RIGHT","UP","LEFT","UP"], description:"중화기 오토캐넌 포탑", icon:"▤" },
  { id:"rocket-sentry", name:"로켓 센트리", category:"방어", sequence:["DOWN","UP","RIGHT","RIGHT","LEFT"], description:"로켓 방어 포탑", icon:"▤" },
  { id:"tesla-tower", name:"테슬라 타워", category:"방어", sequence:["DOWN","UP","RIGHT","UP","LEFT","RIGHT"], description:"전기 충격 구역 방어 장치", icon:"ϟ" },
  { id:"guard-dog", name:"가드 독", category:"지원", sequence:["DOWN","UP","LEFT","UP","RIGHT","RIGHT"], description:"자율 전투 드론", icon:"◈" },
  { id:"ballistic-shield", name:"탄도 방패 팩", category:"방어", sequence:["DOWN","LEFT","DOWN","DOWN","UP","LEFT"], description:"휴대용 탄도 방패", icon:"⬡" },
  { id:"jump-pack", name:"점프 팩", category:"지원", sequence:["DOWN","UP","UP","DOWN","UP"], description:"기동용 점프 팩", icon:"↟" }
];

export const categories: Category[] = ["공격", "지원", "방어", "임무"];
export const categoryColors: Record<Category,string> = { 공격:"#DE7B6C", 지원:"#49ADC9", 방어:"#679552", 임무:"#C9B269" };
export const arrow: Record<Direction, string> = { UP:"↑", DOWN:"↓", LEFT:"←", RIGHT:"→" };
export const keyFor: Record<string, Direction> = { w:"UP", s:"DOWN", a:"LEFT", d:"RIGHT" };
