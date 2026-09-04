/* =====================================================
   LUDO ARENA - WALLET.JS
   Virtual Points Wallet
   ===================================================== */

"use strict";


/* =====================================================
   STORAGE
   ===================================================== */

const WALLET_KEY = "ludoPoints";


/* =====================================================
   GET BALANCE
   ===================================================== */

function getWalletBalance() {

    return Number(
        localStorage.getItem(
            WALLET_KEY
        ) || 0
    );

}


/* =====================================================
   SAVE BALANCE
   ===================================================== */

function saveWalletBalance(
    amount
) {

    const balance =
        Math.max(
            0,
            Number(amount) || 0
        );


    localStorage.setItem(
        WALLET_KEY,
        String(balance)
    );


    return balance;

}


/* =====================================================
   ADD POINTS
   ===================================================== */

function addWalletPoints(
    amount
) {

    const value =
        Number(amount) || 0;


    if (
        value <= 0
    ) {

        return getWalletBalance();

    }


    return saveWalletBalance(
        getWalletBalance() + value
    );

}


/* =====================================================
   REMOVE POINTS
   ===================================================== */

function removeWalletPoints(
    amount
) {

    const value =
        Number(amount) || 0;


    if (
        value <= 0
    ) {

        return getWalletBalance();

    }


    return saveWalletBalance(
        Math.max(
            0,
            getWalletBalance() - value
        )
    );

}


/* =====================================================
   UPDATE BALANCE UI
   ===================================================== */

function updateWalletUI() {

    const balance =
        getWalletBalance();


    const balanceElement =
        document.getElementById(
            "balance"
        );


    if (balanceElement) {

        balanceElement.textContent =
            balance;

    }


    const gamePoints =
        document.getElementById(
            "gamePoints"
        );


    if (gamePoints) {

        gamePoints.textContent =
            balance;

    }


    const winningPoints =
        document.getElementById(
            "winningPoints"
        );


    const storedWinningPoints =
        Number(
            localStorage.getItem(
                "ludoWinningPoints"
            ) || 0
        );


    if (winningPoints) {

        winningPoints.textContent =
            storedWinningPoints;

    }


    const totalPoints =
        document.getElementById(
            "totalPoints"
        );


    if (totalPoints) {

        totalPoints.textContent =
            balance;

    }

}


/* =====================================================
   ADD WINNING POINTS
   ===================================================== */

function addWinningPoints(
    amount
) {

    const value =
        Number(amount) || 0;


    if (
        value <= 0
    ) {

        return;

    }


    const current =
        Number(
            localStorage.getItem(
                "ludoWinningPoints"
            ) || 0
        );


    localStorage.setItem(
        "ludoWinningPoints",
        String(
            current + value
        )
    );


    addWalletPoints(
        value
    );


    updateWalletUI();

}


/* =====================================================
   RESET WALLET
   ===================================================== */

function resetWallet() {

    localStorage.setItem(
        WALLET_KEY,
        "0"
    );

    localStorage.setItem(
        "ludoWinningPoints",
        "0"
    );


    updateWalletUI();

}


/* =====================================================
   INITIALIZE
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateWalletUI();

    }
);