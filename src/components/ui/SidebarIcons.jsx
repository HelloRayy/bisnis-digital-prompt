import React from 'react';

/**
 * Custom Minimalist Sidebar SVG Icons
 * Inactive -> Clean Geometric Outline (stroke)
 * Active -> Solid Filled Shape (fill)
 */

export function SidebarSparkleIcon({ active = false, className = "" }) {
  if (active) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
        <circle cx="19" cy="5" r="2.2" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  );
}

export function SidebarFlameIcon({ active = false, className = "" }) {
  if (active) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 22c4.97 0 9-4.03 9-9 0-4.5-3.5-7.5-6-10-1.5 2-2 3.5-2 5-1-1-2-2.5-2-4.5-3 2.5-5 5.5-5 9.5 0 4.97 4.03 9 9 9z" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22c4.97 0 9-4.03 9-9 0-4.5-3.5-7.5-6-10-1.5 2-2 3.5-2 5-1-1-2-2.5-2-4.5-3 2.5-5 5.5-5 9.5 0 4.97 4.03 9 9 9z" />
    </svg>
  );
}

export function SidebarAwardIcon({ active = false, className = "" }) {
  if (active) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <circle cx="12" cy="8.5" r="5.5" />
        <path d="M15.5 13.8L18 22l-6-3-6 3 2.5-8.2" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8.5" r="5.5" />
      <path d="M8.21 13.89L7 22l5-3 5 3-1.21-8.11" />
    </svg>
  );
}

export function SidebarZapIcon({ active = false, className = "" }) {
  if (active) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13 2L3 14h8l-2 8 11-13h-8l3-7z" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13 2L3 14h8l-2 8 11-13h-8l3-7z" />
    </svg>
  );
}

export function SidebarHeartIcon({ active = false, className = "" }) {
  if (active) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export function SidebarUnlockIcon({ active = false, className = "" }) {
  if (active) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" clipRule="evenodd" d="M7 8V6a5 5 0 019.9-1H14.8A3 3 0 009 6v2h10a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9a2 2 0 012-2h2zm5 4a1.5 1.5 0 00-1.5 1.5c0 .53.28.99.7 1.25V17a.8.8 0 101.6 0v-2.25c.42-.26.7-.72.7-1.25A1.5 1.5 0 0012 12z" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

export function SidebarCreditCardIcon({ active = false, className = "" }) {
  if (active) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

export function SidebarHomeIcon({ active = false, className = "" }) {
  if (active) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.1L1 11.5h3.2V21a1 1 0 001 1h5v-6h4v6h5a1 1 0 001-1v-9.5H23L12 2.1z" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function SidebarSearchIcon({ active = false, className = "" }) {
  if (active) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function SidebarClockIcon({ active = false, className = "" }) {
  if (active) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 5a1 1 0 10-2 0v5a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L13 11.586V7z" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}
