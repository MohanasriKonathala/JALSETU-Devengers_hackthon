import React, { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BrainCircuit,
  Building2, Droplets, Factory, Gauge, Leaf, MapPin, Play, RefreshCw,
  Settings2, ShieldCheck, Sparkles, Target, TrendingDown, Waves, Zap
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from "recharts";

const consumption = [
  { day:"Mon", used:42, expected:40 }, { day:"Tue", used:44, expected:41 },
  { day:"Wed", used:43, expected:42 }, { day:"Thu", used:51, expected:42 },
  { day:"Fri", used:48, expected:43 }, { day:"Sat", used:46, expected:43 },
  { day:"Sun", used:45, expected:42 }
];

const facilities = [
  { id:1, name:"Data Centre A", type:"Data Centre", icon:Zap, x:70, y:24, status:"high", supply:8000, demand:0 },
  { id:2, name:"Green Valley Community", type:"Residential", icon:Building2, x:28, y:67, status:"shortage", supply:0, demand:6500 },
  { id:3, name:"Riverside College", type:"Campus", icon:Building2, x:48, y:43, status:"normal", supply:1800, demand:3200 },
  { id:4, name:"Metro Industrial Park", type:"Industry", icon:Factory, x:79, y:70, status:"normal", supply:5200, demand:4600 },
  { id:5, name:"City Hotel", type:"Hotel", icon:Building2, x:18, y:28, status:"normal", supply:1100, demand:1800 }
];

function StatCard({icon:Icon, label, value, note, tone="blue"}) {
  return <div className={`stat-card ${tone}`}>
    <div className="stat-top"><div className="stat-icon"><Icon size={19}/></div><span>{label}</span></div>
    <div className="stat-value">{value}</div>
    <div className="stat-note">{note}</div>
  </div>
}

function App(){
  const [tab,setTab] = useState("overview");
  const [reuse,setReuse] = useState(40);
  const [reduction,setReduction] = useState(30);
  const [rain,setRain] = useState(true);
  const [selected,setSelected] = useState(facilities[0]);
  const [match,setMatch] = useState(false);

  const projected = useMemo(() => {
    const base = 6500;
    const reuseImpact = base * (reuse/40);
    const reductionImpact = 6500 * (reduction/30) * 0.35;
    const rainImpact = rain ? 18000 * 0.12 : 0;
    return Math.round(reuseImpact + reductionImpact + rainImpact);
  },[reuse,reduction,rain]);

  const nav = [
    ["overview","Overview"],["map","Water Map"],["matching","Water Matching"],["simulator","What-If Simulator"]
  ];

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Droplets size={24}/></div><div><b>JALSETU</b><small>Water Intelligence</small></div></div>
      <div className="side-label">COMMAND CENTER</div>
      {nav.map(([id,label])=><button key={id} className={`nav ${tab===id?"active":""}`} onClick={()=>setTab(id)}>
        {id==="overview"&&<Gauge size={18}/>}
        {id==="map"&&<MapPin size={18}/>}
        {id==="matching"&&<Target size={18}/>}
        {id==="simulator"&&<Sparkles size={18}/>}
        {label}
      </button>)}
      <div className="sidebar-bottom">
        <div className="live"><span></span> Demo network online</div>
        <div className="mini-card"><ShieldCheck size={17}/><div><b>Decision support</b><small>Human verification required</small></div></div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <div><div className="eyebrow">WATER OPERATIONS / LIVE DEMO</div><h1>{tab==="overview"?"Water Intelligence Overview":nav.find(n=>n[0]===tab)?.[1]}</h1></div>
        <div className="header-actions"><span className="demo-pill"><span/>SIMULATED DATA</span><button className="icon-btn"><RefreshCw size={18}/></button></div>
      </header>

      {tab==="overview" && <Overview onNavigate={setTab}/>}
      {tab==="map" && <WaterMap selected={selected} setSelected={setSelected}/>}
      {tab==="matching" && <Matching match={match} setMatch={setMatch}/>}
      {tab==="simulator" && <Simulator reuse={reuse} setReuse={setReuse} reduction={reduction} setReduction={setReduction} rain={rain} setRain={setRain} projected={projected}/>}
    </main>
  </div>
}

function Overview({onNavigate}){
  return <section className="content">
    <div className="hero-banner">
      <div><span className="badge"><Sparkles size={14}/> INTELLIGENT WATER ALLOCATION</span>
      <h2>Water should flow<br/><em>where it matters most.</em></h2>
      <p>JALSETU connects consumption, shortage risk and potential non-potable water reuse in one decision-support layer.</p>
      <button className="primary" onClick={()=>onNavigate("matching")}>Explore Water Matching <ArrowDownRight size={17}/></button></div>
      <div className="hero-orb"><Waves size={100}/><div className="orb-ring r1"/><div className="orb-ring r2"/></div>
    </div>

    <div className="stats">
      <StatCard icon={Droplets} label="TOTAL CONSUMPTION" value="1.24M L/day" note="Across demo network" />
      <StatCard icon={AlertTriangle} label="POTENTIAL WASTE" value="84K L/day" note="Anomaly signals detected" tone="amber"/>
      <StatCard icon={Activity} label="SHORTAGE RISK" value="3 zones" note="Needs attention" tone="red"/>
      <StatCard icon={Leaf} label="POTENTIAL AVOIDED" value="126K L/mo" note="Simulated opportunity" tone="green"/>
    </div>

    <div className="grid-2">
      <div className="panel">
        <div className="panel-head"><div><h3>Consumption pattern</h3><span>Litres × 1,000 · 7 day view</span></div><span className="trend down"><TrendingDown size={15}/> 8.4%</span></div>
        <div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={consumption}>
          <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#20d3ee" stopOpacity=".28"/><stop offset="100%" stopColor="#20d3ee" stopOpacity="0"/></linearGradient></defs>
          <CartesianGrid stroke="#1c3043" vertical={false}/><XAxis dataKey="day" stroke="#71869b" axisLine={false} tickLine={false}/><YAxis stroke="#71869b" axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:"#0d1a29",border:"1px solid #243a50",borderRadius:10}}/>
          <Area type="monotone" dataKey="used" stroke="#20d3ee" fill="url(#fill)" strokeWidth={3}/>
          <Area type="monotone" dataKey="expected" stroke="#70869b" fill="none" strokeDasharray="5 5"/>
        </AreaChart></ResponsiveContainer></div>
      </div>

      <div className="panel">
        <div className="panel-head"><div><h3>Priority signals</h3><span>Requires review</span></div><button className="text-btn" onClick={()=>onNavigate("map")}>Open map →</button></div>
        <div className="alert-list">
          <div className="alert-item red"><div className="alert-icon"><AlertTriangle size={18}/></div><div><b>Shortage risk · Zone B</b><p>Potential 11,000 L/day gap detected.</p></div><span>HIGH</span></div>
          <div className="alert-item amber"><div className="alert-icon"><Activity size={18}/></div><div><b>Consumption spike · Data Centre A</b><p>68% above expected pattern.</p></div><span>WATCH</span></div>
          <div className="alert-item green"><div className="alert-icon"><Target size={18}/></div><div><b>Potential match available</b><p>6,500 L/day suitable demand nearby.</p></div><span>READY</span></div>
        </div>
      </div>
    </div>

    <div className="section-title"><div><h3>Network snapshot</h3><span>Potential opportunities across the demo network</span></div></div>
    <div className="network-cards">{facilities.slice(0,4).map(f=><div className="facility-card" key={f.id}><div className={`facility-dot ${f.status}`}></div><div><b>{f.name}</b><small>{f.type}</small></div><div className="facility-number">{f.supply?`${(f.supply/1000).toFixed(1)}k L`:"—"}<small>{f.supply?"potential supply":"no supply"}</small></div></div>)}</div>
  </section>
}

