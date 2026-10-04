export type TransactionType="INITIAL_BALANCE"|"DAILY_INCOME"|"PURCHASE"|"ACHIEVEMENT_REWARD"|"REFUND";
export interface WalletTransaction { id:string; type:TransactionType; amount:number; timestamp:string; relatedOrderId?:string; description?:string }
export type Category="Food"|"Electronics"|"Gaming"|"Fashion"|"Home"|"Vehicles"|"Luxury"|"Fitness"|"Travel"|"Pets"|"Beauty"|"Office"|"Outdoors";
export interface Product { id:string; name:string; description:string; category:Category; price:number; rating:number; reviewCount:number; isFeatured?:boolean; isPopular?:boolean; deliveryMinutes:number; collectionType:"collectible"|"consumable"; emoji:string; keywords:string[]; createdAt:string }
export interface CartItem { productId:string; quantity:number }
export interface OrderItem { productId:string; name:string; price:number; quantity:number; collectionType:Product["collectionType"]; emoji:string }
export type OrderStatus="ORDER_PLACED"|"PROCESSING"|"PACKED"|"SHIPPED"|"OUT_FOR_DELIVERY"|"DELIVERED"|"RECEIVED";
export interface Order { id:string; number:string; items:OrderItem[]; total:number; orderedAt:string; expectedDeliveryAt:string; status:OrderStatus; locationName:string }
export interface CollectionItem { id:string; productId:string; name:string; emoji:string; acquiredAt:string; purchasePrice:number }
export interface AppState { version:1; onboardingCompleted:boolean; lastIncomeDate:string; ledger:WalletTransaction[]; wishlist:string[]; cart:CartItem[]; orders:Order[]; collection:CollectionItem[]; displayName:string; dreamGoalProductId?:string; debugTimeOffsetMinutes?:number }
