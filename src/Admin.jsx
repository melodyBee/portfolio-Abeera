import {useEffect,useState} from 'react';
import {MODE,loadAdmin,save,signIn,signOut,getSession} from './content.js';
import ProjectCard from './ProjectCard.jsx';

const okUrl=u=>{try{const x=new URL(u);return x.protocol==='https:'||x.protocol==='http:'}catch{return false}};
const F=(k,l,o={})=>({k,l,...o});
const PF=[F('name','Project name',{req:1}),F('id','Slug (unique, lowercase-with-dashes)',{req:1,slug:1}),F('description','Short description',{req:1,t:'area'}),F('details','Detailed description',{t:'area'}),
 F('live','Live website URL',{url:1}),F('repo','GitHub / repository URL',{url:1}),F('links','Additional links (one full URL per line)',{t:'area',urls:1}),F('stack','Technology stack',{t:'tags'}),
 F('role','My role and contributions',{t:'area'}),F('status','Project status',{t:'sel',o:['live','wip','archived','idea']}),F('published','Published (visible on the public site)',{t:'chk'}),
 F('featured','Featured project (only one at a time)',{t:'chk'}),F('cover','Cover image URL',{url:1}),F('alt','Image alt text'),F('category','Category'),F('date','Completion date',{t:'date'})];
const WF=[F('title','Title',{req:1}),F('id','Slug (unique, lowercase-with-dashes)',{req:1,slug:1}),F('description','Short description',{t:'area'}),F('url','Article URL',{req:1,url:1}),
 F('platform','Platform',{t:'sel',o:['Medium','RusticReads','Other']}),F('date','Publication date',{t:'date'}),F('category','Category'),F('published','Published',{t:'chk'})];
const SF=[F('heroLead','Hero introduction',{t:'area',req:1}),F('writingText','Writing section intro',{t:'area'}),F('rusticUrl','RusticReads URL',{url:1}),F('aiText','Agentic AI learning status',{t:'area'}),
 F('aboutText','About text (blank line between paragraphs)',{t:'area',req:1}),F('skillsBuilding','Skills: building with',{t:'tags'}),F('skillsWriting','Skills: writing',{t:'tags'}),F('skillsLearning','Skills: learning now',{t:'tags'}),
 F('contactText','Contact intro',{t:'area'}),F('github','GitHub URL',{url:1}),F('linkedin','LinkedIn URL',{url:1}),F('medium','Medium URL',{url:1}),F('footer','Footer text')];
const BLANK_P={id:'',name:'',description:'',details:'',live:'',repo:'',links:'',stack:[],role:'',status:'wip',published:false,featured:false,cover:'',alt:'',category:'',date:''};
const BLANK_W={id:'',title:'',description:'',url:'',platform:'Medium',date:'',category:'',published:false};

function Editor({fields,init,others=[],onSave,onCancel,preview}){
 const [v,setV]=useState(init),[err,setErr]=useState({}),[tg,setTg]=useState({}),[busy,setBusy]=useState(false);
 const set=(k,x)=>setV(o=>({...o,[k]:x}));
 const addTag=k=>{const t=(tg[k]||'').trim();if(t&&!v[k].includes(t))set(k,[...v[k],t]);setTg(o=>({...o,[k]:''}))};
 const validate=()=>{const e={};fields.forEach(f=>{const x=v[f.k];
  if(f.req&&!String(x||'').trim())e[f.k]='Required.';
  else if(f.slug&&!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(x))e[f.k]='Use lowercase letters, numbers and dashes.';
  else if(f.slug&&others.includes(x))e[f.k]='This slug is already used.';
  else if(f.url&&x&&!okUrl(x))e[f.k]='Enter a full http(s) URL.';
  else if(f.urls&&String(x||'').split('\n').some(l=>l.trim()&&!okUrl(l.trim())))e[f.k]='Each line must be a full http(s) URL.'});
  if('cover'in v&&v.cover&&!String(v.alt).trim())e.alt='Add alt text for the cover image.';
  setErr(e);return !Object.keys(e).length};
 const submit=async e=>{e.preventDefault();if(!validate()){setTimeout(()=>document.querySelector('[aria-invalid=true]')?.focus());return}
  setBusy(true);const ok=await onSave({...v,updated:Date.now()});if(!ok)setBusy(false)};
 return(<form onSubmit={submit} noValidate>
  {fields.map(f=>{const id='fld-'+f.k,ed=err[f.k]&&id+'-e',p={id,'aria-invalid':!!err[f.k],'aria-describedby':ed};
   return(<div key={f.k}>
    {f.t==='chk'?<label className="chk"><input type="checkbox" checked={!!v[f.k]} onChange={e=>set(f.k,e.target.checked)}/>{f.l}</label>:<label htmlFor={id}>{f.l}{f.req&&' *'}</label>}
    {f.t==='area'&&<textarea {...p} value={v[f.k]||''} onChange={e=>set(f.k,e.target.value)}/>}
    {f.t==='sel'&&<select {...p} value={v[f.k]} onChange={e=>set(f.k,e.target.value)}>{f.o.map(o=><option key={o}>{o}</option>)}</select>}
    {f.t==='tags'&&<><div>{v[f.k].map(t=><span className="tag chip" key={t}>{t}<button type="button" aria-label={'Remove '+t} onClick={()=>set(f.k,v[f.k].filter(x=>x!==t))}>×</button></span>)}</div>
     <div className="row" style={{border:0,padding:'.4rem 0'}}><input id={id} className="grow" type="text" value={tg[f.k]||''} placeholder="Add a tag" onChange={e=>setTg(o=>({...o,[f.k]:e.target.value}))} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addTag(f.k)}}}/><button type="button" className="btn y sm" onClick={()=>addTag(f.k)}>Add tag</button></div></>}
    {!f.t&&<input {...p} type={f.url?'url':'text'} value={v[f.k]||''} onChange={e=>set(f.k,e.target.value)}/>}
    {f.t==='date'&&<input {...p} type="date" value={v[f.k]||''} onChange={e=>set(f.k,e.target.value)}/>}
    {err[f.k]&&<p className="err" id={ed}>{err[f.k]}</p>}</div>)})}
  <div className="cta"><button className="btn g" disabled={busy}>{busy?'Saving…':'Save'}</button><button type="button" className="btn y" onClick={onCancel}>Cancel</button></div>
  {preview&&<><h3 style={{marginTop:'2rem'}}>Preview</h3><div className="grid"><ProjectCard p={{...v,stack:v.stack||[]}} open onToggle={()=>{}}/></div></>}</form>)}

