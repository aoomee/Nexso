import React from 'react';
interface AppLogoProps { className?: string; }
export const AppLogo: React.FC<AppLogoProps> = ({ className }) => {
  const id = React.useId();
  return (
    <svg viewBox="61 61 902 902" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-base`} x2=".7" y2="1"><stop stopColor="#f4f2ef" /><stop offset="1" stopColor="#dcdad7" /></linearGradient>
        <linearGradient id={`${id}-cloud`} x2=".7" y2="1"><stop stopColor="#eee8f4" /><stop offset="1" stopColor="#cabbd9" /></linearGradient>
      </defs>
      <rect x="61" y="61" width="902" height="902" rx="200" fill={`url(#${id}-base)`} />
      <path d="M314 680H688C746 680 790 642 790 590C790 547 767 512 730 495C728 442 685 404 634 404C611 404 591 411 573 423C551 358 498 316 433 316C344 316 275 387 275 476C275 485 276 494 278 503C235 524 210 565 210 609C210 651 250 680 314 680Z" fill={`url(#${id}-cloud)`} />
      <path d="M474 470L518 510Q530 522 518 534L474 578" fill="none" stroke="#6b5b76" strokeWidth="37" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
export default AppLogo;
