const { getMySqlPromiseConnection } = require("../config/mysql.db");

// CREATE
exports.addEmployeeDB = async (
  employeeName, employeeDepartment, employeeDesignation, employeeShift,
  employeeJoiningDate, employeeEmail, employeePhone,
  employeePresentAddress, employeePermanentAddress, employeeEmergencyContact,
  employeeNIDNumber, employeeGender, emergencyContactName, employeeMartialStatus,
  employeeDOB, employeeSalaryType, employeeSalary, employeeStatus,
  employeeAccountHolderName, employeeAccountNumber, employeeBankName,
  employeeBankIdentifierCode, employeeBranchLocation, employeeTaxPayerId,
  tenantId
) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const sql = `
      INSERT INTO employee (
        employeeName, employeeDepartment, employeeDesignation, employeeShift,
        employeeJoiningDate, employeeEmail, employeePhone,
        employeePresentAddress, employeePermanentAddress, employeeEmergencyContact,
        employeeNIDNumber, employeeGender, emergency_contact_name, employeeMartialStatus,
        employeeDOB, employeeSalaryType, employeeSalary, employeeStatus,
        employeeAccountHolderName, employeeAccountNumber, employeeBankName,
        employeeBankIdentifierCode, employeeBranchLocation, employeeTaxPayerId,
        tenant_id, updated_at
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, NOW())
    `;
    const [result] = await conn.query(sql, [
      employeeName, employeeDepartment, employeeDesignation, employeeShift,
      employeeJoiningDate, employeeEmail, employeePhone,
      employeePresentAddress, employeePermanentAddress, employeeEmergencyContact,
      employeeNIDNumber, employeeGender, emergencyContactName, employeeMartialStatus,
      employeeDOB, employeeSalaryType, employeeSalary, employeeStatus,
      employeeAccountHolderName, employeeAccountNumber, employeeBankName,
      employeeBankIdentifierCode, employeeBranchLocation, employeeTaxPayerId,
      tenantId
    ]);
    return result.insertId;
  } finally { conn.release(); }
};

// LIST by tenant
exports.getEmployeesListDB = async (tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const [rows] = await conn.query(
      `SELECT *
       FROM employee
       WHERE tenant_id = ?
       ORDER BY employeeId DESC`,
      [tenantId]
    );
    return rows;
  } finally { conn.release(); }
};

// READ ONE by tenant
exports.getEmployeeByIdDB = async (employeeId, tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const [rows] = await conn.query(
      `SELECT *
       FROM employee
       WHERE employeeId = ? AND tenant_id = ?
       LIMIT 1`,
      [employeeId, tenantId]
    );
    return rows[0] || null;
  } finally { conn.release(); }
};

// Uniqueness check per tenant
exports.getEmployeesMailOrPhoneDB = async (email, phone, tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const [rows] = await conn.query(
      `SELECT employeeId
       FROM employee
       WHERE tenant_id = ?
         AND (employeeEmail = ? OR employeePhone = ?)
       LIMIT 1`,
      [tenantId, email, phone]
    );
    return rows;
  } finally { conn.release(); }
};

// UPDATE scoped
exports.updateEmployeesListDB = async (
  employeeId,
  employeeName, employeeDepartment, employeeDesignation, employeeShift,
  employeeJoiningDate, employeeEmail, employeePhone,
  employeePresentAddress, employeePermanentAddress, employeeEmergencyContact,
  employeeNIDNumber, employeeGender, emergencyContactName, employeeMartialStatus,
  employeeDOB, employeeSalaryType, employeeSalary, employeeStatus,
  employeeAccountHolderName, employeeAccountNumber, employeeBankName,
  employeeBankIdentifierCode, employeeBranchLocation, employeeTaxPayerId,
  tenantId
) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const sql = `
      UPDATE employee
      SET
        employeeName=?, employeeDepartment=?, employeeDesignation=?, employeeShift=?,
        employeeJoiningDate=?, employeeEmail=?, employeePhone=?,
        employeePresentAddress=?, employeePermanentAddress=?, employeeEmergencyContact=?,
        employeeNIDNumber=?, employeeGender=?, emergency_contact_name=?, employeeMartialStatus=?,
        employeeDOB=?, employeeSalaryType=?, employeeSalary=?, employeeStatus=?,
        employeeAccountHolderName=?, employeeAccountNumber=?, employeeBankName=?,
        employeeBankIdentifierCode=?, employeeBranchLocation=?, employeeTaxPayerId=?,
        updated_at = NOW()
      WHERE employeeId = ? AND tenant_id = ?
    `;
    await conn.query(sql, [
      employeeName, employeeDepartment, employeeDesignation, employeeShift,
      employeeJoiningDate, employeeEmail, employeePhone,
      employeePresentAddress, employeePermanentAddress, employeeEmergencyContact,
      employeeNIDNumber, employeeGender, emergencyContactName, employeeMartialStatus,
      employeeDOB, employeeSalaryType, employeeSalary, employeeStatus,
      employeeAccountHolderName, employeeAccountNumber, employeeBankName,
      employeeBankIdentifierCode, employeeBranchLocation, employeeTaxPayerId,
      employeeId, tenantId
    ]);
  } finally { conn.release(); }
};

// DELETE scoped
exports.deleteEmployeesListDB = async (employeeId, tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    await conn.query(
      `DELETE FROM employee WHERE employeeId = ? AND tenant_id = ?`,
      [employeeId, tenantId]
    );
  } finally { conn.release(); }
};

// IMAGE scoped (kept)
exports.updateProfilePictureDB = async (employeeId, employeeProfilePicture, tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    await conn.query(
      `UPDATE employee SET employeeProfilePicture=?, updated_at=NOW()
       WHERE employeeId=? AND tenant_id=?`,
      [employeeProfilePicture, employeeId, tenantId]
    );
  } finally { conn.release(); }
};

// FEEDBACK INSERT
exports.addEmployeeFeedbackDB = async (p) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const sql = `
      INSERT INTO employee_feedback
        (employee_name, review, rating, service, review_result, punchuality,
         customer_feedback_on_staff, manager_behaviour_feedback_on_employee, tenant_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await conn.query(sql, [
      p.employee_name,
      p.review,
      p.rating,
      p.service,
      p.review_result ?? null,
      p.punchuality,
      p.customer_feedback_on_staff,
      p.manager_behaviour_feedback_on_employee,
      p.tenantId
    ]);
  } finally { conn.release(); }
};

// FEEDBACK LIST (by employeeName within tenant)
exports.getFeedbackListByEmployeeNameDB = async (employeeName, tenantId) => {
  const conn = await getMySqlPromiseConnection();
  try {
    const [rows] = await conn.query(
      `SELECT *
       FROM employee_feedback
       WHERE employee_name = ? AND tenant_id = ?
       ORDER BY id DESC`,
      [employeeName, tenantId]
    );
    return rows;
  } finally { conn.release(); }
};