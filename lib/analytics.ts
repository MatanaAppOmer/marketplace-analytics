import type { Template } from './types'

// ─── Volume ──────────────────────────────────────────────────────────────────

export function getTotalTemplates(templates: Template[]): number {
  return templates.length
}

export function getTotalPartners(templates: Template[]): number {
  return new Set(templates.map(t => t.partnerName)).size
}

export function getTemplatesPerPartner(templates: Template[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const t of templates) {
    counts[t.partnerName] = (counts[t.partnerName] ?? 0) + 1
  }
  return counts
}

export type BucketLabel = '1' | '2-3' | '4-5' | '6' | '7+'

export function getBucketLabel(count: number): BucketLabel {
  if (count === 1) return '1'
  if (count <= 3) return '2-3'
  if (count <= 5) return '4-5'
  if (count === 6) return '6'
  return '7+'
}

export function getPartnerBuckets(
  templates: Template[],
): { bucket: BucketLabel; count: number }[] {
  const perPartner = getTemplatesPerPartner(templates)
  const bucketCounts: Record<BucketLabel, number> = {
    '1': 0, '2-3': 0, '4-5': 0, '6': 0, '7+': 0,
  }
  for (const count of Object.values(perPartner)) {
    bucketCounts[getBucketLabel(count)]++
  }
  const order: BucketLabel[] = ['1', '2-3', '4-5', '6', '7+']
  return order.map(bucket => ({ bucket, count: bucketCounts[bucket] }))
}

export function getTopPartners(
  templates: Template[],
  limit = 10,
): { partnerName: string; count: number }[] {
  const perPartner = getTemplatesPerPartner(templates)
  return Object.entries(perPartner)
    .map(([partnerName, count]) => ({ partnerName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export type PartnerRow = {
  partnerName: string
  count: number
  share: number
  bucket: BucketLabel
  avgPrice?: number
}

export function getPartnerRows(templates: Template[]): PartnerRow[] {
  const total = templates.length
  const counts: Record<string, number> = {}
  const priceSums: Record<string, number> = {}
  const priceCounts: Record<string, number> = {}

  for (const t of templates) {
    counts[t.partnerName] = (counts[t.partnerName] ?? 0) + 1
    if (t.price != null) {
      priceSums[t.partnerName] = (priceSums[t.partnerName] ?? 0) + t.price
      priceCounts[t.partnerName] = (priceCounts[t.partnerName] ?? 0) + 1
    }
  }

  return Object.entries(counts)
    .map(([partnerName, count]) => {
      const pc = priceCounts[partnerName] ?? 0
      return {
        partnerName,
        count,
        share: total > 0 ? (count / total) * 100 : 0,
        bucket: getBucketLabel(count),
        avgPrice: pc > 0 ? priceSums[partnerName] / pc : undefined,
      }
    })
    .sort((a, b) => b.count - a.count)
}

export type ReviewerRow = {
  reviewer: string
  count: number
}

function getTemplatesByReviewer(
  templates: Template[],
  field: 'qaReviewer' | 'designReviewer',
): ReviewerRow[] {
  const counts: Record<string, number> = {}
  for (const t of templates) {
    const reviewer = t[field]?.trim()
    if (!reviewer) continue
    counts[reviewer] = (counts[reviewer] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([reviewer, count]) => ({ reviewer, count }))
    .sort((a, b) => b.count - a.count)
}

export function getTemplatesByQAReviewer(templates: Template[]): ReviewerRow[] {
  return getTemplatesByReviewer(templates, 'qaReviewer')
}

export function getTemplatesByDesignReviewer(templates: Template[]): ReviewerRow[] {
  return getTemplatesByReviewer(templates, 'designReviewer')
}

// ─── Price ───────────────────────────────────────────────────────────────────

/** Only templates that have a valid numeric price. */
function pricedTemplates(templates: Template[]): number[] {
  return templates
    .filter(t => t.price != null)
    .map(t => t.price as number)
}

export function getAveragePrice(templates: Template[]): number | null {
  const prices = pricedTemplates(templates)
  if (prices.length === 0) return null
  return prices.reduce((s, p) => s + p, 0) / prices.length
}

export function getMedianPrice(templates: Template[]): number | null {
  const prices = pricedTemplates(templates).sort((a, b) => a - b)
  if (prices.length === 0) return null
  const mid = Math.floor(prices.length / 2)
  return prices.length % 2 === 0
    ? (prices[mid - 1] + prices[mid]) / 2
    : prices[mid]
}

export function getMinPrice(templates: Template[]): number | null {
  const prices = pricedTemplates(templates)
  return prices.length === 0 ? null : Math.min(...prices)
}

export function getMaxPrice(templates: Template[]): number | null {
  const prices = pricedTemplates(templates)
  return prices.length === 0 ? null : Math.max(...prices)
}

export type PriceBucket = {
  label: string
  min: number
  max: number
  count: number
}

const PRICE_RANGES = [
  { label: 'Free', min: 0, max: 0 },
  { label: '$1–$24', min: 1, max: 24 },
  { label: '$25–$49', min: 25, max: 49 },
  { label: '$50–$99', min: 50, max: 99 },
  { label: '$100–$199', min: 100, max: 199 },
  { label: '$200+', min: 200, max: Infinity },
]

export function getPriceDistribution(templates: Template[]): PriceBucket[] {
  const buckets: PriceBucket[] = PRICE_RANGES.map(r => ({ ...r, count: 0 }))
  for (const t of templates) {
    if (t.price == null) continue
    const bucket = buckets.find(b => t.price! >= b.min && t.price! <= b.max)
    if (bucket) bucket.count++
  }
  return buckets
}

export type PartnerPriceRow = {
  partnerName: string
  avgPrice: number
  templateCount: number
  pricedCount: number
}

export function getAveragePriceByPartner(templates: Template[]): PartnerPriceRow[] {
  const sums: Record<string, number> = {}
  const counts: Record<string, number> = {}
  const totalCounts: Record<string, number> = {}

  for (const t of templates) {
    totalCounts[t.partnerName] = (totalCounts[t.partnerName] ?? 0) + 1
    if (t.price != null) {
      sums[t.partnerName] = (sums[t.partnerName] ?? 0) + t.price
      counts[t.partnerName] = (counts[t.partnerName] ?? 0) + 1
    }
  }

  return Object.entries(sums)
    .map(([partnerName, sum]) => ({
      partnerName,
      avgPrice: sum / counts[partnerName],
      templateCount: totalCounts[partnerName],
      pricedCount: counts[partnerName],
    }))
    .sort((a, b) => b.avgPrice - a.avgPrice)
}

export type TopPricedTemplate = {
  templateName: string
  partnerName: string
  price: number
  templateUrl?: string
}

export function getTopPricedTemplates(
  templates: Template[],
  limit = 10,
): TopPricedTemplate[] {
  return templates
    .filter(t => t.price != null)
    .sort((a, b) => (b.price as number) - (a.price as number))
    .slice(0, limit)
    .map(t => ({
      templateName: t.templateName,
      partnerName: t.partnerName,
      price: t.price as number,
      templateUrl: t.templateUrl,
    }))
}
