import {supabase} from "@/data/cloud";

export async function loadAdminSeasonRewards(){
 if(!supabase)throw new Error("Cloud sync is not configured.");
 const{data,error}=await supabase.rpc("admin_season_rewards");
 if(error)throw error;
 return data??[];
}

export async function adminUpsertSeasonReward(p:any){
 if(!supabase)throw new Error("Cloud sync is not configured.");
 const{data,error}=await supabase.rpc("admin_upsert_season_reward",{p});
 if(error)throw error;
 return data as string;
}
