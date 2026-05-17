import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./helpers/PrivateRoute";
import LandingPage from "./views/LandingPage/LandingPage";
import LoginPage from "./views/LoginPage";
import DashboardLayout from "./views/DashboardLayout";
import DashboardPage from "./views/DashboardPage";
import POSPage from "./views/POSPage";
import OrdersPage from "./views/OrdersPage";
import KitchenPage from "./views/KitchenPage";
import ReservationPage from "./views/ReservationPage";
import CustomersPage from "./views/CustomersPage";
import InvoicesPage from "./views/InvoicesPage";
import UsersPage from "./views/UsersPage";
import ReportsPage from "./views/ReportsPage";
import SettingsPage from "./views/SettingsPage";
import SettingDetailsPage from "./views/SettingsViews/SettingDetailsPage";
import PrintSettingsPage from "./views/SettingsViews/PrintSettingsPage";
import TablesSettingsPage from "./views/SettingsViews/TableSettingsPage";
import MenuItemsSettingsPage from "./views/SettingsViews/MenuItemsSettingsPage";
import InventoryItemsSettingsPage from "./views/SettingsViews/InventoryItemsSettingsPage";
import TaxSetupPage from "./views/SettingsViews/TaxSetupPage";
import FeedbackFormPage from "./views/feedbackFormPage";
import PaymentTypesPage from "./views/SettingsViews/PaymentTypesPage";
import DevicesPage from "./views/SettingsViews/DevicesPage";
import ContactSupport from "./views/SettingsViews/ContactSupportPage";
import CategoriesPage from "./views/SettingsViews/CategoriesPage";
import MenuItemViewPage from "./views/SettingsViews/MenuItemViewPage";
import InventoryItemViewPage from "./views/SettingsViews/InventoryItemViewPage";
import { NavbarContext } from "./contexts/NavbarContext";
import { getIsNavbarCollapsed } from "./helpers/NavbarSettings";
import PrintReceiptPage from "./views/PrintReceiptPage";
import PrintTokenPage from "./views/PrintTokenPage";
import NoAccessPage from "./views/NoAccessPage";
import ProfilePage from "./views/ProfilePage";
import { SCOPES } from "./config/scopes";
import ScopeProtectedRoute from "./helpers/ScopeProtectedRoute";
import { SocketProvider } from "./contexts/SocketContext";
import RegistrationPage from "./views/RegistrationPage";
import ForgotPasswordPage from "./views/ForgotPasswordPage";
import InActiveSubscriptionPage from "./views/InActiveSubscriptionPage";
import PaymentSuccessPage from "./views/PaymentSuccessPage";
import PaymentCancelledPage from "./views/PaymentCancelledPage";
import ResetPasswordPage from "./views/ResetPasswordPage";
import QRMenuPage from "./views/QRMenuPage";
import SuperAdminProtectedRoute from "./helpers/SuperAdminProtectedRoute";
import SuperAdminLoginPage from "./views/SuperAdmin/LoginPage";
import SuperAdminDashboadLayout from "./views/SuperAdmin/SuperAdminDashboadLayout";
import SuperAdminDashboardPage from "./views/SuperAdmin/SuperAdminDashboardPage";
import SuperAdminContactSupportPage from "./views/SuperAdmin/SuperAdminContactSupportPage";
import SuperAdminTenantsPage from "./views/SuperAdmin/SuperAdminTenantsPage";
import SuperAdminReportsPage from "./views/SuperAdmin/SuperAdminReportsPage";
import SuperAdminTenantSubscriptionHistoryPage from "./views/SuperAdmin/SuperAdminTenantSubscriptionHistoryPage";
import CartPage from "./views/CartPage";
import OrderSuccessPage from "./views/OrderSuccessPage";
import OrderFailedPage from "./views/OrderFailedPage";
import PosSystemPage from "./views/PosSystemPage";
import ReportsViewPage from "./views/ReportViews/reportsViewPage";
import SalesDashboardReactPage from "./views/ReportViews/SalesDashboardPage"; // React Dashboard
import InventoryDashboardReactPage from "./views/ReportViews/InventoryDashboardReactPage";
import CEODashboardReactPage from "./views/ReportViews/CEODashboardReactPage";
import { EmployeeList } from "./views/EmployeeManagement/EmployeeList";
import { EmployeeForm } from "./views/EmployeeManagement/EmployeeForm";
import EditEmployeeForm from "/src/views/EmployeeManagement/EditEmployeeForm.jsx";
import { AttendanceReport } from "./views/CEODashboard/AttendanceReport";
import { ExpenseReport } from "./views/CEODashboard/ExpenseReport";
import { ItemSaleReport } from "./views/CEODashboard/ItemSaleReport";
import { PurchaseReport } from "./views/CEODashboard/PurchaseReport";
import { SaleDetailedReport } from "./views/CEODashboard/SaleDetailedReport";
import { SaleReport } from "./views/CEODashboard/SaleReport";
import { SaleSummaryReport } from "./views/CEODashboard/SaleSummaryReport";
import { CustomerDueReport } from "./views/CEODashboard/CustomerDueReport";
import { StockAlertReport } from "./views/CEODashboard/StockAlertReport";
import { SupplierDueReport } from "./views/CEODashboard/SupplierDueReport";
import { WorkPeriodReport } from "./views/CEODashboard/WorkPeriodReport";
import HRMPage from "./views/HRMPage";
import WelcomeDashboardPage from "./views/WelcomeDashboardPage";
import { EmployeeFeedback } from "./views/EmployeeManagement/EmployeeFeedback";
import { EmployeePerformance } from "./views/EmployeeManagement/EmployeePerformance";
//import { CustomerFeedback } from "./views/CEODashboard/CustomerFeedback";
import { CustomerFeedbackReport } from "./views/CustomerFeedbackReport";
import StripeSuccessPage from "./views/StripeSuccessPage";
import TerminalPaymentView from './views/TerminalPaymentView';


