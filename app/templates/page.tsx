import { getTemplates } from '@/lib/dataSource'
import TemplatesTable from '@/components/TemplatesTable'

export const dynamic = 'force-dynamic'

export default async function TemplatesPage() {
  const templates = await getTemplates()
  return <TemplatesTable templates={templates} />
}