function WaterMap({selected,setSelected}){
  return <section className="content">
    <div className="map-layout">
      <div className="map-panel">
        <div className="map-toolbar"><span><span className="map-live"></span> Network map</span><span>5 facilities · 3 risk signals</span></div>
        <div className="fake-map">
          <div className="grid-lines"></div>
          <div className="river"></div>
          {facilities.map(f=>{const Icon=f.icon; return <button key={f.id} className={`map-pin ${f.status}`} style={{left:`${f.x}%`,top:`${f.y}%`}} onClick={()=>setSelected(f)}><span><Icon size={15}/></span></button>})}
          <div className="route route-a"></div><div className="route route-b"></div>
          <div className="map-label label-a">Potential source</div><div className="map-label label-b">Shortage risk</div>
        </div>
      </div>
      <div className="map-details panel">
        <div className="panel-head"><div><h3>{selected.name}</h3><span>{selected.type}</span></div><span className={`status-tag ${selected.status}`}>{selected.status.toUpperCase()}</span></div>
        <div className="detail-metric"><span>Potential availability</span><b>{selected.supply.toLocaleString()} L/day</b></div>
        <div className="detail-metric"><span>Current demand</span><b>{selected.demand.toLocaleString()} L/day</b></div>
        <div className="detail-metric"><span>Location</span><b>{selected.x.toFixed(0)}° / {selected.y.toFixed(0)}°</b></div>
        <div className="insight"><BrainCircuit size={18}/><div><b>JALSETU insight</b><p>{selected.status==="high"?"Consumption is above the expected pattern. Review cooling and operational water use.":selected.status==="shortage"?"Potential demand-supply gap detected. Search for suitable non-potable sources.":"No immediate anomaly. Continue monitoring the baseline."}</p></div></div>
        <button className="primary full">Open facility analysis</button>
      </div>
    </div>
  </section>
}