import EmployeesPage from "/src/views/EmployeeManagement/EmployeesPage.jsx";




import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
axios.defaults.withCredentials = true;

export default function App() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(
    getIsNavbarCollapsed()
  );

  return (
    <SocketProvider>
      <NavbarContext.Provider value={[isNavbarCollapsed, setIsNavbarCollapsed]}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/print-receipt" element={<PrintReceiptPage />} />
            <Route path="/print-token" element={<PrintTokenPage />} />
            <Route path="/no-access" element={<NoAccessPage />} />
            <Route path="/pos-system" element={<PosSystemPage />} />
            <Route path="/success" element={<PaymentSuccessPage />} />
            <Route path="/terminal-payment" element={<TerminalPaymentView />} />
            <Route
              path="/cancelled-payment"
              element={<PaymentCancelledPage />}
            />
            <Route
              path="/orders/stripe-success"
              element={<StripeSuccessPage />}
            />

            <Route
              path="/dashboard/inactive-subscription"
              element={<InActiveSubscriptionPage />}
            />

            <Route path="/m/:qrcode" element={<QRMenuPage />} />
            <Route path="/m/:qrcode/cart" element={<CartPage />} />
            <Route path="/m/order-success" element={<OrderSuccessPage />} />
            <Route path="/m/order-failed" element={<OrderFailedPage />} />

            {/* <Route path="/employee-list" element={<EmployeeList />} />
            <Route path="/employee-form" element={<EmployeeForm />} /> */}
            {/* <Route path="/edit-employee-form/:employeeId" element={<EditEmployeeForm />} /> */}

            {/* app routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route
                path=""
                element={
                  // <ScopeProtectedRoute scopes={[SCOPES.DASHBOARD]}>
                  <WelcomeDashboardPage />
                  // </ScopeProtectedRoute>
                }
              />
              <Route
                path="home"
                element={
                  // <ScopeProtectedRoute scopes={[SCOPES.DASHBOARD]}>
                  <DashboardPage />
                  // </ScopeProtectedRoute>
                }
              />
              <Route path="profile" element={<ProfilePage />} />

              <Route
                path="pos"
                element={
                  <ScopeProtectedRoute scopes={[SCOPES.POS]}>
                    <POSPage />
                  </ScopeProtectedRoute>
                }
              />
              <Route
                path="orders"
                element={
                  <ScopeProtectedRoute
                    scopes={[
                      SCOPES.POS,
                      SCOPES.ORDERS,
                      SCOPES.ORDER_STATUS,
                      SCOPES.ORDER_STATUS_DISPLAY,
                    ]}
                  >
                    <OrdersPage />
                  </ScopeProtectedRoute>
                }
              />
              <Route
                path="kitchen"
                element={
                  <ScopeProtectedRoute
                    scopes={[SCOPES.KITCHEN, SCOPES.KITCHEN_DISPLAY]}
                  >
                    <KitchenPage />
                  </ScopeProtectedRoute>
                }
              />
              <Route
                path="reservation"
                element={
                  <ScopeProtectedRoute
                    scopes={[
                      SCOPES.RESERVATIONS,
                      SCOPES.VIEW_RESERVATIONS,
                      SCOPES.MANAGE_RESERVATIONS,
                    ]}
                  >
                    <ReservationPage />
                  </ScopeProtectedRoute>
                }
              />
              <Route
                path="customers"
                element={
                  <ScopeProtectedRoute
                    scopes={[
                      SCOPES.CUSTOMERS,
                      SCOPES.VIEW_CUSTOMERS,
                      SCOPES.MANAGE_CUSTOMERS,
                    ]}
                  >
                    <CustomersPage />
                  </ScopeProtectedRoute>
                }
              />
              <Route
                path="invoices"
                element={
                  <ScopeProtectedRoute scopes={[SCOPES.INVOICES]}>
                    <InvoicesPage />
                  </ScopeProtectedRoute>
                }
              />
              <Route
                path="users"
                element={
                  <ScopeProtectedRoute scopes={[SCOPES.SETTINGS]}>
                    <UsersPage />
                  </ScopeProtectedRoute>
                }
              />
              <Route
                path="reports"
                element={
                  <ScopeProtectedRoute scopes={[SCOPES.REPORTS]}>
                    <ReportsPage />
                  </ScopeProtectedRoute>
                }
              >
                <Route path="" element={<SalesDashboardReactPage />} />
                {/*<Route path="reports" element={<ReportsViewPage />} />*/}
                <Route path="sales" element={<SalesDashboardReactPage />} />
                <Route path="inventory" element={<InventoryDashboardReactPage />} />
                <Route path="ceo" element={<CEODashboardReactPage />} />
                <Route
                  path="attendance-report"
                  element={<AttendanceReport />}
                />
                <Route
                  path="customer-due-report"
                  element={<CustomerDueReport />}
                />
                <Route path="expense-report" element={<ExpenseReport />} />
                <Route
                  path="sales/item-sale-report"
                  element={<ItemSaleReport />}
                />
                <Route path="purchase-report" element={<PurchaseReport />} />
                <Route
                  path="sales/sale-detailed-report"
                  element={<SaleDetailedReport />}
                />
                <Route path="sales/sale-report" element={<SaleReport />} />
                <Route
                  path="sales/sale-summary-report"
                  element={<SaleSummaryReport />}
                />
                <Route
                  path="stock-alert-report"
                  element={<StockAlertReport />}
                />
                <Route
                  path="supplier-due-report"
                  element={<SupplierDueReport />}
                />
                <Route
                  path="work-period-report"
                  element={<WorkPeriodReport />}
                />
                <Route
                  path="employee-performance"
                  element={<EmployeePerformance />}
                />
                <Route
                  path="customer-feedback"
                  element={<CustomerFeedbackReport />}
                />
                
              </Route>

              <Route path="devices" element={<DevicesPage />} />
              <Route path="contact-support" element={<ContactSupport />} />
              <Route path="HRM" element={<HRMPage />}>
                <Route path="" element={<EmployeeList />} />
                <Route path="employee-list" element={<EmployeeList />} />
                <Route
                  path="edit-employee-form/:employeeId"
                  element={<EditEmployeeForm />}
                />
                <Route path="employee-form" element={<EmployeeForm />} />
                <Route
                  path="employee-feedback"
                  element={<EmployeeFeedback />}
                />
                <Route path="employees" element={<EmployeesPage />} />
              </Route>

              <Route
                path="settings"
                element={
                  <ScopeProtectedRoute scopes={[SCOPES.SETTINGS]}>
                    <SettingsPage />
                  </ScopeProtectedRoute>
                }
              >
                <Route path="" element={<SettingDetailsPage />} />
                <Route path="details" element={<SettingDetailsPage />} />
                <Route path="print-settings" element={<PrintSettingsPage />} />
                <Route path="tables" element={<TablesSettingsPage />} />
                <Route path="menu-items" element={<MenuItemsSettingsPage />} />
                <Route path="menu-items/:id" element={<MenuItemViewPage />} />
                <Route
                  path="menu-items/categories"
                  element={<CategoriesPage />}
                />
                <Route
                  path="inventory-items"
                  element={<InventoryItemsSettingsPage />}
                />
                <Route
                  path="inventory-items/:id"
                  element={<InventoryItemViewPage />}
                />
                <Route
                  path="inventory-items/categories"
                  element={<CategoriesPage />}
                />
                <Route path="tax-setup" element={<TaxSetupPage />} />
                <Route path="payment-types" element={<PaymentTypesPage />} />
              </Route>
              <Route
                path="feedback"
                element={
                  <ScopeProtectedRoute scopes={[SCOPES.FEEDBACK]}>
                    <FeedbackFormPage />
                  </ScopeProtectedRoute>
                }
              />
            </Route>
            {/* app routes */}

            {/* superadmin routes */}
            <Route path="/superadmin" element={<SuperAdminLoginPage />} />
            <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />
            <Route
              path="/superadmin/dashboard"
              element={
                <PrivateRoute>
                  <SuperAdminDashboadLayout />
                </PrivateRoute>
              }
            >
              <Route
                path=""
                element={
                  <SuperAdminProtectedRoute>
                    <SuperAdminDashboardPage />
                  </SuperAdminProtectedRoute>
                }
              />
              <Route
                path="home"
                element={
                  <SuperAdminProtectedRoute>
                    <SuperAdminDashboardPage />
                  </SuperAdminProtectedRoute>
                }
              />
              <Route
                path="tenants"
                element={
                  <SuperAdminProtectedRoute>
                    <SuperAdminTenantsPage />
                  </SuperAdminProtectedRoute>
                }
              />
              <Route
                path="tenants/:id/subscription-history"
                element={
                  <SuperAdminProtectedRoute>
                    <SuperAdminTenantSubscriptionHistoryPage />
                  </SuperAdminProtectedRoute>
                }
              />
              <Route
                path="reports"
                element={
                  <SuperAdminProtectedRoute>
                    <SuperAdminReportsPage />
                  </SuperAdminProtectedRoute>
                }
              />
              <Route
                path="contact-support"
                element={
                  <SuperAdminProtectedRoute>
                    <SuperAdminContactSupportPage />
                  </SuperAdminProtectedRoute>
                }
              />
            </Route>
            {/* superadmin routes */}
          </Routes>
          <Toaster />
        </BrowserRouter>
      </NavbarContext.Provider>
    </SocketProvider>
  );
}
