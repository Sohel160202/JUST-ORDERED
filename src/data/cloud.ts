import { createClient, Session } from "@supabase/supabase-js";
import { AppState, CartItem, CollectionItem, Order, OrderItem, TransactionType } from "@/domain/models";

const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const supabase=url&&key?createClient(url,key):null;

export const isCloudConfigured=()=>!!supabase;

export async function sendMagicLink(email:string){
  if(!supabase) throw new Error("Cloud sync is not configured.");
  const redirect=typeof window!=="undefined"?window.location.origin:undefined;
  const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:redirect}});
  if(error) throw error;
}

export async function signOutCloud(){
  if(!supabase) return;
  const {error}=await supabase.auth.signOut();
  if(error) throw error;
}

export async function currentSession():Promise<Session|null>{
  if(!supabase) return null;
  const {data,error}=await supabase.auth.getSession();
  if(error) throw error;
  return data.session;
}

export function onAuthChange(cb:(session:Session|null)=>void){
  if(!supabase) return ()=>{};
  const {data}=supabase.auth.onAuthStateChange((_event,session)=>cb(session));
  return ()=>data.subscription.unsubscribe();
}

export async function loadCloudState():Promise<AppState>{
  if(!supabase) throw new Error("Cloud sync is not configured.");
  const {data:{user},error:userError}=await supabase.auth.getUser();
  if(userError||!user) throw userError??new Error("Not signed in.");

  await supabase.rpc("credit_daily_income");

  const [profileRes,ledgerRes,wishlistRes,cartRes,ordersRes,collectionRes]=await Promise.all([
    supabase.from("profiles").select("display_name,last_income_date").single(),
    supabase.from("wallet_transactions").select("id,type,amount,related_order_id,description,created_at").order("created_at",{ascending:false}),
    supabase.from("wishlist_items").select("product_id"),
    supabase.from("cart_items").select("product_id,quantity"),
    supabase.from("orders").select("id,order_number,total,status,location_name,ordered_at,expected_delivery_at,order_items(product_id,name_snapshot,price_snapshot,quantity,emoji_snapshot,collection_type_snapshot)").order("ordered_at",{ascending:false}),
    supabase.from("collection_items").select("id,product_id,name_snapshot,emoji_snapshot,purchase_price,acquired_at").order("acquired_at",{ascending:false})
  ]);

  const firstError=[profileRes,ledgerRes,wishlistRes,cartRes,ordersRes,collectionRes].find(r=>r.error)?.error;
  if(firstError) throw firstError;

  const orders:Order[]=(ordersRes.data??[]).map((o:any)=>({
    id:o.id,
    number:o.order_number,
    total:Number(o.total),
    status:o.status,
    locationName:o.location_name,
    orderedAt:o.ordered_at,
    expectedDeliveryAt:o.expected_delivery_at,
    items:(o.order_items??[]).map((i:any):OrderItem=>({
      productId:i.product_id,
      name:i.name_snapshot,
      price:Number(i.price_snapshot),
      quantity:i.quantity,
      emoji:i.emoji_snapshot,
      collectionType:i.collection_type_snapshot
    }))
  }));

  const collection:CollectionItem[]=(collectionRes.data??[]).map((i:any)=>({
    id:i.id,
    productId:i.product_id,
    name:i.name_snapshot,
    emoji:i.emoji_snapshot,
    purchasePrice:Number(i.purchase_price),
    acquiredAt:i.acquired_at
  }));

  const cart:CartItem[]=(cartRes.data??[]).map((i:any)=>({productId:i.product_id,quantity:i.quantity}));

  return {
    version:1,
    onboardingCompleted:true,
    lastIncomeDate:profileRes.data?.last_income_date??new Date().toISOString().slice(0,10),
    ledger:(ledgerRes.data??[]).map((t:any)=>({
      id:t.id,
      type:t.type as TransactionType,
      amount:Number(t.amount),
      timestamp:t.created_at,
      relatedOrderId:t.related_order_id??undefined,
      description:t.description??undefined
    })),
    wishlist:(wishlistRes.data??[]).map((x:any)=>x.product_id),
    cart,
    orders,
    collection,
    displayName:profileRes.data?.display_name??user.email?.split("@")[0]??"Shopper"
  };
}

export async function setCloudWishlist(productId:string,saved:boolean){
  if(!supabase) return;
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return;
  if(saved){
    const {error}=await supabase.from("wishlist_items").upsert({user_id:user.id,product_id:productId});
    if(error) throw error;
  } else {
    const {error}=await supabase.from("wishlist_items").delete().eq("user_id",user.id).eq("product_id",productId);
    if(error) throw error;
  }
}

export async function setCloudCart(productId:string,quantity:number){
  if(!supabase) return;
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return;
  if(quantity<=0){
    const {error}=await supabase.from("cart_items").delete().eq("user_id",user.id).eq("product_id",productId);
    if(error) throw error;
  }else{
    const {error}=await supabase.from("cart_items").upsert({user_id:user.id,product_id:productId,quantity,updated_at:new Date().toISOString()});
    if(error) throw error;
  }
}

export async function clearCloudCart(){
  if(!supabase) return;
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return;
  const {error}=await supabase.from("cart_items").delete().eq("user_id",user.id);
  if(error) throw error;
}

export async function placeCloudOrder(locationName="My Place"){
  if(!supabase) throw new Error("Cloud sync is not configured.");
  const key=crypto.randomUUID();
  const {data,error}=await supabase.rpc("place_virtual_order",{p_idempotency_key:key,p_location_name:locationName});
  if(error) throw error;
  return data as string;
}

export async function receiveCloudOrder(orderId:string){
  if(!supabase) throw new Error("Cloud sync is not configured.");
  const {error}=await supabase.rpc("receive_virtual_order",{p_order_id:orderId});
  if(error) throw error;
}
