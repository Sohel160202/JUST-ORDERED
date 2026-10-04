"use client";
import {useEffect,useState} from "react";
import {currentSession,onAuthChange} from "@/data/cloud";
import {getNotificationCenter,markAllNotificationsRead,markNotificationRead,NotificationCenter,NotificationItem} from "@/data/platform";

const age=(iso:string)=>{const s=Math.max(1,Math.floor((Date.now()-new Date(iso).getTime())/1000));if(s<60)return "now";if(s<3600)return `${Math.floor(s/60)}m`;if(s<86400)return `${Math.floor(s/3600)}h`;return `${Math.floor(s/86400)}d`};

export default function NotificationBell(){
 const[authed,setAuthed]=useState(false),[open,setOpen]=useState(false),[data,setData]=useState<NotificationCenter|null>(null),[busy,setBusy]=useState(false);
 const refresh=async()=>{setBusy(true);try{setData(await getNotificationCenter(20))}catch{}finally{setBusy(false)}};
 useEffect(()=>{let alive=true;currentSession().then(s=>{if(!alive)return;setAuthed(!!s);if(s)refresh()});const unsub=onAuthChange(s=>{if(!alive)return;setAuthed(!!s);if(s)refresh();else setData(null)});return()=>{alive=false;unsub()}},[]);
 useEffect(()=>{if(!authed)return;const t=setInterval(()=>refresh(),60000);return()=>clearInterval(t)},[authed]);
 if(!authed)return null;
 const openItem=async(n:NotificationItem)=>{if(!n.read_at){try{await markNotificationRead(n.id)}catch{}setData(x=>x?{...x,unread_count:Math.max(0,x.unread_count-1),items:x.items.map(i=>i.id===n.id?{...i,read_at:new Date().toISOString()}:i)}:x)}if(n.action_url)location.href=n.action_url};
 const markAll=async()=>{try{await markAllNotificationsRead();setData(x=>x?{...x,unread_count:0,items:x.items.map(i=>({...i,read_at:i.read_at??new Date().toISOString()}))}:x)}catch{}};
 return <>
  <button className="notificationBell" aria-label="Notifications" onClick={()=>{setOpen(v=>!v);if(!open)refresh()}}>🔔{Number(data?.unread_count??0)>0&&<span>{Math.min(99,Number(data?.unread_count??0))}</span>}</button>
  {open&&<><button className="notificationScrim" aria-label="Close notifications" onClick={()=>setOpen(false)}/><aside className="notificationDrawer">
   <header><div><span>JUST ORDERED</span><h2>Notifications</h2></div><button onClick={()=>setOpen(false)}>×</button></header>
   <div className="notificationTools"><small>{Number(data?.unread_count??0)} unread</small><button onClick={markAll} disabled={!data?.unread_count}>Mark all read</button></div>
   <div className="notificationList">{busy&&!data?<div className="notificationEmpty">Checking the chaos…</div>:!data?.items?.length?<div className="notificationEmpty"><b>Nothing new.</b><span>Your imaginary life is suspiciously calm.</span></div>:data.items.map(n=><button key={n.id} className={`notificationItem ${n.read_at?"":"unread"}`} onClick={()=>openItem(n)}><span className="notificationIcon">{n.icon}</span><div><div className="notificationItemTop"><b>{n.title}</b><small>{age(n.created_at)}</small></div><p>{n.body}</p>{n.action_url&&<em>Open →</em>}</div></button>)}</div>
   <footer><a href="/notifications">View notification center</a></footer>
  </aside></>}
 </>
}
