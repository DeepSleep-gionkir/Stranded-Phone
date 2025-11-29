
export type Weather = 'clear' | 'rain' | 'fog';

export interface GameState {
  battery: number;
  signal: number;
  sanity: number;
  time: number; // Minutes from start
  weather: Weather;
  inventory: string[];
  messages: Message[];
  isFlashlightOn: boolean;
  gameStatus: 'playing' | 'won' | 'lost';
  gameOverReason: string | null;
  hasSeenIntro: boolean;
  brightness: number;
  explorationLog: ExplorationLog[];
}

export interface ExplorationLog {
  id: string;
  timestamp: number;
  text: string;
  foundItem?: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface Scenario {
  id: string;
  text: string;
  effect?: {
    battery?: number;
    sanity?: number;
    time?: number;
    item?: string;
    signal?: number;
  };
}

export const INITIAL_STATE: GameState = {
  battery: 85.0,
  signal: 2,
  sanity: 100,
  time: 720, // 12:00 PM
  weather: 'clear',
  inventory: [],
  messages: [],
  isFlashlightOn: false,
  gameStatus: 'playing',
  gameOverReason: null,
  hasSeenIntro: false,
  brightness: 60, // Default brightness
  explorationLog: [],
};

export interface Item {
  id: string;
  name: string;
  description: string;
  isConsumable: boolean;
  effect?: {
    battery?: number;
    sanity?: number;
    signal?: number;
    time?: number;
  };
}

export const ITEMS: Record<string, Item> = {
  "power_bank": {
    id: "power_bank",
    name: "보조배터리",
    description: "휴대용 배터리입니다. 사용하면 배터리를 25% 충전합니다.",
    isConsumable: true,
    effect: { battery: 25 }
  },
  "old_map": {
    id: "old_map",
    name: "낡은 지도",
    description: "섬의 지형이 그려진 지도입니다. 살펴보면 멘탈이 회복됩니다.",
    isConsumable: true,
    effect: { sanity: 10, time: 10 }
  },
  "rations": {
    id: "rations",
    name: "비상 식량",
    description: "건조된 비상 식량입니다. 섭취하면 멘탈이 크게 회복됩니다.",
    isConsumable: true,
    effect: { sanity: 20 }
  },
  "burnt_wood": {
    id: "burnt_wood",
    name: "탄 장작",
    description: "다 타버린 장작입니다. 쓸모가 없어 보입니다.",
    isConsumable: false
  },
  "strange_fruit": {
    id: "strange_fruit",
    name: "이상한 열매",
    description: "알 수 없는 열매입니다. 배가 아플 수도 있습니다.",
    isConsumable: true,
    effect: { sanity: -5, battery: 5 }
  },
  "small_boat": {
    id: "small_boat",
    name: "작은 보트",
    description: "탈출할 수 있는 작은 보트입니다. 사용하면 바다로 나갑니다.",
    isConsumable: true // Triggers ending
  },
  "bunker_key": {
    id: "bunker_key",
    name: "벙커 열쇠",
    description: "어딘가에 있는 벙커의 열쇠입니다. 벙커를 찾으면 사용할 수 있습니다.",
    isConsumable: false
  },
  "water_bottle": {
    id: "water_bottle",
    name: "생수",
    description: "갈증을 해소해주는 시원한 물입니다. 정신이 맑아집니다.",
    isConsumable: true,
    effect: { sanity: 10, battery: 5 }
  },
  "chocolate_bar": {
    id: "chocolate_bar",
    name: "초콜릿 바",
    description: "달콤한 간식입니다. 스트레스가 해소됩니다.",
    isConsumable: true,
    effect: { sanity: 15 }
  },
  "first_aid_kit": {
    id: "first_aid_kit",
    name: "구급상자",
    description: "응급 처치 도구입니다. 멘탈을 크게 회복합니다.",
    isConsumable: true,
    effect: { sanity: 40 }
  },
  "flashlight_battery": {
    id: "flashlight_battery",
    name: "건전지",
    description: "새 건전지입니다. 배터리를 많이 충전합니다.",
    isConsumable: true,
    effect: { battery: 30 }
  },
  "mysterious_pills": {
    id: "mysterious_pills",
    name: "정체불명의 알약",
    description: "효과를 알 수 없는 약입니다. 위험할 수도 있습니다.",
    isConsumable: true,
    effect: { sanity: 30, battery: -10 } // High sanity, but drowsy (battery drain simulation)
  },
  "flare_gun": {
    id: "flare_gun",
    name: "조명탄 발사기",
    description: "구조 신호를 보낼 수 있는 조명탄입니다. 하늘이 보일 때 사용하세요.",
    isConsumable: true
  }
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'search_beach',
    text: "모래사장 깊은 곳에서 반쯤 묻힌 보조배터리를 발견했다!",
    effect: { battery: 15, time: 30, item: "power_bank" }
  },
  {
    id: 'search_forest',
    text: "숲속에서 이상한 인기척을 느꼈다. 서둘러 도망쳤다.",
    effect: { sanity: -10, time: 20 }
  },
  {
    id: 'search_cave',
    text: "동굴 안에서 낡은 지도를 발견했다.",
    effect: { sanity: 5, time: 40, item: "old_map" }
  },
  {
    id: 'search_wreck',
    text: "난파된 배의 잔해에서 비상 식량을 찾았다.",
    effect: { sanity: 10, time: 60, item: "rations" }
  },
  {
    id: 'search_hill',
    text: "높은 언덕에 올랐다. 잠시 동안 신호가 잡힌다!",
    effect: { time: 40, signal: 4 }
  },
  {
    id: 'search_cave_empty',
    text: "어두운 동굴을 탐험했지만 아무것도 없었다. 무서웠다.",
    effect: { sanity: -5, time: 30 }
  },
  {
    id: 'search_fruit',
    text: "이상하게 생긴 열매를 발견했다. 먹을 수 있을까?",
    effect: { sanity: 5, time: 15, item: "strange_fruit" }
  },
  // --- Exploration Scenarios ---
  {
    id: 'search_forest_path',
    text: "숲속에서 희미한 오솔길을 발견했다. 누군가 다녔던 길일까?",
    effect: { time: 20, sanity: 5 }
  },
  {
    id: 'search_old_camp',
    text: "오래된 캠프 흔적을 찾았다. 다 타버린 장작만이 남아있다.",
    effect: { time: 30, sanity: -5, item: "burnt_wood" }
  },
  {
    id: 'search_strange_statue',
    text: "기괴하게 생긴 돌 조각상을 발견했다. 쳐다보고 있으면 기분이 나쁘다.",
    effect: { time: 15, sanity: -15 }
  },
  {
    id: 'search_broken_boat',
    text: "해변가에 부서진 배의 잔해가 밀려왔다. 쓸만한 건 없어 보인다.",
    effect: { time: 25, sanity: -5 }
  },
  {
    id: 'search_coconut',
    text: "야자수를 발견했다! 수분을 보충할 수 있을 것 같다.",
    effect: { time: 15, sanity: 10, battery: 2 } // Small energy boost
  },
  {
    id: 'search_cliff_view',
    text: "절벽 위에서 바다를 내려다보았다. 끝없는 수평선뿐이다.",
    effect: { time: 40, sanity: -10, signal: 2 } // Slight signal boost but depressing
  },
  {
    id: 'search_cave_painting',
    text: "동굴 벽에서 알 수 없는 그림을 발견했다. 날짜를 세던 흔적 같다.",
    effect: { time: 35, sanity: -10 }
  },
  {
    id: 'search_radio_tower',
    text: "녹슨 철탑을 발견했다! 하지만 너무 낡아서 올라가기 위험해 보인다.",
    effect: { time: 50, signal: 3, sanity: 5 }
  },
  
