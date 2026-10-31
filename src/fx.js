export const RM=matchMedia('(prefers-reduced-motion: reduce)');
let live=0;
export function burst(el,chars){if(RM.matches)return;const r=el.getBoundingClientRect();
 chars.forEach((c,i)=>{if(live>12)return;live++;const s=document.createElement('span');s.className='fx';s.textContent=c;s.setAttribute('aria-hidden','true');
  s.style.left=Math.min(innerWidth-30,Math.max(4,r.left+r.width/2+(i-1)*26))+'px';s.style.top=Math.max(4,r.top)+'px';s.style.setProperty('--dx',(i-1)*14+'px');
  s.style.color=['var(--pink)','var(--green)','var(--ink)'][i%3];s.addEventListener('animationend',()=>{s.remove();live--});document.body.append(s)})}
