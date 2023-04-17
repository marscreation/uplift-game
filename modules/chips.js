import { delay } from "./helper.js";
export default function Chips(board, player = { name: "" }) {
    let chip;
    let gameOn = true;
    this.currentCell = 1;
    this.coordinate = [0, 9];
    this.move = function (x, y) {
        const tx = 0.6 + 4 * x;
        const ty = 0.6 + 4 * y;
        if (y % 2) chip.classList.remove("flip");
        else chip.classList.add("flip");
        chip.style.transform = `translate(${tx}em, ${ty}em)`;
        this.coordinate = [x, y];
    };

    this.stepTo = async function (cell) {
        chip.classList.remove("stand");
        chip.classList.add("walk");
        for (let i = this.currentCell; i <= cell; i++) {
            this.currentCell = i;
            this.coordinate = board.getCellCoordinate(i);
            this.move(...this.coordinate);
            await delay(700);
        }
        chip.classList.remove("walk");
        chip.classList.add("stand");
        const trap = board.checkTraps(this.currentCell);
        if (trap) {
            this.currentCell = parseInt(trap);
            this.coordinate = board.getCellCoordinate(trap);
            chip.classList.add("slow");
            this.move(...this.coordinate);
            await delay(2000);
            chip.classList.remove("slow");
        }
        if (this.currentCell == 100) {
            const alertMessage = document.querySelector(`.alert.congrats`);
            const winner = document.querySelector('span#player')
            winner.textContent = player.name
            alertMessage.classList.add('show')
            await delay(10);
            alertMessage.querySelector(".win").style.transform = "scale(1)";
            // alert("Congratulation!");
            return (gameOn = false);
        }
        return gameOn;
    };

    this.stepForward = async function (n) {
        if (gameOn) {
            let nextStop = this.currentCell + parseInt(n);
            if (nextStop > 100) return;
            return await this.stepTo(nextStop);
        } else return gameOn;
    };

    this.sleep = function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };

    (() => {
        chip = document.createElement("div");
        chip.classList.add("chip", "stand");
        chip.dataset.player = player.name;
        board.table.appendChild(chip);
    })();

    this.reset = function () {
        this.currentCell = 0;
        this.coordinate = [0, 9];
        this.move(...this.coordinate);
    };

    this.changeName = function (name) {
        chip.dataset.player = name;
    };
}
