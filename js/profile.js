/* =====================================================
   LUDO ARENA - PROFILE.JS
   Player Profile & Statistics
   ===================================================== */

"use strict";


/* =====================================================
   GET STORAGE VALUE
   ===================================================== */

function getNumber(
    key
) {

    return Number(
        localStorage.getItem(key) || 0
    );

}


/* =====================================================
   GET PLAYER NAME
   ===================================================== */

function getProfileName() {

    return (
        localStorage.getItem(
            "ludoName"
        ) || "Guest"
    );

}


/* =====================================================
   UPDATE PROFILE
   ===================================================== */

function updateProfile() {

    const name =
        getProfileName();


    const games =
        getNumber(
            "ludoGames"
        );


    const wins =
        getNumber(
            "ludoWins"
        );


    const points =
        getNumber(
            "ludoPoints"
        );


    /* ---------- Name ---------- */

    const nameElement =
        document.getElementById(
            "profileName"
        );


    if (nameElement) {

        nameElement.textContent =
            name;

    }


    /* ---------- Games ---------- */

    const gamesElement =
        document.getElementById(
            "games"
        );


    if (gamesElement) {

        gamesElement.textContent =
            games;

    }


    /* ---------- Wins ---------- */

    const winsElement =
        document.getElementById(
            "wins"
        );


    if (winsElement) {

        winsElement.textContent =
            wins;

    }


    /* ---------- Points ---------- */

    const pointsElement =
        document.getElementById(
            "points"
        );


    if (pointsElement) {

        pointsElement.textContent =
            points;

    }

}


/* =====================================================
   LOGOUT
   ===================================================== */

function logout() {

    localStorage.removeItem(
        "ludoName"
    );

    localStorage.removeItem(
        "ludoLoggedIn"
    );


    window.location.href =
        "index.html";

}


/* =====================================================
   LOGOUT BUTTON
   ===================================================== */

const logoutButton =
    document.getElementById(
        "logoutBtn"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            const confirmed =
                window.confirm(
                    "Are you sure you want to logout?"
                );


            if (confirmed) {

                logout();

            }

        }
    );

}


/* =====================================================
   AUTO UPDATE
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateProfile();

    }
);