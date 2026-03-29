import type { Template } from './types'
import { mondayAdapter } from './mondayAdapter'

export async function getTemplates(): Promise<Template[]> {
  return mondayAdapter()
}
