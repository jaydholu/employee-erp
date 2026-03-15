import { useEffect, useState } from 'react'
import EmployeeTable from '../components/EmployeeTable'
import { getEmployees, createEmployee, updateEmployee } from '../services/api'

const EMPTY_CREATE = {
  user: { fullname: '', username: '', email: '', password: '', role: 'employee' },
  employee: { department: '', position: '', joining_date: '', salary: '' },
}

const EMPTY_EDIT = { fullname: '', email: '', department: '', position: '', joining_date: '', salary: '' }

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState(null)   // employee object
  const [createForm, setCreateForm] = useState(EMPTY_CREATE)
  const [editForm, setEditForm]     = useState(EMPTY_EDIT)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')

  const load = () => {
    setLoading(true)
    getEmployees()
      .then(r => setEmployees(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  // ── Create ───────────────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true)
    try {
      await createEmployee({
        user:     { ...createForm.user, salary: undefined },
        employee: { ...createForm.employee, salary: Number(createForm.employee.salary) },
      })
      setShowCreate(false)
      setCreateForm(EMPTY_CREATE)
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create employee')
    } finally { setSubmitting(false) }
  }

  // ── Edit ─────────────────────────────────────────────────────────────────
  const openEdit = (emp) => {
    setEditTarget(emp)
    setEditForm({
      fullname:     emp.user.fullname,
      email:        emp.user.email,
      department:   emp.department,
      position:     emp.position,
      joining_date: emp.joining_date,
      salary:       emp.salary,
    })
    setError('')
  }

  const handleEdit = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true)
    try {
      await updateEmployee(editTarget.id, { ...editForm, salary: Number(editForm.salary) })
      setEditTarget(null)
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update employee')
    } finally { setSubmitting(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Employees</h2>
          <p className="text-sm text-slate-400">{employees.length} total</p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setError('') }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <span className="text-lg leading-none">+</span> Add Employee
        </button>
      </div>

      <EmployeeTable employees={employees} onEdit={openEdit} />

      {/* Create Modal */}
      {showCreate && (
        <Modal title="New Employee" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
            <fieldset className="space-y-3">
              <legend className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Account</legend>
              <FormRow label="Full Name">
                <input required value={createForm.user.fullname}
                  onChange={e => setCreateForm(f => ({ ...f, user: { ...f.user, fullname: e.target.value }}))}
                  className={inputCls} placeholder="Jane Doe" />
              </FormRow>
              <FormRow label="Username">
                <input required value={createForm.user.username}
                  onChange={e => setCreateForm(f => ({ ...f, user: { ...f.user, username: e.target.value }}))}
                  className={inputCls} placeholder="janedoe" />
              </FormRow>
              <FormRow label="Email">
                <input type="email" required value={createForm.user.email}
                  onChange={e => setCreateForm(f => ({ ...f, user: { ...f.user, email: e.target.value }}))}
                  className={inputCls} placeholder="jane@company.com" />
              </FormRow>
              <FormRow label="Password">
                <input type="password" required value={createForm.user.password}
                  onChange={e => setCreateForm(f => ({ ...f, user: { ...f.user, password: e.target.value }}))}
                  className={inputCls} placeholder="••••••••" />
              </FormRow>
            </fieldset>

            <fieldset className="space-y-3 border-t border-surface-100 pt-4">
              <legend className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Work Details</legend>
              <FormRow label="Department">
                <input required value={createForm.employee.department}
                  onChange={e => setCreateForm(f => ({ ...f, employee: { ...f.employee, department: e.target.value }}))}
                  className={inputCls} placeholder="Engineering" />
              </FormRow>
              <FormRow label="Position">
                <input required value={createForm.employee.position}
                  onChange={e => setCreateForm(f => ({ ...f, employee: { ...f.employee, position: e.target.value }}))}
                  className={inputCls} placeholder="Software Engineer" />
              </FormRow>
              <FormRow label="Joining Date">
                <input type="date" required value={createForm.employee.joining_date}
                  onChange={e => setCreateForm(f => ({ ...f, employee: { ...f.employee, joining_date: e.target.value }}))}
                  className={inputCls} />
              </FormRow>
              <FormRow label="Salary (₹)">
                <input type="number" required min="0" value={createForm.employee.salary}
                  onChange={e => setCreateForm(f => ({ ...f, employee: { ...f.employee, salary: e.target.value }}))}
                  className={inputCls} placeholder="500000" />
              </FormRow>
            </fieldset>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowCreate(false)} className={cancelBtn}>Cancel</button>
              <button type="submit" disabled={submitting} className={submitBtn}>
                {submitting ? 'Creating…' : 'Create Employee'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <Modal title={`Edit — ${editTarget.user.fullname}`} onClose={() => setEditTarget(null)}>
          <form onSubmit={handleEdit} className="space-y-3">
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
            <FormRow label="Full Name">
              <input value={editForm.fullname} onChange={e => setEditForm(f => ({ ...f, fullname: e.target.value }))} className={inputCls} />
            </FormRow>
            <FormRow label="Email">
              <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className={inputCls} />
            </FormRow>
            <FormRow label="Department">
              <input value={editForm.department} onChange={e => setEditForm(f => ({ ...f, department: e.target.value }))} className={inputCls} />
            </FormRow>
            <FormRow label="Position">
              <input value={editForm.position} onChange={e => setEditForm(f => ({ ...f, position: e.target.value }))} className={inputCls} />
            </FormRow>
            <FormRow label="Joining Date">
              <input type="date" value={editForm.joining_date} onChange={e => setEditForm(f => ({ ...f, joining_date: e.target.value }))} className={inputCls} />
            </FormRow>
            <FormRow label="Salary (₹)">
              <input type="number" min="0" value={editForm.salary} onChange={e => setEditForm(f => ({ ...f, salary: e.target.value }))} className={inputCls} />
            </FormRow>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditTarget(null)} className={cancelBtn}>Cancel</button>
              <button type="submit" disabled={submitting} className={submitBtn}>
                {submitting ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const inputCls   = 'w-full px-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'
const submitBtn  = 'px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60'
const cancelBtn  = 'px-4 py-2 border border-surface-200 text-slate-600 hover:bg-surface-100 text-sm font-medium rounded-lg transition-colors'

function FormRow({ label, children }) {
  return (
    <div className="grid grid-cols-3 items-center gap-3">
      <label className="text-xs font-semibold text-slate-500 col-span-1">{label}</label>
      <div className="col-span-2">{children}</div>
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
