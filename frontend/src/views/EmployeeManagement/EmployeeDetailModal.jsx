import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../components/Modal";
import { getEmployeeById } from "../../controllers/employee.controller";
import EditEmployeeForm from "./EditEmployeeForm";
import useCurrency from "../../hooks/useCurrency";

const Chip = ({ children, tone = "secondary" }) => (
  <span className={`badge text-bg-${tone}`} style={{ borderRadius: "999px", padding: "0.35rem .6rem" }}>
    {children}
  </span>
);

const Field = ({ label, value }) => (
  <div className="col-md-6 mb-3">
    <div className="text-muted small">{label}</div>
    <div className="fw-semibold">{value ?? "-"}</div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-3">
    <div className="d-flex align-items-center gap-2 mb-2">
      <div style={{ width: 6, height: 18, borderRadius: 3, background: "#0d6efd" }} />
      <h6 className="m-0">{title}</h6>
    </div>
    <div className="border rounded-3 p-3">{children}</div>
  </div>
);

const formatDate = (d) => {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return d; // already formatted
    return dt.toLocaleDateString();
  } catch {
    return d;
  }
};

const EmployeeDetailModal = ({ employeeId, onClose, onUpdated }) => {
  const [emp, setEmp] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const currency = useCurrency();

  const load = async () => {
    try {
      const res = await getEmployeeById(employeeId);
      setEmp(res?.data?.employee || null);
    } catch (e) {
      console.error(e);
      setError("Unable to load employee details.");
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [employeeId]);

  const onSaved = () => {
    load();
    onUpdated?.();
    setEditing(false);
  };

  const salaryBlock = useMemo(() => {
    if (!emp) return "-";
    const base = `${currency}${emp.employeeSalary ?? "0"}.00`;
    return (
      <div className="d-flex flex-wrap align-items-center gap-2">
        <Chip tone="primary">{emp.employeeSalaryType || "N/A"}</Chip>
        <span className="fw-semibold">{base}</span>
        <span className="text-muted">· Net {base}</span>
      </div>
    );
  }, [emp, currency]);

  return (
    <Modal
      title={editing ? "Edit Employee" : "Employee Details"}
      onClose={onClose}
      size="md"
      height="normal"
      headerCompact
    >
      {!emp && !error && <div>Loading…</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {emp && !editing && (
        <>
          {/* header card */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-3">
              {/* avatar */}
              {emp.employeeProfilePicture ? (
                <img
                  src={emp.employeeProfilePicture}
                  alt="Avatar"
                  style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover", border: "1px solid #eee" }}
                  onError={(e)=>{e.currentTarget.style.display='none';}}
                />
              ) : (
                <div
                  style={{
                    width: 64, height: 64, borderRadius: 12,
                    background: "#f1f3f5", display: "grid", placeItems: "center",
                    border: "1px solid #eee", fontWeight: 700, color: "#6c757d"
                  }}
                >
                  {String(emp.employeeName || "?").slice(0,1).toUpperCase()}
                </div>
              )}

              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h5 className="m-0">{emp.employeeName}</h5>
                  <Chip>{emp.employeeDesignation || "No designation"}</Chip>
                  {emp.employeeStatus && <Chip tone="success">{emp.employeeStatus}</Chip>}
                </div>
                <div className="text-muted small">Employee #{emp.employeeId} · Tenant {emp.tenant_id}</div>
              </div>
            </div>

            <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit</button>
          </div>

          {/* sections */}
          <Section title="Contacts">
            <div className="row">
              <Field label="Email" value={emp.employeeEmail} />
              <Field label="Phone" value={emp.employeePhone} />
              <Field label="Present Address" value={emp.employeePresentAddress} />
              <Field label="Permanent Address" value={emp.employeePermanentAddress} />
              <Field label="Emergency Contact (Name)" value={emp.emergency_contact_name} />
              <Field label="Emergency Contact (Phone)" value={emp.employeeEmergencyContact} />
            </div>
          </Section>

          <Section title="Employment">
            <div className="row">
              <Field label="Department" value={emp.employeeDepartment} />
              <Field label="Shift" value={emp.employeeShift} />
              <Field label="Joining Date" value={formatDate(emp.employeeJoiningDate)} />
              <Field label="Leaving Date" value={formatDate(emp.employeeLeavingDate)} />
              <Field label="Gender" value={emp.employeeGender} />
              {/* Legacy read-only */}
              <Field label="Religion (legacy)" value={emp.employeeReligion} />
              <Field label="Marital Status (legacy)" value={emp.employeeMartialStatus} />
              <Field label="DOB" value={formatDate(emp.employeeDOB)} />
              <div className="col-12 mb-2">
                <div className="text-muted small">Salary</div>
                {salaryBlock}
              </div>
            </div>
          </Section>

          <Section title="Banking">
            <div className="row">
              <Field label="Account Holder Name" value={emp.employeeAccountHolderName} />
              <Field label="Account Number" value={emp.employeeAccountNumber} />
              <Field label="Bank Name" value={emp.employeeBankName} />
              <Field label="Bank Identifier Code" value={emp.employeeBankIdentifierCode} />
              <Field label="Branch Location" value={emp.employeeBranchLocation} />
              <Field label="Tax Payer ID" value={emp.employeeTaxPayerId} />
            </div>
          </Section>

          <Section title="Meta">
            <div className="row">
              <Field label="Updated At" value={formatDate(emp.updated_at)} />
              <Field label="Tenant ID" value={emp.tenant_id} />
            </div>
          </Section>

          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-outline-secondary" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit</button>
          </div>
        </>
      )}

      {emp && editing && (
        <EditEmployeeForm employeeId={employeeId} onSaved={onSaved} />
      )}
    </Modal>
  );
};

export default EmployeeDetailModal;
export { EmployeeDetailModal };
