import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API } from "../../config/config";
import { getEmployeesList } from "../../controllers/employee.controller";
import EmployeeList from "./EmployeeList";
import EmployeeForm from "./EmployeeForm";
import EditEmployeeForm from "./EditEmployeeForm";
import EmployeeDetails from "./EmployeeDetails";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("₹"); // safe fallback

  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewId, setViewId] = useState(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getEmployeesList();
      setEmployees(res?.data?.employees || []);
    } catch (e) {
      console.error("EmployeesPage load error:", e);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  // Try to fetch real currency; do not block UI on 401 or errors
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/settings/store-setting`, { withCredentials: true });
        if (res?.data?.currency) setCurrency(res.data.currency);
      } catch {
        // intentionally silent
      }
    })();
  }, []);

  const selected = useMemo(
    () => employees.find(e => e.employeeId === viewId) || null,
    [employees, viewId]
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Employees</h3>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Employee</button>
      </div>

      <EmployeeList
        rows={employees}
        loading={loading}
        currency={currency}
        onEdit={(id) => setEditId(id)}
        onView={(id) => setViewId(id)}
      />

      {/* Add modal */}
      {showAdd && (
        <div className="modal d-block" tabIndex="-1" onClick={() => setShowAdd(false)}>
          <div className="modal-dialog modal-lg" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Employee</h5>
                <button type="button" className="btn-close" onClick={() => setShowAdd(false)} />
              </div>
              <div className="modal-body">
                <EmployeeForm onSaved={() => { setShowAdd(false); refresh(); }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editId && (
        <div className="modal d-block" tabIndex="-1" onClick={() => setEditId(null)}>
          <div className="modal-dialog modal-lg" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Employee</h5>
                <button type="button" className="btn-close" onClick={() => setEditId(null)} />
              </div>
              <div className="modal-body">
                <EditEmployeeForm employeeId={editId} onSaved={() => { setEditId(null); refresh(); }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View drawer */}
      {selected && (
        <div className="offcanvas offcanvas-end show" style={{visibility:"visible", width:"720px"}} tabIndex="-1">
          <div className="offcanvas-header">
            <h5>Employee Details</h5>
            <button type="button" className="btn-close text-reset" onClick={() => setViewId(null)} />
          </div>
          <div className="offcanvas-body">
            <EmployeeDetails
              employee={selected}
              currency={currency}
              onEdit={() => { setViewId(null); setEditId(selected.employeeId); }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
export { EmployeesPage };
