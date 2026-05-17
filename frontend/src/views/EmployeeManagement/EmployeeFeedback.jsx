import React, { useEffect, useState } from "react";
import { getEmployeesList, addEmployeeFeedback, getEmployeeFeedback } from "../../controllers/employee.controller";

const EmployeeFeedback = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selected, setSelected] = useState(null);

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [service, setService] = useState(0);
  const [punctuality, setPunctuality] = useState(0);
  const [customerFeedback, setCustomerFeedback] = useState(0);
  const [managerBehaviour, setManagerBehaviour] = useState(0);
  const [reviewResult, setReviewResult] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getEmployeesList();
        setEmployees(res?.data?.employees || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const loadFeedback = async (empId) => {
    if (!empId) return setList([]);
    try {
      const res = await getEmployeeFeedback(empId);
      setList(res?.data?.feedback || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const emp = employees.find(e => String(e.employeeId) === String(selectedId));
    setSelected(emp || null);
    loadFeedback(emp?.employeeId);
  }, [selectedId, employees]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return setError("Select an employee first");
    setSaving(true);
    setError("");
    try {
      const res = await addEmployeeFeedback(
        selected.employeeName, review, rating, service, punctuality, customerFeedback, managerBehaviour, reviewResult
      );
      if (res?.data?.success) {
        setReview(""); setRating(0); setService(0); setPunctuality(0);
        setCustomerFeedback(0); setManagerBehaviour(0); setReviewResult("");
        loadFeedback(selected.employeeId);
      } else setError(res?.data?.message || "Unable to save feedback");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Unable to save feedback");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid">
      <h3 className="mb-3">Employee Feedback</h3>

      <div className="card mb-3 p-3">
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label">Select Employee</label>
            <select className="form-select" value={selectedId} onChange={(e)=>setSelectedId(e.target.value)}>
              <option value="">-- choose --</option>
              {employees.map(e => (
                <option key={e.employeeId} value={e.employeeId}>{e.employeeName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <form onSubmit={onSubmit} className="card p-3">
            <h5 className="mb-2">Add Feedback {selected ? `for ${selected.employeeName}` : ""}</h5>
            <div className="mb-2">
              <label className="form-label">Review</label>
              <textarea className="form-control" rows={3} value={review} onChange={e=>setReview(e.target.value)} required />
            </div>

            <div className="row g-2">
              <div className="col-4">
                <label className="form-label">Rating</label>
                <input className="form-control" type="number" min="0" max="5" value={rating} onChange={e=>setRating(Number(e.target.value))} />
              </div>
              <div className="col-4">
                <label className="form-label">Service</label>
                <input className="form-control" type="number" min="0" max="5" value={service} onChange={e=>setService(Number(e.target.value))} />
              </div>
              <div className="col-4">
                <label className="form-label">Punctuality</label>
                <input className="form-control" type="number" min="0" max="5" value={punctuality} onChange={e=>setPunctuality(Number(e.target.value))} />
              </div>
              <div className="col-6">
                <label className="form-label">Customer feedback</label>
                <input className="form-control" type="number" min="0" max="5" value={customerFeedback} onChange={e=>setCustomerFeedback(Number(e.target.value))} />
              </div>
              <div className="col-6">
                <label className="form-label">Manager behaviour</label>
                <input className="form-control" type="number" min="0" max="5" value={managerBehaviour} onChange={e=>setManagerBehaviour(Number(e.target.value))} />
              </div>
              <div className="col-12">
                <label className="form-label">Review Result (optional)</label>
                <input className="form-control" value={reviewResult} onChange={e=>setReviewResult(e.target.value)} />
              </div>
            </div>

            {error && <div className="alert alert-danger mt-2">{error}</div>}
            <div className="mt-2">
              <button className="btn btn-primary" disabled={saving || !selected}>
                {saving ? "Saving..." : "Save Feedback"}
              </button>
            </div>
          </form>
        </div>

        <div className="col-md-6">
          <div className="card p-3">
            <h5 className="mb-2">Feedback List</h5>
            {list.length === 0 ? (
              <div className="text-muted">No feedback yet.</div>
            ) : (
              <div className="list-group">
                {list.map(f => (
                  <div key={f.id} className="list-group-item">
                    <div className="d-flex justify-content-between">
                      <strong>Rating: {f.rating} | Service: {f.service} | Punctuality: {f.punchuality}</strong>
                      {f.review_result && <span className="badge bg-info">{f.review_result}</span>}
                    </div>
                    <div className="small text-muted">
                      Customer: {f.customer_feedback_on_staff}, Manager: {f.manager_behaviour_feedback_on_employee}
                    </div>
                    <div className="mt-1">{f.review}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFeedback;
export { EmployeeFeedback };
