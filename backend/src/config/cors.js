const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://dp360-mvp.netlify.app",
];

const splitCSV = (value = "") =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([
    ...DEFAULT_ALLOWED_ORIGINS,
    ...splitCSV(process.env.FRONTEND_DOMAIN),
    ...splitCSV(process.env.CLIENT_URL),
    ...splitCSV(process.env.CORS_ALLOWED_ORIGINS),
  ])
);

const isOriginAllowed = (origin) => !origin || allowedOrigins.includes(origin);

const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "tenant-id",
    "x-tenant-id",
    "X-Tenant-Id",
    "X-Requested-With",
  ],
};

const socketCorsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true,
};

module.exports = {
  allowedOrigins,
  corsOptions,
  socketCorsOptions,
};
