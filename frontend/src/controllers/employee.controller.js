import axios from "axios";
import { API } from "../config/config";

axios.defaults.withCredentials = true;

// LIST (server is tenant-scoped)
export async function getEmployeesList() {
  return axios.get(`${API}/employee/`);
}
// Back-compat alias (fixes imports like getEmployeeList)
export const getEmployeeList = getEmployeesList;

// READ ONE
export async function getEmployeeById(employeeId) {
  return axios.get(`${API}/employee/${employeeId}`);
}

// CREATE (Add Employee)
export async function addEmployees(payload) {
  return axios.post(`${API}/employee/add`, payload);
}

// UPDATE
export async function updateEmployees(employeeId, payload) {
  return axios.put(`${API}/employee/${employeeId}`, payload);
}

// DELETE
export async function deleteEmployee(employeeId) {
  return axios.delete(`${API}/employee/${employeeId}`);
}

// UPDATE IMAGE (kept for compatibility)
export async function updateEmployeeImage(employeeId, employeeProfilePicture) {
  return axios.post(`${API}/employee/${employeeId}/update-image`, { employeeProfilePicture });
}

// FEEDBACK: add
export async function addEmployeeFeedback(
  employeeName, review, rating, service, punctuality, customerFeedback, managerBehaviour, reviewResult = ""
) {
  const payload = {
    employeeName,
    review,
    rating,
    service,
    reviewResult,
    punctuality,
    customerFeedback,
    managerBehaviour
  };
  return axios.post(`${API}/employee/feedback`, payload);
}

// FEEDBACK: list by employeeId
export async function getEmployeeFeedback(employeeId) {
  return axios.get(`${API}/employee/${employeeId}/feedback`);
}
