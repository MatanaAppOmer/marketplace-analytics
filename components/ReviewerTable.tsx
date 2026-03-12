import type { ReviewerRow } from '@/lib/analytics'

type Props = {
  title: string
  rows: ReviewerRow[]
  total: number
}

export default function ReviewerTable({ title, rows, total }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{rows.length} reviewers · {total} templates assigned</p>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="text-left px-5 py-2.5 font-medium text-gray-500">Reviewer</th>
            <th className="text-right px-5 py-2.5 font-medium text-gray-500">Templates</th>
            <th className="text-right px-5 py-2.5 font-medium text-gray-500">Share</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((r, i) => (
            <tr key={`${r.reviewer}-${i}`} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-2.5 text-gray-700">{r.reviewer}</td>
              <td className="px-5 py-2.5 text-right font-semibold text-gray-900 tabular-nums">
                {r.count}
              </td>
              <td className="px-5 py-2.5 text-right text-gray-500 tabular-nums">
                {total > 0 ? ((r.count / total) * 100).toFixed(1) : '0'}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
