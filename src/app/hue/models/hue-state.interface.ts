export interface HueState{
  on?: boolean;
  bri?: number;
  hue?: number;
  sat?: number;
  xy?: [number, number];
  ct?: number,
  alert?: string;
  effect?: string;
  colormode?: string;
  reachable?: boolean;
}
