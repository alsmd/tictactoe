var { partidas, id } = require("../variables")

function new_tabuleiro() {
    for (let i = 0; i < partidas.length; i++) {
        if (partidas[i].player1.isLog == false || partidas[i].player2.isLog == false)
            return partidas[i];
    }
    id += 1;
    return tabuleiro = {
        is_connected: false,
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

function getTabuleiro(id) {
    for (var i = 0; i < partidas.length; i++) {
        if (partidas[i].id == id)
            return partidas[i]
    }
    return {
        array: [
            []
        ]
    }
}

module.exports = {
    getTabuleiro,
    new_tabuleiro
}