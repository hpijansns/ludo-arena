/* =====================================================
   LUDO ARENA - AUTH.JS
   Login + Registration
   ===================================================== */

"use strict";


/* =====================================================
   STORAGE HELPERS
   ===================================================== */

function getUsers() {

    try {

        return JSON.parse(
            localStorage.getItem("ludoUsers")
        ) || [];

    } catch (error) {

        return [];

    }

}


function saveUsers(users) {

    localStorage.setItem(
        "ludoUsers",
        JSON.stringify(users)
    );

}


/* =====================================================
   LOGIN
   ===================================================== */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            if (!name || !password) {

                showMessage(
                    message,
                    "Please enter your name and password."
                );

                return;

            }


            const users = getUsers();


            const user =
                users.find(function (item) {

                    return (
                        item.name.toLowerCase() ===
                        name.toLowerCase() &&
                        item.password === password
                    );

                });


            if (!user) {

                showMessage(
                    message,
                    "Invalid player name or password."
                );

                return;

            }


            /* Save logged-in player */

            localStorage.setItem(
                "ludoName",
                user.name
            );

            localStorage.setItem(
                "ludoLoggedIn",
                "true"
            );


            showMessage(
                message,
                "Login successful! Starting game..."
            );


            setTimeout(function () {

                window.location.href =
                    "game.html";

            }, 700);

        }
    );

}


/* =====================================================
   REGISTER
   ===================================================== */

const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const username =
                document
                    .getElementById("username")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;

            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    .value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            /* ---------- Validation ---------- */

            if (username.length < 3) {

                showMessage(
                    message,
                    "Player name must be at least 3 characters."
                );

                return;

            }


            if (password.length < 4) {

                showMessage(
                    message,
                    "Password must be at least 4 characters."
                );

                return;

            }


            if (password !== confirmPassword) {

                showMessage(
                    message,
                    "Passwords do not match."
                );

                return;

            }


            const users = getUsers();


            /* ---------- Duplicate check ---------- */

            const existingUser =
                users.find(function (user) {

                    return (
                        user.name.toLowerCase() ===
                        username.toLowerCase()
                    );

                });


            if (existingUser) {

                showMessage(
                    message,
                    "This player name is already registered."
                );

                return;

            }


            const existingEmail =
                users.find(function (user) {

                    return (
                        user.email.toLowerCase() ===
                        email.toLowerCase()
                    );

                });


            if (existingEmail) {

                showMessage(
                    message,
                    "This email is already registered."
                );

                return;

            }


            /* ---------- Create user ---------- */

            const newUser = {

                name: username,

                email: email,

                password: password,

                games: 0,

                wins: 0,

                points: 0,

                createdAt:
                    new Date().toISOString()

            };


            users.push(newUser);

            saveUsers(users);


            /* Login immediately */

            localStorage.setItem(
                "ludoName",
                username
            );

            localStorage.setItem(
                "ludoLoggedIn",
                "true"
            );

            localStorage.setItem(
                "ludoGames",
                "0"
            );

            localStorage.setItem(
                "ludoWins",
                "0"
            );

            localStorage.setItem(
                "ludoPoints",
                "0"
            );


            showMessage(
                message,
                "Account created successfully!"
            );


            setTimeout(function () {

                window.location.href =
                    "game.html";

            }, 800);

        }
    );

}


/* =====================================================
   MESSAGE HELPER
   ===================================================== */

function showMessage(element, text) {

    if (!element) {
        return;
    }

    element.textContent = text;

}


/* =====================================================
   SIMPLE GUEST LOGIN
   ===================================================== */

function continueAsGuest() {

    localStorage.setItem(
        "ludoName",
        "Guest"
    );

    localStorage.setItem(
        "ludoLoggedIn",
        "false"
    );

    window.location.href =
        "game.html";

}