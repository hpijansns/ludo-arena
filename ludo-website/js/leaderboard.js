"use strict";

function loadLeaderboardUsers() {
    try {
        return JSON.parse(localStorage.getItem("ludoUsers")) || [];
    } catch (error) {
        return [];
    }
}

function getCurrentPlayerName() {
    return localStorage.getItem("ludoName") || "Guest";
}

function getCurrentPlayerWins() {
    const currentName = getCurrentPlayerName();
    const users = loadLeaderboardUsers();

    const user = users.find(
        u =>
            u &&
            u.name &&
            u.name.toLowerCase() === currentName.toLowerCase()
    );

    if (user) {
        return Number(user.wins || 0);
    }

    return Number(localStorage.getItem("ludoWins") || 0);
}

function prepareUsers() {
    return loadLeaderboardUsers()
        .filter(user => user && user.name)
        .map(user => ({
            name: user.name,
            wins: Number(user.wins || 0),
            points: Number(user.points || 0)
        }))
        .sort((a, b) => {
            if (b.wins !== a.wins) {
                return b.wins - a.wins;
            }

            return b.points - a.points;
        });
}

function updateTopThree(users) {
    const topRanks = document.querySelectorAll(".top-three .rank");

    if (!topRanks.length) {
        return;
    }

    // HTML order: 2nd, 1st, 3rd
    const positions = [
        users[1],
        users[0],
        users[2]
    ];

    topRanks.forEach((rankElement, index) => {
        const user = positions[index];

        const nameElement = rankElement.querySelector("strong");
        const winsElement = rankElement.querySelector("span");

        if (user) {
            if (nameElement) {
                nameElement.textContent = user.name;
            }

            if (winsElement) {
                winsElement.textContent = `${user.wins} Wins`;
            }
        } else {
            if (nameElement) {
                nameElement.textContent = "—";
            }

            if (winsElement) {
                winsElement.textContent = "0 Wins";
            }
        }
    });
}

function updateRemainingPlayers(users) {
    const leaderboardList = document.getElementById("leaderboardList");

    if (!leaderboardList) {
        return;
    }

    leaderboardList.innerHTML = "";

    const remainingUsers = users.slice(3);

    if (remainingUsers.length === 0) {
        const emptyRow = document.createElement("div");
        emptyRow.className = "leader-row";

        emptyRow.innerHTML = `
            <span class="rank-number">—</span>
            <span class="player-name">No more players yet</span>
            <strong>—</strong>
        `;

        leaderboardList.appendChild(emptyRow);
        return;
    }

    remainingUsers.forEach((user, index) => {
        const row = document.createElement("div");
        row.className = "leader-row";

        const rank = document.createElement("span");
        rank.className = "rank-number";
        rank.textContent = `#${index + 4}`;

        const name = document.createElement("span");
        name.className = "player-name";
        name.textContent = user.name;

        const wins = document.createElement("strong");
        wins.textContent = `${user.wins} Wins`;

        row.appendChild(rank);
        row.appendChild(name);
        row.appendChild(wins);

        leaderboardList.appendChild(row);
    });
}

function updateCurrentPlayer() {
    const currentPlayer = document.getElementById("currentPlayer");

    if (!currentPlayer) {
        return;
    }

    const name = getCurrentPlayerName();
    const wins = getCurrentPlayerWins();

    currentPlayer.innerHTML = "";

    const playerText = document.createElement("span");
    playerText.textContent = `👤 You: ${name}`;

    const winsText = document.createElement("strong");
    winsText.textContent = `${wins} Wins`;

    currentPlayer.appendChild(playerText);
    currentPlayer.appendChild(winsText);
}

function renderLeaderboard() {
    const users = prepareUsers();

    updateTopThree(users);
    updateRemainingPlayers(users);
    updateCurrentPlayer();
}

document.addEventListener("DOMContentLoaded", renderLeaderboard);