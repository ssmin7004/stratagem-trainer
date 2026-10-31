export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type Category =
  | "애국 행정 센터"
  | "궤도 포격"
  | "격납고"
  | "함교"
  | "공병 작업장"
  | "로봇 작업장"
  | "기타";

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
  { id:"machine-gun", name:"기관총", category:"애국 행정 센터", sequence:["DOWN","LEFT","DOWN","UP","RIGHT"], description:"General-purpose support weapon", icon:"⌁" },
  { id:"anti-materiel-rifle", name:"대물 저격총", category:"애국 행정 센터", sequence:["DOWN","LEFT","RIGHT","UP","DOWN"], description:"Long-range precision support weapon", icon:"⌖" },
  { id:"stalwart", name:"스털워트", category:"애국 행정 센터", sequence:["DOWN","LEFT","DOWN","UP","UP","LEFT"], description:"Mobile light machine gun", icon:"⌁" },
  { id:"recoilless-rifle", name:"무반동 소총", category:"애국 행정 센터", sequence:["DOWN","LEFT","RIGHT","RIGHT","LEFT"], description:"Heavy anti-armor launcher", icon:"➤" },
  { id:"spear", name:"스피어", category:"애국 행정 센터", sequence:["DOWN","DOWN","UP","DOWN","DOWN"], description:"Guided anti-tank missile", icon:"➤" },
  { id:"orbital-precision-strike", name:"궤도 정밀 타격", category:"궤도 포격", sequence:["RIGHT","RIGHT","UP"], description:"Precision orbital shell", icon:"◎" },
  { id:"orbital-gatling-barrage", name:"궤도 개틀링 폭격", category:"궤도 포격", sequence:["RIGHT","DOWN","LEFT","UP","UP"], description:"Sustained orbital fire", icon:"✳" },
  { id:"orbital-airburst-strike", name:"궤도 공중폭발 타격", category:"궤도 포격", sequence:["RIGHT","RIGHT","RIGHT"], description:"Airburst orbital bombardment", icon:"✳" },
  { id:"orbital-120mm-he-barrage", name:"궤도 120mm 고폭탄 폭격", category:"궤도 포격", sequence:["RIGHT","RIGHT","DOWN","LEFT","RIGHT","DOWN"], description:"Medium orbital barrage", icon:"◎" },
  { id:"orbital-380mm-he-barrage", name:"궤도 380mm 고폭탄 폭격", category:"궤도 포격", sequence:["RIGHT","DOWN","UP","UP","LEFT","DOWN","DOWN"], description:"Heavy orbital barrage", icon:"◎" },
  { id:"orbital-laser", name:"궤도 레이저", category:"궤도 포격", sequence:["RIGHT","DOWN","UP","RIGHT","DOWN"], description:"Orbital laser strike", icon:"✧" },
  { id:"orbital-railcannon-strike", name:"궤도 레일캐넌 타격", category:"궤도 포격", sequence:["RIGHT","UP","DOWN","DOWN","RIGHT"], description:"Targeted railcannon strike", icon:"◎" },
  { id:"eagle-strafing-run", name:"이글 기총소사", category:"격납고", sequence:["UP","RIGHT","RIGHT"], description:"Fast strafing attack", icon:"✈" },
  { id:"eagle-airstrike", name:"이글 공습", category:"격납고", sequence:["UP","RIGHT","DOWN","RIGHT"], description:"Multi-bomb airstrike", icon:"✈" },
  { id:"eagle-cluster-bomb", name:"이글 집속 폭탄", category:"격납고", sequence:["UP","RIGHT","DOWN","DOWN","RIGHT"], description:"Wide-area cluster attack", icon:"✈" },
  { id:"eagle-napalm-airstrike", name:"이글 네이팜 공습", category:"격납고", sequence:["UP","RIGHT","DOWN","UP"], description:"Incendiary airstrike", icon:"✈" },
  { id:"eagle-500kg-bomb", name:"이글 500kg 폭탄", category:"격납고", sequence:["UP","RIGHT","DOWN","DOWN","DOWN"], description:"Heavy explosive payload", icon:"✈" },
  { id:"eagle-rearm", name:"이글 재무장", category:"격납고", sequence:["UP","UP","LEFT","UP","RIGHT"], description:"Rearm Eagle aircraft", icon:"✈" },
  { id:"resupply", name:"보급품", category:"함교", sequence:["DOWN","DOWN","UP","RIGHT"], description:"Request ammunition supplies", icon:"▣" },
  { id:"hellbomb", name:"헬밤", category:"함교", sequence:["DOWN","UP","LEFT","DOWN","UP","RIGHT","DOWN","UP"], description:"Deploy a hellbomb", icon:"☢" },
  { id:"reinforce", name:"증원", category:"함교", sequence:["UP","DOWN","RIGHT","LEFT","UP"], description:"증원 fallen squadmates", icon:"✚" },
  { id:"sos-beacon", name:"SOS 신호기", category:"함교", sequence:["UP","DOWN","RIGHT","UP"], description:"Request assistance", icon:"⌁" },
  { id:"machine-gun-sentry", name:"기관총 Sentry", category:"공병 작업장", sequence:["DOWN","UP","RIGHT","RIGHT","UP"], description:"Automated machine gun turret", icon:"▤" },
  { id:"gatling-sentry", name:"개틀링 센트리", category:"공병 작업장", sequence:["DOWN","UP","RIGHT","LEFT"], description:"High-rate defensive turret", icon:"▤" },
  { id:"mortar-sentry", name:"박격포 센트리", category:"공병 작업장", sequence:["DOWN","UP","RIGHT","RIGHT","DOWN"], description:"Indirect-fire defensive turret", icon:"▤" },
  { id:"autocannon-sentry", name:"오토캐넌 센트리", category:"공병 작업장", sequence:["DOWN","UP","RIGHT","UP","LEFT","UP"], description:"Heavy autocannon turret", icon:"▤" },
  { id:"rocket-sentry", name:"로켓 센트리", category:"공병 작업장", sequence:["DOWN","UP","RIGHT","RIGHT","LEFT"], description:"Rocket defensive turret", icon:"▤" },
  { id:"tesla-tower", name:"테슬라 타워", category:"공병 작업장", sequence:["DOWN","UP","RIGHT","UP","LEFT","RIGHT"], description:"Electrical area denial tower", icon:"ϟ" },
  { id:"guard-dog", name:"가드 독", category:"로봇 작업장", sequence:["DOWN","UP","LEFT","UP","RIGHT","RIGHT"], description:"Autonomous combat drone", icon:"◈" },
  { id:"ballistic-shield", name:"탄도 방패 팩", category:"로봇 작업장", sequence:["DOWN","LEFT","DOWN","DOWN","UP","LEFT"], description:"Portable ballistic shield", icon:"⬡" },
  { id:"jump-pack", name:"점프 팩", category:"로봇 작업장", sequence:["DOWN","UP","UP","DOWN","UP"], description:"Mobility jump pack", icon:"↟" }
];

export const categories = Array.from(new Set(stratagems.map(s => s.category)));
export const arrow: Record<Direction, string> = { UP:"↑", DOWN:"↓", LEFT:"←", RIGHT:"→" };
export const keyFor: Record<string, Direction> = { w:"UP", s:"DOWN", a:"LEFT", d:"RIGHT" };
