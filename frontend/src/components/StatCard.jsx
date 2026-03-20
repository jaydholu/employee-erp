export default function StatCard({ title, value, sub, icon: Icon, accent = 'brand' }) {
  const accents = {
    brand:   'bg-brand-100 text-brand-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber:   'bg-amber-100 text-amber-600',
    rose:    'bg-rose-100 text-rose-600',
  }
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${accents[accent]}`}>
        <Icon />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
