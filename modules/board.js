export default function Board(table) {
    const freeMove = [
        [1, 38, "ladder"],
        [4, 14, "ladder"],
        [9, 31, "ladder"],
        [21, 42, "ladder"],
        [28, 84, "ladder"],
        [36, 44, "ladder"],
        [51, 68, "ladder"],
        [71, 91, "ladder"],
        [80, 100, "ladder"],
        [16, 6, "slide"],
        [47, 26, "slide"],
        [49, 11, "slide"],
        [56, 53, "slide"],
        [62, 19, "slide"],
        [64, 60, "slide"],
        [87, 24, "slide"],
        [93, 73, "slide"],
        [95, 75, "slide"],
        [98, 78, "slide"],
    ];
    this.table = table;
    function placeTraps(cell) {
        let destination = freeMove.find((arr) => arr[0] == cell);
        if (destination && destination[0] == cell) return destination;
        return false;
    }

    this.checkTraps = function (cell) {
        const c = table.querySelector(`[data-cell="${cell}"]`).dataset.moveto;
        if (typeof c == "undefined") return false;
        const x = table.querySelector(`[data-cell="${cell}"]`).dataset.x;
        const y = table.querySelector(`[data-cell="${cell}"]`).closest("tr")
            .dataset.y;
        return c;
    };

    this.getCellCoordinate = function (cell) {
        if (cell == 0) return [0, 9];
        let x = table.querySelector(`[data-cell="${cell}"]`).dataset.x;
        let y = table.querySelector(`[data-cell="${cell}"]`).closest("tr")
            .dataset.y;
        return [x, y];
    };

    (() => {
        let row = "",
            cell = 100,
            y = 0;
        for (let tr = 10; tr >= 1; tr--) {
            let col = "";
            for (let td = 1; td <= 10; td++) {
                let traps = placeTraps(cell);
                let placeFreeMove = "";
                if ((traps && traps[2] == "ladder") || traps[2] == "slide")
                    placeFreeMove = `data-moveTo="${traps[1]}"`;
                let td = `<td data-cell="${cell}" ${placeFreeMove}>${cell}</td>`;
                col = tr % 2 == 1 ? `${td}${col}` : `${col}${td}`;
                cell--;
            }
            row += `<tr data-y="${y}">${col}</tr>`;
            y++;
        }
        table.innerHTML = row;
        for (let i = 0; i <= 9; i++) {
            let td = table.querySelectorAll("tr>td:nth-child(" + (i + 1) + ")");
            td.forEach((el) => {
                el.setAttribute("data-x", i);
                el.style.backgroundColor = "#" + el.dataset.color;
            });
        }
    })();
}
