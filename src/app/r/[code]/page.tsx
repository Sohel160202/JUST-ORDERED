"use client";
import {useEffect,useState} from "react";
import {useParams} from "next/navigation";
import {getReferralPreview} from "@/data/platform";
import {formatMoney} from "@/core/currency";

export default function ReferralLanding(){
 const {code}=useParams<{code:string}>(),[preview,setPreview]=useState<any>(undefined),[reward,setReward]=useState<{inviter:number;invitee:number}|null>(null);
 useEffect(()=>{let alive=true;getReferralPreview(code).then(async p=>{if(!alive)return;setPreview(p);try{const {getReferralDashboard}=await import("@/data/platform");}catch{};}).catch(()=>{if(alive)setPreview(null)});return()=>{alive=false}},[code]);
 const continueToShop=()=>{localStorage.setItem("just-ordered:referral",code.toLowerCase());location.href="/";};
 return <main className="referralShell">
  <section className="referralCard">
   <div className="eyebrow light">JUST ORDERED REFERRAL</div>
   {preview===undefined?<><h1>Checking invite…</h1><p>One virtual shopping spree is loading.</p></>:preview===null?<><h1>This invite link is unavailable.</h1><p>The referral code may be invalid or referrals may be disabled.</p><a className="heroBtn linkButton" href="/">Open JUST ORDERED</a></>:<>
    <div className="referralGift">🎁</div>
    <h1>{preview.display_name} invited you.</h1>
    <p>Join JUST ORDERED, build your imaginary lifestyle, and get a referral welcome bonus after you sign in.</p>
    <div className="referralPromise"><span>No real purchase.</span><span>No real delivery.</span><span>Only virtual money.</span></div>
    <button className="heroBtn" onClick={continueToShop}>Accept invite</button>
    <small>Referral rewards are credited once per new account. Self-referrals are blocked.</small>
   </>}
  </section>
 </main>
}
