"use strict";

class PlayerManager {
    constructor() {
        this.players = new Map();
    }

    addPlayer(id, name, roomId) {
        const player = {
            id,
            name: this.cleanName(name),
            roomId,
            color: null,
            position: 0,
            tokens: [0, 0, 0, 0]
        };

        this.players.set(id, player);

        return player;
    }

    getPlayer(id) {
        return this.players.get(id) || null;
    }

    removePlayer(id) {
        this.players.delete(id);
    }

    getPlayers() {
        return Array.from(this.players.values());
    }

    getPlayersInRoom(roomId) {
        return this.getPlayers().filter(
            player => player.roomId === roomId
        );
    }

    cleanName(name) {
        if (!name) {
            return "Player";
        }

        return String(name)
            .replace(/[<>]/g, "")
            .trim()
            .substring(0, 20) || "Player";
    }
}

module.exports = PlayerManager;