import React, { useEffect, useMemo, useState } from "react";
import { getEmployeesList } from "../../controllers/employee.controller";
import useCurrency from "../../hooks/useCurrency";
import Modal from "../../components/Modal";
import EmployeeForm from "./EmployeeForm";
import EmployeeDetailModal from "./EmployeeDetailModal";

const Pill = ({ children }) => (
  <span className="badge text-bg-light border" style={{ borderRadius: 999, padding: ".4rem .6rem" }}>
    {children}
  </span>
);

const StatusDot = ({ on = false }) => (
  <span
    style={{
      display: "inline-block",
      width: 8,
      height: 8,
      borderRadius: 999,
      background: on ? "#16a34a" : "#94a3b8",
      marginRight: 6
    }}
  />
);

const formatAmount = (val) => {
  if (val === null || val === undefined || val === "") return "0.00";
  const n = Number(val);
  if (Number.isNaN(n)) return String(val); // already formatted text
  // Two decimals, thousand separators
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const EmployeeList = () => {
  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [viewId, setViewId] = useState(null);
  const currency = useCurrency();

  const load = async () => {
    setLoading(true);
    try {
      const res = await getEmployeesList();
      const list = res?.data?.employees || [];
      setRows(list);
      setFiltered(list);
    } catch (e) {
      console.error("Employee list error:", e);
      setRows([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // derive department filters
  const departments = useMemo(() => {
    const set = new Set();
    rows.forEach(r => r.employeeDepartment && set.add(r.employeeDepartment));
    return ["all", ...Array.from(set)];
  }, [rows]);

  // client filter
  useEffect(() => {
    const query = q.trim().toLowerCase();
    const f = rows.filter(r => {
      const matchQuery =
        !query ||
        String(r.employeeName || "").toLowerCase().includes(query) ||
        String(r.employeeEmail || "").toLowerCase().includes(query) ||
        String(r.employeePhone || "").toLowerCase().includes(query);
      const matchDept = dept === "all" || String(r.employeeDepartment || "") === dept;
      return matchQuery && matchDept;
    });
    setFiltered(f);
  }, [q, dept, rows]);

  const onAdded = () => {
    setShowAdd(false);
    load();
  };

  const onUpdated = () => {
    load();
  };

  return (
    <>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h4 className="m-0">Employees</h4>
              <Pill><StatusDot on={filtered.length > 0} />{filtered.length} total</Pill>
            </div>
            <div className="d-flex gap-2">
              <input
                className="form-control"
                placeholder="Search by name, email or phone…"
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                style={{ minWidth: 260 }}
              />
              <select
                className="form-select"
                value={dept}
                onChange={(e)=>setDept(e.target.value)}
              >
                {departments.map(d => <option key={d} value={d}>{d === "all" ? "All departments" : d}</option>)}
              </select>
              <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Employee</button>
            </div>
          </div>

          {loading ? (
            <div>Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-muted">No employees found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{width: 70}}>#ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Phone</th>
                    <th>Emergency Contact Name</th>
                    <th style={{width: 180}}>Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(emp => (
                    <tr key={emp.employeeId} style={{ cursor: "pointer" }} onClick={() => setViewId(emp.employeeId)}>
                      <td className="text-muted">#{emp.employeeId}</td>
                      <td>
                        <div className="fw-semibold">{emp.employeeName}</div>
                        <div className="small text-muted">{emp.employeeEmail}</div>
                      </td>
                      <td>{emp.employeeDepartment || "-"}</td>
                      <td>{emp.employeeDesignation || "-"}</td>
                      <td>{emp.employeePhone || "-"}</td>
                      <td>{emp.emergency_contact_name || "-"}</td>
                      <td>
                        {/* currency symbol + space + amount (2dp) */}
                        <div className="fw-semibold">
                          {currency} {formatAmount(emp.employeeSalary)}
                        </div>
                        <div className="small text-muted">{emp.employeeSalaryType || "—"}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="small text-muted">Tip: click a row to view or edit details.</div>
            </div>
          )}
        </div>
      </div>

      {/* Add overlay */}
      {showAdd && (
        <Modal
          title="Add Employee"
          onClose={() => setShowAdd(false)}
          size="sm"
          height="short"
          headerCompact
        >
          <EmployeeForm onSaved={onAdded} />
        </Modal>
      )}

      {/* View/Edit overlay */}
      {viewId && (
        <EmployeeDetailModal
          employeeId={viewId}
          onClose={() => setViewId(null)}
          onUpdated={onUpdated}
        />
      )}
    </>
  );
};

export default EmployeeList;
export { EmployeeList };
