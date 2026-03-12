'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type Props = {
  data: { bucket: string; count: number; fill?: string }[]
}

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']

export default function BucketChart({ data }: Props) {
  const colored = data.map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={colored} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="bucket"
          label={{ value: 'Templates per partner', position: 'insideBottom', offset: -2, fontSize: 12 }}
          tick={{ fontSize: 13 }}
        />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip
          formatter={(value) => [value ?? 0, 'Partners']}
          labelFormatter={(label) => `${label} template${label === '1' ? '' : 's'}`}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  )
}
