import { useState } from 'react'
import { Gamepad2, Library, Compass, Server, Palette, FolderOpen, Settings, Play, Plus, Search, Download, ChevronRight, Zap } from 'lucide-react'

type Page = 'home' | 'instances' | 'content' | 'servers' | 'customize' | 'files' | 'settings'

const nav: { id: Page; label: string; icon: typeof Gamepad2 }[] = [
  { id: 'home', label: 'Home', icon: Gamepad2 },
  { id: 'instances', label: 'Instances', icon: Library },
  { id: 'content', label: 'Content', icon: Compass },
  { id: 'servers', label: 'Servers', icon: Server },
  { id: 'customize', label: 'Customize', icon: Palette },
  { id: 'files', label: 'Files', icon: FolderOpen },
]

function App() {
  const [page, setPage] = useState<Page>('home')
  const [search, setSearch] = useState('')

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">S</div><div><b>specked</b><span>launcher</span></div></div>
        <nav>{nav.map(({ id, label, icon: Icon }) => <button key={id} className={page === id ? 'nav-item active' : 'nav-item'} onClick={() => setPage(id)}><Icon size={18}/><span>{label}</span></button>)}</nav>
        <div className="sidebar-bottom">
          <div className="profile"><div className="avatar">V</div><div><b>V24</b><span>Offline account</span></div><ChevronRight size={15}/></div>
          <button className="nav-item" onClick={() => setPage('settings')}><Settings size={18}/><span>Settings</span></button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar"><div className="crumb">{page === 'home' ? 'Welcome back' : nav.find(n => n.id === page)?.label}</div><div className="top-actions"><div className="search"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Specked" /></div><button className="icon-btn"><Download size={17}/></button></div></header>

        {page === 'home' && <Home onNavigate={setPage}/>} 
        {page !== 'home' && <Placeholder page={page} search={search} />}
      </main>
    </div>
  )
}

function Home({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return <div className="content">
    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><Zap size={13}/> SPECKED LAUNCHER</div><h1>Ready to play?</h1><p>Your Minecraft, your way. Pick an instance and jump straight in.</p><button className="primary" onClick={() => onNavigate('instances')}><Play size={17} fill="currentColor"/> Launch Minecraft</button></div>
      <div className="hero-orb"><div className="orb-grid"/><span>S</span></div>
    </section>

    <div className="section-head"><div><h2>Quick launch</h2><p>Your recently played instances</p></div><button className="text-btn" onClick={() => onNavigate('instances')}>View all <ChevronRight size={15}/></button></div>
    <section className="instance-grid">
      <InstanceCard name="Survival" version="1.21.8 • Vanilla" accent="purple" onClick={() => onNavigate('instances')} />
      <InstanceCard name="Modded" version="1.20.1 • Fabric" accent="blue" onClick={() => onNavigate('instances')} />
      <button className="new-card" onClick={() => onNavigate('instances')}><div><Plus size={22}/></div><b>Create instance</b><span>Start something new</span></button>
    </section>

    <div className="lower-grid">
      <section className="panel"><div className="section-head compact"><div><h2>Discover</h2><p>Fresh content for your next world</p></div><button className="text-btn" onClick={() => onNavigate('content')}>Explore <ChevronRight size={15}/></button></div><div className="discover"><div className="discover-icon">✦</div><div><b>Content Hub</b><span>Browse mods, modpacks, shaders and more from Modrinth & CurseForge.</span></div></div></section>
      <section className="panel stats"><h2>Playtime</h2><div className="stat-number">24<span>h</span> 18<span>m</span></div><div className="bars">{[38,62,45,76,54,88,68,92,71,84,60,96].map((h,i)=><i key={i} style={{height:`${h}%`}}/> )}</div><span className="muted">Last 30 days</span></section>
    </div>
  </div>
}

function InstanceCard({ name, version, accent, onClick }: { name:string; version:string; accent:string; onClick:()=>void }) { return <button className="instance-card" onClick={onClick}><div className={`instance-art ${accent}`}><span>⛏</span></div><div className="instance-info"><div><b>{name}</b><span>{version}</span></div><div className="play-circle"><Play size={15} fill="currentColor"/></div></div></button> }
function Placeholder({ page, search }: { page:Page; search:string }) { const title = page === 'settings' ? 'Settings' : nav.find(n=>n.id===page)?.label; return <div className="content"><div className="page-title"><div><div className="eyebrow">SPECKED</div><h1>{title}</h1><p>{search ? `Searching for “${search}”` : 'This section is ready for the next build.'}</p></div></div><div className="empty"><div className="empty-mark"><Zap/></div><h2>Building this out</h2><p>The launcher foundation is in place. Next up: real Minecraft instances, content APIs, servers and customization.</p></div></div> }

export default App
