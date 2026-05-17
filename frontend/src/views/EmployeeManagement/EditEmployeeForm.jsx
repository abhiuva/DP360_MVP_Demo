import React, { useEffect, useState } from "react";
import { getEmployeeList, getEmployeeById, updateEmployees } from "../../controllers/employee.controller";

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

const EditEmployeeForm = ({ employeeId, onSaved }) => {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await getEmployeeList(); // back-compat call used elsewhere
        const res = await getEmployeeById(employeeId);
        setForm(res?.data?.employee || {});
      } catch (err) {
        console.error("Load employee error:", err);
        setError("Unable to load employee");
      }
    })();
  }, [employeeId]);

  const onChange = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        employeeName: form.employeeName,
        employeeDepartment: form.employeeDepartment,
        employeeDesignation: form.employeeDesignation,
        employeeShift: form.employeeShift,
        employeeJoiningDate: form.employeeJoiningDate,
        employeeEmail: form.employeeEmail,
        employeePhone: form.employeePhone,
        employeePresentAddress: form.employeePresentAddress,
        employeePermanentAddress: form.employeePermanentAddress,
        employeeEmergencyContact: form.employeeEmergencyContact,
        employeeNIDNumber: form.employeeNIDNumber,
        employeeGender: form.employeeGender,
        emergencyContactName: form.emergency_contact_name || "",
        employeeDOB: form.employeeDOB,
        employeeSalaryType: form.employeeSalaryType,
        employeeSalary: form.employeeSalary,
        employeeStatus: form.employeeStatus,
        employeeAccountHolderName: form.employeeAccountHolderName,
        employeeAccountNumber: form.employeeAccountNumber,
        employeeBankName: form.employeeBankName,
        employeeBankIdentifierCode: form.employeeBankIdentifierCode,
        employeeBranchLocation: form.employeeBranchLocation,
        employeeTaxPayerId: form.employeeTaxPayerId
      };
      const res = await updateEmployees(employeeId, payload);
      if (res?.data?.success) onSaved?.();
      else setError(res?.data?.message || "Update failed");
    } catch (err) {
      console.error("Update employee error:", err);
      setError(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <form onSubmit={onSubmit}>
      {/* Core */}
      <Section title="Core">
        <div className="row g-2">
          <Input label="Name" value={form.employeeName || ""} onChange={onChange("employeeName")} />
          <Input label="Department" value={form.employeeDepartment || ""} onChange={onChange("employeeDepartment")} />
          <Input label="Designation" value={form.employeeDesignation || ""} onChange={onChange("employeeDesignation")} />
          <Input label="Shift" value={form.employeeShift || ""} onChange={onChange("employeeShift")} />
          <Input label="Joining Date" type="date" value={(form.employeeJoiningDate || "").substring(0,10)} onChange={onChange("employeeJoiningDate")} />
          <Input label="DOB" type="date" value={(form.employeeDOB || "").substring(0,10)} onChange={onChange("employeeDOB")} />
          <Input label="Email" type="email" value={form.employeeEmail || ""} onChange={onChange("employeeEmail")} />
          <Input label="Phone" value={form.employeePhone || ""} onChange={onChange("employeePhone")} />
          <Input label="Present Address" value={form.employeePresentAddress || ""} onChange={onChange("employeePresentAddress")} />
          <Input label="Permanent Address" value={form.employeePermanentAddress || ""} onChange={onChange("employeePermanentAddress")} />
          <Input label="Gender" value={form.employeeGender || ""} onChange={onChange("employeeGender")} />
          <Input label="NID Number" value={form.employeeNIDNumber || ""} onChange={onChange("employeeNIDNumber")} />
        </div>
      </Section>

      {/* Emergency */}
      <Section title="Emergency">
        <div className="row g-2">
          <Input label="Emergency Contact (Name)" value={form.emergency_contact_name || ""} onChange={onChange("emergency_contact_name")} />
          <Input label="Emergency Contact (Phone)" value={form.employeeEmergencyContact || ""} onChange={onChange("employeeEmergencyContact")} />
        </div>
      </Section>

      {/* Financials */}
      <Section title="Financials">
        <div className="row g-2">
          <Input label="Salary Type" value={form.employeeSalaryType || ""} onChange={onChange("employeeSalaryType")} />
          <Input label="Salary" value={form.employeeSalary || ""} onChange={onChange("employeeSalary")} />
          <Input label="Status" value={form.employeeStatus || ""} onChange={onChange("employeeStatus")} />
          <Input label="Account Holder Name" value={form.employeeAccountHolderName || ""} onChange={onChange("employeeAccountHolderName")} />
          <Input label="Account Number" value={form.employeeAccountNumber || ""} onChange={onChange("employeeAccountNumber")} />
          <Input label="Bank Name" value={form.employeeBankName || ""} onChange={onChange("employeeBankName")} />
          <Input label="Bank Identifier Code" value={form.employeeBankIdentifierCode || ""} onChange={onChange("employeeBankIdentifierCode")} />
          <Input label="Branch Location" value={form.employeeBranchLocation || ""} onChange={onChange("employeeBranchLocation")} />
          <div className="col-md-12">
            <label className="form-label">Tax Payer ID</label>
            <input className="form-control" value={form.employeeTaxPayerId || ""} onChange={onChange("employeeTaxPayerId")} />
          </div>
        </div>
      </Section>

      {error && <div className="alert alert-danger mt-2">{error}</div>}

      <div className="mt-2 d-flex justify-content-end gap-2">
        <button className="btn btn-outline-secondary" type="button" onClick={() => onSaved?.()}>
          Close
        </button>
        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditEmployeeForm;
export { EditEmployeeForm };
