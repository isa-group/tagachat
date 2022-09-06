export function createSquareMatrix(itemLength: number) {
  const array = new Array(itemLength)

  for (let i = 0; i < itemLength; i++) {
    array[i] = []

    for (let j = 0; j < itemLength; j++) {
      array[i].push(0)
    }
  }

  return array
}

export function calculateObservedAgreement(array: any[]) {
  const total = array.reduce((acc, row) => {
    return acc + row.reduce((acc: any, val: any) => acc + val, 0)
  }, 0)

  const agreements = array.reduce((acc, row, idx) => {
    return acc + row[idx]
  }, 0)

  const observedAgreement = agreements / total

  return observedAgreement
}

export function calculateChanceAgreement(array: any[]) {
  const total = array.reduce((acc, row) => {
    return acc + row.reduce((acc: any, val: any) => acc + val, 0)
  }, 0)

  const chanceAgreement = array.reduce((acc, row, idx) => {
    const sumOfRow = row.reduce((acc: any, val: any) => acc + val, 0)
    const sumOfColumn = array.reduce((acc: any, val: any) => acc + val[idx], 0)
    return acc + (sumOfRow / total) * (sumOfColumn / total)
  }, 0)

  return chanceAgreement
}

export function calculateCohenKappa(
  observedAgreement: number,
  chanceAgreement: number
) {
  const cohenKappa =
    (observedAgreement - chanceAgreement) / (1 - chanceAgreement)

  return Math.round(cohenKappa * 100) / 100
}
