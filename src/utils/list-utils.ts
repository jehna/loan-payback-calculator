type SumByFn = <Prop extends string, T extends { [Key in Prop]: number }>(
  prop: Prop,
  arr: T[]
) => number

export const randomize = <T>(arr: readonly T[]): T[] =>
  [...arr].sort(() => Math.random() - 0.5)
export const sumBy: SumByFn = (prop, arr) =>
  arr.reduce((sum, item) => item[prop] + sum, 0)
