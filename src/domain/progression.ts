import { AppState, Product } from "./models";
import { depositsNeeded } from "./economy";

export type RevealTier="snack"|"standard"|"premium"|"legendary";
export type DailyShop={temptation:Product; almost:Product; dream:Product; picks:Product[]};

const hash=(s:string)=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,2166136261);
export const dayKey=(d=new Date())=>d.toISOString().slice(0,10);

export function dailyShop(products:Product[], balance:number, d=new Date()):DailyShop{
  const seed=hash(dayKey(d));
  const pick=(arr:Product[],offset:number)=>arr.length?arr[(seed+offset*97)%arr.length]:products[(seed+offset)%products.length];
  const affordable=products.filter(p=>p.price<=Math.max(balance,10000));
  const almost=products.filter(p=>p.price>balance).sort((a,b)=>a.price-b.price);
  const dreams=products.filter(p=>p.price>=1000000);
  const picks:Array<Product>=[];
  for(let i=0;i<6;i++){const p=pick(products,i+11);if(!picks.some(x=>x.id===p.id))picks.push(p)}
  return {
    temptation:pick(affordable.length?affordable:products,2),
    almost:almost[0]??pick(products,3),
    dream:pick(dreams.length?dreams:products,5),
    picks
  };
}

export function lifestyleStats(state:AppState,products:Product[]){
  const totalSpent=-state.ledger.filter(x=>x.amount<0).reduce((a,x)=>a+x.amount,0);
  const collectionValue=state.collection.reduce((a,x)=>a+x.purchasePrice,0);
  const categories=new Set(state.collection.map(i=>products.find(p=>p.id===i.productId)?.category).filter(Boolean));
  const orders=state.orders.length;
  const score=Math.floor(totalSpent/5000)+state.collection.length*120+categories.size*300+orders*40;
  const level=Math.max(1,Math.floor(score/1000)+1);
  const levelStart=(level-1)*1000, levelProgress=Math.min(100,Math.round(((score-levelStart)/1000)*100));
  const favorite=products.map(p=>p.category).reduce((best,c)=>{
    const n=state.collection.filter(i=>products.find(p=>p.id===i.productId)?.category===c).length;
    return n>best.n?{category:c,n}:best
  },{category:"None",n:0});
  const mostExpensive=[...state.collection].sort((a,b)=>b.purchasePrice-a.purchasePrice)[0];
  return {totalSpent,collectionValue,categoriesOwned:categories.size,score,level,levelProgress,favoriteCategory:favorite.category,mostExpensive};
}

export function revealTier(orderTotal:number,items:{collectionType:string}[]):RevealTier{
  if(orderTotal>=10000000)return"legendary";
  if(orderTotal>=250000||items.length>=3)return"premium";
  if(orderTotal<5000&&items.every(i=>i.collectionType==="consumable"))return"snack";
  return"standard";
}

export function goalProgress(goal:Product|undefined,balance:number){
  if(!goal)return null;
  const pct=Math.min(100,Math.round((balance/goal.price)*100));
  return {pct,missing:Math.max(0,goal.price-balance),days:depositsNeeded(goal.price,balance)};
}
