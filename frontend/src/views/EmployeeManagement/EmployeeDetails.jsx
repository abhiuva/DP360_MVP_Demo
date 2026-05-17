import React, { useEffect, useState } from "react";
import { getEmployeeFeedback, addEmployeeFeedback } from "../../controllers/employee.controller";

const Field = ({ label, value }) => (
  <div className="mb-2">
    <div className="text-muted small">{label}</div>
    <div className="fw-semibold">{value || <span className="text-muted">—</span>}</div>
  </div>
);

const FeedbackList = ({ employeeId }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getEmployeeFeedback(employeeId);
      setRows(res?.data?.feedback || []);
    } catch (e) {
      console.error("feedback load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [employeeId]);

  if (loading) return <div>Loading feedback...</div>;
  return (
    <div className="list-group">
      {rows.length === 0 && <div className="text-muted">No feedback yet.</div>}
      {rows.map(f => (
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
  );
};

const FeedbackFormInline = ({ employee, onSaved }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [service, setService] = useState(0);
  const [punctuality, setPunctuality] = useState(0);
  const [customerFeedback, setCustomerFeedback] = useState(0);
  const [managerBehaviour, setManagerBehaviour] = useState(0);
  const [reviewResult, setReviewResult] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await addEmployeeFeedback(
        employee.employeeName, review, rating, service, punctuality,
        customerFeedback, managerBehaviour, reviewResult
      );
      if (res?.data?.success) {
        setReview(""); setRating(0); setService(0); setPunctuality(0);
        setCustomerFeedback(0); setManagerBehaviour(0); setReviewResult("");
        onSaved?.();
      } else {
        setError(res?.data?.message || "Unable to save feedback");
      }
    } catch (err) {
      console.error("Feedback save error:", err);
      setError(err?.response?.data?.message || "Unable to save feedback");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card p-3">
      <h6 className="mb-2">Add feedback for {employee.employeeName}</h6>
      <div className="row g-2">
        <div className="col-12">
          <label className="form-label">Review</label>
          <textarea className="form-control" rows={2} value={review} onChange={e=>setReview(e.target.value)} required />
        </div>
        <div className="col-4"><label className="form-label">Rating</label><input className="form-control" type="number" min="0" max="5" value={rating} onChange={e=>setRating(Number(e.target.value))} /></div>
        <div className="col-4"><label className="form-label">Service</label><input className="form-control" type="number" min="0" max="5" value={service} onChange={e=>setService(Number(e.target.value))} /></div>
        <div className="col-4"><label className="form-label">Punctuality</label><input className="form-control" type="number" min="0" max="5" value={punctuality} onChange={e=>setPunctuality(Number(e.target.value))} /></div>
        <div className="col-6"><label className="form-label">Customer feedback</label><input className="form-control" type="number" min="0" max="5" value={customerFeedback} onChange={e=>setCustomerFeedback(Number(e.target.value))} /></div>
        <div className="col-6"><label className="form-label">Manager behaviour</label><input className="form-control" type="number" min="0" max="5" value={managerBehaviour} onChange={e=>setManagerBehaviour(Number(e.target.value))} /></div>
        <div className="col-12"><label className="form-label">Review Result (optional)</label><input className="form-control" value={reviewResult} onChange={e=>setReviewResult(e.target.value)} /></div>
      </div>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
      <div className="mt-2">
        <button className="btn btn-primary btn-sm" disabled={saving}>{saving ? "Saving..." : "Save Feedback"}</button>
      </div>
    </form>
  );
};

const EmployeeDetails = ({ employee, onEdit, currency = "₹" }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{employee.employeeName}</h5>
        <button className="btn btn-outline-primary btn-sm" onClick={onEdit}>Edit</button>
      </div>

      <div className="row">
        <div className="col-md-6">
          <Field label="Department" value={employee.employeeDepartment} />
          <Field label="Designation" value={employee.employeeDesignation} />
          <Field label="Shift" value={employee.employeeShift} />
          <Field label="Joining Date" value={employee.employeeJoiningDate?.slice(0,10)} />
          <Field label="DOB" value={employee.employeeDOB?.slice(0,10)} />
          <Field label="Gender" value={employee.employeeGender} />
        </div>
        <div className="col-md-6">
          <Field label="Email" value={employee.employeeEmail} />
          <Field label="Phone" value={employee.employeePhone} />
          <Field label="Present Address" value={employee.employeePresentAddress} />
          <Field label="Permanent Address" value={employee.employeePermanentAddress} />
          <Field label="Emergency Contact (Phone)" value={employee.employeeEmergencyContact} />
          <Field label="Emergency Contact Name" value={employee.emergency_contact_name} />
        </div>
      </div>

      <hr />

      <div className="row">
        <div className="col-md-6">
          <h6>Banking & Status</h6>
          <Field label="Salary Type" value={employee.employeeSalaryType} />
          <Field label="Salary" value={`${currency}${employee.employeeSalary ?? ""}`} />
          <Field label="Status" value={employee.employeeStatus} />
          <Field label="Account Holder" value={employee.employeeAccountHolderName} />
          <Field label="Account Number" value={employee.employeeAccountNumber} />
          <Field label="Bank Name" value={employee.employeeBankName} />
          <Field label="Bank Identifier Code" value={employee.employeeBankIdentifierCode} />
          <Field label="Branch Location" value={employee.employeeBranchLocation} />
          <Field label="Tax Payer ID" value={employee.employeeTaxPayerId} />
        </div>

        {/* Dynamic Feedback Column */}
        <div className="col-md-6">
          <h6 className="mb-2">Feedback</h6>
          <FeedbackFormInline
            employee={employee}
            onSaved={() => setRefreshKey(k => k + 1)}
          />
          <div className="mt-3">
            <FeedbackList key={refreshKey} employeeId={employee.employeeId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
export { EmployeeDetails };
