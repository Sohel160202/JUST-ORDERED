import { Category, Product } from "@/domain/models";

type ExtraRow=[name:string,price:number,emoji:string];
const rows:Record<Category,ExtraRow[]>={
 Food:[
  ["Wagyu Because Why Not",8500,"🥩"],["Twenty Four Karat-ish Burger",7200,"🍔"],["Sushi Yacht Platter",12500,"🍣"],["Emergency Pizza Fund",1800,"🍕"],["Croissant of Consequence",650,"🥐"],["CEO Breakfast Tray",4200,"🍳"],["Ramen Retirement Plan",1350,"🍜"],["Dessert Disaster Tower",5800,"🍰"],["Mango Empire Box",2800,"🥭"],["Midnight Biriyani Expansion Pack",1650,"🍛"]
 ],
 Electronics:[
  ["PearPhone Fold-ish",185000,"📱"],["AirBuds Max-ish",65000,"🎧"],["Smart Fridge With Opinions",245000,"🧊"],["Pocket Projector Pro-ish",55000,"📽️"],["Creator Camera Ultra",210000,"📷"],["HomePod-ish Mood Orb",22000,"🔊"],["E-Reader Never Finish Edition",18000,"📖"],["Robot Assistant Beta-ish",460000,"🤖"],["Desk Display Studio",135000,"🖥️"],["Satellite Phone for Drama",320000,"📡"]
 ],
 Gaming:[
  ["Portal-ish Handheld",38000,"🎮"],["Racing Rig of Regret",175000,"🏎️"],["RGB Battle Desk",95000,"🖥️"],["Sim Racer Divorce Kit",420000,"🏁"],["VR Headset Definitely Real",110000,"🥽"],["Arcade Cabinet Nostalgia Tax",160000,"🕹️"],["Flight Sim Cockpit Overkill",590000,"✈️"],["Controller Collection Problem",72000,"🎮"],["Streamer Starter Fortress",250000,"🎙️"],["Retro Console Time Machine",48000,"👾"]
 ],
 Fashion:[
  ["Billionaire Bathrobe",35000,"🥋"],["Red Carpet Emergency Dress",180000,"👗"],["Limited-ish Sneaker Drop",75000,"👟"],["CEO Carry-On",120000,"🧳"],["Quiet Luxury Watch Box",45000,"🎁"],["Airport Fit Final Form",28000,"🧥"],["Runway Sunglasses XXL",65000,"🕶️"],["Cashmere-ish Cloud Scarf",22000,"🧣"],["Wedding Guest Panic Suit",95000,"🤵"],["Closet Influencer Starter Pack",155000,"👚"]
 ],
 Home:[
  ["Smart Toilet Supreme",185000,"🚽"],["Walk-In Closet Starter Pack",650000,"🚪"],["Home Cinema Max",420000,"🎬"],["Rooftop Infinity Pool",4800000,"🏊"],["Personal Elevator",7500000,"🛗"],["Sparkling Water Cellar",850000,"🫧"],["Panic Room But Cozy",1500000,"🔐"],["Backyard Observatory",2800000,"🔭"],["Indoor Waterfall Decision",3200000,"🌊"],["Mansion Doorbell Ultra",95000,"🔔"]
 ],
 Vehicles:[
  ["G-Wagon-ish Problem",18000000,"🚙"],["Mini-ish City Bean",3200000,"🚗"],["Porsche-ish Weekend Mistake",22000000,"🏎️"],["Electric Pickup XXL",16000000,"🛻"],["Helicopter Because Why Not",180000000,"🚁"],["Jet Ski Midlife Patch",2600000,"🛥️"],["TukTuk Executive Edition",650000,"🛺"],["Luxury Camper Van",9500000,"🚐"],["Armored Limo-ish",35000000,"🚘"],["Hypercar Final Boss",120000000,"🏎️"]
 ],
 Luxury:[
  ["First-Class Forever Pass",45000000,"🎫"],["Diamond Phone Case Problem",2200000,"💎"],["Monaco-ish Apartment",180000000,"🏙️"],["Superyacht Upgrade Pack",350000000,"🛥️"],["Art Piece Nobody Understands",65000000,"🖼️"],["Private Chef for Imaginary Tuesday",12000000,"👨‍🍳"],["Vault Membership Platinum",25000000,"🔐"],["Designer Dog House Deluxe",8000000,"🏠"],["Gold-Plated Espresso Machine",4500000,"☕"],["Museum Wing Naming Rights",900000000,"🏛️"]
 ],
 Fitness:[
  ["Treadmill to Nowhere",68000,"🏃"],["Peloton-ish Regret Bike",125000,"🚴"],["Home Gym Overkill",780000,"🏋️"],["Recovery Pod 3000",240000,"🛌"],["Protein Powder of Destiny",8500,"🥤"],["Smart Dumbbells Somehow",42000,"🏋️"],["Yoga Mat Executive Edition",12000,"🧘"],["Boxing Bag for Emails",28000,"🥊"],["Cold Plunge Character Arc",185000,"🧊"],["Personal Trainer Hologram-ish",350000,"🤸"]
 ],
 Travel:[
  ["Cox's Bazar Escape Plan",18000,"🏖️"],["Maldives-ish Weekend",185000,"🏝️"],["Tokyo Shopping Rampage",320000,"🗼"],["First Class to Somewhere",450000,"✈️"],["Around-the-World Ticket",2400000,"🌍"],["Northern Lights Chase",620000,"🌌"],["Swiss Train Main Character Tour",540000,"🚆"],["Bali Work-From-Beach Week",210000,"🌴"],["Dubai Weekend Upgrade",290000,"🌆"],["Space Tourism Deposit",25000000,"🚀"]
 ],
 Pets:[
  ["CEO Golden Retriever",280000,"🐕"],["Cat With Better Furniture",85000,"🐈"],["Aquarium Empire",320000,"🐠"],["Tiny Horse Huge Problem",950000,"🐴"],["Royal Pet Starter Kit",145000,"🐾"],["Robot Pet Sitter-ish",175000,"🤖"],["Hamster Penthouse",28000,"🐹"],["Parrot With Opinions",120000,"🦜"],["Luxury Cat Tower District",65000,"🐈"],["Pet Birthday Gala Pack",38000,"🎂"]
 ],
 Beauty:[
  ["Glow-Up Emergency Kit",12000,"✨"],["Perfume of Questionable Confidence",28000,"🧴"],["Skincare Routine Final Boss",45000,"🧖"],["Hair Dryer Jet Engine",32000,"💨"],["Vanity Mirror Celebrity Mode",55000,"🪞"],["Spa Day Main Character Pack",85000,"🧖"],["Makeup Vault Deluxe",125000,"💄"],["Sunscreen CEO SPF 9000",6500,"☀️"],["Salon Chair of Authority",95000,"💺"],["Red Carpet Survival Case",180000,"💼"]
 ],
 Office:[
  ["CEO Desk of Importance",125000,"🗄️"],["Ergonomic Throne Pro",85000,"🪑"],["Meeting Escape Button",2500,"🔘"],["Standing Desk Commitment Issues",65000,"🧍"],["Coffee Machine Productivity Tax",72000,"☕"],["Noise-Canceling Coworker Shield",48000,"🎧"],["Whiteboard Master Plan XL",18000,"📝"],["Executive Briefcase-ish",42000,"💼"],["Conference Table Diplomacy Edition",240000,"🪵"],["Corner Office Starter Pack",950000,"🏢"]
 ],
 Outdoors:[
  ["Tent Mahal Deluxe",68000,"⛺"],["Camping Chair CEO Edition",18000,"🪑"],["Portable Grill Adventure Tax",42000,"🔥"],["Mountain Bike Ego Boost",145000,"🚵"],["Kayak of Bad Decisions",98000,"🛶"],["Hiking Boots Main Quest",28000,"🥾"],["Solar Generator Apocalypse-ish",185000,"🔋"],["Roof Tent Weekend Warrior",320000,"🚙"],["Telescope Campfire Flex",75000,"🔭"],["Backyard Glamping Kingdom",550000,"🏕️"]
 ]
};

