import {RM} from './fx.js';
let api=null;
function build(){
const ab=document.getElementById('abee'),rnd=(a,b)=>a+Math.random()*(b-a),ease=t=>.5-.5*Math.cos(Math.PI*t);
let anim=null,timer=0,ntimer=0,arr=0,sy=0,last='',cnt=0;
const vis=r=>r.bottom>0&&r.top<innerHeight;
function free(x,y){if(x<20||x>innerWidth-20||y<90||y>innerHeight-20)return false;
 const el=document.elementFromPoint(x,y);return !(el&&el.closest('a,button,nav,li,p,dt,dd,.tag,.status,h3,.term,.deco,.win'))}
function targets(){const t=[];
 document.querySelectorAll('section h2').forEach(h=>{const r=document.createRange();r.selectNodeContents(h);const q=[...r.getClientRects()].pop();
  if(q&&vis(q))t.push({k:h.id,x:q.right+20,y:q.top+q.height*.4,kind:'h'})});
 document.querySelectorAll('.folder').forEach(c=>{const q=c.getBoundingClientRect();if(vis(q))t.push({k:c.id,x:q.left+130,y:q.top-14,kind:'f'})});
 const s=document.getElementById('star').getBoundingClientRect();if(vis(s))t.push({k:'star',x:s.left-18,y:s.top+s.height/2,kind:'s'});
 return t.filter(o=>o.k!==last&&free(o.x,o.y))}
function curve(a,b,n,wob){const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy)||1,k=rnd(-.3,.3)*L,cx=(a.x+b.x)/2-dy/L*k,cy=(a.y+b.y)/2+dx/L*k,p=[];
 for(let i=1;i<=n;i++){const t=ease(i/n),u=1-t,w=Math.sin(i*1.3+rnd(0,1))*wob*Math.sin(Math.PI*i/n);
  p.push([u*u*a.x+2*u*t*cx+t*t*b.x-dy/L*w,u*u*a.y+2*u*t*cy+t*t*b.y+dx/L*w])}return p}
function amb(x,y,chars){chars.forEach((c,i)=>{if(cnt>5)return;cnt++;const s=document.createElement('span');s.className='fx s';s.textContent=c;s.setAttribute('aria-hidden','true');
 s.style.left=Math.min(innerWidth-30,Math.max(4,x+i*18))+'px';s.style.top=y+'px';s.style.animationDelay=i*200+'ms';s.style.setProperty('--dx',(i-1)*10+'px');
 s.style.color=i%2?'var(--green)':'var(--pink)';s.addEventListener('animationend',()=>{s.remove();cnt--});document.body.append(s)})}
function twinkle(){const s=document.getElementById('star');s.classList.remove('tw');void s.offsetWidth;s.classList.add('tw')}
function fly(){if(anim||document.hidden||RM.matches)return;const T=targets();if(!T.length)return;
 const t=T[Math.floor(Math.random()*T.length)];last=t.k;const W=innerWidth,H=innerHeight;
 const S={x:Math.random()<.5?-40:W+40,y:rnd(H*.2,H*.7)},E={x:Math.random()<.5?-40:W+40,y:rnd(H*.15,H*.75)};
 const d1=3000,dh=2600,d2=2800,total=d1+dh+d2,dir1=t.x>=S.x?1:-1,dir2=E.x>=t.x?1:-1;
 const fr=[];let cum=0,py=S.y;
 const push=(p,d,dt)=>{cum+=dt;fr.push({transform:`translate(${p[0]-14}px,${p[1]-12}px) scaleX(${d}) rotate(${Math.max(-14,Math.min(14,(p[1]-py)*1.1))}deg)`,offset:cum/total,opacity:1});py=p[1]};
 push([S.x,S.y],dir1,0);
 curve(S,t,18,10).forEach(p=>push(p,dir1,d1/18));
 for(let i=1;i<=14;i++)push([t.x+Math.sin(i*.9)*4,t.y+Math.sin(i*1.7)*5],dir1,dh/14);
 curve(t,E,18,10).forEach(p=>push(p,dir2,d2/18));
 fr[fr.length-1].offset=1;
 ab.classList.add('on');sy=scrollY;
 anim=ab.animate(fr,{duration:total,easing:'linear'});
 anim.onfinish=()=>{anim=null;ab.classList.remove('on');schedule()};
 arr=setTimeout(()=>{if(!anim)return;if(t.kind==='s')twinkle();else if(t.kind==='f'&&Math.random()<.55)amb(t.x-70,t.y-6,['♪','♫'])},d1)}
function stop(){clearTimeout(arr);if(anim){anim.onfinish=null;anim.cancel();anim=null}ab.classList.remove('on')}
function abort(){if(!anim)return;const tf=getComputedStyle(ab).transform;clearTimeout(arr);anim.onfinish=null;anim.cancel();anim=null;
 ab.animate([{transform:tf,opacity:1},{transform:tf,opacity:0}],{duration:250}).onfinish=()=>ab.classList.remove('on');schedule()}
function schedule(first){clearTimeout(timer);if(document.hidden||RM.matches)return;timer=setTimeout(()=>{fly();if(!anim)schedule()},first||rnd(14000,30000))}
function nSched(first){clearTimeout(ntimer);if(document.hidden||RM.matches)return;ntimer=setTimeout(()=>{ambient();nSched()},first||rnd(16000,34000))}
function ambient(){const tabs=[...document.querySelectorAll('.folder')].map(c=>c.getBoundingClientRect()).filter(q=>vis(q)&&free(q.left+60,q.top-10));
 if(!tabs.length){const s=document.getElementById('star');if(vis(s.getBoundingClientRect()))twinkle();return}
 const q=tabs[Math.floor(Math.random()*tabs.length)];amb(q.left+60,q.top-10,Math.random()<.6?['♪','♫','♪']:['✦'])}
addEventListener('scroll',()=>{if(anim&&Math.abs(scrollY-sy)>60)abort()},{passive:true});
addEventListener('resize',abort);
document.addEventListener('click',e=>{if(e.target.closest('.tog'))abort()});
function pause(){stop();clearTimeout(timer);clearTimeout(ntimer)}
function resume(){schedule(6000);nSched(10000)}
document.addEventListener('visibilitychange',()=>document.hidden?pause():resume());
RM.addEventListener('change',()=>RM.matches?pause():resume());
return {resume,pause}}
export function startAmbient(){if(!api)api=build();api.resume();return api.pause}
