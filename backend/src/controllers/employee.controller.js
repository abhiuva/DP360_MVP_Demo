const {
  addEmployeeDB,
  getEmployeesListDB,
  getEmployeeByIdDB,
  getEmployeesMailOrPhoneDB,
  deleteEmployeesListDB,
  updateEmployeesListDB,
  updateProfilePictureDB,
  addEmployeeFeedbackDB,
  getFeedbackListByEmployeeNameDB
} = require("../services/employee.service");

// CREATE
exports.addEmployees = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.tenantId;

    const {
      employeeName, employeeDepartment, employeeDesignation, employeeShift,
      employeeJoiningDate, employeeEmail, employeePhone,
      employeePresentAddress, employeePermanentAddress, employeeEmergencyContact,
      employeeNIDNumber, employeeGender,

      // CHANGED: use emergency_contact_name instead of religion in the form
      emergencyContactName,

      // schema still has these; we don't use them in UI, allow null safely
      employeeMartialStatus = null,

      employeeDOB, employeeSalaryType, employeeSalary, employeeStatus,
      employeeAccountHolderName, employeeAccountNumber, employeeBankName,
      employeeBankIdentifierCode, employeeBranchLocation, employeeTaxPayerId
    } = req.body;

    // per-tenant uniqueness
    const dup = await getEmployeesMailOrPhoneDB(employeeEmail, employeePhone, tenantId);
    if (dup.length) {
      return res.status(400).json({ success: false, message: "The email or phone number is already in use." });
    }

    const newId = await addEmployeeDB(
      employeeName, employeeDepartment, employeeDesignation, employeeShift,
      employeeJoiningDate, employeeEmail, employeePhone,
      employeePresentAddress, employeePermanentAddress, employeeEmergencyContact,
      employeeNIDNumber, employeeGender, emergencyContactName, employeeMartialStatus,
      employeeDOB, employeeSalaryType, employeeSalary, employeeStatus,
      employeeAccountHolderName, employeeAccountNumber, employeeBankName,
      employeeBankIdentifierCode, employeeBranchLocation, employeeTaxPayerId,
      tenantId
    );

    return res.status(201).json({ success: true, employeeId: newId });
  } catch (error) {
    console.error("addEmployees error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong! Please try again." });
  }
};

// LIST (tenant-scoped)
exports.getEmployeesList = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.tenantId;
    const rows = await getEmployeesListDB(tenantId);
    return res.status(200).json({ success: true, employees: rows });
  } catch (error) {
    console.error("getEmployeesList error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong! Please try again." });
  }
};

// READ ONE (tenant-scoped)
exports.getEmployeeById = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.tenantId;
    const { employeeId } = req.params;
    const row = await getEmployeeByIdDB(employeeId, tenantId);
    if (!row) return res.status(404).json({ success: false, message: "Employee not found" });
    return res.status(200).json({ success: true, employee: row });
  } catch (error) {
    console.error("getEmployeeById error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong! Please try again." });
  }
};

// UPDATE (tenant-scoped)
exports.updateEmployeesList = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.tenantId;
    const { employeeId } = req.params;

    const {
      employeeName, employeeDepartment, employeeDesignation, employeeShift,
      employeeJoiningDate, employeeEmail, employeePhone,
      employeePresentAddress, employeePermanentAddress, employeeEmergencyContact,
      employeeNIDNumber, employeeGender,
      emergencyContactName, // CHANGED
      employeeMartialStatus = null,
      employeeDOB, employeeSalaryType, employeeSalary, employeeStatus,
      employeeAccountHolderName, employeeAccountNumber, employeeBankName,
      employeeBankIdentifierCode, employeeBranchLocation, employeeTaxPayerId
    } = req.body;

    await updateEmployeesListDB(
      employeeId,
      employeeName, employeeDepartment, employeeDesignation, employeeShift,
      employeeJoiningDate, employeeEmail, employeePhone,
      employeePresentAddress, employeePermanentAddress, employeeEmergencyContact,
      employeeNIDNumber, employeeGender, emergencyContactName, employeeMartialStatus,
      employeeDOB, employeeSalaryType, employeeSalary, employeeStatus,
      employeeAccountHolderName, employeeAccountNumber, employeeBankName,
      employeeBankIdentifierCode, employeeBranchLocation, employeeTaxPayerId,
      tenantId
    );

    return res.status(200).json({ success: true, message: "Employee updated" });
  } catch (error) {
    console.error("updateEmployeesList error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong! Please try again." });
  }
};

// DELETE (tenant-scoped)
exports.deleteEmployeesList = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.tenantId;
    const { employeeId } = req.params;
    await deleteEmployeesListDB(employeeId, tenantId);
    return res.status(200).json({ success: true, message: "Employee deleted" });
  } catch (error) {
    console.error("deleteEmployeesList error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong! Please try again." });
  }
};

// IMAGE (kept for backwards-compat; Add/Edit forms no longer upload)
exports.updateProfilePicture = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.tenantId;
    const { employeeId } = req.params;
    const { employeeProfilePicture } = req.body;
    await updateProfilePictureDB(employeeId, employeeProfilePicture, tenantId);
    return res.status(200).json({ success: true, message: "Profile picture updated" });
  } catch (error) {
    console.error("updateProfilePicture error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong! Please try again." });
  }
};

// FEEDBACK ADD (tenant-scoped)
exports.addEmployeeFeedback = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.tenantId;
    const {
      employeeName, review, rating, service,
      reviewResult, punctuality, customerFeedback, managerBehaviour
    } = req.body;

    if ([employeeName, review, rating, service, punctuality, customerFeedback, managerBehaviour]
      .some(v => v === undefined || v === null || v === "")) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    await addEmployeeFeedbackDB({
      employee_name: employeeName,
      review,
      rating: Number(rating),
      service: Number(service),
      review_result: reviewResult ?? null,
      punchuality: Number(punctuality), // DB spelling
      customer_feedback_on_staff: Number(customerFeedback),
      manager_behaviour_feedback_on_employee: Number(managerBehaviour),
      tenantId
    });

    return res.status(200).json({ success: true, message: "Feedback saved" });
  } catch (error) {
    console.error("addEmployeeFeedback error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong! Please try again." });
  }
};

// FEEDBACK LIST BY EMPLOYEE (tenant-scoped)
// Note: employee_feedback table has no employeeId; we match by employeeName.
exports.getFeedbackByEmployeeId = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.tenantId;
    const { employeeId } = req.params;
    const emp = await getEmployeeByIdDB(employeeId, tenantId);
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });

    const feedback = await getFeedbackListByEmployeeNameDB(emp.employeeName, tenantId);
    return res.status(200).json({ success: true, feedback });
  } catch (error) {
    console.error("getFeedbackByEmployeeId error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong! Please try again." });
  }
};
