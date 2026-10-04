"use client";
import {useEffect,useState} from "react";
import {adminSetSeason,loadAdminDashboard} from "@/data/platform";

const isoLocal=(d:Date)=>new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);
export default function AdminSeasonPage(){
 const[data,setData]=useState<any>(null),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const[form,setForm]=useState<any>({name:"Bad Decisions Club",slug:"bad-decisions-club",subtitle:"Season 1 · Rewarding imaginary financial irresponsibility.",startsAt:isoLocal(new Date()),endsAt:isoLocal(new Date(Date.now()+45*86400000)),active:true});
 const refresh=async()=>{setBusy(true);setError("");try{const d=await loadAdminDashboard();setData(d);const s=(d?.seasons??[])[0];if(s)setForm({name:s.name,slug:s.slug,subtitle:s.subtitle,startsAt:isoLocal(new Date(s.starts_at)),endsAt:isoLocal(new Date(s.ends_at)),active:s.is_active})}catch(e:any){setError(e?.message??"Admin access required")}finally{setBusy(false)}};
 useEffect(()=>{refresh()},[]);
 const save=async()=>{setBusy(true);setError("");try{await adminSetSeason({name:form.name,slug:form.slug,subtitle:form.subtitle,startsAt:new Date(form.startsAt).toISOString(),endsAt:new Date(form.endsAt).toISOString(),active:form.active});await refresh()}catch(e:any){setError(e?.message??"Could not save season")}finally{setBusy(false)}};
 if(error&&!data)return <main className="adminShell"><section className="adminDenied"><div className="eyebrow">SEASON ADMIN</div><h1>Access denied.</h1><p>{error}</p><a href="/">Back to shop</a></section></main>;
 return <main className="adminShell"><header className="adminTop"><div><a href="/admin" className="creatorBrand">JUST ORDERED</a><span>SEASON</span></div><div className="row"><a className="secondary linkButton" href="/admin">← Admin</a><a className="secondary linkButton" href="/missions">View missions ↗</a></div></header>
  <section className="adminHero"><div><div className="eyebrow light">SEASON CONTROL</div><h1>Run progression without touching code.</h1></div></section>
  {error&&<div className="adminError">{error}</div>}
  <section className="adminGrid"><div className="adminPanel"><h2>Active season</h2><div className="adminForm"><label>Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Slug<input value={form.slug} onChange={e=>setForm({...form,slug:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"")})}/></label><label>Subtitle<input value={form.subtitle} onChange={e=>setForm({...form,subtitle:e.target.value})}/></label><div className="creatorTwo"><label>Starts<input type="datetime-local" value={form.startsAt} onChange={e=>setForm({...form,startsAt:e.target.value})}/></label><label>Ends<input type="datetime-local" value={form.endsAt} onChange={e=>setForm({...form,endsAt:e.target.value})}/></label></div><label className="publicToggle"><input type="checkbox" checked={!!form.active} onChange={e=>setForm({...form,active:e.target.checked})}/> Season enabled</label><button className="primary" disabled={busy||!form.name||!form.slug} onClick={save}>{busy?"SAVING…":"SAVE SEASON"}</button></div></div>
  <div className="adminPanel"><div className="eyebrow">SEASON HISTORY</div><h2>Configured seasons</h2><div className="adminProductList">{(data?.seasons??[]).map((s:any)=><button key={s.id} onClick={()=>setForm({name:s.name,slug:s.slug,subtitle:s.subtitle,startsAt:isoLocal(new Date(s.starts_at)),endsAt:isoLocal(new Date(s.ends_at)),active:s.is_active})}><div><b>{s.name}</b><small>{s.is_active?"Enabled":"Disabled"} · {new Date(s.starts_at).toLocaleDateString()} → {new Date(s.ends_at).toLocaleDateString()}</small></div></button>)}</div></div></section>
 </main>
}
