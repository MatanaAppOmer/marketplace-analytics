import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'
import type { Template } from './types'

export function excelAdapter(): Template[] {
  const filePath = path.join(process.cwd(), 'public', 'templates.xlsx')
  const buffer = fs.readFileSync(filePath)
  const wb = XLSX.read(buffer, { type: 'buffer' })

  const sheetName = 'selling templates'
  const ws = wb.Sheets[sheetName]
  if (!ws) {
    throw new Error(`Sheet "${sheetName}" not found. Available: ${wb.SheetNames.join(', ')}`)
  }

  // Sheet has 3 header rows:
  //   Row 0: "Selling templates" (title)
  //   Row 1: "Done - Uploaded to MP" (subtitle)
  //   Row 2: actual column headers
  //   Row 3+: data
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 })

  const headers = aoa[2] as string[]
  const dataRows = aoa.slice(3) as unknown[][]

  console.log('[excelAdapter] Detected columns:', headers)

  const colIndex = (name: string) => headers.findIndex(h => String(h).trim() === name)

  const idx = {
    guid: colIndex('GUID'),
    name: colIndex('Name'),
    partner: colIndex('Partners name'),
    qa: colIndex('QA reviewer'),
    design: colIndex('Design reviewer'),
    externalStatus: colIndex('External Status'),
    status: colIndex('Status'),
    url: colIndex('Template URL'),
    price: colIndex('Price (USD)'),
  }

  const templates: Template[] = []

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i]

    const partnerName = String(row[idx.partner] ?? '').trim()
    if (!partnerName) continue

    const externalStatus = String(row[idx.externalStatus] ?? '').trim()
    if (externalStatus !== 'Live!') continue

    const rawPrice = row[idx.price]
    let price: number | undefined
    if (rawPrice !== undefined && rawPrice !== null && rawPrice !== '') {
      const parsed = parseFloat(String(rawPrice).replace(/[^0-9.]/g, ''))
      if (!isNaN(parsed)) price = parsed
    }

    const templateName = String(row[idx.name] ?? '').trim()
    const safeName = (templateName || 'template').replace(/\s+/g, '-').toLowerCase()
    const safePartner = partnerName.replace(/\s+/g, '-').toLowerCase()
    const id = `${safeName}-${safePartner}-${i}`

    templates.push({
      id,
      templateName,
      partnerName,
      qaReviewer: String(row[idx.qa] ?? '').trim() || undefined,
      designReviewer: String(row[idx.design] ?? '').trim() || undefined,
      externalStatus,
      status: String(row[idx.status] ?? '').trim() || undefined,
      templateUrl: String(row[idx.url] ?? '').trim() || undefined,
      price,
    })
  }

  // Validation log
  const partners = new Set(templates.map(t => t.partnerName))
  console.log(`[excelAdapter] Total templates (Live!): ${templates.length}`)
  console.log(`[excelAdapter] Total partners: ${partners.size}`)

  return templates
}