function List({kind,fields,blank,data,commit,label}){
 const [ed,setEd]=useState(null),items=data[kind],put=a=>commit({...data,[kind]:a});
 const move=(i,d)=>{const a=[...items],j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];put(a)};
 const dup=i=>{let id=items[i].id+'-copy',n=2;while(items.some(x=>x.id===id))id=items[i].id+'-copy-'+n++;const c={...items[i],id,[items[i].name?'name':'title']:(items[i].name||items[i].title)+' (copy)',published:false,featured:false,updated:Date.now()};const a=[...items];a.splice(i+1,0,c);put(a)};
 const upd=(i,ch)=>put(items.map((x,j)=>j===i?{...x,...ch,updated:Date.now()}:ch.featured?{...x,featured:false}:x));
 const del=i=>confirm(`Delete "${items[i].name||items[i].title}"? This cannot be undone.`)&&put(items.filter((_,j)=>j!==i));
 const saveItem=async v=>{let a=[...items];if(v.featured)a=a.map(x=>({...x,featured:false}));ed.i<0?a.push(v):a[ed.i]=v;const ok=await commit({...data,[kind]:a});if(ok)setEd(null);return ok};
 if(ed)return(<div className="win"><div className="t">{ed.i<0?'New':'Edit'} {label}</div><div className="b"><Editor fields={fields} init={ed.item} others={items.filter((_,j)=>j!==ed.i).map(x=>x.id)} onSave={saveItem} onCancel={()=>setEd(null)} preview={kind==='projects'}/></div></div>);
 return(<div><button className="btn" onClick={()=>setEd({i:-1,item:blank})}>+ Add {label}</button>
  {!items.length&&<p>Nothing here yet.</p>}
  {items.map((x,i)=>{const n=x.name||x.title;return(<div className="row" key={x.id}><div className="grow"><strong>{n}</strong> {x.featured&&'★ '}<span className={'status '+(x.published?'st-live':'st-wip')}>{x.published?'Published':'Draft'}</span>{x.status&&<span className="tag">{x.status}</span>}</div>
   <button className="btn y sm" aria-label={'Move '+n+' up'} onClick={()=>move(i,-1)} disabled={i===0}>↑</button><button className="btn y sm" aria-label={'Move '+n+' down'} onClick={()=>move(i,1)} disabled={i===items.length-1}>↓</button>
   <button className="btn y sm" onClick={()=>setEd({i,item:{...blank,...x}})}>Edit</button><button className="btn y sm" onClick={()=>dup(i)}>Duplicate</button>
   {kind==='projects'&&<button className="btn y sm" aria-pressed={!!x.featured} onClick={()=>upd(i,{featured:!x.featured})}>{x.featured?'Unfeature':'Feature'}</button>}
   <button className="btn g sm" onClick={()=>upd(i,{published:!x.published})}>{x.published?'Unpublish':'Publish'}</button><button className="btn sm" onClick={()=>del(i)}>Delete</button></div>)})}</div>)}

