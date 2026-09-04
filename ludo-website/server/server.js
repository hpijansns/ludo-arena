"use strict";

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const GameRoom = require("./game-room");
const PlayerManager = require("./player-manager");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const playerManager = new PlayerManager();
const rooms = new Map();

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Ludo Arena Multiplayer Server is running"
    });
});

app.get("/api/rooms", (req, res) => {
    const roomList = [];

    rooms.forEach((room, roomId) => {
        roomList.push({
            roomId,
            players: room.players.length,
            maxPlayers: 4,
            status: room.status
        });
    });

    res.json(roomList);
});

function createRoom(roomId) {
    const room = new GameRoom(roomId);
    rooms.set(roomId, room);
    return room;
}

io.on("connection", socket => {

    console.log(`Player connected: ${socket.id}`);

    socket.on("createRoom", data => {

        const roomId =
            data && data.roomId
                ? String(data.roomId)
                : Math.random()
                      .toString(36)
                      .substring(2, 8)
                      .toUpperCase();

        if (rooms.has(roomId)) {
            socket.emit("roomError", {
                message: "Room already exists."
            });
            return;
        }

        const playerName =
            data && data.playerName
                ? String(data.playerName).substring(0, 20)
                : "Player";

        const room = createRoom(roomId);

        const player = playerManager.addPlayer(
            socket.id,
            playerName,
            roomId
        );

        room.addPlayer(player);

        socket.join(roomId);

        socket.emit("roomCreated", {
            roomId,
            playerId: socket.id,
            players: room.getPublicPlayers()
        });

        io.to(roomId).emit(
            "roomUpdated",
            room.getPublicState()
        );
    });

    socket.on("joinRoom", data => {

        if (!data || !data.roomId) {
            socket.emit("roomError", {
                message: "Room ID is required."
            });
            return;
        }

        const roomId = String(data.roomId).toUpperCase();
        const room = rooms.get(roomId);

        if (!room) {
            socket.emit("roomError", {
                message: "Room not found."
            });
            return;
        }

        if (room.players.length >= 4) {
            socket.emit("roomError", {
                message: "Room is full."
            });
            return;
        }

        if (room.status === "playing") {
            socket.emit("roomError", {
                message: "Game has already started."
            });
            return;
        }

        const playerName =
            data.playerName
                ? String(data.playerName).substring(0, 20)
                : "Player";

        const player = playerManager.addPlayer(
            socket.id,
            playerName,
            roomId
        );

        room.addPlayer(player);

        socket.join(roomId);

        socket.emit("roomJoined", {
            roomId,
            playerId: socket.id
        });

        io.to(roomId).emit(
            "roomUpdated",
            room.getPublicState()
        );
    });

    socket.on("startGame", () => {

        const player = playerManager.getPlayer(socket.id);

        if (!player) {
            return;
        }

        const room = rooms.get(player.roomId);

        if (!room) {
            return;
        }

        if (room.players.length < 2) {
            socket.emit("roomError", {
                message: "At least 2 players are required."
            });
            return;
        }

        room.startGame();

        io.to(room.roomId).emit(
            "gameStarted",
            room.getPublicState()
        );
    });

    socket.on("rollDice", () => {

        const player = playerManager.getPlayer(socket.id);

        if (!player) {
            return;
        }

        const room = rooms.get(player.roomId);

        if (!room || room.status !== "playing") {
            return;
        }

        const result = room.rollDice(socket.id);

        if (!result.success) {
            socket.emit("gameError", {
                message: result.message
            });
            return;
        }

        io.to(room.roomId).emit(
            "diceRolled",
            result.state
        );
    });

    socket.on("moveToken", data => {

        const player = playerManager.getPlayer(socket.id);

        if (!player) {
            return;
        }

        const room = rooms.get(player.roomId);

        if (!room || room.status !== "playing") {
            return;
        }

        const result = room.moveToken(
            socket.id,
            data
        );

        if (!result.success) {
            socket.emit("gameError", {
                message: result.message
            });
            return;
        }

        io.to(room.roomId).emit(
            "gameUpdated",
            result.state
        );
    });

    socket.on("leaveRoom", () => {

        removePlayerFromRoom(socket.id);
    });

    socket.on("disconnect", () => {

        console.log(`Player disconnected: ${socket.id}`);

        removePlayerFromRoom(socket.id);
    });
});

function removePlayerFromRoom(socketId) {

    const player = playerManager.getPlayer(socketId);

    if (!player) {
        return;
    }

    const roomId = player.roomId;
    const room = rooms.get(roomId);

    playerManager.removePlayer(socketId);

    if (!room) {
        return;
    }

    room.removePlayer(socketId);

    io.to(roomId).emit(
        "roomUpdated",
        room.getPublicState()
    );

    if (room.players.length === 0) {
        rooms.delete(roomId);
        console.log(`Room ${roomId} deleted.`);
    }
}

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🎲 Ludo Arena server running on port ${PORT}`);
});