const prefixes:Record<Category,string>={Food:"f",Electronics:"e",Gaming:"g",Fashion:"fa",Home:"h",Vehicles:"v",Luxury:"l",Fitness:"fit",Travel:"tr",Pets:"pet",Beauty:"b",Office:"o",Outdoors:"out"};
const existing=new Set<Category>(["Food","Electronics","Gaming","Fashion","Home","Vehicles","Luxury"]);
const d="2026-10-05T00:00:00.000Z";

export const extraProducts:Product[]=Object.entries(rows).flatMap(([category,items])=>
 (items as ExtraRow[]).map(([name,price,emoji],i)=>{
  const cat=category as Category;
  const n=existing.has(cat)?i+11:i+1;
  const collectionType:Product["collectionType"]=(cat==="Food"||cat==="Travel"||(cat==="Fitness"&&i===4)||(cat==="Luxury"&&i===5)||(cat==="Pets"&&i===9)||(cat==="Beauty"&&[1,2,5,7].includes(i)))?"consumable":"collectible";
  return {
   id:`${prefixes[cat]}${n}`,name,category:cat,price,emoji,collectionType,
   isFeatured:i%4===1||i===9,isPopular:i%3===0,
   description:cat==="Travel"?`A fictional ${name.toLowerCase()} travel plan inside JUST ORDERED. No real booking is made.`:`A delightfully unnecessary virtual ${name.toLowerCase()} for your Just Ordered life.`,
   rating:4.1+(n%8)/10,reviewCount:80+(n*137)%2600,
   deliveryMinutes:cat==="Travel"?30:cat==="Food"?15:price>1000000?720:120,
   keywords:[name.toLowerCase(),cat.toLowerCase()],createdAt:d
  };
 })
);