export default function Admin(){
 const [auth,setAuth]=useState(null),[data,setData]=useState(null),[tab,setTab]=useState('Overview'),[msg,setMsg]=useState(null),[lerr,setLerr]=useState('');
 useEffect(()=>{getSession().then(s=>setAuth(!!s)).catch(()=>setAuth(false))},[]);
 useEffect(()=>{if(auth)loadAdmin().then(setData).catch(e=>setMsg({e:1,t:'Could not load content: '+e.message}))},[auth]);
 const commit=async next=>{try{await save(next);setData(next);setMsg({t:'Saved.'});return true}catch(e){setMsg({e:1,t:'Save failed: '+e.message});return false}};
 const login=async e=>{e.preventDefault();setLerr('');const f=new FormData(e.target);try{await signIn(f.get('email'),f.get('pw'));setAuth(true)}catch(x){setLerr(x.message)}};
 if(auth===null)return <p style={{padding:'2rem'}} role="status">Checking sign-in…</p>;
 if(!auth)return(<div className="adm" style={{maxWidth:'30rem'}}><div className="win"><div className="t"><span className="dots" aria-hidden="true"><i/><i/><i/></span>admin_login</div><div className="b">
  <h1 style={{fontSize:'2rem'}}>Admin</h1>
  {MODE==='demo'?<><p className="note" style={{transform:'none'}}><strong>Demo mode.</strong> No backend is configured, so there is no real security. Content is saved only in this browser. Add Supabase keys to enable real sign-in.</p>
   <button className="btn g" onClick={()=>signIn().then(()=>setAuth(true))}>Enter demo admin</button></>
  :<form onSubmit={login}><label htmlFor="em">Email</label><input id="em" name="email" type="email" required autoComplete="username"/><label htmlFor="pw">Password</label><input id="pw" name="pw" type="password" required autoComplete="current-password"/>
   {lerr&&<p className="err" role="alert">{lerr}</p>}<p><button className="btn g">Sign in</button></p></form>}
  <p><a href="#home">← Back to the site</a></p></div></div></div>);
 if(!data)return <p style={{padding:'2rem'}} role="status">{msg?.e?msg.t:'Loading…'}</p>;
 const {projects:P,writing:W}=data,recent=[...P.map(x=>({n:x.name,u:x.updated||0})),...W.map(x=>({n:x.title,u:x.updated||0}))].filter(x=>x.u).sort((a,b)=>b.u-a.u).slice(0,5);
 const stats=[['Projects',P.length],['Published',P.filter(p=>p.published).length],['Drafts',P.filter(p=>!p.published).length],['Work in progress',P.filter(p=>p.status==='wip').length],['Writing items',W.length]];
 return(<div className="adm"><div className="bar" style={{padding:0}}><h1 style={{fontSize:'2.2rem',margin:0}}>melodyBee admin</h1><div className="cta" style={{margin:0}}><a className="btn y sm" href="#home">View site</a><button className="btn sm" onClick={()=>signOut().then(()=>{setAuth(false);setData(null)})}>Sign out</button></div></div>
  {MODE==='demo'&&<p className="note" style={{transform:'none'}}>Demo mode: saved only in this browser, no real security.</p>}
  <div className="tabs" role="group" aria-label="Admin sections">{['Overview','Projects','Writing','Settings'].map(t=><button key={t} className="btn y sm" aria-current={tab===t} onClick={()=>{setTab(t);setMsg(null)}}>{t}</button>)}</div>
  <p role="status" aria-live="polite" style={{fontWeight:600}}>{msg&&(msg.e?'⚠ ':'✓ ')+msg.t}</p>
  {tab==='Overview'&&<><div className="stats">{stats.map(([l,n])=><div className="stat" key={l}><b>{n}</b>{l}</div>)}</div><h2 style={{fontSize:'1.6rem',marginTop:'2rem'}}>Recently updated</h2>{recent.length?<ul>{recent.map(r=><li key={r.n+r.u}>{r.n} · {new Date(r.u).toLocaleString()}</li>)}</ul>:<p>No edits yet.</p>}</>}
  {tab==='Projects'&&<List kind="projects" label="project" fields={PF} blank={BLANK_P} data={data} commit={commit}/>}
  {tab==='Writing'&&<List kind="writing" label="writing item" fields={WF} blank={BLANK_W} data={data} commit={commit}/>}
  {tab==='Settings'&&<div className="win"><div className="t">site_settings</div><div className="b"><Editor fields={SF} init={data.settings} onCancel={()=>setTab('Overview')} onSave={v=>commit({...data,settings:v})}/></div></div>}
 </div>)}