  // --- New Scenarios (Items) ---
  {
    id: 'search_cabin',
    text: "버려진 오두막을 발견했다. 구석에 구급상자가 놓여있다!",
    effect: { time: 45, item: "first_aid_kit" }
  },
  {
    id: 'search_backpack',
    text: "누군가 잃어버린 배낭을 찾았다. 안에는 물과 초콜릿이 들어있다.",
    effect: { time: 30, item: "water_bottle" } // Can only give one item per scenario currently. Let's give water.
  },
  {
    id: 'search_backpack_2',
    text: "배낭의 깊은 곳에서 초콜릿 바도 발견했다!",
    effect: { time: 10, item: "chocolate_bar" }
  },
  {
    id: 'search_dead_phone',
    text: "망가진 휴대폰을 발견했다. 배터리는 아직 쓸만해 보인다.",
    effect: { time: 25, item: "flashlight_battery" }
  },
  {
    id: 'search_pharmacy_bag',
    text: "약국 봉투가 떨어져 있다. 정체불명의 알약이 들어있다.",
    effect: { time: 15, item: "mysterious_pills" }
  },
  {
    id: 'search_military_box',
    text: "군용 보급 상자를 발견했다. 조명탄 발사기가 들어있다!",
    effect: { time: 40, item: "flare_gun" }
  },

