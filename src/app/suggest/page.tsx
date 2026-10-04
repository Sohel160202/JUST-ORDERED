"use client";
import {useEffect,useState} from "react";
import {currentSession} from "@/data/cloud";
import {loadMySubmissions,loadShopConfig,submitProductIdea} from "@/data/platform";
import {Category} from "@/domain/models";
import {formatMoney} from "@/core/currency";

export default function SuggestPage(){
 const[email,setEmail]=useState<string|null>(null),[categories,setCategories]=useState<Category[]>([]),[items,setItems]=useState<any[]>([]),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const[name,setName]=useState(""),[category,setCategory]=useState<Category>("Food"),[price,setPrice]=useState(5000),[emoji,setEmoji]=useState("✨"),[description,setDescription]=useState("");
 const refresh=async()=>{const [session,config]=await Promise.all([currentSession(),loadShopConfig()]);setEmail(session?.user?.email??null);const cats=(config?.categories??[]).map(x=>x.name);setCategories(cats);if(cats.length&&!cats.includes(category))setCategory(cats[0]);if(session){try{setItems(await loadMySubmissions())}catch{}}};
 useEffect(()=>{refresh().catch(()=>{})},[]);
 const submit=async()=>{setBusy(true);setMessage("");try{await submitProductIdea({name:name.trim(),category,price:Number(price),emoji,description:description.trim()});setMessage("Idea submitted for review 🎉");setName("");setDescription("");setEmoji("✨");setItems(await loadMySubmissions())}catch(e:any){setMessage(e?.message??"Could not submit idea")}finally{setBusy(false)}};
 return <main className="creatorShell"><header className="creatorTop"><a href="/" className="creatorBrand">JUST ORDERED</a><a href="/">← Back to shop</a></header>
  <section className="creatorHero"><div className="eyebrow light">COMMUNITY CREATOR</div><h1>Invent something ridiculous.</h1><p>Pitch a product for JUST ORDERED. Nothing goes public automatically — every idea is reviewed first.</p></section>
  {!email?<section className="creatorPanel"><h2>Sign in first</h2><p className="muted">Product ideas are tied to your account so you can track whether they were approved, rejected, or need changes.</p><a className="primary linkButton" href="/?profile=1">Go to sign in</a></section>:<>
   <section className="creatorPanel"><div className="sectionhead"><div><div className="eyebrow">YOUR IDEA</div><h2>Suggest a product</h2></div><span className="virtualPill">Signed in</span></div>
    <div className="creatorForm">
     <label>Product name<input value={name} maxLength={80} onChange={e=>setName(e.target.value)} placeholder="Emotional Support Lamborghini"/></label>
     <div className="creatorTwo"><label>Category<select value={category} onChange={e=>setCategory(e.target.value as Category)}>{categories.map(c=><option key={c}>{c}</option>)}</select></label><label>Emoji<input value={emoji} maxLength={8} onChange={e=>setEmoji(e.target.value)} placeholder="🏎️"/></label></div>
     <label>Suggested virtual price<input type="number" min={1} max={1000000000000} value={price} onChange={e=>setPrice(Number(e.target.value))}/><small>{formatMoney(Number(price)||0)}</small></label>
     <label>Description<textarea value={description} maxLength={500} onChange={e=>setDescription(e.target.value)} placeholder="For when therapy wasn't expensive enough."/></label>
     <button className="primary" disabled={busy||name.trim().length<3||price<1} onClick={submit}>{busy?"SUBMITTING…":"SUBMIT FOR REVIEW"}</button>
     {message&&<div className="creatorMessage">{message}</div>}
    </div>
   </section>
   <section className="creatorPanel"><div className="sectionhead"><div><div className="eyebrow">YOUR SUBMISSIONS</div><h2>Idea history</h2></div></div>{items.length===0?<div className="empty compact"><b>No ideas submitted yet.</b></div>:<div className="submissionList">{items.map(x=><article key={x.id} className="submissionCard"><div className="submissionEmoji">{x.emoji}</div><div><div className="row wrap"><b>{x.name}</b><span className={`submissionStatus status-${x.status.toLowerCase().replace("_","-")}`}>{x.status.replaceAll("_"," ")}</span></div><p>{x.category} · {formatMoney(Number(x.suggested_price))}</p>{x.admin_notes&&<small>Admin note: {x.admin_notes}</small>}</div></article>)}</div>}</section>
  </>}
 </main>
}
