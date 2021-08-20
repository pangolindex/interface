import {Fiat} from '../../constants/fiat'

export function filterFiats(fiats: Fiat[], search: string): Fiat[] {
  if (search.length === 0) return fiats

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter(s => s.length > 0)

  if (lowerSearchParts.length === 0) {
    return fiats
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)

    return lowerSearchParts.every(p => p.length === 0 || sParts.some(sp => sp.startsWith(p) || sp.endsWith(p)))
  }

  return fiats.filter(fiat => {
    const { symbol, name } = fiat

    return (symbol && matchesSearch(symbol)) || (name && matchesSearch(name))
  })
}
