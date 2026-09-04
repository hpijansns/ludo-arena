/* =====================================================
   LUDO ARENA - APP.JS
   Common application helpers
   ===================================================== */

"use strict";


/* =====================================================
   USER HELPERS
   ===================================================== */

/**
 * Get currently saved player name.
 */
function getPlayerName() {

    return localStorage.getItem("ludoName") || "Guest";

}


/**
 * Save player name.
 */
function setPlayerName(name) {

    const cleanName = String(name || "Guest").trim();

    localStorage.setItem(
        "ludoName",
        cleanName || "Guest"
    );

}


/**
 * Logout player.
 */
function logoutPlayer() {

    localStorage.removeItem("ludoName");

    window.location.href = "index.html";

}


/* =====================================================
   GAME STATISTICS
   ===================================================== */

/**
 * Get number of games.
 */
function getGames() {

    return Number(
        localStorage.getItem("ludoGames") || 0
    );

}


/**
 * Get number of wins.
 */
function getWins() {

    return Number(
        localStorage.getItem("ludoWins") || 0
    );

}


/**
 * Get game points.
 */
function getPoints() {

    return Number(
        localStorage.getItem("ludoPoints") || 0
    );

}


/**
 * Increase games count.
 */
function addGame() {

    const games = getGames() + 1;

    localStorage.setItem(
        "ludoGames",
        games
    );

    return games;

}


/**
 * Add a win.
 */
function addWin() {

    const wins = getWins() + 1;

    localStorage.setItem(
        "ludoWins",
        wins
    );

    return wins;

}


/**
 * Add virtual points.
 */
function addPoints(amount) {

    const value = Number(amount) || 0;

    const points = getPoints() + value;

    localStorage.setItem(
        "ludoPoints",
        points
    );

    return points;

}


/* =====================================================
   DOM HELPERS
   ===================================================== */

/**
 * Short helper for document.getElementById().
 */
function $(id) {

    return document.getElementById(id);

}


/**
 * Safely change element text.
 */
function setText(id, text) {

    const element = $(id);

    if (!element) {
        return;
    }

    element.textContent = text;

}


/* =====================================================
   PAGE INITIALIZATION
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * Update common player name elements
         * when they exist on a page.
         */

        const nameElements =
            document.querySelectorAll(
                "[data-player-name]"
            );

        const playerName =
            getPlayerName();

        nameElements.forEach(
            function (element) {

                element.textContent =
                    playerName;

            }
        );

    }
);