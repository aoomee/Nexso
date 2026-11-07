import React from 'react';
interface AppWordmarkProps { accessibleLabel?: string; className?: string; }
export const AppWordmark: React.FC<AppWordmarkProps> = ({ accessibleLabel, className }) => (
  <svg viewBox="0 0 150 40" className={className} role={accessibleLabel ? 'img' : undefined} aria-label={accessibleLabel} aria-hidden={accessibleLabel ? undefined : true} focusable="false">
    <text x="0" y="31" fill="currentColor" fontFamily="system-ui, sans-serif" fontSize="36" fontWeight="650" letterSpacing="-1.3">Nexso</text>
  </svg>
);
export default AppWordmark;
