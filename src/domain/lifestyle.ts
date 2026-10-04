import { AppState, Category, Product } from "./models";

export type RoomKey="garage"|"gaming"|"closet"|"dream-home"|"tech"|"luxury";
export interface LifestyleRoom { key:RoomKey; title:string; subtitle:string; emoji:string; categories:Category[] }
export const lifestyleRooms:LifestyleRoom[]=[
 {key:"garage",title:"My Garage",subtitle:"Wheels, speed and questionable financial decisions.",emoji:"🏁",categories:["Vehicles"]},
 {key:"gaming",title:"Gaming Room",subtitle:"Every frame matters. Apparently.",emoji:"🎮",categories:["Gaming"]},
 {key:"closet",title:"My Closet",subtitle:"Fits for a life you definitely live.",emoji:"🧥",categories:["Fashion"]},
 {key:"dream-home",title:"Dream Home",subtitle:"Comfort, appliances and expensive rectangles.",emoji:"🏡",categories:["Home"]},
 {key:"tech",title:"Tech Shelf",subtitle:"Shiny screens and things that need charging.",emoji:"💻",categories:["Electronics"]},
 {key:"luxury",title:"Luxury Vault",subtitle:"Absolutely unnecessary. Completely essential.",emoji:"💎",categories:["Luxury"]}
];

export interface Achievement { id:string; title:string; description:string; emoji:string; unlocked:boolean; progress:string }
export function achievements(state:AppState, products:Product[], totalSpent:number):Achievement[]{
 const owned=state.collection.length;
 const categoriesOwned=new Set(state.collection.map(i=>products.find(p=>p.id===i.productId)?.category).filter(Boolean));
 const luxuryOwned=state.collection.some(i=>products.find(p=>p.id===i.productId)?.category==="Luxury");
 const vehicleOwned=state.collection.some(i=>products.find(p=>p.id===i.productId)?.category==="Vehicles");
 const orders=state.orders.length;
 return [
  {id:"first-order",title:"Just Ordered!",description:"Place your first virtual order.",emoji:"📦",unlocked:orders>=1,progress:orders>=1?"Unlocked":`${orders}/1 order`},
  {id:"collector",title:"Shelf Starter",description:"Own 5 collectible items.",emoji:"🗄️",unlocked:owned>=5,progress:`${Math.min(owned,5)}/5 items`},
  {id:"big-spender",title:"Imaginary Big Spender",description:"Spend ৳100,000 virtually.",emoji:"💸",unlocked:totalSpent>=100000,progress:`৳${Math.min(totalSpent,100000).toLocaleString()}/৳100,000`},
  {id:"million",title:"Million Taka Mood",description:"Spend ৳1,000,000 virtually.",emoji:"🤑",unlocked:totalSpent>=1000000,progress:`৳${Math.min(totalSpent,1000000).toLocaleString()}/৳1,000,000`},
  {id:"garage",title:"Keys, Please",description:"Own your first vehicle.",emoji:"🔑",unlocked:vehicleOwned,progress:vehicleOwned?"Unlocked":"0/1 vehicle"},
  {id:"luxury",title:"Absolutely Necessary",description:"Own a Luxury item.",emoji:"💎",unlocked:luxuryOwned,progress:luxuryOwned?"Unlocked":"0/1 luxury item"},
  {id:"lifestyle",title:"Lifestyle Architect",description:"Own items from 4 different categories.",emoji:"🏆",unlocked:categoriesOwned.size>=4,progress:`${Math.min(categoriesOwned.size,4)}/4 categories`}
 ];
}

const funnyReviews:Record<Category,string[]>={
 Food:["Arrived virtually hot. My actual kitchen remains disappointed.","Five stars. Zero calories. Financially unbeatable.","Tasted incredible in my imagination. Would pretend-order again."],
 Electronics:["Battery life is amazing as long as you never turn it on.","Looks expensive enough to make my imaginary coworkers jealous.","Unboxed it, admired it, immediately started wanting the next model."],
 Gaming:["My virtual FPS increased by at least 300. Science cannot explain it.","RGB so powerful my electricity bill stayed exactly zero.","I am now 17% better at games according to absolutely nobody."],
 Fashion:["Fit goes unbelievably hard for something I cannot physically wear.","My imaginary paparazzi have become unbearable.","The confidence boost was real. The jacket was not."],
 Home:["Completely transformed the apartment I also do not own.","Assembly took zero hours. Swedish furniture could never.","My imaginary guests keep asking where I bought it."],
 Vehicles:["0–100 instantly because physics is optional here.","My virtual neighbors have already filed three complaints.","Insurance quote came back at exactly ৳0. Beautiful."],
 Luxury:["Worth every imaginary taka.","My accountant fainted until I reminded him none of this is real.","Subtle enough for a billionaire with absolutely no subtlety."]
};
export function reviewsFor(product:Product){const pool=funnyReviews[product.category];return pool.map((text,i)=>({name:["DefinitelyRealBuyer","ImpulseBuyer99","WalletOnVacation"][i],rating:i===1?4:5,text}));}

export function recommendedFor(state:AppState, products:Product[]){
 const wishlistCats=state.wishlist.map(id=>products.find(p=>p.id===id)?.category).filter(Boolean) as Category[];
 const orderCats=state.orders.flatMap(o=>o.items.map(i=>products.find(p=>p.id===i.productId)?.category).filter(Boolean)) as Category[];
 const signals=[...wishlistCats,...orderCats];
 const favorite=signals.sort((a,b)=>signals.filter(x=>x===b).length-signals.filter(x=>x===a).length)[0];
 return products.filter(p=>p.category===favorite && !state.wishlist.includes(p.id)).slice(0,4);
}
