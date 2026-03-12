'use client'

import { useState, useMemo } from 'react'
import type { Template } from '@/lib/types'

export default function TemplatesTable({ templates }: { templates: Template[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return templates
    return templates.filter(
      t =>
        t.templateName.toLowerCase().includes(q) ||
        t.partnerName.toLowerCase().includes(q) ||
        (t.qaReviewer ?? '').toLowerCase().includes(q) ||
        (t.designReviewer ?? '').toLowerCase().includes(q),
    )
  }, [templates, query])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Templates</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{filtered.length} of {templates.length}</span>
          <input
            type="search"
            placeholder="Search templates, partners, reviewers…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Template Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Partner</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">QA Reviewer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Design Reviewer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((t, index) => (
                <tr key={`${t.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-800 font-medium max-w-xs truncate">
                    {t.templateName || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{t.partnerName}</td>
                  <td className="px-4 py-3 text-gray-500">{t.qaReviewer ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{t.designReviewer ?? '—'}</td>
                  <td className="px-4 py-3">
                    {t.templateUrl ? (
                      <a
                        href={t.templateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline truncate block max-w-[180px]"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                    No templates match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
