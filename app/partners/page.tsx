import { getTemplates } from '@/lib/dataSource'
import { getPartnerRows } from '@/lib/analytics'
import PartnersTable from '@/components/PartnersTable'

export const dynamic = 'force-dynamic'

export default async function PartnersPage() {
  const templates = await getTemplates()
  const rows = getPartnerRows(templates)
  return <PartnersTable rows={rows} />
}
