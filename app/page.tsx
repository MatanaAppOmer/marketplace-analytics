import Link from 'next/link'
import { getTemplates } from '@/lib/dataSource'
import {
  getTotalTemplates,
  getTotalPartners,
  getPartnerBuckets,
  getTopPartners,
  getPartnerRows,
  getAveragePrice,
  getMedianPrice,
  getMinPrice,
  getMaxPrice,
  getPriceDistribution,
  getTopPricedTemplates,
} from '@/lib/analytics'
import BucketChart from '@/components/BucketChart'
import TopPartnersChart from '@/components/TopPartnersChart'
import PriceDistributionChart from '@/components/PriceDistributionChart'

export const dynamic = 'force-dynamic'

const fmt = (n: number | null, fallback = '—') =>
  n == null ? fallback : `$${n.toFixed(2)}`

export default async function DashboardPage() {
  const templates = await getTemplates()

  const total = getTotalTemplates(templates)
  const totalPartners = getTotalPartners(templates)
  const avgPerPartner = totalPartners > 0 ? (total / totalPartners).toFixed(1) : '0'
  const buckets = getPartnerBuckets(templates)
  const topPartners = getTopPartners(templates, 10)
  const partnerRows = getPartnerRows(templates)
  const priceDistribution = getPriceDistribution(templates)
  const topPriced = getTopPricedTemplates(templates, 10)

  const avgPrice = getAveragePrice(templates)
  const medianPrice = getMedianPrice(templates)
  const minPrice = getMinPrice(templates)
  const maxPrice = getMaxPrice(templates)

  const singleTemplatePartners = partnerRows.filter(r => r.bucket === '1')
  const heavyPartners = partnerRows.filter(r => r.bucket === '7+')

  const volumeKpis = [
    {
      label: 'Total Templates',
      value: total,
      sub: 'Live on Marketplace',
      color: 'border-indigo-500',
      textColor: 'text-indigo-600',
    },
    {
      label: 'Total Partners',
      value: totalPartners,
      sub: 'Contributing partners',
      color: 'border-violet-500',
      textColor: 'text-violet-600',
    },
    {
      label: 'Avg Templates / Partner',
      value: avgPerPartner,
      sub: 'Mean portfolio size',
      color: 'border-sky-500',
      textColor: 'text-sky-600',
    },
  ]

  const priceKpis = [
    {
      label: 'Average Price',
      value: fmt(avgPrice),
      sub: 'Mean across priced templates',
      color: 'border-emerald-500',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Median Price',
      value: fmt(medianPrice),
      sub: '50th percentile',
      color: 'border-teal-500',
      textColor: 'text-teal-600',
    },
    {
      label: 'Min Price',
      value: fmt(minPrice),
      sub: 'Lowest priced template',
      color: 'border-cyan-500',
      textColor: 'text-cyan-600',
    },
    {
      label: 'Max Price',
      value: fmt(maxPrice),
      sub: 'Highest priced template',
      color: 'border-orange-500',
      textColor: 'text-orange-600',
    },
  ]

  const savedQuestions = [
    {
      question: 'Which partners have the most templates?',
      answer: `${topPartners[0]?.partnerName} leads with ${topPartners[0]?.count} templates`,
      href: '/partners',
      accent: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      label: 'View Partners →',
    },
    {
      question: 'How many partners have only 1 template?',
      answer: `${singleTemplatePartners.length} partners — ${((singleTemplatePartners.length / totalPartners) * 100).toFixed(0)}% of all partners`,
      href: '/partners',
      accent: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
      label: 'View Partners →',
    },
    {
      question: 'How many partners have 7+ templates?',
      answer: `${heavyPartners.length} partners own ${heavyPartners.reduce((s, r) => s + r.count, 0)} templates combined`,
      href: '/partners',
      accent: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
      label: 'View Partners →',
    },
    {
      question: 'How many templates are in the catalog?',
      answer: `${total} live templates from ${totalPartners} partners`,
      href: '/templates',
      accent: 'bg-violet-50 border-violet-200 hover:bg-violet-100',
      label: 'Browse Templates →',
    },
    {
      question: "What's the most expensive template?",
      answer: topPriced[0]
        ? `${topPriced[0].templateName || topPriced[0].partnerName} at ${fmt(topPriced[0].price)}`
        : 'No price data',
      href: '#top-priced',
      accent: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      label: 'See top priced ↓',
    },
    {
      question: 'What is the median template price?',
      answer: medianPrice != null ? `${fmt(medianPrice)} across priced templates` : 'No price data',
      href: '#price-distribution',
      accent: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
      label: 'See distribution ↓',
    },
  ]

  return (
    <div className="space-y-8">

      {/* Volume KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {volumeKpis.map(({ label, value, sub, color, textColor }) => (
          <div
            key={label}
            className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 border-l-4 ${color}`}
          >
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-4xl font-bold tabular-nums ${textColor}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Price KPI Cards */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Pricing
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {priceKpis.map(({ label, value, sub, color, textColor }) => (
            <div
              key={label}
              className={`bg-white rounded-xl border border-gray-200 shadow-sm p-5 border-l-4 ${color}`}
            >
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
              <p className={`text-3xl font-bold tabular-nums ${textColor}`}>{value}</p>
              <p className="text-xs text-gray-400 mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Questions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Saved Questions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {savedQuestions.map(({ question, answer, href, accent, label }) => (
            <Link
              key={question}
              href={href}
              className={`block rounded-xl border p-4 transition-colors ${accent}`}
            >
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Q</p>
              <p className="text-sm font-medium text-gray-800 leading-snug mb-2">{question}</p>
              <p className="text-sm text-gray-600 mb-3">{answer}</p>
              <span className="text-xs font-semibold text-gray-500">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts — volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Distribution</p>
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Partners by Template Count
          </h2>
          <BucketChart data={buckets} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Ranking</p>
          <h2 className="text-base font-semibold text-gray-800 mb-4">Top 10 Partners</h2>
          <TopPartnersChart data={topPartners} />
        </div>
      </div>

      {/* Price distribution chart */}
      <div id="price-distribution" className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Pricing</p>
        <h2 className="text-base font-semibold text-gray-800 mb-4">Price Distribution</h2>
        <PriceDistributionChart data={priceDistribution} />
      </div>

      {/* Quick Insight Tables */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Quick Insights
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">Partners by Bucket</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-2.5 font-medium text-gray-500">Templates</th>
                  <th className="text-right px-5 py-2.5 font-medium text-gray-500">Partners</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {buckets.map(({ bucket, count }) => (
                  <tr key={bucket} className="hover:bg-gray-50">
                    <td className="px-5 py-2.5 text-gray-700">{bucket}</td>
                    <td className="px-5 py-2.5 text-right font-semibold text-gray-900 tabular-nums">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">Partners with 1 Template</h3>
              <p className="text-xs text-gray-400 mt-0.5">{singleTemplatePartners.length} partners</p>
            </div>
            <div className="overflow-y-auto max-h-52">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-50">
                  {singleTemplatePartners.map((r, i) => (
                    <tr key={`single-${r.partnerName}-${i}`} className="hover:bg-gray-50">
                      <td className="px-5 py-2 text-gray-700">{r.partnerName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">Top 10 Partners</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-2.5 font-medium text-gray-500">Partner</th>
                  <th className="text-right px-5 py-2.5 font-medium text-gray-500">Templates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topPartners.map(({ partnerName, count }, i) => (
                  <tr key={`top-${partnerName}-${i}`} className="hover:bg-gray-50">
                    <td className="px-5 py-2.5 text-gray-700">
                      <span className="text-gray-400 mr-2 tabular-nums">{i + 1}.</span>
                      {partnerName}
                    </td>
                    <td className="px-5 py-2.5 text-right font-semibold text-gray-900 tabular-nums">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top 10 most expensive templates */}
      <div id="top-priced" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Pricing</p>
          <h2 className="text-base font-semibold text-gray-800">Top 10 Most Expensive Templates</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-500">#</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Template</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Partner</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">Price</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">URL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {topPriced.map((t, i) => (
              <tr key={`priced-${t.templateName}-${i}`} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-gray-400 tabular-nums">{i + 1}</td>
                <td className="px-6 py-3 text-gray-800 font-medium max-w-xs truncate">
                  {t.templateName || '—'}
                </td>
                <td className="px-6 py-3 text-gray-600">{t.partnerName}</td>
                <td className="px-6 py-3 text-right">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 font-semibold tabular-nums">
                    {fmt(t.price)}
                  </span>
                </td>
                <td className="px-6 py-3">
                  {t.templateUrl ? (
                    <a
                      href={t.templateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline text-xs"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
            {topPriced.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  No price data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
