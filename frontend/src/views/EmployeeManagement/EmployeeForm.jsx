import React, { useState } from "react";
import { addEmployees } from "../../controllers/employee.controller";

const Section = ({ title, children }) => (
  <div className="mb-3">
    <div className="d-flex align-items-center gap-2 mb-2">
      <div style={{ width: 6, height: 18, borderRadius: 3, background: "#0d6efd" }} />
      <h6 className="m-0">{title}</h6>
    </div>
    <div className="border rounded-3 p-3">{children}</div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="col-md-6">
    <label className="form-label">{label}</label>
    <input className="form-control" {...props} />
  </div>
);

const EmployeeForm = ({ onSaved }) => {
  // Core
  const [employeeName, setEmployeeName] = useState("");
  const [employeeDepartment, setEmployeeDepartment] = useState("");
  const [employeeDesignation, setEmployeeDesignation] = useState("");
  const [employeeShift, setEmployeeShift] = useState("");
  const [employeeJoiningDate, setEmployeeJoiningDate] = useState("");
  const [employeeDOB, setEmployeeDOB] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeePhone, setEmployeePhone] = useState("");
  const [employeePresentAddress, setEmployeePresentAddress] = useState("");
  const [employeePermanentAddress, setEmployeePermanentAddress] = useState("");
  const [employeeGender, setEmployeeGender] = useState("");
  const [employeeNIDNumber, setEmployeeNIDNumber] = useState("");

  // Emergency (religion removed → emergency_contact_name)
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [employeeEmergencyContact, setEmployeeEmergencyContact] = useState("");

  // Financials / Banking
  const [employeeSalaryType, setEmployeeSalaryType] = useState("");
  const [employeeSalary, setEmployeeSalary] = useState("");
  const [employeeStatus, setEmployeeStatus] = useState("");
  const [employeeAccountHolderName, setEmployeeAccountHolderName] = useState("");
  const [employeeAccountNumber, setEmployeeAccountNumber] = useState("");
  const [employeeBankName, setEmployeeBankName] = useState("");
  const [employeeBankIdentifierCode, setEmployeeBankIdentifierCode] = useState("");
  const [employeeBranchLocation, setEmployeeBranchLocation] = useState("");
  const [employeeTaxPayerId, setEmployeeTaxPayerId] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await addEmployees({
        employeeName, employeeDepartment, employeeDesignation, employeeShift,
        employeeJoiningDate, employeeEmail, employeePhone,
        employeePresentAddress, employeePermanentAddress, employeeEmergencyContact,
        employeeNIDNumber, employeeGender,
        emergencyContactName,
        employeeDOB, employeeSalaryType, employeeSalary, employeeStatus,
        employeeAccountHolderName, employeeAccountNumber, employeeBankName,
        employeeBankIdentifierCode, employeeBranchLocation, employeeTaxPayerId
      });
      if (res?.data?.success) onSaved?.();
      else setError(res?.data?.message || "Failed to save employee");
    } catch (err) {
      console.error("Save employee error:", err);
      setError(err?.response?.data?.message || "Failed to save employee");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {/* Core */}
      <Section title="Core">
        <div className="row g-2">
          <Input label="Name" value={employeeName} onChange={e=>setEmployeeName(e.target.value)} required />
          <Input label="Department" value={employeeDepartment} onChange={e=>setEmployeeDepartment(e.target.value)} />
          <Input label="Designation" value={employeeDesignation} onChange={e=>setEmployeeDesignation(e.target.value)} />
          <Input label="Shift" value={employeeShift} onChange={e=>setEmployeeShift(e.target.value)} />
          <Input label="Joining Date" type="date" value={employeeJoiningDate} onChange={e=>setEmployeeJoiningDate(e.target.value)} />
          <Input label="DOB" type="date" value={employeeDOB} onChange={e=>setEmployeeDOB(e.target.value)} />
          <Input label="Email" type="email" value={employeeEmail} onChange={e=>setEmployeeEmail(e.target.value)} required />
          <Input label="Phone" value={employeePhone} onChange={e=>setEmployeePhone(e.target.value)} required />
          <Input label="Present Address" value={employeePresentAddress} onChange={e=>setEmployeePresentAddress(e.target.value)} />
          <Input label="Permanent Address" value={employeePermanentAddress} onChange={e=>setEmployeePermanentAddress(e.target.value)} />
          <Input label="Gender" value={employeeGender} onChange={e=>setEmployeeGender(e.target.value)} />
          <Input label="NID Number" value={employeeNIDNumber} onChange={e=>setEmployeeNIDNumber(e.target.value)} />
        </div>
      </Section>

      {/* Emergency */}
      <Section title="Emergency">
        <div className="row g-2">
          <Input label="Emergency Contact (Name)" value={emergencyContactName} onChange={e=>setEmergencyContactName(e.target.value)} />
          <Input label="Emergency Contact (Phone)" value={employeeEmergencyContact} onChange={e=>setEmployeeEmergencyContact(e.target.value)} />
        </div>
      </Section>

      {/* Financials */}
      <Section title="Financials">
        <div className="row g-2">
          <Input label="Salary Type" value={employeeSalaryType} onChange={e=>setEmployeeSalaryType(e.target.value)} />
          <Input label="Salary" value={employeeSalary} onChange={e=>setEmployeeSalary(e.target.value)} />
          <Input label="Status" value={employeeStatus} onChange={e=>setEmployeeStatus(e.target.value)} />
          <Input label="Account Holder Name" value={employeeAccountHolderName} onChange={e=>setEmployeeAccountHolderName(e.target.value)} />
          <Input label="Account Number" value={employeeAccountNumber} onChange={e=>setEmployeeAccountNumber(e.target.value)} />
          <Input label="Bank Name" value={employeeBankName} onChange={e=>setEmployeeBankName(e.target.value)} />
          <Input label="Bank Identifier Code" value={employeeBankIdentifierCode} onChange={e=>setEmployeeBankIdentifierCode(e.target.value)} />
          <Input label="Branch Location" value={employeeBranchLocation} onChange={e=>setEmployeeBranchLocation(e.target.value)} />
          <div className="col-md-12">
            <label className="form-label">Tax Payer ID</label>
            <input className="form-control" value={employeeTaxPayerId} onChange={e=>setEmployeeTaxPayerId(e.target.value)} />
          </div>
        </div>
      </Section>

      {error && <div className="alert alert-danger mt-2">{error}</div>}

      <div className="mt-2 d-flex justify-content-end gap-2">
        <button className="btn btn-outline-secondary" type="button" onClick={() => onSaved?.()}>
          Close
        </button>
        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
export { EmployeeForm };
