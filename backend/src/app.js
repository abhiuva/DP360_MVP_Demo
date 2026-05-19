require("dotenv").config({});

const express = require("express");
const morgan = require("morgan");
const {rateLimit} = require("express-rate-limit");
const cors = require("cors");
// const path = require("path")
// const rfs = require("rotating-file-stream");
const cookieParser = require("cookie-parser");
const userAgent = require('express-useragent');
const { CONFIG } = require("./config");
const fileUpload = require("express-fileupload")
const path = require("path")

// routes import
const authRoutes = require("./routes/auth.routes");
const settingsRoutes = require("./routes/settings.routes");
const customerRoutes = require("./routes/customer.routes");
const reservationRoutes = require("./routes/reservation.routes");
const userRoutes = require("./routes/user.routes");
const menuItemRoutes = require("./routes/menu_item.routes");
const posRoutes = require("./routes/pos.routes");
const kitchenRoutes = require("./routes/kitchen.routes")
const ordersRoutes = require("./routes/orders.routes")
const invoiceRoutes = require("./routes/invoice.routes")
const dashboardRoutes = require("./routes/dashboard.routes")
const reportsRoutes = require("./routes/reports.routes")
const qrMenuRoutes = require("./routes/qrmenu.routes")
const superAdminRoutes = require("./routes/superadmin.routes")
const inventoryRoutes = require("./routes/inventory.routes")
const feedbackRoutes = require("./routes/feedback.routes")
const employeeRoutes = require("./routes/employee.routes")
const paymentsRoutes = require("./routes/payments.routes")
const salesRoutes = require("./routes/sales.routes");
const ceoRoutes = require("./routes/ceo.routes");
const terminalRoutes = require("./routes/terminal.routes");
const clientCompatRoutes = require("./routes/client_compat.routes");
const { allowedOrigins, corsOptions } = require("./config/cors");


// routes import


const app = express();

/**
 * Middlewares
 * */ 
// create write stream for logs
// const accessLogStream = rfs.createStream("access.log", {
//   interval: '1d',
//   path: path.join(__dirname, '../log')
// })

// const limiter = rateLimit({
//   max: 1000,
//   windowMs: 60000,
//   legacyHeaders: false,
//   standardHeaders: true,
//   message: "You exceeded limits! hold on",
// });


console.log("[CORS allowedOrigins]", allowedOrigins);
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // needed for secure cookies behind App Service proxy
}

app.use(cookieParser());
app.use(userAgent.express());
app.use('/api/v1/auth/stripe-webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
// app.use(morgan("combined", {stream: accessLogStream}));
app.use(fileUpload({
  preserveExtension: true,
  safeFileNames: true,
  useTempFiles: true,
  tempFileDir: path.join(__dirname, "../tmp")
}))
app.use("/public", express.static(path.join(__dirname, "../public")))
app.use("/profile", express.static(path.join(__dirname, "../profile")))

app.use(morgan("tiny"));
// app.use(limiter);
/**
 * Middlewares
 * */ 


// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/reservations", reservationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/menu-items", menuItemRoutes);
app.use("/api/v1/inventory-items", inventoryRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/pos", posRoutes);
app.use("/api/v1/kitchen", kitchenRoutes);
app.use("/api/v1/orders", ordersRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/reports", reportsRoutes);
app.use("/api/v1/qrmenu", qrMenuRoutes);
app.use("/api/v1/superadmin", superAdminRoutes);
app.use("/api/v1/employee", employeeRoutes);
app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/v1/terminal", terminalRoutes);
app.use("/api/v1/reports/sales", salesRoutes);
app.use("/api/v1/ceo", ceoRoutes);
app.use("/api/ceo", require("./routes/ceo.routes"));
app.use("/api", clientCompatRoutes);


// routes

app.get("/", (req, res)=>{
  res.send("DP360 Backend Running");
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const isCorsError = /CORS/i.test(err.message || "");

  console.error("[Express error]", {
    status,
    method: req.method,
    path: req.originalUrl,
    origin: req.headers.origin,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });

  res.status(isCorsError ? 403 : status).json({
    success: false,
    message: isCorsError ? err.message : "Internal server error",
  });
});


module.exports = app;
