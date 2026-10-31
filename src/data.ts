export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type Category =
  | "Patriotic Administration Center"
  | "Orbital Cannons"
  | "Hangar"
  | "Bridge"
  | "Engineering Bay"
  | "Robotics Workshop"
  | "Other";

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
  { id:"machine-gun", name:"Machine Gun", category:"Patriotic Administration Center", sequence:["DOWN","LEFT","DOWN","UP","RIGHT"], description:"General-purpose support weapon", icon:"⌁" },
  { id:"anti-materiel-rifle", name:"Anti-Materiel Rifle", category:"Patriotic Administration Center", sequence:["DOWN","LEFT","RIGHT","UP","DOWN"], description:"Long-range precision support weapon", icon:"⌖" },
  { id:"stalwart", name:"Stalwart", category:"Patriotic Administration Center", sequence:["DOWN","LEFT","DOWN","UP","UP","LEFT"], description:"Mobile light machine gun", icon:"⌁" },
  { id:"recoilless-rifle", name:"Recoilless Rifle", category:"Patriotic Administration Center", sequence:["DOWN","LEFT","RIGHT","RIGHT","LEFT"], description:"Heavy anti-armor launcher", icon:"➤" },
  { id:"spear", name:"Spear", category:"Patriotic Administration Center", sequence:["DOWN","DOWN","UP","DOWN","DOWN"], description:"Guided anti-tank missile", icon:"➤" },
  { id:"orbital-precision-strike", name:"Orbital Precision Strike", category:"Orbital Cannons", sequence:["RIGHT","RIGHT","UP"], description:"Precision orbital shell", icon:"◎" },
  { id:"orbital-gatling-barrage", name:"Orbital Gatling Barrage", category:"Orbital Cannons", sequence:["RIGHT","DOWN","LEFT","UP","UP"], description:"Sustained orbital fire", icon:"✳" },
  { id:"orbital-airburst-strike", name:"Orbital Airburst Strike", category:"Orbital Cannons", sequence:["RIGHT","RIGHT","RIGHT"], description:"Airburst orbital bombardment", icon:"✳" },
  { id:"orbital-120mm-he-barrage", name:"Orbital 120MM HE Barrage", category:"Orbital Cannons", sequence:["RIGHT","RIGHT","DOWN","LEFT","RIGHT","DOWN"], description:"Medium orbital barrage", icon:"◎" },
  { id:"orbital-380mm-he-barrage", name:"Orbital 380MM HE Barrage", category:"Orbital Cannons", sequence:["RIGHT","DOWN","UP","UP","LEFT","DOWN","DOWN"], description:"Heavy orbital barrage", icon:"◎" },
  { id:"orbital-laser", name:"Orbital Laser", category:"Orbital Cannons", sequence:["RIGHT","DOWN","UP","RIGHT","DOWN"], description:"Orbital laser strike", icon:"✧" },
  { id:"orbital-railcannon-strike", name:"Orbital Railcannon Strike", category:"Orbital Cannons", sequence:["RIGHT","UP","DOWN","DOWN","RIGHT"], description:"Targeted railcannon strike", icon:"◎" },
  { id:"eagle-strafing-run", name:"Eagle Strafing Run", category:"Hangar", sequence:["UP","RIGHT","RIGHT"], description:"Fast strafing attack", icon:"✈" },
  { id:"eagle-airstrike", name:"Eagle Airstrike", category:"Hangar", sequence:["UP","RIGHT","DOWN","RIGHT"], description:"Multi-bomb airstrike", icon:"✈" },
  { id:"eagle-cluster-bomb", name:"Eagle Cluster Bomb", category:"Hangar", sequence:["UP","RIGHT","DOWN","DOWN","RIGHT"], description:"Wide-area cluster attack", icon:"✈" },
  { id:"eagle-napalm-airstrike", name:"Eagle Napalm Airstrike", category:"Hangar", sequence:["UP","RIGHT","DOWN","UP"], description:"Incendiary airstrike", icon:"✈" },
  { id:"eagle-500kg-bomb", name:"Eagle 500KG Bomb", category:"Hangar", sequence:["UP","RIGHT","DOWN","DOWN","DOWN"], description:"Heavy explosive payload", icon:"✈" },
  { id:"eagle-rearm", name:"Eagle Rearm", category:"Hangar", sequence:["UP","UP","LEFT","UP","RIGHT"], description:"Rearm Eagle aircraft", icon:"✈" },
  { id:"resupply", name:"Resupply", category:"Bridge", sequence:["DOWN","DOWN","UP","RIGHT"], description:"Request ammunition supplies", icon:"▣" },
  { id:"hellbomb", name:"Hellbomb", category:"Bridge", sequence:["DOWN","UP","LEFT","DOWN","UP","RIGHT","DOWN","UP"], description:"Deploy a hellbomb", icon:"☢" },
  { id:"reinforce", name:"Reinforce", category:"Bridge", sequence:["UP","DOWN","RIGHT","LEFT","UP"], description:"Reinforce fallen squadmates", icon:"✚" },
  { id:"sos-beacon", name:"SOS Beacon", category:"Bridge", sequence:["UP","DOWN","RIGHT","UP"], description:"Request assistance", icon:"⌁" },
  { id:"machine-gun-sentry", name:"Machine Gun Sentry", category:"Engineering Bay", sequence:["DOWN","UP","RIGHT","RIGHT","UP"], description:"Automated machine gun turret", icon:"▤" },
  { id:"gatling-sentry", name:"Gatling Sentry", category:"Engineering Bay", sequence:["DOWN","UP","RIGHT","LEFT"], description:"High-rate defensive turret", icon:"▤" },
  { id:"mortar-sentry", name:"Mortar Sentry", category:"Engineering Bay", sequence:["DOWN","UP","RIGHT","RIGHT","DOWN"], description:"Indirect-fire defensive turret", icon:"▤" },
  { id:"autocannon-sentry", name:"Autocannon Sentry", category:"Engineering Bay", sequence:["DOWN","UP","RIGHT","UP","LEFT","UP"], description:"Heavy autocannon turret", icon:"▤" },
  { id:"rocket-sentry", name:"Rocket Sentry", category:"Engineering Bay", sequence:["DOWN","UP","RIGHT","RIGHT","LEFT"], description:"Rocket defensive turret", icon:"▤" },
  { id:"tesla-tower", name:"Tesla Tower", category:"Engineering Bay", sequence:["DOWN","UP","RIGHT","UP","LEFT","RIGHT"], description:"Electrical area denial tower", icon:"ϟ" },
  { id:"guard-dog", name:"Guard Dog", category:"Robotics Workshop", sequence:["DOWN","UP","LEFT","UP","RIGHT","RIGHT"], description:"Autonomous combat drone", icon:"◈" },
  { id:"ballistic-shield", name:"Ballistic Shield Backpack", category:"Robotics Workshop", sequence:["DOWN","LEFT","DOWN","DOWN","UP","LEFT"], description:"Portable ballistic shield", icon:"⬡" },
  { id:"jump-pack", name:"Jump Pack", category:"Robotics Workshop", sequence:["DOWN","UP","UP","DOWN","UP"], description:"Mobility jump pack", icon:"↟" }
];

export const categories = Array.from(new Set(stratagems.map(s => s.category)));
export const arrow: Record<Direction, string> = { UP:"↑", DOWN:"↓", LEFT:"←", RIGHT:"→" };
export const keyFor: Record<string, Direction> = { w:"UP", s:"DOWN", a:"LEFT", d:"RIGHT" };
