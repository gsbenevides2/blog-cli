export {}

declare global {
  interface Array<T> {
    especialFilter: (
      callback: (value: T, index: number, array: T[]) => boolean
    ) => [Array<T>, Array<T>]
  }
}
Array.prototype.especialFilter = function (
  callback: (value: unknown, index: number, array: unknown[]) => boolean
): [unknown[], unknown[]] {
  'use strict'
  const trueRes: unknown[] = []
  const falseRes: unknown[] = []
  this.forEach((...args) => {
    const res = callback(args[0], args[1], args[2])
    if (res) trueRes.push(args[0])
    else falseRes.push(args[0])
  })
  return [trueRes, falseRes]
}
