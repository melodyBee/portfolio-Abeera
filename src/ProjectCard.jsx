export const STATUS={live:['st-live','● Live'],wip:['st-wip','◐ Work in progress'],archived:['st-wip','▣ Archived'],idea:['st-idea','◇ Idea']};
const GL=['✦','≋','♪','❝','◐'];
export default function ProjectCard({p,i=0,open,onToggle}){
 const [cls,label]=STATUS[p.status]||STATUS.live;
 const extra=(p.links||'').split('\n').map(l=>l.trim()).filter(Boolean);
 return(<article className={`folder${p.featured?' feat':''}${open?' open':''}`} id={'f-'+p.id}>
  <p style={{margin:'0 0 .5rem'}}><span className={'status '+cls}>{label}</span>{p.featured&&<> <strong>Featured</strong></>}</p>
  <h3>{p.name}</h3><p>{p.description}</p>
  <div>{p.stack.map(s=><span className="tag" key={s}>{s}</span>)}</div>
  <div className="links"><button className="btn y tog" type="button" aria-expanded={!!open} aria-controls={'p-'+p.id} onClick={e=>onToggle(p,e.currentTarget)}>{open?'Close folder':'Open folder'}</button>
   {p.live&&<a href={p.live} target="_blank" rel="noopener noreferrer">Live site ↗</a>}{p.repo&&<a href={p.repo} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}</div>
  <div className="panel" id={'p-'+p.id} role="region" aria-label={p.name+' details'} inert={open?undefined:''}><div className="pi"><div className="pin">
   <div style={{'--i':0}}>
    {p.cover&&<img src={p.cover} alt={p.alt} loading="lazy" style={{maxWidth:'100%',border:'2px solid var(--line)',marginBottom:'1rem'}}/>}
    {p.details&&<p style={{marginTop:0}}>{p.details}</p>}
    <dl style={{margin:0}}>
     {p.stack.length>0&&<><dt>Technologies</dt><dd>{p.stack.join(', ')}</dd></>}
     {p.role&&<><dt>My role</dt><dd>{p.role}</dd></>}
     <dt>Status</dt><dd>{label}</dd>
     {p.category&&<><dt>Category</dt><dd>{p.category}</dd></>}{p.date&&<><dt>Completed</dt><dd>{p.date}</dd></>}
    </dl>
    <p className="links" style={{'--i':1}}>{p.live&&<a className="btn g" href={p.live} target="_blank" rel="noopener noreferrer">Live site ↗</a>}{p.repo&&<a className="btn y" href={p.repo} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}{extra.map(u=><a key={u} href={u} target="_blank" rel="noopener noreferrer">{u.replace(/^https?:\/\/(www\.)?/,'')} ↗</a>)}</p>
   </div>
   <div className="deco" style={{'--i':2}} aria-hidden="true">{GL[i%GL.length]}</div>
  </div></div></div></article>)}
