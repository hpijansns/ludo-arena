"use strict";

let onlineGameState = null;

/* =========================
   RECEIVE GAME STATE
========================= */

function setOnlineGameState(state) {
    if (!state) return;

    onlineGameState = state;
    window.multiplayerState = state;

    updateOnlineGameUI();
}


/* =========================
   UPDATE GAME UI
========================= */

function updateOnlineGameUI() {

    if (!onlineGameState) return;

    const diceValue =
        document.getElementById("diceValue");

    const turnPlayer =
        document.getElementById("turnPlayer");

    const gameStatus =
        document.getElementById("gameStatus");

    if (diceValue) {
        diceValue.textContent =
            onlineGameState.lastDice || "—";
    }

    if (gameStatus) {
        gameStatus.textContent =
            onlineGameState.status || "waiting";
    }

    const currentPlayer =
        (onlineGameState.players || []).find(
            player =>
                player.id ===
                onlineGameState.currentPlayerId
        );

    if (turnPlayer) {
        turnPlayer.textContent =
            currentPlayer
                ? currentPlayer.name
                : "—";
    }

    updateRollButton();
}


/* =========================
   ROLL BUTTON
========================= */

function updateRollButton() {

    const button =
        document.getElementById(
            "rollDiceBtn"
        );

    if (!button) return;

    const myId =
        typeof currentPlayerId !== "undefined"
            ? currentPlayerId
            : null;

    const isMyTurn =
        onlineGameState &&
        onlineGameState.status === "playing" &&
        onlineGameState.currentPlayerId === myId;

    button.disabled = !isMyTurn;

    if (isMyTurn) {
        button.textContent =
            "🎲 Roll Dice";
    } else {
        button.textContent =
            "⏳ Opponent's Turn";
    }
}


/* =========================
   TOKEN CONTROLS
========================= */

function renderOnlineTokens() {

    const container =
        document.getElementById(
            "multiplayerTokenControls"
        );

    if (!container) return;

    container.innerHTML = "";

    if (!onlineGameState) return;

    const myId =
        typeof currentPlayerId !== "undefined"
            ? currentPlayerId
            : null;

    const player =
        (onlineGameState.players || []).find(
            p => p.id === myId
        );

    if (!player) return;

    for (let i = 0; i < 4; i++) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "multiplayer-token-button";

        button.textContent =
            `Token ${i + 1}`;

        button.disabled =
            onlineGameState.currentPlayerId !== myId ||
            !onlineGameState.lastDice;

        button.addEventListener(
            "click",
            function () {
                moveOnlineToken(i);
            }
        );

        container.appendChild(button);
    }
}


/* =========================
   MOVE TOKEN
========================= */

function moveOnlineToken(tokenIndex) {

    if (!onlineGameState) return;

    const myId =
        typeof currentPlayerId !== "undefined"
            ? currentPlayerId
            : null;

    if (
        onlineGameState.currentPlayerId !==
        myId
    ) {
        showOnlineMessage(
            "⏳ It is not your turn."
        );

        return;
    }

    if (!onlineGameState.lastDice) {

        showOnlineMessage(
            "🎲 Roll the dice first."
        );

        return;
    }

    if (
        typeof multiplayerMoveToken ===
        "function"
    ) {
        multiplayerMoveToken(
            tokenIndex
        );
    }
}


/* =========================
   MESSAGE
========================= */

function showOnlineMessage(message) {

    const element =
        document.getElementById(
            "multiplayerMessage"
        );

    if (element) {
        element.textContent =
            message;
    }
}


/* =========================
   MULTIPLAYER CALLBACKS
========================= */

window.onMultiplayerGameStart =
    function (state) {

        setOnlineGameState(state);

        renderOnlineTokens();

        showOnlineMessage(
            "🎮 Game started!"
        );
    };


window.onMultiplayerDiceRolled =
    function (dice, state) {

        setOnlineGameState(state);

        renderOnlineTokens();

        showOnlineMessage(
            `🎲 Dice rolled: ${dice}`
        );
    };


window.onMultiplayerGameUpdate =
    function (state) {

        setOnlineGameState(state);

        renderOnlineTokens();

        showOnlineMessage(
            "✅ Move completed."
        );
    };


/* =========================
   PAGE LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderOnlineTokens();

        updateOnlineGameUI();

    }
);