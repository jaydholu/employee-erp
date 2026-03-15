import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PerformanceCard from '../components/PerformanceCard'
import { getPerformance, createPerformance, getMyProfile, getEmployee } from '../services/api'

const EMPTY = { communication: '', technical_skill: '', teamwork: '', leadership: '', review_date: '' }

export default function Performance({ isSelf = false }) {
  const { employeeId } = useParams()
  const navigate       = useNavigate()
  const user           = JSON.parse(localStorage.getItem('user') || 'null')
  const isAdmin        = user?.role === 'admin'

  const [reviews, setReviews]   = useState([])
  const [empId, setEmpId]       = useState(null)
  const [empName, setEmpName]   = useState('')
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState('')

  const resolvedId = isSelf ? user?.employeeId : (employeeId ? Number(employeeId) : null)

  useEffect(() => {
    const load = async () => {
      try {
        let eid = resolvedId
        if (isSelf && !eid) {
          const r = await getMyProfile()
          eid = r.data.id
        }
        setEmpId(eid)

        // fetch name for header
        if (eid) {
          const empRes = isSelf ? await getMyProfile() : await getEmployee(eid)
          setEmpName(empRes.data.user.fullname)
          const revRes = await getPerformance(eid)
          setReviews(revRes.data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [resolvedId, isSelf])

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true)
    try {
      await createPerformance({
        employee_id:    empId,
        communication:  Number(form.communication),
        technical_skill: Number(form.technical_skill),
        teamwork:       Number(form.teamwork),
        leadership:     Number(form.leadership),
        review_date:    form.review_date,
      })
      setShowForm(false)
      setForm(EMPTY)
      const r = await getPerformance(empId)
      setReviews(r.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save review')
    } finally { setSubmitting(false) }
  }

  const avg = (key) =>
    reviews.length ? (reviews.reduce((s, r) => s + r[key], 0) / reviews.length).toFixed(1) : '—'

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Performance Reviews</h2>
          <p className="text-sm text-slate-400">{empName} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && !isSelf && (
            <button
              onClick={() => { setShowForm(true); setError('') }}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              + Add Review
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => navigate('/employees')}
              className="px-4 py-2 border border-surface-200 text-slate-600 hover:bg-surface-100 text-sm font-medium rounded-lg transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      {/* Summary row */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Avg Overall',   value: avg('overall_score') },
            { label: 'Communication', value: avg('communication') },
            { label: 'Technical',     value: avg('technical_skill') },
            { label: 'Teamwork',      value: avg('teamwork') },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-surface-200 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-slate-800 font-mono">{value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-slate-800">New Review</h3>
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'communication', label: 'Communication' },
                { key: 'technical_skill', label: 'Technical Skill' },
                { key: 'teamwork', label: 'Teamwork' },
                { key: 'leadership', label: 'Leadership' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{label} (1–10)</label>
                  <input
                    type="number" min="1" max="10" step="0.1" required
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="8.5"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Review Date</label>
              <input
                type="date" required value={form.review_date}
                onChange={e => setForm(f => ({ ...f, review_date: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-surface-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-surface-100">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg disabled:opacity-60">
                {submitting ? 'Saving…' : 'Save Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Review cards */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-12 text-center">
          <p className="text-slate-400 text-sm">No performance reviews yet.</p>
          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Add First Review
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reviews.map(r => <PerformanceCard key={r.id} review={r} />)}
        </div>
      )}
    </div>
  )
}