  // --- New Scenarios (Events) ---
  {
    id: 'search_wild_boar',
    text: "덤불 속에서 멧돼지가 튀어나왔다! 죽을 힘을 다해 도망쳤다.",
    effect: { time: 10, sanity: -20, battery: -10 }
  },
  {
    id: 'search_beautiful_sunset',
    text: "해질녘의 아름다운 풍경을 바라보았다. 잠시나마 마음의 평화를 얻었다.",
    effect: { time: 20, sanity: 15 }
  },
  {
    id: 'search_skeleton',
    text: "풀숲에서 백골이 된 시체를 발견했다... 끔찍하다.",
    effect: { time: 10, sanity: -30 }
  },
  {
    id: 'search_drone',
    text: "추락한 드론을 발견했다. 안테나 부품을 사용하여 신호를 증폭시켰다.",
    effect: { time: 40, battery: -5, signal: 1 }
  },
  {
    id: 'search_nothing',
    text: "한참을 걸었지만 아무것도 발견하지 못했다. 다리만 아프다.",
    effect: { time: 60, battery: -5, sanity: -5 }
  },

  // --- Message/Notification Events ---
  {
    id: 'msg_unknown_1',
    text: "알 수 없는 발신자로부터 부재중 전화가 와있다.",
    effect: { sanity: -10 }
  },
  {
    id: 'msg_mom',
    text: "엄마: '언제 들어오니? 저녁 해놨어.' (전송 실패)",
    effect: { sanity: -20 }
  },
  {
    id: 'msg_news',
    text: "[재난문자] 태풍 경보 발령. 안전한 곳으로 대피하십시오.",
    effect: { sanity: -15 }
  },
  {
    id: 'msg_glitch',
    text: "010-xxxx-xxxx: ...도..망...쳐...",
    effect: { sanity: -30 }
  },
  
  // --- Weather/Environment Events ---
  {
    id: 'env_rain_start',
    text: "갑자기 비가 쏟아지기 시작한다. 체온이 떨어진다.",
    effect: { battery: -5, sanity: -5 } // Cold drains battery faster?
  },
  {
    id: 'env_thunder',
    text: "천둥소리가 섬 전체를 뒤흔들었다. 깜짝 놀랐다.",
    effect: { sanity: -10 }
  },
  {
    id: 'env_bird',
    text: "갈매기 한 마리가 머리 위를 날아갔다.",
    effect: { sanity: 5 }
  },
  
  // --- High Risk / High Reward Scenarios ---
  {
    id: 'search_cliff_climb',
    text: "가파른 절벽을 기어올랐다. 손전등을 비추느라 배터리를 많이 썼지만, 멀리서 불빛을 본 것 같다!",
    effect: { battery: -15, signal: 3, time: 60, sanity: 10 }
  },
  {
    id: 'search_deep_cave',
    text: "깊은 동굴 탐사. 너무 어둡고 습하다. 길을 잃을 뻔했다.",
    effect: { battery: -10, sanity: -20, time: 90 }
  },
  {
    id: 'search_night_swim',
    text: "밤바다에 뛰어들었다가 거센 파도에 휩쓸릴 뻔했다. 스마트폰이 물에 젖을 뻔했다!",
    effect: { battery: -20, sanity: -15, time: 30 }
  },

  // --- Special Ending Scenarios ---
  {
    id: 'ending_boat',
    text: "해안가에 정박된 작은 보트를 발견했다! 노가 있다. 이걸로 탈출할 수 있을까?",
    effect: { item: "small_boat", sanity: 50, time: 30 }
  },
  {
    id: 'ending_bunker',
    text: "수풀 뒤에 숨겨진 벙커 입구를 찾았다. 안에는 통신 장비가 있을지도 모른다.",
    effect: { item: "bunker_key", sanity: 30, time: 45 }
  }
];

export const WEATHER_EFFECTS: Record<Weather, { batteryDrainMultiplier: number; signalModifier: number }> = {
  clear: { batteryDrainMultiplier: 1.0, signalModifier: 0 },
  rain: { batteryDrainMultiplier: 1.2, signalModifier: -1 },
  fog: { batteryDrainMultiplier: 1.1, signalModifier: -2 },
};
