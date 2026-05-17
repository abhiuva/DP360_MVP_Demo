const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { CONFIG } = require("./src/config");
const { getTenantIdFromQRCode } = require("./src/services/settings.service");

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: [
      "http://localhost:5173",
      "http://localhost:3001"
    ],
    methods: ["GET", "POST"]
  }
});

const cors = require('cors');
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3001"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on('authenticate', async (tenantId) => {
    socket.join(tenantId);
  });

  socket.on("new_order_backend", (payload, tenantId) => {
    socket.to(tenantId).emit("new_order", payload);
  });

  socket.on("new_qrorder_backend", async (payload, qrcode) => {
    try {
      const tenantId = await getTenantIdFromQRCode(qrcode);
      socket.to(tenantId).emit("new_qrorder", payload);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("order_update_backend", (payload, tenantId) => {
    console.log(payload);
    socket.to(tenantId).emit("order_update", payload);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Backend started on http://localhost:${PORT}`);
});
