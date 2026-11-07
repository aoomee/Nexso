import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { WorkspaceBrand, WorkspacePageHeading, WorkspaceSection, WorkspaceToolbar } from '../components/workspace/WorkspaceChrome';

// Local visual review harness. No SSH bridge, real credentials, or persistence.
const paths: Record<string, React.ReactNode> = {
  server: <><rect x="4" y="3" width="16" height="7" rx="2"/><rect x="4" y="14" width="16" height="7" rx="2"/><path d="M8 6.5h.01M8 17.5h.01M12 6.5h4M12 17.5h4"/></>,
  key: <><circle cx="8" cy="8" r="4"/><path d="m11 11 9 9m-4-4 3-3m-6 0 3-3"/></>,
  folder: <path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  chevron: <path d="m9 5 7 7-7 7"/>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  terminal: <><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 9 3 3-3 3m6 0h4"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  list: <path d="M4 6h16M4 12h16M4 18h16"/>,
  activity: <path d="M3 13h4l3-9 4 16 3-7h4"/>,
  globe: <><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></>,
  code: <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/>,
  notes: <><rect x="5" y="3" width="15" height="18" rx="2"/><path d="M3 7h4M3 12h4M3 17h4M10 8h6M10 12h6"/></>,
  forward: <path d="M3 7h16m-4-4 4 4-4 4M21 17H5m4-4-4 4 4 4"/>,
  settings: <><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="16" cy="17" r="3"/></>,
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/>,
  pin: <><path d="m8 3 8 0-1 6 4 4v2H5v-2l4-4-1-6ZM12 15v6"/></>,
};
function Icon({ name, size = 17 }: { name: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.server}</svg>;
}
type ExampleHost = { id: number; name: string; address: string; group: string; distro: string; pinned?: boolean };
const initialHosts: ExampleHost[] = [
  { id: 1, name: 'Edge01', address: '192.0.2.10', group: 'Edge', distro: 'Ubuntu', pinned: true },
  { id: 2, name: 'App01', address: '192.0.2.20', group: 'Web', distro: 'Debian' },
  { id: 3, name: 'App02', address: '192.0.2.30', group: 'Web', distro: 'Debian' },
  { id: 4, name: 'App03', address: '198.51.100.10', group: 'Web', distro: 'Debian' },
  { id: 5, name: 'Edge02', address: '198.51.100.20', group: 'Edge', distro: 'Debian' },
  { id: 6, name: 'App04', address: '198.51.100.30', group: 'Relay', distro: 'Alpine' },
  { id: 7, name: 'Edge03', address: '203.0.113.10', group: 'Edge', distro: 'Debian' },
  { id: 8, name: 'Relay01', address: '203.0.113.20', group: 'Relay', distro: 'Debian' },
  { id: 9, name: 'Web01', address: '203.0.113.30', group: 'Web', distro: 'Ubuntu' },
];

