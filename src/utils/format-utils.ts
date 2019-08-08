export const money = (num: number) =>
  num.toLocaleString('fi', { currency: 'EUR', style: 'currency' })
