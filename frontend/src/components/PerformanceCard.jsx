const ScoreBar = ({ label, value }) => {
  const pct = (value / 10) * 100
  const color =
    value >= 8 ? 'bg-emerald-500' :
    value >= 6 ? 'bg-brand-500' :
    value >= 4 ? 'bg-amber-400' : 'bg-red-400'

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-500 font-medium">{label}</span>
        <span className="font-mono font-semibold text-slate-700">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

const badge = score =>
  score >= 8 ? { label: 'Excellent', cls: 'bg-emerald-100 text-emerald-700' } :
  score >= 6 ? { label: 'Good',      cls: 'bg-brand-100 text-brand-700' } :
  score >= 4 ? { label: 'Average',   cls: 'bg-amber-100 text-amber-700' } :
               { label: 'Needs Work',cls: 'bg-red-100 text-red-600' }

export default function PerformanceCard({ review }) {
  const { label, cls } = badge(review.overall_score)

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 font-mono">{review.review_date}</p>
          <p className="font-semibold text-slate-800 mt-0.5">Performance Review</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-800 font-mono">
            {review.overall_score.toFixed(1)}
            <span className="text-base text-slate-400">/10</span>
          </p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
        </div>
      </div>

      {/* Score bars */}
      <div className="space-y-3 pt-1">
        <ScoreBar label="Communication"   value={review.communication} />
        <ScoreBar label="Technical Skill" value={review.technical_skill} />
        <ScoreBar label="Teamwork"        value={review.teamwork} />
        <ScoreBar label="Leadership"      value={review.leadership} />
      </div>
    </div>
  )
}
