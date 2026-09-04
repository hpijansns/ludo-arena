/* =========================================
   LUDO ARENA - MULTIPLAYER BOARD
   ========================================= */

(function () {
    "use strict";

    class MultiplayerBoard {
        constructor(options = {}) {
            this.container =
                typeof options.container === "string"
                    ? document.querySelector(options.container)
                    : options.container;

            this.players = options.players || [];
            this.tokens = {};
            this.currentPlayer = null;
            this.onTokenClick =
                typeof options.onTokenClick === "function"
                    ? options.onTokenClick
                    : function () {};

            this.init();
        }

        init() {
            if (!this.container) return;

            this.container.classList.add("online-board");

            if (!this.container.dataset.boardReady) {
                this.createBoard();
                this.container.dataset.boardReady = "true";
            }
        }

        createBoard() {
            this.container.innerHTML = "";

            for (let row = 0; row < 15; row++) {
                for (let col = 0; col < 15; col++) {
                    const cell = document.createElement("div");

                    cell.className = "cell";
                    cell.dataset.row = row;
                    cell.dataset.col = col;

                    cell.style.left = `${col * 6.6667}%`;
                    cell.style.top = `${row * 6.6667}%`;

                    this.container.appendChild(cell);
                }
            }
        }

        setPlayers(players) {
            this.players = Array.isArray(players) ? players : [];
            this.renderTokens();
        }

        setCurrentPlayer(playerId) {
            this.currentPlayer = playerId;

            document
                .querySelectorAll(".online-token")
                .forEach(token => {
                    token.classList.toggle(
                        "movable",
                        token.dataset.playerId === String(playerId)
                    );
                });
        }

        clearTokens() {
            this.container
                ?.querySelectorAll(".online-token")
                .forEach(token => token.remove());

            this.tokens = {};
        }

        renderTokens() {
            if (!this.container) return;

            this.clearTokens();

            this.players.forEach(player => {
                const playerId = player.id || player.playerId;
                const color = player.color || "red";

                const playerTokens = player.tokens || [
                    { id: 0, position: "home" },
                    { id: 1, position: "home" },
                    { id: 2, position: "home" },
                    { id: 3, position: "home" }
                ];

                playerTokens.forEach(token => {
                    this.createToken(
                        playerId,
                        token,
                        color
                    );
                });
            });
        }

        createToken(playerId, token, color) {
            const element = document.createElement("div");

            element.className = "online-token";
            element.dataset.playerId = playerId;
            element.dataset.tokenId = token.id;

            element.style.background = this.getColor(color);

            const position = this.getPosition(
                color,
                token.position
            );

            element.style.left = `${position.x}%`;
            element.style.top = `${position.y}%`;

            element.addEventListener("click", () => {
                this.onTokenClick({
                    playerId,
                    tokenId: token.id,
                    position: token.position
                });
            });

            this.container.appendChild(element);

            this.tokens[`${playerId}-${token.id}`] = element;
        }

        moveToken(playerId, tokenId, position) {
            const token =
                this.tokens[`${playerId}-${tokenId}`];

            if (!token) return;

            const player = this.players.find(
                p => String(p.id || p.playerId) === String(playerId)
            );

            const color = player?.color || "red";

            const coords = this.getPosition(color, position);

            token.style.left = `${coords.x}%`;
            token.style.top = `${coords.y}%`;

            token.dataset.position = position;
        }

        getColor(color) {
            const colors = {
                red: "#e74c3c",
                green: "#00b894",
                yellow: "#f1c40f",
                blue: "#3498db"
            };

            return colors[color] || color || "#6c5ce7";
        }

        getPosition(color, position) {
            /*
             * Position can be:
             * home
             * number
             * safe
             * finished
             */

            if (
                position === "home" ||
                position === undefined ||
                position === null
            ) {
                return this.getHomePosition(color);
            }

            if (position === "finished") {
                return {
                    x: 47,
                    y: 47
                };
            }

            const numericPosition = Number(position);

            if (!Number.isNaN(numericPosition)) {
                return this.getPathPosition(
                    color,
                    numericPosition
                );
            }

            return {
                x: 47,
                y: 47
            };
        }

        getHomePosition(color) {
            const homes = {
                red: { x: 10, y: 10 },
                green: { x: 77, y: 10 },
                yellow: { x: 77, y: 77 },
                blue: { x: 10, y: 77 }
            };

            return homes[color] || {
                x: 47,
                y: 47
            };
        }

        getPathPosition(color, position) {
            /*
             * Visual fallback path.
             * Actual movement/state is controlled by the
             * game engine/server.
             */

            const path = [
                [47, 7],
                [47, 13],
                [47, 20],
                [47, 27],
                [53, 33],
                [60, 33],
                [67, 33],
                [73, 33],
                [80, 40],
                [80, 47],
                [80, 53],
                [80, 60],
                [73, 67],
                [67, 67],
                [60, 67],
                [53, 67],
                [47, 73],
                [47, 80],
                [47, 87],
                [40, 87],
                [33, 87],
                [27, 80],
                [27, 73],
                [27, 67],
                [33, 60],
                [33, 53],
                [20, 53],
                [13, 53],
                [7, 47],
                [13, 40],
                [20, 40],
                [27, 40],
                [33, 33],
                [40, 33],
                [47, 27]
            ];

            const index =
                Math.abs(Math.floor(position)) % path.length;

            return {
                x: path[index][0],
                y: path[index][1]
            };
        }

        destroy() {
            this.clearTokens();

            if (this.container) {
                this.container.innerHTML = "";
                delete this.container.dataset.boardReady;
            }
        }
    }

    window.MultiplayerBoard = MultiplayerBoard;
})();
