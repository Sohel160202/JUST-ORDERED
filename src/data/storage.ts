import { AppState, WalletTransaction } from "@/domain/models"; import { economyConfig } from "@/core/config"; import { dateKey } from "@/core/time";
const KEY="just-ordered:v1"; const id=()=>globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
export interface StateRepository { load():AppState; save(state:AppState):void; clear():void }
export class BrowserStateRepository implements StateRepository {
 load():AppState { if(typeof window==="undefined") return freshState(new Date()); const raw=localStorage.getItem(KEY); if(!raw){const s=freshState(new Date());this.save(s);return s} try{return JSON.parse(raw)}catch{const s=freshState(new Date());this.save(s);return s} }
 save(s:AppState){if(typeof window!=="undefined")localStorage.setItem(KEY,JSON.stringify(s))} clear(){if(typeof window!=="undefined")localStorage.removeItem(KEY)} }
export const freshState=(now:Date):AppState=>{const tx:WalletTransaction={id:id(),type:"INITIAL_BALANCE",amount:economyConfig.startingBalance,timestamp:now.toISOString(),description:"Welcome balance"};return{version:1,onboardingCompleted:false,lastIncomeDate:dateKey(now),ledger:[tx],wishlist:[],cart:[],orders:[],collection:[],displayName:"Shopper"}};
