function checkWin(tabuleiro) {
    let x;
    let y;
    for (y = 0; y < 3; y++) {
        if (tabuleiro[0][y] == '0')
            continue;
        if (tabuleiro[0][y] == tabuleiro[1][y] && tabuleiro[1][y] == tabuleiro[2][y])
            return tabuleiro[0][y];
    }
    for (x = 0; x < 3; x++) {
        if (tabuleiro[x][0] == '0')
            continue;
        if (tabuleiro[x][0] == tabuleiro[x][1] && tabuleiro[x][1] == tabuleiro[x][2])
            return tabuleiro[x][0];
    }
    if (tabuleiro[1][1] != '0' && tabuleiro[0][2] == tabuleiro[1][1] && tabuleiro[2][0] == tabuleiro[1][1])
        return tabuleiro[0][2];
    if (tabuleiro[0][0] != "0" && tabuleiro[0][0] == tabuleiro[1][1] && tabuleiro[2][2] == tabuleiro[1][1])
        return tabuleiro[0][0];
    return (false);
}

module.exports = {
    checkWin
}