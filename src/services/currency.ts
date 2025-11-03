export function toLocaleDigits(n: number | string) {
  return String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])
}

export function formatToman(amount: number): string {
  const formatted = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(amount)
  return `${formatted} تومان`
}
