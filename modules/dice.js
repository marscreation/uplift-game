export default function Dice() {
    this.gameOver = false;
    this.diceElem = document.querySelector(".dice");
    const randomDice = () => {
        const rand = Math.floor(Math.random() * 6) + 1;
        rollDice(rand);
        return rand
    };

    const rollDice = rand => {
        this.diceElem.style.animation = "rolling 4s";
        let dx = 0;
        let dy = 0;
        setTimeout(() => {
            switch (rand) {
                case 2:
                    dx = -90;
                    break;
                case 3:
                    dy = 90;
                    break;
                case 4:
                    dy = -90;
                    break;
                case 5:
                    dx = 90;
                    break;
                case 6:
                    dx = 180;
                    break;
                default:
                    break;
            }
            this.diceElem.style.transform = `rotateX(${dx}deg) rotateY(${dy}deg)`;
        }, 500);
        setTimeout(() => {
            this.diceElem.style.animation = "";
            return rand
        }, 4050);
    };

    this.spin = function () {
        if (this.gameOver) {
            this.diceElem.style.cursor = 'not-allowed'
            return 0
        }
        return randomDice();
    };
}