function Preview() {
  const systemDialogRef = useRef<HTMLDialogElement>(null);
  const [sampleSwitch, setSampleSwitch] = useState(true);
  const [hosts, setHosts] = useState(initialHosts);
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('');
  const [view, setView] = useState('grid');
  const [dark, setDark] = useState(false);
  const [editor, setEditor] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [parent, setParent] = useState('Web');
  const [username, setUsername] = useState('root');
  const [notice, setNotice] = useState('');
  const addressRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const newHostRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  useEffect(() => { if (editor) addressRef.current?.focus(); }, [editor]);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === 'Escape' && editor) { setEditor(false); newHostRef.current?.focus(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editor]);
  const shown = hosts.filter(h => (!group || h.group === group) && `${h.name} ${h.address} ${h.group}`.toLowerCase().includes(search.toLowerCase()));
  function openNew() { setEditingId(null); setName(''); setAddress(''); setParent(group || 'Web'); setEditor(true); setNotice(''); }
  function openHost(h: ExampleHost) { setEditingId(h.id); setName(h.name); setAddress(h.address); setParent(h.group); setEditor(true); setNotice(''); }
  function closeEditor() { setEditor(false); newHostRef.current?.focus(); }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;
    const record = { id: editingId ?? Date.now(), name: name.trim() || address.trim(), address: address.trim(), group: parent, distro: 'Linux' };
    setHosts(current => editingId ? current.map(h => h.id === editingId ? { ...h, ...record } : h) : [...current, record]);
    setGroup(parent); setSearch(''); closeEditor(); setNotice('已更新预览中的示例主机。刷新页面会恢复初始数据。');
  }
  const nav = [['server', '主机'], ['activity', '监控'], ['key', '钥匙串'], ['globe', '代理'], ['forward', '端口转发'], ['code', '脚本'], ['notes', '笔记'], ['pin', '已知主机'], ['activity', '日志']];
  return <>
    <div className="review-note"><span>界面预览</span><div className="review-controls"><button onClick={() => systemDialogRef.current?.showModal()}>查看统一控件</button></div></div>
    <div className="preview-window">
      <div className="preview-top workspace-tabs">
        <div className="traffic" aria-hidden="true"><i/><i/><i/></div>
        <button className="preview-tab selected"><Icon name="folder"/> Vaults</button>
        <button className="preview-tab" disabled><Icon name="folder"/> SFTP</button>
        <button className="top-icon" onClick={openNew} aria-label="新建主机"><Icon name="plus"/></button>
        <span className="top-spacer"/>
        <button className="top-icon" onClick={() => setDark(!dark)} aria-label="切换明暗主题"><Icon name="moon"/></button>
      </div>
      <div className="preview-body">
        <aside className="preview-sidebar" data-section="vault-sidebar">
          <div className="preview-brand"><WorkspaceBrand/></div>
          <nav className="workspace-navigation" aria-label="主导航">
            {nav.map(([icon, label], i) => <button key={label} aria-current={i === 0 ? 'page' : undefined} disabled={i !== 0} onClick={() => { setGroup(''); setSearch(''); }}><Icon name={icon}/><span>{label}</span></button>)}
          </nav>
          <div className="preview-sidebar-bottom"><button disabled><Icon name="settings"/> 设置</button></div>
        </aside>
        <main className="preview-main">
          <WorkspaceToolbar
            search={<><div className="preview-search"><Icon name="search"/><input ref={searchRef} aria-label="搜索主机" placeholder="查找主机、分组或 IP 地址…" value={search} onChange={e => setSearch(e.target.value)}/><kbd>⌘ K</kbd></div><button className="quiet-button" onClick={() => setNotice('这是界面预览。真实 SSH 连接由原项目提供。')}>快速连接 <span>↗</span></button></>}
            actions={<><button ref={newHostRef} className="primary-button" onClick={openNew}><Icon name="plus" size={15}/>新建主机</button><button className="plain-button" disabled><Icon name="terminal" size={15}/> 本地终端</button></>}
            filters={<div className="view-switch" aria-label="列表显示方式"><button aria-label="网格视图" aria-pressed={view === 'grid'} onClick={() => setView('grid')}><Icon name="grid" size={15}/></button><button aria-label="列表视图" aria-pressed={view === 'list'} onClick={() => setView('list')}><Icon name="list" size={16}/></button></div>}
          />
          <div className="preview-content">
            <WorkspacePageHeading title={group || '全部主机'} count={shown.length} breadcrumb={<div className="breadcrumb"><button onClick={() => setGroup('')}>工作空间</button><span>/</span><span>{group || '全部主机'}</span></div>}/>
            {!group && !search && <section className="group-section" aria-label="主机分组"><h2>分组</h2><div className="preview-groups">{['Edge', 'Relay', 'Web'].map(g => <button key={g} className="workspace-host-card workspace-group-card preview-group" onClick={() => setGroup(g)}><span className="folder-icon"><Icon name="folder" size={20}/></span><span><strong>{g}</strong><small>{hosts.filter(h => h.group === g).length} 台主机</small></span><Icon name="chevron" size={14}/></button>)}</div></section>}
            <section aria-label="主机列表"><div className="list-heading"><h2>主机</h2><span>{group ? '当前分组' : '全部分组'}</span></div>
              <div className={`preview-hosts ${view === 'list' ? 'is-list' : ''}`}>
                {shown.map(h => <button key={h.id} className="workspace-host-card preview-host" onClick={() => openHost(h)}><span className="host-icon"><Icon name="server" size={17}/></span><span className="host-copy"><strong>{h.name}{h.pinned && <Icon name="pin" size={11}/>}</strong><small>root@{h.address}</small></span>{view === 'list' && <span className="host-group">{h.group}</span>}<span className="host-distro">{h.distro}</span><span className="host-open"><Icon name="chevron" size={14}/></span></button>)}
              </div>
              {shown.length === 0 && <div className="preview-empty"><Icon name="search" size={28}/><h3>没有匹配的主机</h3><p>试试其他名称或 IP 地址。</p><button className="quiet-button" onClick={() => setSearch('')}>清除搜索</button></div>}
            </section>
            {notice && <div className="preview-notice" role="status">{notice}</div>}
          </div>
        </main>
        {editor && <aside className="preview-editor workspace-host-editor" aria-label={editingId ? '主机详情' : '新建主机'}>
          <header className="workspace-editor-header"><div><h3>{editingId ? '主机详情' : '新建主机'}</h3></div><button className="icon-button" aria-label="关闭主机面板" onClick={closeEditor}><Icon name="close"/></button></header>
          <form onSubmit={save} className="preview-form">
            <div className="preview-fields">
              <WorkspaceSection title="连接地址" icon={<Icon name="globe"/>}><label className="preview-field"><span>IP 地址或主机名</span><input ref={addressRef} required placeholder="例如 192.0.2.10" value={address} onChange={e => setAddress(e.target.value)}/></label></WorkspaceSection>
              <WorkspaceSection title="基本信息" icon={<Icon name="settings"/>}><label className="preview-field"><span>名称</span><input placeholder="为主机起个名字" value={name} onChange={e => setName(e.target.value)}/></label><label className="preview-field"><span>所属分组</span><select value={parent} onChange={e => setParent(e.target.value)}>{['Edge','Relay','Web'].map(g => <option key={g}>{g}</option>)}</select></label><label className="preview-field"><span>标签 <small>可选</small></span><input placeholder="添加标签…"/></label></WorkspaceSection>
              <WorkspaceSection title="SSH 与认证" icon={<Icon name="key"/>}><div className="preview-port"><span>连接端口</span><input type="number" aria-label="SSH 端口" defaultValue="22" min="1" max="65535"/></div><label className="preview-field"><span>用户名</span><input value={username} onChange={e => setUsername(e.target.value)} autoComplete="off"/></label><label className="preview-field"><span>密码</span><input type="password" placeholder="仅供预览，请勿输入真实密码" autoComplete="off"/></label><p className="preview-auth-note">预览不保存或发送认证信息。</p></WorkspaceSection>
            </div>
            <footer className="workspace-editor-footer"><button className="primary-button" type="submit" disabled={!address.trim()}>保存主机<Icon name="chevron" size={16}/></button></footer>
          </form>
        </aside>}
      </div>
    </div>

    <dialog ref={systemDialogRef} className="ui-dialog system-dialog" aria-labelledby="system-title">
      <header><div><h2 id="system-title">统一控件 · 样式检查</h2><p>示例数据，不连接服务器。</p></div><button className="icon-button ui-button" aria-label="关闭控件预览" onClick={() => systemDialogRef.current?.close()}><Icon name="close"/></button></header>
      <div className="system-gallery">
        <section className="ui-surface"><h3>输入与选择</h3><label>名称<input className="ui-control" placeholder="输入名称…"/></label><label>连接方式<select className="ui-control" defaultValue="ssh"><option value="ssh">SSH</option><option value="sftp">SFTP</option></select></label><label>备注<textarea className="ui-control" placeholder="添加备注…"/></label><div className="sample-actions"><button className="primary-button ui-button" onClick={() => systemDialogRef.current?.close()}>完成预览</button><button className="quiet-button ui-button" onClick={() => systemDialogRef.current?.close()}>取消</button><button className="primary-button ui-button" disabled>不可用</button></div></section>
        <section className="ui-surface"><h3>设置、标签与菜单</h3><div className="sample-setting"><span>启用选项</span><button role="switch" aria-label="示例选项" aria-checked={sampleSwitch} className="sample-switch" onClick={() => setSampleSwitch(!sampleSwitch)}><span/></button></div><div className="sample-setting"><span>选中状态</span><span className="sample-badge">已启用</span></div><div className="sample-menu ui-menu" aria-label="菜单外观示例"><button onClick={() => { systemDialogRef.current?.close(); openNew(); }}>新建主机</button><button onClick={() => { setView('list'); systemDialogRef.current?.close(); }}>切换列表视图</button><button onClick={() => setDark(!dark)}>切换明暗主题</button></div></section>
      </div>
    </dialog>
  </>;
}

createRoot(document.getElementById('root')!).render(<Preview/>);
