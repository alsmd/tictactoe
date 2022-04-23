const express = require("express")
const app = express()
const router = require("./routes/route.js")
    //Configs
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

app.get("/test", function(req, res) {
    console.log("here");
})

app.use("/", router);

app.listen(process.env.PORT || "8181")