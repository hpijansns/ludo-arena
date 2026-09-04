"use strict";

/*
    Ludo Arena Multiplayer Client

    This file connects the browser to the Node.js
    + Socket.IO multiplayer server.
*/

let socket = null;
let currentRoomId = null;
let currentPlayerId = null;
let multiplayerState = null;

const SERVER_URL =
    window.LUDO_SERVER_URL ||
    "http://localhost:3000";


function getPlayerName() {
    return (
        localStorage.getItem("ludoName") ||
        "Guest"
    );
}


/* -------------------------------
   CONNECT TO SERVER
-------------------------------- */

function connectMultiplayer() {

    if (typeof io === "undefined") {
        console.error(
            "Socket.IO library is not loaded."
        );
        return;
    }

    if (socket && socket.connected) {
        return;
    }

    socket = io(SERVER_URL);

    socket.on("connect", () => {

        currentPlayerId = socket.id;

        console.log(
            "Connected to Ludo server:",
            socket.id
        );

        showMultiplayerMessage(
            "Connected to multiplayer server."
        );
    });


    socket.on("disconnect", () => {

        console.log(
            "Disconnected from server."
        );

        showMultiplayerMessage(
            "Disconnected from server."
        );
    });


    socket.on("roomCreated", data => {

        currentRoomId = data.roomId;
        currentPlayerId = data.playerId;

        multiplayerState = data;

        updateRoomUI(data);

        showMultiplayerMessage(
            `Room ${data.roomId} created.`
        );
    });


    socket.on("roomJoined", data => {

        currentRoomId = data.roomId;
        currentPlayerId = data.playerId;

        showMultiplayerMessage(
            `Joined room ${data.roomId}.`
        );
    });


    socket.on("roomUpdated", state => {

        multiplayerState = state;

        updateRoomUI(state);

        console.log(
            "Room updated:",
            state
        );
    });


    socket.on("gameStarted", state => {

        multiplayerState = state;

        updateRoomUI(state);

        showMultiplayerMessage(
            "Game started!"
        );

        if (
            typeof window.onMultiplayerGameStart ===
            "function"
        ) {
            window.onMultiplayerGameStart(state);
        }
    });


    socket.on("diceRolled", state => {

        multiplayerState = state;

        updateRoomUI(state);

        if (
            typeof window.onMultiplayerDiceRolled ===
            "function"
        ) {
            window.onMultiplayerDiceRolled(
                state.lastDice,
                state
            );
        }
    });


    socket.on("gameUpdated", state => {

        multiplayerState = state;

        updateRoomUI(state);

        if (
            typeof window.onMultiplayerGameUpdate ===
            "function"
        ) {
            window.onMultiplayerGameUpdate(state);
        }
    });


    socket.on("gameError", data => {

        showMultiplayerMessage(
            data.message || "Game error."
        );
    });


    socket.on("roomError", data => {

        showMultiplayerMessage(
            data.message || "Room error."
        );
    });
}


/* -------------------------------
   CREATE ROOM
-------------------------------- */

function createMultiplayerRoom(roomId = "") {

    if (!socket || !socket.connected) {
        connectMultiplayer();

        setTimeout(() => {
            createMultiplayerRoom(roomId);
        }, 500);

        return;
    }

    socket.emit("createRoom", {
        roomId:
            roomId.trim() || undefined,

        playerName:
            getPlayerName()
    });
}


/* -------------------------------
   JOIN ROOM
-------------------------------- */

function joinMultiplayerRoom(roomId) {

    if (!roomId) {
        showMultiplayerMessage(
            "Please enter a room ID."
        );
        return;
    }

    if (!socket || !socket.connected) {
        connectMultiplayer();

        setTimeout(() => {
            joinMultiplayerRoom(roomId);
        }, 500);

        return;
    }

    socket.emit("joinRoom", {

        roomId:
            String(roomId)
                .trim()
                .toUpperCase(),

        playerName:
            getPlayerName()
    });
}


/* -------------------------------
   START GAME
-------------------------------- */

function startMultiplayerGame() {

    if (!socket || !socket.connected) {
        showMultiplayerMessage(
            "Not connected to server."
        );
        return;
    }

    socket.emit("startGame");
}


/* -------------------------------
   ROLL DICE
-------------------------------- */

function multiplayerRollDice() {

    if (!socket || !socket.connected) {
        showMultiplayerMessage(
            "Not connected to server."
        );
        return;
    }

    socket.emit("rollDice");
}


/* -------------------------------
   MOVE TOKEN
-------------------------------- */

function multiplayerMoveToken(tokenIndex) {

    if (!socket || !socket.connected) {
        showMultiplayerMessage(
            "Not connected to server."
        );
        return;
    }

    socket.emit("moveToken", {
        tokenIndex:
            Number(tokenIndex)
    });
}


/* -------------------------------
   LEAVE ROOM
-------------------------------- */

function leaveMultiplayerRoom() {

    if (!socket || !socket.connected) {
        return;
    }

    socket.emit("leaveRoom");

    currentRoomId = null;
    multiplayerState = null;

    showMultiplayerMessage(
        "You left the room."
    );
}


/* -------------------------------
   ROOM UI
-------------------------------- */

function updateRoomUI(state) {

    if (!state) {
        return;
    }

    const roomIdElement =
        document.getElementById(
            "roomId"
        );

    const playerListElement =
        document.getElementById(
            "playerList"
        );

    const gameStatusElement =
        document.getElementById(
            "gameStatus"
        );

    if (roomIdElement) {
        roomIdElement.textContent =
            state.roomId || "—";
    }

    if (gameStatusElement) {
        gameStatusElement.textContent =
            state.status || "waiting";
    }

    if (playerListElement) {

        playerListElement.innerHTML = "";

        (state.players || [])
            .forEach(player => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "multiplayer-player";

                const name =
                    document.createElement(
                        "span"
                    );

                name.textContent =
                    player.name;

                const color =
                    document.createElement(
                        "small"
                    );

                color.textContent =
                    player.color;

                item.appendChild(name);
                item.appendChild(color);

                playerListElement.appendChild(
                    item
                );
            });
    }
}


/* -------------------------------
   MESSAGE
-------------------------------- */

function showMultiplayerMessage(message) {

    const messageElement =
        document.getElementById(
            "multiplayerMessage"
        );

    if (messageElement) {
        messageElement.textContent =
            message;
    }

    console.log(
        "[Ludo Multiplayer]",
        message
    );
}


/* -------------------------------
   AUTO CONNECT
-------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        connectMultiplayer();

    }
);