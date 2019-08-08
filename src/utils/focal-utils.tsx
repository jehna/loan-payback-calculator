import React from 'react'
import { Atom, F } from '@grammarly/focal'

export const mapElems = <T, O>(
  iterator: (arg0: T, arg1: number) => O,
  arr: Atom<T[]>
) => <F.Fragment>{arr.view(current => current.map(iterator))}</F.Fragment>

export const reduce = <T, O>(
  iterator: (curr: O, next: T) => O,
  initial: O,
  arr: Atom<T[]>
) => (
  <F.Fragment>
    {arr.view(current => current.reduce(iterator, initial))}
  </F.Fragment>
)

export function spread<
  T extends {},
  Keys extends keyof T,
  O extends { [K in Keys]: Atom<T[K]> }
>(atom: Atom<T>): O {
  const keys = Object.keys(atom.get()) as Keys[]
  const out: any = {}
  for (const key of keys) {
    out[key] = atom.view(v => v[key])
  }
  return out as O
}

export const persist = <T, _>(id: string, atom: Atom<T>) => {
  const lastSave = localStorage.getItem(id)
  if (lastSave) {
    atom.set(JSON.parse(lastSave))
  }
  atom.subscribe(value => localStorage.setItem(id, JSON.stringify(value)))
}
