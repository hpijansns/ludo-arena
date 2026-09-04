"use strict";

const MULTIPLAYER_BOARD_SIZE = 15;

const PLAYER_COLORS = {
    red: "🔴",
    green: "🟢",
    yellow: "🟡",
    blue: "🔵"
};

function getMultiplayerState() {
    return window.multiplayerState || null;
}

function findCurrentPlayer(state) {
    if (!state || !state.players) {
        return null;
    }

    return state.players.find(
        player => player.id === state.currentPlayerId
    ) || null;
}

function renderMultiplayerBoard(state) {

    if (!state || !state.players) {
        return;
    }

    const board = document.getElementById("ludoBoard");

    if (!board) {
        return;
    }

    /*
     * Existing board को disturb नहीं करते।
     * सिर्फ multiplayer token indicators update करते हैं।
     */

    let statusBox =
        document.getElementById("multiplayerBoardStatus");

    if (!statusBox) {

        statusBox =
            document.createElement("div");

        statusBox.id =
            "multiplayerBoardStatus";

        statusBox.className =
            "multiplayer-board-status";

        board.parentElement.appendChild(
            statusBox
        );
    }

    statusBox.innerHTML = "";

    state.players.forEach(player => {

        const playerBox =
            document.createElement("div");

        playerBox.className =
            "board-player-status";

        const icon =
            PLAYER_COLORS[player.color] || "⚪";

        const isTurn =
            player.id ===
            state.currentPlayerId;

        playerBox.textContent =
            `${icon} ${player.name}` +
            (isTurn ? " ← Turn" : "");

        statusBox.appendChild(
            playerBox
        );
    });
}

function canMoveMultiplayerToken(
    playerId,
    currentPlayerId
) {
    return (
        playerId &&
        currentPlayerId &&
        playerId === currentPlayerId
    );
}

function sendMultiplayerTokenMove(tokenIndex) {

    const state =
        getMultiplayerState();

    if (!state) {
        return;
    }

    const currentPlayer =
        findCurrentPlayer(state);

    if (!currentPlayer) {
        return;
    }

    if (
        !canMoveMultiplayerToken(
            currentPlayer.id,
            state.currentPlayerId
        )
    ) {
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

function createTokenButtons() {

    const container =
        document.getElementById(
            "multiplayerTokenControls"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.type = "button";

        button.className =
            "multiplayer-token-button";

        button.textContent =
            `Token ${i + 1}`;

        button.addEventListener(
            "click",
            () => {
                sendMultiplayerTokenMove(i);
            }
        );

        container.appendChild(
            button
        );
    }
}

window.onMultiplayerGameUpdate =
    function(state) {

        window.multiplayerState =
            state;

        renderMultiplayerBoard(
            state
        );

        updateMultiplayerTurn(
            state
        );
    };

window.onMultiplayerGameStart =
    function(state) {

        window.multiplayerState =
            state;

        renderMultiplayerBoard(
            state
        );

        updateMultiplayerTurn(
            state
        );

        createTokenButtons();
    };

function updateMultiplayerTurn(state) {

    const element =
        document.getElementById(
            "turnPlayer"
        );

    if (!element) {
        return;
    }

    const player =
        findCurrentPlayer(state);

    element.textContent =
        player
            ? player.name
            : "—";
};

document.addEventListener(
    "DOMContentLoaded",
    () => {

        createTokenButtons();

    }
);