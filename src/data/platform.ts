import { Product, Category } from "@/domain/models";
import { supabase } from "@/data/cloud";

export type ShopCategory={name:Category;display_name:string;sort_order:number};
export type ShopEvent={id:string;name:string;slug:string;headline:string;description:string;theme:string;featured_category?:Category|null;starts_at:string;ends_at:string;product_ids:string[];sponsor?:{name:string;website_url:string;label:string}|null};
export type ShopConfig={categories:ShopCategory[];event:ShopEvent|null;daily_override:{temptation?:string|null;almost?:string|null;dream?:string|null;picks?:string[]}|null};

const mapProduct=(x:any):Product=>({
 id:x.id,name:x.name,category:x.category as Category,price:Number(x.price),emoji:x.emoji,
 collectionType:x.collection_type,deliveryMinutes:Number(x.delivery_minutes),description:x.description||"",
 isFeatured:!!x.is_featured,isPopular:!!x.is_popular,rating:Number(x.rating??4.5),reviewCount:Number(x.review_count??100),
 keywords:Array.isArray(x.keywords)?x.keywords:[x.name?.toLowerCase?.()||"",x.category?.toLowerCase?.()||""],createdAt:x.created_at
});

export async function loadPublicCatalog():Promise<Product[]>{
 if(!supabase)return[];
 const {data,error}=await supabase.rpc("public_catalog");
 if(error)throw error;
 return (data??[]).map(mapProduct);
}
export async function loadShopConfig():Promise<ShopConfig|null>{
 if(!supabase)return null;
 const {data,error}=await supabase.rpc("public_shop_config");
 if(error)throw error;
 return data as ShopConfig;
}
export async function submitProductIdea(input:{name:string;category:Category;price:number;emoji:string;description:string}){
 if(!supabase)throw new Error("Cloud sync is not configured.");
 const {data,error}=await supabase.rpc("submit_product_idea",{p_name:input.name,p_category:input.category,p_price:input.price,p_emoji:input.emoji,p_description:input.description});
 if(error)throw error; return data as string;
}
export async function loadMySubmissions(){
 if(!supabase)return[];
 const {data,error}=await supabase.from("product_submissions").select("id,name,category,suggested_price,emoji,description,status,admin_notes,approved_product_id,created_at,reviewed_at").order("created_at",{ascending:false});
 if(error)throw error; return data??[];
}
export async function loadAdminDashboard(){
 if(!supabase)throw new Error("Cloud sync is not configured.");
 const {data,error}=await supabase.rpc("admin_dashboard_data"); if(error)throw error; return data;
}
export async function adminUpsertProduct(p:any){
 if(!supabase)throw new Error("Cloud sync is not configured.");
 const {data,error}=await supabase.rpc("admin_upsert_product",{p});if(error)throw error;return data as string;
}
export async function adminSetCategory(name:string,displayName:string,active:boolean,sort:number){
 if(!supabase)throw new Error("Cloud sync is not configured.");
 const {error}=await supabase.rpc("admin_set_category",{p_name:name,p_display_name:displayName,p_active:active,p_sort:sort});if(error)throw error;
}
export async function adminUpsertSponsor(input:{id?:string|null;name:string;url:string;label:string;active:boolean}){
 if(!supabase)throw new Error("Cloud sync is not configured.");
 const {data,error}=await supabase.rpc("admin_upsert_sponsor",{p_id:input.id??null,p_name:input.name,p_url:input.url,p_label:input.label,p_active:input.active});if(error)throw error;return data as string;
}
export async function adminUpsertEvent(p:any){
 if(!supabase)throw new Error("Cloud sync is not configured.");
 const {data,error}=await supabase.rpc("admin_upsert_event",{p});if(error)throw error;return data as string;
}
export async function adminSetDailyOverride(input:{day:string;temptation:string;almost:string;dream:string;picks:string[]}){
 if(!supabase)throw new Error("Cloud sync is not configured.");
 const {error}=await supabase.rpc("admin_set_daily_override",{p_day:input.day,p_temptation:input.temptation,p_almost:input.almost,p_dream:input.dream,p_picks:input.picks});if(error)throw error;
}
export async function adminReviewSubmission(id:string,status:string,notes:string,product:any|null=null){
 if(!supabase)throw new Error("Cloud sync is not configured.");
 const {data,error}=await supabase.rpc("admin_review_submission",{p_submission_id:id,p_status:status,p_notes:notes,p_product:product});if(error)throw error;return data as string|null;
}
