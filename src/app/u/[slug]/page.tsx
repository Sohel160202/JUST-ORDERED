"use client";
import {useEffect,useState} from "react";
import {useParams} from "next/navigation";
import {getPublicProfile} from "@/data/cloud";
import {products} from "@/data/catalog";
import {formatMoney} from "@/core/currency";

type PublicProfile={
 public_slug:string;display_name:string;dream_goal_product_id?:string|null;collection_value:number;item_count:number;order_count:number;
 total_spent:number;category_count:number;favorite_category:string;lifestyle_score:number;level:number;
 active_badge?:string|null;active_profile_frame?:string|null;active_badge_title?:string|null;active_badge_emoji?:string|null
};

export default function PublicProfilePage(){
 const params=useParams<{slug:string}>(),slug=params.slug;
 const[data,setData]=useState<PublicProfile|null|undefined>(undefined);
 useEffect(()=>{let alive=true;getPublicProfile(slug).then(x=>{if(alive)setData(x as PublicProfile|null)}).catch(()=>{if(alive)setData(null)});return()=>{alive=false}},[slug]);
 if(data===undefined)return <main className="publicShell"><div className="publicLoading">Loading virtual lifestyle…</div></main>;
 if(!data)return <main className="publicShell"><section className="publicEmpty"><div className="eyebrow">JUST ORDERED</div><h1>This profile is private or unavailable.</h1><a href="/">Back to shopping</a></section></main>;
 const goal=products.find(p=>p.id===data.dream_goal_product_id),frame=data.active_profile_frame??"";
 return <main className={`publicShell ${frame?`profile-${frame}`:""}`}>
  <section className="publicHero seasonFramed">
   <div><div className="eyebrow light">PUBLIC JUST ORDERED PROFILE</div><h1>{data.display_name}</h1>{data.active_badge_title&&<div className="publicSeasonBadge"><span>{data.active_badge_emoji??"✨"}</span>{data.active_badge_title}</div>}<p>@{data.public_slug} · Level {data.level} · Lifestyle Score {data.lifestyle_score.toLocaleString()}</p></div>
   <a className="heroBtn" href="/">Build your own</a>
  </section>
  <section className="publicStats">
   <div><span>Virtual net worth</span><b>{formatMoney(data.collection_value)}</b></div>
   <div><span>Items owned</span><b>{data.item_count}</b></div>
   <div><span>Orders placed</span><b>{data.order_count}</b></div>
   <div><span>Favorite category</span><b>{data.favorite_category}</b></div>
  </section>
  <section className="publicGoal">
   <div><div className="eyebrow">CURRENT DREAM GOAL</div><h2>{goal?.name??"Still choosing"}</h2><p>{goal?formatMoney(goal.price):"The wishlist is still plotting."}</p></div>
   <div className="publicMark">JUST ORDERED</div>
  </section>
  <footer className="publicFooter"><strong>Buy everything. Spend nothing.</strong><a href="/">just-ordered.vercel.app</a></footer>
 </main>
}
