'use client'

import { useState, useMemo } from 'react'
import type { PartnerRow } from '@/lib/analytics'

const BUCKET_COLORS: Record<string, string> = {
  '1':   'bg-slate-100 text-slate-600',
  '2-3': 'bg-blue-50 text-blue-600',
  '4-5': 'bg-indigo-50 text-indigo-600',
  '6':   'bg-violet-50 text-violet-600',
  '7+':  'bg-purple-100 text-purple-700',
}

export default function PartnersTable({ rows }: { rows: PartnerRow[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return rows
    return rows.filter(r => r.partnerName.toLowerCase().includes(q))
  }, [rows, query])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Partners</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{filtered.length} of {rows.length}</span>
          <input
            type="search"
            placeholder="Search partners…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-500">#</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Partner Name</th>
              <th className="text-right px-5 py-3 font-medium text-gray-500">Templates</th>
              <th className="text-right px-5 py-3 font-medium text-gray-500">% of Total</th>
              <th className="text-right px-5 py-3 font-medium text-gray-500">Avg Price</th>
              <th className="text-center px-5 py-3 font-medium text-gray-500">Bucket</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r, i) => (
              <tr key={`${r.partnerName}-${i}`} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-gray-400 tabular-nums">{i + 1}</td>
                <td className="px-5 py-3 text-gray-800 font-medium">{r.partnerName}</td>
                <td className="px-5 py-3 text-right">
                  <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold tabular-nums">
                    {r.count}
                  </span>
                </td>
                <td className="px-5 py-3 text-right text-gray-600 tabular-nums">
                  {r.share.toFixed(1)}%
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-gray-600">
                  {r.avgPrice != null ? `$${r.avgPrice.toFixed(2)}` : '—'}
                </td>
                <td className="px-5 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${BUCKET_COLORS[r.bucket]}`}>
                    {r.bucket}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                  No partners match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
