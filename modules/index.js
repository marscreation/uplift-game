// final task - congratulation message > localstorage?
import Board from "./board.js";
import Chips from "./chips.js";
import Dice from "./dice.js";
import { delay } from "./helper.js";

(() => {
    const body = document.querySelector("body");
    const table = document.querySelector("div.board>table tbody");
    // const dice = document.querySelector(".dice");
    const bgsound = document.querySelector(".bgsound");
    const landing = document.querySelector(".landingPage");

    const b = new Board(table);
    const d = new Dice();
    const players = [
        {
            play: "player",
            name: "mars",
            chip: new Chips(b, { name: "player1" }),
        },
        {
            play: "auto",
            name: "computer",
            chip: new Chips(b, { name: "computer" }),
        },
    ];
    let alertMessage;
    let playerTurn = 0;
    let currentMover = players[0];
    let gameOver = false;
    let walking = false;

    window.nextTurn = () => {
        let user = players.length;
        playerTurn = playerTurn < user - 1 ? playerTurn + 1 : 0;
        currentMover = players[playerTurn];
    };

    window.spin = (e) => {
        e.stopPropagation();
        if (walking) return;
        d.diceElem.setAttribute("onclick", "");
        d.diceElem.style.cursor = "not-allowed";
        if (gameOver) return;
        const p = new Promise((resolve, reject) => {
            walking = true;
            let n = d.spin();
            setTimeout(() => {
                resolve(n);
            }, 4500);
        });
        p.then(async (steps) => {
            let gameStatus = await currentMover.chip.stepForward(steps);
            if (gameStatus === false) {
                gameOver = true;
                d.gameOver = true;
            }
        }).finally(() => {
            if (!gameOver) {
                d.diceElem.setAttribute("onclick", "spin(event)");
                d.diceElem.style.cursor = "pointer";
                walking = false;
                nextTurn();
                delay(1000);
                if (currentMover.play == "auto") spin(e);
            }
        });
    };

    // buttons
    window.showAlert = async (a) => {
        if (a == "user") {
            const player = document.querySelector("input#player-name");
            player.value = players[0].name;
        }
        alertMessage = document.querySelector(`.alert.${a}`);
        alertMessage.classList.add("show");
        await delay(10);
        alertMessage.querySelector(".content").style.transform = "scale(1)";
    };

    window.reset = () => {
        alert("clicked");
        players.forEach((el) => el.chip.reset());
        closeAlert();
    };

    window.changeName = (status) => {
        let player;
        if (status == "update") {
            player = document.querySelector("input#player-name");
        } else if (status == "new") {
            player = document.querySelector("input#new-player-name");
            if (bgsound.played.length == 0) {
                bgsound.src = "../audio/bgsound.wav";
                bgsound.volume = 0.2;
                bgsound.play();
            }
        }
        currentMover.chip.changeName(player.value);
        currentMover.name = player.value;
        alertMessage.classList.remove("show");
    };

    window.closeAlert = async () => {
        alertMessage.querySelector(".content").style.transform = "scale(0)";
        await delay(550);
        alertMessage.classList.remove("show");
    };

    window.closeWinAlert = () => {
        players.forEach((el) => el.chip.reset());
        const win = document.querySelector(".alert.congrats");
        win.querySelector(".win").style.transform = "scale(0)";
        win.classList.remove("show");
    };

    window.updatePlayer = async () => {
        closeAlert();
        await delay(550);
        showAlert("startUser");
        const newPlayer = document.getElementById("new-player-name");
        newPlayer.focus();
        newPlayer.addEventListener('keydown', (e) => {
            if (e.code == "Enter") changeName('new')
        })
    };

    window.playGame = () => {
        landing.classList.remove("show");
        showAlert("gameRules");
    };
    // menu
    const btnMenu = document.querySelector(".settings > .menu");
    const ulMenu = document.querySelector(".settings > ul");

    window.menuToggle = () => {
        let show = ulMenu.dataset.show;
        if (show == "false") {
            ulMenu.style.top = "1em";
            ulMenu.dataset.show = "true";
            btnMenu.querySelector("i").style.transform = "rotate(180deg)";
        } else {
            ulMenu.style.top = "-25em";
            ulMenu.dataset.show = "false";
            btnMenu.querySelector("i").style.transform = "rotate(0deg)";
        }
    };

    body.addEventListener("keydown", (e) => {
        if (document.activeElement === body) {
            if (e.code == "Space" && currentMover.play != "auto") spin(e);
        }
    });
})();
