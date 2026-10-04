export interface Clock { now(): Date }
export class SystemClock implements Clock { now(){ return new Date(); } }
export const dateKey=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
export const calendarDaysBetween=(from:string,to:string)=>{const a=new Date(`${from}T12:00:00`),b=new Date(`${to}T12:00:00`);return Math.max(0,Math.round((b.getTime()-a.getTime())/86400000));};
