const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { getTenantIdFromQRCode } = require("./src/services/settings.service");
const { socketCorsOptions, allowedOrigins } = require("./src/config/cors");

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: socketCorsOptions,
});

console.log("[Socket.IO CORS allowedOrigins]", allowedOrigins);

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
  console.log(`Backend started on port ${PORT}`);
});
