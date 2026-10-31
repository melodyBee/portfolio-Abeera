import {createRoot} from 'react-dom/client';
import {useEffect,useState} from 'react';
import './styles.css';
import Public from './Public.jsx';
import Admin from './Admin.jsx';
function App(){const [h,setH]=useState(location.hash);
 useEffect(()=>{const f=()=>setH(location.hash);addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);
 return h.startsWith('#/admin')?<Admin/>:<Public/>}
createRoot(document.getElementById('root')).render(<App/>);
