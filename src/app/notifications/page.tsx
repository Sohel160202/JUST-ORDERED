"use client";
import {useEffect,useState} from "react";
import {getNotificationCenter,markAllNotificationsRead,markNotificationRead,NotificationCenter,NotificationItem} from "@/data/platform";

const timeText=(iso:string)=>new Date(iso).toLocaleString([], {dateStyle:"medium",timeStyle:"short"});
export default function NotificationsPage(){
 const[data,setData]=useState<NotificationCenter|null>(null),[error,setError]=useState(""),[busy,setBusy]=useState(true);
 const refresh=async()=>{setBusy(true);setError("");try{setData(await getNotificationCenter(100))}catch(e:any){setError(e?.message??"Sign in to view notifications")}finally{setBusy(false)}};
 useEffect(()=>{refresh()},[]);
 const openItem=async(n:NotificationItem)=>{if(!n.read_at){try{await markNotificationRead(n.id)}catch{}}if(n.action_url)location.href=n.action_url;else refresh()};
 const readAll=async()=>{await markAllNotificationsRead();await refresh()};
 if(error&&!data)return <main className="notificationsPage"><section className="notificationsDenied"><div className="eyebrow">NOTIFICATION CENTER</div><h1>Sign in to see what happened.</h1><p>{error}</p><a className="primary linkButton" href="/">Back to JUST ORDERED</a></section></main>;
 return <main className="notificationsPage"><header className="notificationsPageTop"><a href="/" className="creatorBrand">JUST ORDERED</a><div className="row"><button className="secondary" onClick={refresh} disabled={busy}>{busy?"Refreshing…":"Refresh"}</button><a className="secondary linkButton" href="/">Back to shop</a></div></header>
  <section className="notificationsHero"><div><div className="eyebrow light">RE-ENGAGEMENT HQ</div><h1>Your imaginary life has updates.</h1><p>Packages, missions, referrals, community ideas, season rewards and limited events all land here.</p></div><div className="notificationHeroCount"><b>{Number(data?.unread_count??0)}</b><span>UNREAD</span></div></section>
  <section className="notificationsPanel"><div className="sectionhead"><div><div className="eyebrow">LATEST</div><h2>Notification Center</h2></div><button className="secondary" disabled={!data?.unread_count} onClick={readAll}>Mark all read</button></div>
   {!data?.items?.length?<div className="empty"><b>No notifications yet.</b><span>Place an order, finish a mission, share a referral, or submit a product idea. The chaos will arrive.</span></div>:<div className="notificationsFullList">{data.items.map(n=><button key={n.id} className={`notificationsFullItem ${n.read_at?"":"unread"}`} onClick={()=>openItem(n)}><span>{n.icon}</span><div><div><b>{n.title}</b><small>{timeText(n.created_at)}</small></div><p>{n.body}</p><em>{n.read_at?"Read":"New"}{n.action_url?" · Open →":""}</em></div></button>)}</div>}
  </section>
 </main>
}
