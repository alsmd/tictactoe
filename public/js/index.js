let gameInfo;
let starter = document.querySelector("#starter");
let gameStart = false;
starter.addEventListener("click", function(event) {
    fetch("/create").then(function(response) {
        return (response.json());
    }).then(tryEnterGame);
})

async function tryEnterGame(response) {
    let loading = document.querySelector("#loading");
    starter.style.display = "none"
    loading.style.display = "block"
    let r;
    while (1) {
        r = await fetch("/check-game", {
            headers: {
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify({
                gameInfo: response
            })
        }).then((r) => r.json());
        if (r.start == true)
            break;
    }

    gameInfo = response;
    start_game(gameInfo)
}

async function start_game(gameInfo) {
    let loading = document.querySelector("#loading");
    loading.style.display = "none";
    let game = document.querySelector("#game");
    game.style.display = "block";
    gameStart = true;
}


//CLICAVEL


let buttons = document.querySelectorAll(".field");
//0 1 2
//3 4 5 
//6 7 8

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", async function(event) {
        if (!gameStart)
            return;
        let i = event.target.id;
        let y = Math.trunc(i / 3);
        let x = i - (y * 3);
        request = { x: x, y: y, player: gameInfo.player, id: gameInfo.id };
        response = await fetch("/move", {
            headers: {
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify({ gameInfo: request })
        }).then((r) => r.json())
        if (response.move)
            drawTabuleiro(response.tabuleiro)
    })
}


//ATUALIZAR EM TEMPO REAL


function drawTabuleiro(tabuleiro) {
    let fields = document.querySelectorAll(".field");
    for (var i = 0; i < fields.length; i++) {
        let y = Math.trunc(i / 3);
        let x = i - (y * 3);
        if (tabuleiro[x][y] != '0')
            fields[i].textContent = tabuleiro[x][y];
    }
}

async function updateBoard() {
    if (!gameStart)
        return;
    let response = await fetch('/get-board', {
        headers: {
            'Content-Type': 'application/json',
        },
        method: "POST",
        body: JSON.stringify({ id: gameInfo.id, player: gameInfo.player })
    }).then((r) => r.json());
    let tabuleiro = response.tabuleiro;
    drawTabuleiro(tabuleiro);
    if (!response.has_connection) {
        let victory = document.querySelector("#victory");
        victory.style.display = "block"
        victory.textContent = "Player " + (gameInfo.player == 1 ? "2" : "1") + " foi desconectado!"
        victory.style.background = "red";
        gameStart = false;
        return;
    }
    if (response.win != false) {
        let victory = document.querySelector("#victory");
        victory.style.display = "block"
        if (gameInfo.player == 1 && response.win == "X")
            victory.textContent = response.win + ", você venceu!"
        else if (gameInfo.player == 2 && response.win == "O")
            victory.textContent = response.win + ", você venceu!"
        else {
            victory.textContent = gameInfo.player == 1 ? "X" : "O" + ", você perdeu!"
            victory.style.background = "red";
        }

        gameStart = false;
    }
}


setInterval(updateBoard, 1000);