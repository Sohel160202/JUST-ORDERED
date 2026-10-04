"use client";
import {useEffect,useState} from "react";
import {claimSeasonReward,EngagementDashboard,equipSeasonCosmetic,getEngagementDashboard,getSeasonRewards,SeasonRewardsDashboard} from "@/data/platform";
import {formatMoney} from "@/core/currency";

const MissionCard=({m}:{m:any})=><article className={`missionCard ${m.completed?"done":""}`}>
 <div className="missionTop"><div><span>{m.completed?"COMPLETED":"MISSION"}</span><h3>{m.title}</h3></div><b>{m.completed?"✓":"+"+m.xp+" XP"}</b></div>
 <p>{m.description}</p>
 <div className="missionProgress"><i style={{width:`${Math.min(100,(Number(m.progress)/Math.max(1,Number(m.target)))*100)}%`}}/></div>
 <div className="missionBottom"><span>{Number(m.progress).toLocaleString()} / {Number(m.target).toLocaleString()}</span><strong>{formatMoney(Number(m.cash))} + {m.xp} XP</strong></div>
</article>;

export default function MissionsPage(){
 const[data,setData]=useState<EngagementDashboard|null>(null),[rewards,setRewards]=useState<SeasonRewardsDashboard|null>(null),[busy,setBusy]=useState(true),[error,setError]=useState(""),[message,setMessage]=useState("");
 const refresh=async()=>{setBusy(true);setError("");try{const[d,r]=await Promise.all([getEngagementDashboard(),getSeasonRewards()]);setData(d);setRewards(r)}catch(e:any){setError(e?.message??"Sign in to use missions")}finally{setBusy(false)}};
 useEffect(()=>{refresh()},[]);
 const claim=async(id:string)=>{setBusy(true);setMessage("");try{const r=await claimSeasonReward(id);setMessage(r.status==="claimed"?`${r.title??"Reward"} unlocked 🎉`:"Already claimed");await refresh()}catch(e:any){setMessage(e?.message??"Could not claim reward");setBusy(false)}};
 const equip=async(key:string)=>{setBusy(true);setMessage("");try{await equipSeasonCosmetic(key);setMessage("Cosmetic equipped ✨");await refresh()}catch(e:any){setMessage(e?.message??"Could not equip cosmetic");setBusy(false)}};
 if(error&&!data)return <main className="missionsShell"><section className="missionsDenied"><div className="eyebrow">JUST ORDERED MISSIONS</div><h1>Sign in to build a streak.</h1><p>{error}</p><a className="primary linkButton" href="/">Back to JUST ORDERED</a></section></main>;
 return <main className="missionsShell">
  <header className="missionsTop"><a href="/" className="creatorBrand">JUST ORDERED</a><div className="row"><button className="secondary" onClick={refresh} disabled={busy}>{busy?"Refreshing…":"Refresh progress"}</button><a className="secondary linkButton" href="/">Back to shop</a></div></header>
  {message&&<div className="missionMessage">{message}</div>}
  {data&&<>
   <section className="missionsHero"><div><div className="eyebrow light">DAILY HABIT</div><h1>Bad decisions. Better streak.</h1><p>Complete missions with virtual shopping. Rewards are virtual cash and Season XP only.</p></div><div className="streakOrb"><span>🔥</span><b>{data.streak}</b><small>DAY STREAK</small></div></section>
   {data.season&&<section className="seasonCard"><div><div className="eyebrow">SEASON 1</div><h2>{data.season.name}</h2><p>{data.season.subtitle}</p></div><div className="seasonProgress"><div><span>Level {data.season.level}</span><b>{data.season.xp.toLocaleString()} XP</b></div><div className="seasonTrack"><i style={{width:`${data.season.level_progress/10}%`}}/></div><small>{data.season.level_progress}/1000 XP to Level {data.season.level+1}</small></div></section>}

   {rewards&&rewards.rewards.length>0&&<section className="missionSection seasonRewardsSection"><div className="sectionhead"><div><div className="eyebrow">BAD DECISIONS CLUB</div><h2>Season Reward Track</h2><p className="muted">Reach the level, claim it once, keep the cosmetic forever.</p></div><span className="missionCount">Level {rewards.level}</span></div><div className="seasonRewardTrack">{rewards.rewards.map(r=>{const active=r.cosmetic_key&&(rewards.active_badge===r.cosmetic_key||rewards.active_profile_frame===r.cosmetic_key);return <article key={r.id} className={`seasonReward ${r.claimed?"claimed":""} ${r.eligible?"eligible":"locked"}`}><div className="rewardLevel">LVL {r.level_required}</div><div className="rewardEmoji">{r.emoji}</div><div><span className="rewardType">{r.reward_type.replace("_"," ")}</span><h3>{r.title}</h3><p>{r.description}</p>{r.reward_type==="CASH"&&<strong>{formatMoney(Number(r.cash_amount))}</strong>}</div><div className="rewardAction">{!r.claimed?<button className={r.eligible?"primary":"secondary"} disabled={!r.eligible||busy} onClick={()=>claim(r.id)}>{r.eligible?"CLAIM":"LOCKED"}</button>:r.cosmetic_key&&(r.reward_type==="BADGE"||r.reward_type==="PROFILE_FRAME")?<button className={active?"primary":"secondary"} disabled={!!active||busy} onClick={()=>equip(r.cosmetic_key!)}>{active?"EQUIPPED":"EQUIP"}</button>:<span className="claimedPill">CLAIMED ✓</span>}</div></article>})}</div></section>}

   <section className="missionSection"><div className="sectionhead"><div><div className="eyebrow">TODAY</div><h2>Daily Missions</h2></div><span className="missionCount">{data.daily.filter(x=>x.completed).length}/3 complete</span></div><div className="missionGrid">{data.daily.map(m=><MissionCard key={m.code} m={m}/>)}</div></section>
   <section className="missionSection"><div className="sectionhead"><div><div className="eyebrow">THIS WEEK</div><h2>Weekly Missions</h2></div><span className="missionCount">{data.weekly.filter(x=>x.completed).length}/3 complete</span></div><div className="missionGrid">{data.weekly.map(m=><MissionCard key={m.code} m={m}/>)}</div></section>
   <section className="streakInfo"><div><span>Current streak</span><b>{data.streak} days</b></div><div><span>Longest streak</span><b>{data.longest_streak} days</b></div><div><span>Every 7 days</span><b>+৳100,000</b></div></section>
  </>}
 </main>
}
