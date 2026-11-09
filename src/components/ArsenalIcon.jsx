import React from "react";
import { ICONS } from "./arsenalIcons";

// Shows a card icon: a named line icon from arsenalIcons.jsx, or any emoji / text as-is.
const ArsenalIcon = ({ icon, className = "" }) =>
  ICONS[icon] ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICONS[icon]}
    </svg>
  ) : (
    <span className={className} aria-hidden="true">{icon}</span>
  );

export default ArsenalIcon;
