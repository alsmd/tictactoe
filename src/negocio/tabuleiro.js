var { partidas, id } = require("../variables")

function create_tabuleiro() {
    id += 1;
    return tabuleiro = {
        has_connection: false,
        player1: {
            isLog: false,
            lastTime: 0
        },
        player2: {
            isLog: false,
            lastTime: 0
        },
        turn: 1,
        id: id,
        array: [
            ["0", "0", "0"],
            ["0", "0", "0"],
            ["0", "0", "0"]
        ]
    }
}

function new_tabuleiro() {
    for (let i = 0; i < partidas.length; i++) {
        if (partidas[i].player1.isLog == false || partidas[i].player2.isLog == false)
            return partidas[i];
    }
    return create_tabuleiro()
}

function getTabuleiro(id) {
    for (var i = 0; i < partidas.length; i++) {
        if (partidas[i].id == id)
            return partidas[i]
    }
    return 0;
}

function updatePartidas() {
    for (let i = 0; i < partidas.length; i++) {
        if (partidas[i].player1.isLog == false || partidas[i].player2.isLog == false)
            continue;
        let secondsToBeDesconected = 5;
        if ((((Date.now() / 1000) - partidas[i].player1.lastTime > secondsToBeDesconected) && partidas[i].player1.lastTime != 0) || ((Date.now() / 1000) - partidas[i].player2.lastTime > secondsToBeDesconected) && partidas[i].player2.lastTime != 0) {
            partidas[i].has_connection = false;
        }
        if (partidas[i].has_connection == false)
            partidas.splice(i, 1)
    }
}

module.exports = {
    getTabuleiro,
    new_tabuleiro,
    updatePartidas
}