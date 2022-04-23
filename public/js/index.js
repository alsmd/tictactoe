let gameInfo;
let starter = document.querySelector("#starter");
let gameStart = false;
starter.addEventListener("click", function(event) {
    newGame();
})


async function newGame() {
    await fetch("/create").then(function(response) {
        return (response.json());
    }).then(tryEnterGame);
}

async function tryEnterGame(response) {
    let loading = document.querySelector("#loading");
    starter.style.display = "none"
    loading.style.display = "block"
    let r;
    gameInfo = response;
    while (1) {
        r = await fetch("/check-game", {
            headers: {
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify({
                gameInfo
            })
        }).then((r) => r.json());
        if (r.start == true)
            break;
    }

    start_game(gameInfo)
}

async function start_game(gameInfo) {
    let loading = document.querySelector("#loading");
    loading.style.display = "none";
    updateBoard();
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

//play again
let playAgain = document.querySelector("#play-again");
playAgain.addEventListener("click", async function(event) {
    drawTabuleiro([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]);
    let victory = document.querySelector("#victory");
    victory.style.display = "none"
    let gameBoard = document.querySelector("#game");
    event.target.style.display = "none"
    gameBoard.style.display = "none"
    newGame();
});




//ATUALIZAR EM TEMPO REAL


function drawTabuleiro(tabuleiro) {
    let fields = document.querySelectorAll(".field");
    for (var i = 0; i < fields.length; i++) {
        let y = Math.trunc(i / 3);
        let x = i - (y * 3);
        if (tabuleiro[x][y] == '0')
            fields[i].textContent = "";
        else
            fields[i].textContent = tabuleiro[x][y];
    }
}

async function updateBoard() {
    if (!gameStart) {
        return;
    }
    let response = await fetch('/get-board', {
        headers: {
            'Content-Type': 'application/json',
        },
        method: "POST",
        body: JSON.stringify({ id: gameInfo.id, player: gameInfo.player })
    }).then((r) => r.json());
    let tabuleiro = response.tabuleiro;
    console.log(tabuleiro)
    drawTabuleiro(tabuleiro);
    if (!response.has_connection) {
        let playAgain = document.querySelector("#play-again");
        playAgain.style.display = "block";
        let victory = document.querySelector("#victory");
        victory.style.display = "block"
        victory.textContent = "Player " + (gameInfo.player == 1 ? "2" : "1") + " foi desconectado!"
        victory.style.background = "red";
        gameStart = false;
        return;
    }
    if (response.win != false) {
        let playAgain = document.querySelector("#play-again");
        playAgain.style.display = "block";
        let victory = document.querySelector("#victory");
        victory.style.display = "block"
        if (gameInfo.player == 1 && response.win == "X") {
            victory.textContent = response.win + ", você venceu!"
            victory.style.background = "green";
        } else if (gameInfo.player == 2 && response.win == "O") {
            victory.style.background = "green";
            victory.textContent = response.win + ", você venceu!"
        } else {
            victory.textContent = (gameInfo.player == 1 ? "X" : "O") + ", você perdeu!"
            victory.style.background = "red";
        }

        gameStart = false;
    }
}


setInterval(updateBoard, 1000);