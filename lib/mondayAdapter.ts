import type { Template } from './types'

const MONDAY_API_URL = 'https://api.monday.com/v2'
const BOARD_ID = process.env.MONDAY_BOARD_ID ?? '6936451041'
const GROUP_ID = 'new_group57741__1' // "Done - Uploaded to MP"

const COLUMN_IDS = [
  'text58__1',       // Partners name
  'dup__of_reviewer__1', // QA reviewer
  'person',          // Design reviewer
  'color_mktj9hcq',  // External Status
  'status',          // Status
  'text59__1',       // Template URL
  'guid__1',         // GUID
  'numbers4__1',     // Price (USD)
]

interface MondayItem {
  id: string
  name: string
  column_values: Array<{ id: string; text: string }>
}

interface ItemsPage {
  cursor: string | null
  items: MondayItem[]
}

async function fetchPage(cursor: string | null): Promise<ItemsPage> {
  const token = process.env.MONDAY_API_TOKEN
  if (!token) throw new Error('MONDAY_API_TOKEN is not set')

  const colIds = JSON.stringify(COLUMN_IDS)

  const query = cursor
    ? `{ next_items_page(limit: 500, cursor: "${cursor}") { cursor items { id name column_values(ids: ${colIds}) { id text } } } }`
    : `{ boards(ids: [${BOARD_ID}]) { groups(ids: ["${GROUP_ID}"]) { items_page(limit: 500) { cursor items { id name column_values(ids: ${colIds}) { id text } } } } } }`

  const res = await fetch(MONDAY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ query }),
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`Monday API error: ${res.status} ${res.statusText}`)

  const json = await res.json()

  if (json.errors?.length) {
    throw new Error(`Monday GraphQL error: ${json.errors[0].message}`)
  }

  if (cursor) {
    return json.data.next_items_page as ItemsPage
  }
  return json.data.boards[0].groups[0].items_page as ItemsPage
}

function col(item: MondayItem, id: string): string {
  return item.column_values.find((c) => c.id === id)?.text?.trim() ?? ''
}

function toTemplate(item: MondayItem, index: number): Template {
  const templateName = item.name.trim()
  const partnerName = col(item, 'text58__1')
  const price = parseFloat(col(item, 'numbers4__1'))

  return {
    id: item.id,
    templateName,
    partnerName,
    qaReviewer: col(item, 'dup__of_reviewer__1') || undefined,
    designReviewer: col(item, 'person') || undefined,
    externalStatus: col(item, 'color_mktj9hcq') || undefined,
    status: col(item, 'status') || undefined,
    templateUrl: col(item, 'text59__1') || undefined,
    price: isNaN(price) ? undefined : price,
  }
}

export async function mondayAdapter(): Promise<Template[]> {
  const allItems: MondayItem[] = []
  let cursor: string | null = null

  do {
    const page = await fetchPage(cursor)
    allItems.push(...page.items)
    cursor = page.cursor
  } while (cursor)

  const templates = allItems
    .filter((item) => item.name.trim() !== '')
    .map((item, i) => toTemplate(item, i))

  console.log(`[mondayAdapter] Fetched ${templates.length} templates from Monday`)
  return templates
}
