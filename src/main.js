const express = require("express")
const app = express()
const router = require("./routes/route.js")
let { updatePartidas } = require("./negocio/tabuleiro")
    //Configs
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))


app.use("/", router);

setInterval(updatePartidas, 1000);

app.listen(process.env.PORT || "8181")