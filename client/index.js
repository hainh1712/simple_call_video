const express = require("express");
const http = require("http");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userPairings = {};

function findNewPartner(userId) {
  for (let potentialPartnerId in userPairings) {
    if (!userPairings[potentialPartnerId] && potentialPartnerId !== userId) {
      userPairings[userId] = potentialPartnerId;
      userPairings[potentialPartnerId] = userId;
      return potentialPartnerId;
    }
  }
  return null;
}

function findAndRemoveCurrentPartner(userId) {
  const partnerId = userPairings[userId];
  if (partnerId) {
    delete userPairings[userId];
    delete userPairings[partnerId];
  }
  return partnerId;
}

io.on("connection", (socket) => {
  // New user joins the room
  socket.on("join room", () => {
    userPairings[socket.id] = null;
    const partnerId = findNewPartner(socket.id);
    if (partnerId) {
      socket.to(partnerId).emit("new partner", { partnerId: socket.id });
    }
  });

  // Handle user requesting the next partner
  socket.on("next user", () => {
    const oldPartner = findAndRemoveCurrentPartner(socket.id);
    if (oldPartner) {
      io.to(oldPartner).emit("partner left");
    }
    const newPartner = findNewPartner(socket.id);
    if (newPartner) {
      io.to(socket.id).emit("new partner", { partnerId: newPartner });
      io.to(newPartner).emit("new partner", { partnerId: socket.id });
    }
  });

  // Handle user leaving the room
  socket.on("leave room", () => {
    const partnerId = findAndRemoveCurrentPartner(socket.id);
    if (partnerId) {
      io.to(partnerId).emit("partner left");
    }
  });

  // User disconnects from the server
  socket.on("disconnect", () => {
    const partnerId = findAndRemoveCurrentPartner(socket.id);
    if (partnerId) {
      io.to(partnerId).emit("partner left");
    }
  });

  // User is calling another user
  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: socket.id,
    });
  });

  // User answers a call
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(5000, () => console.log("server is running on port 5000"));
