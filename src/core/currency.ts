export const formatMoney = (amount: number, locale = "en-BD") => `৳${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount)}`;
