/* =====================================================
   LUDO ARENA - DICE.JS
   Dice Roll, Animation & Display
   ===================================================== */

"use strict";


/* =====================================================
   DICE FACES
   ===================================================== */

const DICE_FACES = {

    1: "⚀",
    2: "⚁",
    3: "⚂",
    4: "⚃",
    5: "⚄",
    6: "⚅"

};


/* =====================================================
   GET DICE ELEMENT
   ===================================================== */

function getDiceElement() {

    return document.getElementById(
        "dice"
    );

}


/* =====================================================
   DISPLAY DICE
   ===================================================== */

function displayDice(
    value
) {

    const dice =
        getDiceElement();


    if (!dice) {

        return;

    }


    if (
        value >= 1 &&
        value <= 6
    ) {

        dice.textContent =
            DICE_FACES[value];

    }
    else {

        dice.textContent =
            "🎲";

    }

}


/* =====================================================
   RANDOM DICE VALUE
   ===================================================== */

function randomDiceValue() {

    return Math.floor(
        Math.random() * 6
    ) + 1;

}


/* =====================================================
   ROLL ANIMATION
   ===================================================== */

function animateDice(
    callback
) {

    const dice =
        getDiceElement();


    if (!dice) {

        if (
            typeof callback === "function"
        ) {

            callback();

        }

        return;

    }


    dice.classList.add(
        "rolling"
    );


    let animationCount = 0;


    /*
     * Show random dice faces
     * while animation is running.
     */

    const animation =
        setInterval(
            function () {

                const randomValue =
                    randomDiceValue();


                displayDice(
                    randomValue
                );


                animationCount++;


                if (
                    animationCount >= 6
                ) {

                    clearInterval(
                        animation
                    );


                    dice.classList.remove(
                        "rolling"
                    );


                    if (
                        typeof callback ===
                        "function"
                    ) {

                        callback();

                    }

                }

            },
            80
        );

}


/* =====================================================
   ROLL WITH CALLBACK
   ===================================================== */

function rollDiceAnimation(
    finalValue,
    callback
) {

    const value =
        Number(finalValue);


    animateDice(
        function () {

            displayDice(
                value
            );


            if (
                typeof callback ===
                "function"
            ) {

                callback(
                    value
                );

            }

        }
    );

}


/* =====================================================
   DISABLE DICE
   ===================================================== */

function disableDiceButton() {

    const buttons = [

        document.getElementById(
            "roll"
        ),

        document.getElementById(
            "mobile-roll"
        )

    ];


    buttons.forEach(
        function (button) {

            if (button) {

                button.disabled =
                    true;

            }

        }
    );

}


/* =====================================================
   ENABLE DICE
   ===================================================== */

function enableDiceButton() {

    const buttons = [

        document.getElementById(
            "roll"
        ),

        document.getElementById(
            "mobile-roll"
        )

    ];


    buttons.forEach(
        function (button) {

            if (button) {

                button.disabled =
                    false;

            }

        }
    );

}


/* =====================================================
   RESET DICE
   ===================================================== */

function resetDice() {

    const dice =
        getDiceElement();


    if (!dice) {

        return;

    }


    dice.classList.remove(
        "rolling"
    );


    dice.textContent =
        "🎲";

}


/* =====================================================
   DICE INITIALIZATION
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        resetDice();

    }
);