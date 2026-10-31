const KEY='melodybee-content-v1',URL_=import.meta.env.VITE_SUPABASE_URL,ANON=import.meta.env.VITE_SUPABASE_ANON_KEY;
export const MODE=URL_&&ANON?'cloud':'demo';
const P=(id,name,description,stack,o={})=>({id,name,description,details:'',live:'',repo:'',links:'',stack,role:'',status:'live',published:true,featured:false,cover:'',alt:'',category:'',date:'',...o});
export const SEED={projects:[
 P('aetheria','Aetheria','My featured e-commerce project, with its own backend API.',['React','React Bootstrap','Custom backend API','MongoDB'],{featured:true,live:'https://aetheria-w-2.vercel.app',repo:'https://github.com/melodyBee/Aetheria'}),
 P('zephyr','Zephyr','A React and Bootstrap e-commerce project with server-side data storage.',['React','Bootstrap','Server-side storage'],{role:'It began as a group project, and I ended up building most of it.',live:'https://zephyr-rho.vercel.app',repo:'https://github.com/melodyBee/Zephyr'}),
 P('melodyplayer','MelodyPlayer','A personal music player.',[],{role:'A personal project.',category:'Music',live:'https://melodybee.github.io/melodyPlayer/',repo:'https://github.com/melodyBee/melodyPlayer'}),
 P('rusticreads','RusticReads','My personal writing website and editorial project.',['HTML','CSS'],{role:'I designed, built and wrote the site myself.',live:'https://melodybee.github.io/RusticReads/',repo:'https://github.com/melodyBee/RusticReads'}),
 P('earlywrapped','EarlyWrapped','A Spotify-related experiment. It is not complete: Spotify authentication, developer setup and data handling limit it.',[],{status:'wip',role:'A personal experiment.',live:'https://melodybee.github.io/EarlyWrapped/',repo:'https://github.com/melodyBee/EarlyWrapped'})],
writing:[
 {id:'climate',title:'Are You Ready to Face the Climate Change Impacts?',description:'',url:'https://medium.com/@melodyBeee/are-you-ready-to-face-the-climate-change-impacts-82371807aba8',platform:'Medium',date:'',category:'',published:true},
 {id:'phone',title:"Stuck on Your Phone? Here's What You're Missing Out On",description:'',url:'https://medium.com/@melodyBeee/stuck-on-your-phone-heres-what-you-re-missing-out-on-25778b1ff45f',platform:'Medium',date:'',category:'',published:true}],
settings:{
 heroLead:'I build things for the web, write about ideas that stay with me, and keep exploring what technology can do.',
 writingText:"RusticReads is my personal writing site, hand-built in HTML and CSS, and it's where my writing feels most personal. I also publish on Medium.",
 rusticUrl:'https://melodybee.github.io/RusticReads/',
 aiText:"I'm studying Agentic AI through Saylani Mass IT Training (SMIT). It's an ongoing course, not a finished qualification, and I don't have AI projects to show yet.",
 aboutText:"I'm Abeera Fatima, known online as melodyBee. I'm drawn to technology, writing, music and design.\n\nMy favorite part is the whole path from idea to working project: planning it, building it, experimenting, and explaining it clearly.",
 skillsBuilding:['React','JavaScript','HTML','CSS','Node.js','Express','MongoDB','REST APIs'],skillsWriting:['Content writing'],skillsLearning:['Agentic AI'],
 contactText:"I'm open to web development roles, writing opportunities, freelance projects and creative collaborations. Find me here:",
 github:'https://github.com/melodyBee',linkedin:'https://www.linkedin.com/in/abeera-fatima',medium:'https://medium.com/@melodyBeee',
 footer:'made with React-shaped dreams and too much coffee'}};
let sbp;const sb=async()=>{if(MODE==='demo')return null;sbp??=import('@supabase/supabase-js').then(m=>m.createClient(URL_,ANON));return sbp};
const local=()=>{try{return JSON.parse(localStorage.getItem(KEY))||SEED}catch{return SEED}};
const pull=async id=>{const c=await sb();if(!c)return local();const {data,error}=await c.from('portfolio').select('data').eq('id',id).maybeSingle();if(error)throw error;return data?.data||SEED};
export const loadPublic=()=>pull('public');
export const loadAdmin=()=>pull('admin');
export async function save(d){const c=await sb();if(!c){localStorage.setItem(KEY,JSON.stringify(d));return}
 const pub={...d,projects:d.projects.filter(p=>p.published),writing:d.writing.filter(w=>w.published)};
 const {error}=await c.from('portfolio').upsert([{id:'admin',data:d},{id:'public',data:pub}]);if(error)throw error}
export async function getSession(){const c=await sb();if(!c)return sessionStorage.getItem('mb-demo')?{}:null;return (await c.auth.getSession()).data.session}
export async function signIn(email,pw){const c=await sb();if(!c){sessionStorage.setItem('mb-demo','1');return}const {error}=await c.auth.signInWithPassword({email,password:pw});if(error)throw error}
export async function signOut(){const c=await sb();if(!c)sessionStorage.removeItem('mb-demo');else await c.auth.signOut()}
