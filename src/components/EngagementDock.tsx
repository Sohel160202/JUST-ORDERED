"use client";
import {useEffect,useState} from "react";
import {EngagementDashboard,getEngagementDashboard} from "@/data/platform";

export default function EngagementDock(){
 const[data,setData]=useState<EngagementDashboard|null>(null);
 useEffect(()=>{let alive=true;getEngagementDashboard().then(x=>{if(alive)setData(x)}).catch(()=>{});return()=>{alive=false}},[]);
 if(!data)return null;
 const done=data.daily.filter(x=>x.completed).length;
 return <a className="engagementDock" href="/missions" aria-label="Open missions and streaks">
  <div className="dockFlame">🔥</div>
  <div><b>{data.streak} day streak</b><span>{done}/3 daily missions</span></div>
  {data.season&&<div className="dockSeason"><small>S{data.season.level}</small><strong>{data.season.level_progress}/1000 XP</strong></div>}
 </a>
}
