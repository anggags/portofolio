/* ---------------------------------------------------------------------------
   Time-of-day palette.

   The page background is interpolated between hourly stops and the text colour
   steps through night → yellow → day → yellow → night. Two extra channels ride
   along: `ov` darkens artwork with a black overlay and `br` is exposed for
   anything that needs to dim with the background.

   Everything here is also serialised into TIME_THEME_SCRIPT and injected before
   first paint, so the very first frame already has the right colours.
--------------------------------------------------------------------------- */

export type TextKey = "night" | "yellow" | "day";

export type BgStop = {
  hour: number;
  bg: string;
  /** opacity of the black overlay drawn on top of artwork */
  ov: number;
  /** background brightness, 0.2 (night) … 1 (midday) */
  br: number;
};

export const BG_STOPS: BgStop[] = [
  { hour: 0, bg: "#2C2922", ov: 0.1, br: 0.2 },
  { hour: 4, bg: "#2C2922", ov: 0.1, br: 0.2 },
  { hour: 5, bg: "#60594C", ov: 0.08, br: 0.36 },
  { hour: 6, bg: "#857C6A", ov: 0.06, br: 0.52 },
  { hour: 7, bg: "#A59D8A", ov: 0.04, br: 0.68 },
  { hour: 8, bg: "#CEC9BB", ov: 0.02, br: 0.84 },
  { hour: 9, bg: "#F8F6F2", ov: 0, br: 1 },
  { hour: 16, bg: "#F8F6F2", ov: 0, br: 1 },
  { hour: 17, bg: "#CEC9BB", ov: 0.02, br: 0.84 },
  { hour: 18, bg: "#A59D8A", ov: 0.04, br: 0.68 },
  { hour: 19, bg: "#7C725E", ov: 0.06, br: 0.52 },
  { hour: 20, bg: "#534C3D", ov: 0.08, br: 0.36 },
  { hour: 21, bg: "#2C2922", ov: 0.1, br: 0.2 },
  { hour: 24, bg: "#2C2922", ov: 0.1, br: 0.2 },
];

export const TEXT_STEPS: { hour: number; key: TextKey }[] = [
  { hour: 0, key: "night" },
  { hour: 5, key: "yellow" },
  { hour: 6, key: "day" },
  { hour: 19, key: "yellow" },
  { hour: 20, key: "night" },
];

export const TEXT_COLORS: Record<TextKey, { ui: string; sel: string }> = {
  night: { ui: "#C3BEB1", sel: "rgba(255, 238, 194, 0.2)" },
  yellow: { ui: "#F1C345", sel: "rgba(68, 48, 0, 0.2)" },
  day: { ui: "#111111", sel: "rgba(68, 48, 0, 0.2)" },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** "#rrggbb" or "rgba(r,g,b,a)" → [r, g, b, a] */
function parseColor(input: string): [number, number, number, number] {
  if (input.startsWith("#")) {
    const hex = input.slice(1);
    return [
      Number.parseInt(hex.slice(0, 2), 16),
      Number.parseInt(hex.slice(2, 4), 16),
      Number.parseInt(hex.slice(4, 6), 16),
      1,
    ];
  }
  const parts = input.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 1];
  return [parts[0], parts[1], parts[2], parts[3] ?? 1];
}

function mixColor(from: string, to: string, t: number) {
  const a = parseColor(from);
  const b = parseColor(to);
  const rgb = a.slice(0, 3).map((channel, i) => Math.round(lerp(channel, b[i], t)));
  const alpha = Math.round(lerp(a[3], b[3], t) * 1e4) / 1e4;
  return `rgba(${rgb.join(",")},${alpha})`;
}

/** Same colour, fully opaque. */
const opaque = (color: string) => mixColor(color, color, 0);

/** Last step whose hour is <= the fractional hour. */
export function textKeyAt(hour: number): TextKey {
  let i = 0;
  while (i < TEXT_STEPS.length - 1 && TEXT_STEPS[i + 1].hour <= hour) i++;
  return TEXT_STEPS[i].key;
}

export type ThemeVars = Record<string, string>;

/** Resolve the full set of CSS custom properties for a fractional hour. */
export function themeAt(hour: number): ThemeVars {
  const key = textKeyAt(hour);
  const ui = TEXT_COLORS[key];

  let i = 0;
  while (i < BG_STOPS.length - 1 && BG_STOPS[i + 1].hour <= hour) i++;
  const from = BG_STOPS[i];
  const to = BG_STOPS[Math.min(i + 1, BG_STOPS.length - 1)];

  const span = to.hour - from.hour;
  const t = span > 0 ? (hour - from.hour) / span : 0;

  return {
    "--color-main": opaque(ui.ui),
    "--color-bg": mixColor(from.bg, to.bg, t),
    "--img-over-opacity": String(lerp(from.ov, to.ov, t)),
    "--bg-brightness": String(lerp(from.br, to.br, t)),
    "--selection-color": opaque(ui.ui),
    "--selection-bg": opaque(ui.sel),
  };
}

/** Fractional local hour, matching what the reference uses. */
export function hourOf(date: Date) {
  return date.getHours() + date.getMinutes() / 60;
}

export function applyTheme(el: HTMLElement, hour: number) {
  const vars = themeAt(hour);
  for (const [name, value] of Object.entries(vars)) {
    el.style.setProperty(name, value);
  }
  el.style.backgroundColor = "var(--color-bg)";
  el.style.color = "var(--color-main)";
}

/* ---------------------------------------------------------------------------
   Pre-paint bootstrap. Runs before the body paints so there is no flash.
--------------------------------------------------------------------------- */

declare global {
  interface Window {
    __applyTimeTheme?: (hour: number) => void;
  }
}

const scriptSource = JSON.stringify({
  bg: BG_STOPS,
  steps: TEXT_STEPS,
  colors: TEXT_COLORS,
});

export const TIME_THEME_SCRIPT = `(function(){
var D=${scriptSource};
function L(a,b,t){return a+(b-a)*t}
function P(s){if(s.charAt(0)==="#"){var h=s.slice(1);return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16),1]}var m=s.match(/[\\d.]+/g).map(Number);return[m[0],m[1],m[2],m[3]===undefined?1:m[3]]}
function M(a,b,t){var x=P(a),y=P(b),c=x.slice(0,3).map(function(v,i){return Math.round(L(v,y[i],t))}),al=Math.round(L(x[3],y[3],t)*1e4)/1e4;return"rgba("+c.join(",")+","+al+")"}
function O(c){return M(c,c,0)}
function K(h){var i=0;while(i<D.steps.length-1&&D.steps[i+1].hour<=h)i++;return D.steps[i].key}
function T(h){
var k=D.colors[K(h)],i=0;while(i<D.bg.length-1&&D.bg[i+1].hour<=h)i++;
var a=D.bg[i],b=D.bg[Math.min(i+1,D.bg.length-1)],s=b.hour-a.hour,t=s>0?(h-a.hour)/s:0;
return{"--color-main":O(k.ui),"--color-bg":M(a.bg,b.bg,t),"--img-over-opacity":L(a.ov,b.ov,t),"--bg-brightness":L(a.br,b.br,t),"--selection-color":O(k.ui),"--selection-bg":O(k.sel)}}
function A(h){var v=T(h),el=document.documentElement;for(var k in v)el.style.setProperty(k,v[k]);el.style.backgroundColor="var(--color-bg)";el.style.color="var(--color-main)"}
function H(){var d=new Date();A(d.getHours()+d.getMinutes()/60)}
window.__applyTimeTheme=A;
H();
setInterval(H,60000);
})();`;