function Matching({match,setMatch}){
  return <section className="content">
    <div className="match-hero">
      <div><span className="badge"><Target size={14}/> CORE INNOVATION</span><h2>Water Matching<br/><em>Engine</em></h2><p>Identify potential connections between available non-potable water and suitable nearby demand.</p></div>
      <div className="match-score"><span>Potential match score</span><strong>92</strong><small>/100</small></div>
    </div>
    <div className="match-grid">
      <div className="source-box"><span className="small-label">POTENTIAL SOURCE</span><h3>Data Centre A</h3><div className="big-number">8,000 <small>L/day</small></div><p>Potentially available non-potable water</p><div className="chips"><span>Available</span><span>Non-potable</span></div></div>
      <div className="engine"><div className="engine-core"><BrainCircuit size={34}/></div><span>JALSETU<br/>ENGINE</span><div className="engine-line"></div></div>
      <div className="source-box demand"><span className="small-label">SUITABLE DEMAND</span><h3>Green Valley Community</h3><div className="big-number">6,500 <small>L/day</small></div><p>Potential non-potable requirement</p><div className="chips"><span>High priority</span><span>2.4 km</span></div></div>
    </div>
    <div className="match-result">
      <div><div className="result-icon"><Target size={21}/></div><div><b>Potential match identified</b><p>Quantity, location, usage category and priority are compatible for further technical verification.</p></div></div>
      <div className="result-impact"><span>Potential freshwater avoided</span><strong>6,500 L/day</strong></div>
      <button className={`primary ${match?"success":""}`} onClick={()=>setMatch(true)}>{match?"Match Simulated ✓":"Simulate Match"}</button>
    </div>
    <div className="notice"><ShieldCheck size={16}/><span><b>Safety note:</b> This is a decision-support recommendation. Actual reuse requires water-quality testing, treatment, infrastructure and applicable regulatory verification.</span></div>
  </section>
}

function Simulator({reuse,setReuse,reduction,setReduction,rain,setRain,projected}){
  const bars = [
    {name:"Current", value:100},
    {name:"Conservation", value:100-reduction},
    {name:"Reuse + rain", value:Math.max(25,100-reduction-(reuse*.35)-(rain?12:0))}
  ];
  return <section className="content">
    <div className="sim-header"><div><span className="badge"><Sparkles size={14}/> DECISION SIMULATOR</span><h2>What if we used water<br/><em>more intelligently?</em></h2><p>Explore scenarios using simulated demo data.</p></div><div className="projection"><span>Potential freshwater avoided</span><strong>{projected.toLocaleString()} L</strong><small>per month · projected</small></div></div>
    <div className="sim-grid">
      <div className="panel controls">
        <h3>Scenario controls</h3>
        <div className="control"><div><b>Freshwater reduction</b><span>{reduction}%</span></div><input type="range" min="0" max="60" value={reduction} onChange={e=>setReduction(+e.target.value)}/><small>Reduce avoidable freshwater demand.</small></div>
        <div className="control"><div><b>Water reuse rate</b><span>{reuse}%</span></div><input type="range" min="0" max="80" value={reuse} onChange={e=>setReuse(+e.target.value)}/><small>Increase suitable non-potable reuse.</small></div>
        <div className="toggle-row"><div><b>Rainwater harvesting</b><small>Include seasonal capture potential.</small></div><button className={`toggle ${rain?"on":""}`} onClick={()=>setRain(!rain)}><span/></button></div>
        <button className="primary full" onClick={()=>{}}>Run simulation <Play size={16}/></button>
      </div>
      <div className="panel">
        <div className="panel-head"><div><h3>Projected demand index</h3><span>Lower is better · simulated</span></div><span className="trend down"><ArrowDownRight size={15}/> improved</span></div>
        <div className="chart bar-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={bars}><CartesianGrid stroke="#1c3043" vertical={false}/><XAxis dataKey="name" stroke="#71869b" axisLine={false} tickLine={false}/><YAxis stroke="#71869b" axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:"#0d1a29",border:"1px solid #243a50",borderRadius:10}}/><Bar dataKey="value" fill="#20d3ee" radius={[7,7,0,0]} barSize={42}/></BarChart></ResponsiveContainer></div>
      </div>
    </div>
    <div className="impact-row"><div><Leaf size={20}/><b>Potential impact</b><span>Scenario projection, not a measured field result.</span></div><strong>{projected.toLocaleString()} L/month</strong></div>
  </section>
}

export default App;