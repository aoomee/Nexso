import React from 'react';

/** Shared presentation primitives. Connection and persistence stay in the caller. */
export function WorkspaceBrand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <span className="workspace-brand">
      <span className="workspace-brand-mark" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 19h11a4 4 0 0 0 1-7.87 4 4 0 0 0-6.3-3.06A5 5 0 0 0 4 12a3.6 3.6 0 0 0 3 7Z" fill="#cabbd9" />
          <path d="m10.5 12 1.8 1.5q.5.5 0 1l-1.8 1.5" fill="none" stroke="#6b5b76" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {!collapsed && <span className="workspace-brand-name">Nexso</span>}
    </span>
  );
}

export function WorkspaceToolbar({
  search, actions, filters, hidden = false,
}: {
  search: React.ReactNode;
  actions: React.ReactNode;
  filters: React.ReactNode;
  hidden?: boolean;
}) {
  return (
    <header className="workspace-toolbar" data-section="vault-hosts-header" hidden={hidden}>
      <div className="workspace-search-row">{search}</div>
      <div className="workspace-action-row">
        <div className="workspace-primary-actions">{actions}</div>
        <div className="workspace-view-actions">{filters}</div>
      </div>
    </header>
  );
}

export function WorkspaceSection({
  title, icon, accessory, children, className = '',
}: {
  title: React.ReactNode;
  icon?: React.ReactNode;
  accessory?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const titleId = React.useId();
  return (
    <section className={`workspace-editor-section bg-card text-card-foreground ${className}`} aria-labelledby={titleId}>
      <div className="workspace-section-heading">
        {icon && <span className="workspace-section-icon" aria-hidden="true">{icon}</span>}
        <h3 id={titleId}>{title}</h3>
        {accessory}
      </div>
      <div className="workspace-section-fields">{children}</div>
    </section>
  );
}

export function WorkspacePageHeading({ title, count, breadcrumb }: {
  title: React.ReactNode;
  count: number;
  breadcrumb: React.ReactNode;
}) {
  return (
    <div className="workspace-page-heading">
      <div className="workspace-breadcrumb">{breadcrumb}</div>
      <h1>{title}<span className="workspace-count">{count}</span></h1>
    </div>
  );
}
