"use strict";

class GameRoom {
    constructor(roomId) {
        this.roomId = roomId;
        this.players = [];
        this.status = "waiting";
        this.currentPlayerIndex = 0;
        this.lastDice = null;
    }

    addPlayer(player) {
        if (this.players.length >= 4) {
            return false;
        }

        player.color = this.getNextColor();
        player.position = 0;
        player.tokens = [0, 0, 0, 0];

        this.players.push(player);

        return true;
    }

    removePlayer(socketId) {
        this.players = this.players.filter(
            player => player.id !== socketId
        );

        if (this.players.length === 0) {
            this.status = "waiting";
        }

        if (
            this.currentPlayerIndex >= this.players.length
        ) {
            this.currentPlayerIndex = 0;
        }
    }

    getNextColor() {
        const colors = [
            "red",
            "green",
            "yellow",
            "blue"
        ];

        const usedColors = this.players.map(
            player => player.color
        );

        return (
            colors.find(
                color => !usedColors.includes(color)
            ) || "red"
        );
    }

    startGame() {
        if (this.players.length < 2) {
            return false;
        }

        this.status = "playing";
        this.currentPlayerIndex = 0;
        this.lastDice = null;

        this.players.forEach(player => {
            player.position = 0;
            player.tokens = [0, 0, 0, 0];
        });

        return true;
    }

    getCurrentPlayer() {
        return this.players[
            this.currentPlayerIndex
        ];
    }

    rollDice(socketId) {

        const currentPlayer =
            this.getCurrentPlayer();

        if (!currentPlayer) {
            return {
                success: false,
                message: "No active player."
            };
        }

        if (currentPlayer.id !== socketId) {
            return {
                success: false,
                message: "It is not your turn."
            };
        }

        const dice =
            Math.floor(Math.random() * 6) + 1;

        this.lastDice = dice;

        return {
            success: true,
            state: this.getPublicState()
        };
    }

    moveToken(socketId, data) {

        const currentPlayer =
            this.getCurrentPlayer();

        if (!currentPlayer) {
            return {
                success: false,
                message: "No active player."
            };
        }

        if (currentPlayer.id !== socketId) {
            return {
                success: false,
                message: "It is not your turn."
            };
        }

        if (!this.lastDice) {
            return {
                success: false,
                message: "Roll the dice first."
            };
        }

        const tokenIndex =
            Number(
                data && data.tokenIndex
            );

        if (
            !Number.isInteger(tokenIndex) ||
            tokenIndex < 0 ||
            tokenIndex > 3
        ) {
            return {
                success: false,
                message: "Invalid token."
            };
        }

        const dice = this.lastDice;

        currentPlayer.tokens[tokenIndex] += dice;

        if (
            currentPlayer.tokens[tokenIndex] > 57
        ) {
            currentPlayer.tokens[tokenIndex] = 57;
        }

        this.lastDice = null;

        this.nextTurn();

        return {
            success: true,
            state: this.getPublicState()
        };
    }

    nextTurn() {

        if (this.players.length === 0) {
            return;
        }

        this.currentPlayerIndex =
            (this.currentPlayerIndex + 1) %
            this.players.length;
    }

    getPublicPlayers() {

        return this.players.map(player => ({
            id: player.id,
            name: player.name,
            color: player.color,
            tokens: [...player.tokens]
        }));
    }

    getPublicState() {

        const currentPlayer =
            this.getCurrentPlayer();

        return {
            roomId: this.roomId,
            status: this.status,
            players: this.getPublicPlayers(),
            currentPlayerId:
                currentPlayer
                    ? currentPlayer.id
                    : null,
            lastDice: this.lastDice
        };
    }
}

module.exports = GameRoom;