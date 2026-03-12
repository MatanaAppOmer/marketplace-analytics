import type { Template } from './types'
import { excelAdapter } from './excelAdapter'

// Later, swap excelAdapter() for mondayAdapter() here.
// The UI and analytics layer only depend on Template[] and won't need changes.
export async function getTemplates(): Promise<Template[]> {
  return excelAdapter()
}
