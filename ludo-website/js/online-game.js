/* =========================================
   LUDO ARENA - ONLINE GAME
   ========================================= */

(function () {
    "use strict";

    class OnlineGame {
        constructor(options = {}) {
            this.socket = options.socket || null;

            this.roomId = options.roomId || null;
            this.playerId = options.playerId || null;

            this.players = [];
            this.gameState = null;
            this.currentTurn = null;
            this.lastDice = null;

            this.board = null;

            this.elements = {
                board: document.querySelector(
                    options.boardSelector || "#online-board"
                ),
                dice: document.querySelector(
                    options.diceSelector || "#online-dice"
                ),
                rollButton: document.querySelector(
                    options.rollButtonSelector || "#roll-dice"
                ),
                players: document.querySelector(
                    options.playersSelector || "#online-player-list"
                ),
                log: document.querySelector(
                    options.logSelector || "#game-log"
                ),
                chatForm: document.querySelector(
                    options.chatFormSelector || "#online-chat-form"
                ),
                chatInput: document.querySelector(
                    options.chatInputSelector || "#chat-message"
                ),
                chatMessages: document.querySelector(
                    options.chatMessagesSelector ||
                        "#online-chat-messages"
                ),
                turn: document.querySelector(
                    options.turnSelector || "#online-turn"
                )
            };

            this.bindEvents();

            if (this.elements.board &&
                window.MultiplayerBoard) {
                this.board = new window.MultiplayerBoard({
                    container: this.elements.board,
                    players: [],
                    onTokenClick: data =>
                        this.selectToken(data)
                });
            }

            this.setupSocket();
            this.updateUI();
        }

        bindEvents() {
            if (this.elements.rollButton) {
                this.elements.rollButton.addEventListener(
                    "click",
                    () => this.rollDice()
                );
            }

            if (this.elements.chatForm) {
                this.elements.chatForm.addEventListener(
                    "submit",
                    event => {
                        event.preventDefault();
                        this.sendChat();
                    }
                );
            }
        }

        setupSocket() {
            if (!this.socket) {
                if (
                    typeof window.io === "function" &&
                    window.location.protocol !== "file:"
                ) {
                    try {
                        this.socket = window.io();
                    } catch (error) {
                        console.warn(
                            "Socket connection failed:",
                            error
                        );
                    }
                }
            }

            if (!this.socket) return;

            this.socket.on(
                "connect",
                () => {
                    this.addLog("Connected to server.");

                    if (this.roomId) {
                        this.joinRoom();
                    }

                    this.updateConnectionStatus(true);
                }
            );

            this.socket.on(
                "disconnect",
                () => {
                    this.addLog("Disconnected from server.");
                    this.updateConnectionStatus(false);
                }
            );

            this.socket.on(
                "gameState",
                state => {
                    this.applyGameState(state);
                }
            );

            this.socket.on(
                "players",
                players => {
                    this.players = players || [];
                    this.renderPlayers();

                    if (this.board) {
                        this.board.setPlayers(this.players);
                    }
                }
            );

            this.socket.on(
                "diceRolled",
                data => {
                    this.lastDice = data.value;
                    this.showDice(data.value);

                    if (data.playerName) {
                        this.addLog(
                            `${data.playerName} rolled ${data.value}.`
                        );
                    }
                }
            );

            this.socket.on(
                "turnChanged",
                data => {
                    this.currentTurn =
                        data.playerId;

                    this.updateTurn();
                }
            );

            this.socket.on(
                "tokenMoved",
                data => {
                    if (this.board) {
                        this.board.moveToken(
                            data.playerId,
                            data.tokenId,
                            data.position
                        );
                    }

                    if (data.playerName) {
                        this.addLog(
                            `${data.playerName} moved a token.`
                        );
                    }
                }
            );

            this.socket.on(
                "chat",
                message => {
                    this.addChatMessage(
                        message.name || "Player",
                        message.text || ""
                    );
                }
            );

            this.socket.on(
                "gameOver",
                data => {
                    this.showWinner(
                        data.playerName ||
                            data.winnerName ||
                            "Winner"
                    );
                }
            );

            this.socket.on(
                "error",
                error => {
                    this.showNotification(
                        error.message ||
                            "Something went wrong."
                    );
                }
            );
        }

        joinRoom() {
            if (!this.socket || !this.roomId) return;

            this.socket.emit("joinRoom", {
                roomId: this.roomId,
                playerId: this.playerId
            });
        }

        rollDice() {
            if (!this.socket) {
                this.showNotification(
                    "Server connection is not available."
                );
                return;
            }

            if (!this.isMyTurn()) {
                this.showNotification(
                    "It's not your turn."
                );
                return;
            }

            this.socket.emit("rollDice", {
                roomId: this.roomId,
                playerId: this.playerId
            });

            this.setRollButton(false);
        }

        selectToken(data) {
            if (!this.socket) return;

            if (!this.isMyTurn()) {
                this.showNotification(
                    "It's not your turn."
                );
                return;
            }

            if (!this.lastDice) {
                this.showNotification(
                    "Roll the dice first."
                );
                return;
            }

            this.socket.emit("moveToken", {
                roomId: this.roomId,
                playerId: this.playerId,
                tokenId: data.tokenId,
                dice: this.lastDice
            });

            this.lastDice = null;
        }

        sendChat() {
            if (!this.elements.chatInput) return;

            const text =
                this.elements.chatInput.value.trim();

            if (!text) return;

            if (this.socket) {
                this.socket.emit("chat", {
                    roomId: this.roomId,
                    playerId: this.playerId,
                    text
                });
            } else {
                this.addChatMessage("You", text);
            }

            this.elements.chatInput.value = "";
        }

        applyGameState(state) {
            if (!state) return;

            this.gameState = state;

            this.players =
                state.players ||
                this.players ||
                [];

            this.currentTurn =
                state.currentTurn ||
                state.currentPlayer ||
                null;

            this.renderPlayers();
            this.updateTurn();

            if (this.board) {
                this.board.setPlayers(this.players);
                this.board.setCurrentPlayer(
                    this.currentTurn
                );
            }

            if (state.dice) {
                this.lastDice = state.dice;
                this.showDice(state.dice);
            }

            this.updateUI();
        }

        isMyTurn() {
            if (!this.currentTurn) return false;

            return (
                String(this.currentTurn) ===
                String(this.playerId)
            );
        }

        renderPlayers() {
            if (!this.elements.players) return;

            this.elements.players.innerHTML = "";

            this.players.forEach((player, index) => {
                const id =
                    player.id ||
                    player.playerId ||
                    index;

                const name =
                    player.name ||
                    player.username ||
                    `Player ${index + 1}`;

                const color =
                    player.color ||
                    "red";

                const item =
                    document.createElement("div");

                item.className =
                    "online-player-item";

                if (
                    String(id) ===
                    String(this.currentTurn)
                ) {
                    item.classList.add("active");
                }

                const avatar =
                    document.createElement("div");

                avatar.className =
                    "online-player-avatar";

                avatar.textContent =
                    name.charAt(0).toUpperCase();

                avatar.style.background =
                    this.getPlayerColor(color);

                const details =
                    document.createElement("div");

                details.className =
                    "online-player-details";

                const nameElement =
                    document.createElement("div");

                nameElement.className =
                    "online-player-name";

                nameElement.textContent =
                    name;

                const score =
                    document.createElement("div");

                score.className =
                    "online-player-score";

                score.textContent =
                    player.score !== undefined
                        ? `Score: ${player.score}`
                        : "Ready";

                details.appendChild(nameElement);
                details.appendChild(score);

                item.appendChild(avatar);
                item.appendChild(details);

                this.elements.players.appendChild(item);
            });
        }

        updateTurn() {
            if (!this.elements.turn) return;

            if (this.isMyTurn()) {
                this.elements.turn.textContent =
                    "🎲 Your Turn";

                this.elements.turn.classList.add(
                    "your-turn"
                );

                this.setRollButton(true);
            } else {
                const player =
                    this.players.find(
                        p =>
                            String(
                                p.id ||
                                p.playerId
                            ) ===
                            String(this.currentTurn)
                    );

                this.elements.turn.textContent =
                    player
                        ? `${player.name || "Player"}'s Turn`
                        : "Waiting for turn";

                this.elements.turn.classList.remove(
                    "your-turn"
                );

                this.setRollButton(false);
            }

            if (this.board) {
                this.board.setCurrentPlayer(
                    this.currentTurn
                );
            }
        }

        setRollButton(enabled) {
            if (!this.elements.rollButton) return;

            this.elements.rollButton.disabled =
                !enabled;
        }

        showDice(value) {
            if (!this.elements.dice) return;

            const faces = {
                1: "⚀",
                2: "⚁",
                3: "⚂",
                4: "⚃",
                5: "⚄",
                6: "⚅"
            };

            this.elements.dice.textContent =
                faces[value] || value;

            this.elements.dice.classList.add(
                "rolling"
            );

            setTimeout(() => {
                this.elements.dice?.classList.remove(
                    "rolling"
                );
            }, 500);
        }

        addLog(text) {
            if (!this.elements.log) return;

            const item =
                document.createElement("div");

            item.className =
                "game-log-item";

            item.textContent = text;

            this.elements.log.prepend(item);

            while (
                this.elements.log.children.length >
                50
            ) {
                this.elements.log.lastElementChild.remove();
            }
        }

        addChatMessage(name, text) {
            if (!this.elements.chatMessages) return;

            const message =
                document.createElement("div");

            message.className =
                "online-chat-message";

            const strong =
                document.createElement("strong");

            strong.textContent =
                `${name}:`;

            const p =
                document.createElement("p");

            p.textContent = text;

            message.appendChild(strong);
            message.appendChild(p);

            this.elements.chatMessages.appendChild(
                message
            );

            this.elements.chatMessages.scrollTop =
                this.elements.chatMessages.scrollHeight;
        }

        updateConnectionStatus(online) {
            const status =
                document.querySelector(
                    ".online-status"
                );

            if (!status) return;

            status.textContent =
                online
                    ? "Online"
                    : "Offline";

            status.dataset.online =
                online ? "true" : "false";
        }

        showNotification(message) {
            const notification =
                document.createElement("div");

            notification.className =
                "game-notification";

            notification.textContent =
                message;

            document.body.appendChild(
                notification
            );

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        showWinner(name) {
            const overlay =
                document.querySelector(
                    ".winner-overlay"
                );

            const winnerName =
                document.querySelector(
                    "#winner-name"
                );

            if (winnerName) {
                winnerName.textContent =
                    name;
            }

            if (overlay) {
                overlay.classList.add("active");
            } else {
                this.showNotification(
                    `🏆 ${name} won the game!`
                );
            }
        }

        getPlayerColor(color) {
            const colors = {
                red: "#e74c3c",
                green: "#00b894",
                yellow: "#f1c40f",
                blue: "#3498db"
            };

            return (
                colors[color] ||
                "#6c5ce7"
            );
        }

        updateUI() {
            this.renderPlayers();
            this.updateTurn();
        }
    }

    window.OnlineGame = OnlineGame;

    /*
     * Auto initialize when explicitly configured
     * using data-online-game on the body.
     */

    document.addEventListener(
        "DOMContentLoaded",
        () => {
            const page =
                document.querySelector(
                    "[data-online-game]"
                );

            if (!page) return;

            window.onlineGame =
                new OnlineGame({
                    roomId:
                        page.dataset.roomId ||
                        null,

                    playerId:
                        page.dataset.playerId ||
                        localStorage.getItem(
                            "playerId"
                        ) ||
                        null
                });
        }
    );
})();
