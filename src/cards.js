// The four quick-link cards on the homepage. Each one opens its own page at `path`.
// Each card shows either an emoji `icon` or an `image` from public/.
// `titleEmoji` (optional) adds a small picture right after the title text,
// and `titleEnd` (optional) is text shown after that picture.
export const CARDS = [
  { image: "/rocket-icon.png", title: "Mission Log", text: "Projects I've launched", path: "/mission-log" },
  { icon: "✦", title: "Skills in Orbit", text: "Tools I build with", path: "/skills-in-orbit" },
  { icon: "🔭", title: "Exploring (ME", titleEmoji: "/wink.png", titleEnd: ")", text: "Know me more.", path: "/exploring" },
  { icon: "📡", title: "Open Channel", text: "Send me a signal", path: "/open-channel" },
];
