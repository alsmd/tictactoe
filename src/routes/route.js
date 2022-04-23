var express = require('express');
var router = express.Router();
var path = require("path")
var { checkWin } = require("../negocio/check")
var { getTabuleiro, new_tabuleiro } = require("../negocio/tabuleiro")
var { partidas } = require("../variables")

router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../views/home.html"));
})

router.get("/create", function(req, res) {
    let tabuleiro = new_tabuleiro()
    let response = { id: tabuleiro.id }
    if (tabuleiro.player1.isLog == false) {
        tabuleiro.player1.isLog = true;
        tabuleiro.player1.lastTime = 0;
        tabuleiro.has_connection = true;
        response.player = 1;
    } else {
        tabuleiro.player2.isLog = true;
        tabuleiro.has_connection = true;
        tabuleiro.player2.lastTime = 0;
        response.player = 2;
    }
    partidas.push(tabuleiro)
    res.send(response);
})

router.post("/check-game", function(req, res) {
    let gameInfo = req.body.gameInfo
    let tabuleiro = getTabuleiro(gameInfo.id)
    let response = {
        start: false
    }
    for (var i = 0; i < partidas.length; i++) {
        if (partidas[i].id == gameInfo.id) {
            if (partidas[i].player2.isLog == true) {
                response.start = true
                break
            }
        }
    }
    res.send(response)
})

router.post("/get-board", function(req, res) {
    let tabuleiro = getTabuleiro(req.body.id)
    if (tabuleiro == 0)
        res.send({
            tabuleiro: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
            win: false,
            has_connection: false
        })
    let win = false;
    if (req.body.player == 1)
        tabuleiro.player1.lastTime = (Date.now() / 1000);
    else
        tabuleiro.player2.lastTime = (Date.now() / 1000);
    if (tabuleiro.array.length == 3)
        win = checkWin(tabuleiro.array);
    res.send({
        tabuleiro: tabuleiro.array,
        win: win,
        has_connection: tabuleiro.has_connection
    })
})

router.post("/move", function(req, res) {
    let gameInfo = req.body.gameInfo
    let tabuleiro = getTabuleiro(gameInfo.id)

    if (tabuleiro.turn != gameInfo.player) {
        res.send({
            move: false
        })
        return;
    }
    if (tabuleiro.array[gameInfo.x][gameInfo.y] != "0") {
        res.send({
            move: false
        })
        return;
    }
    if (tabuleiro.turn == 1)
        tabuleiro.turn = 2
    else
        tabuleiro.turn = 1
    if (gameInfo.player == 1)
        tabuleiro.array[gameInfo.x][gameInfo.y] = "X"
    else
        tabuleiro.array[gameInfo.x][gameInfo.y] = "O"
    res.send({
        move: true,
        tabuleiro: tabuleiro.array
    })

})

module.exports = router;