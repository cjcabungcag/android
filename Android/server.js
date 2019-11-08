const express = require('express')
const app = express();
const port = process.env.PORT || 3000
const bodyParser = require('body-parser');
const cors = require('cors')
const bcrypt = require("bcryptjs")
const config = require("./config")
const jwt = require("jsonwebtoken")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbandroid'
})

app.use(cors())

app.post('/user-insert/:username/:password', function (req, res) {
    let username = req.params.username
    let password = req.params.password;
	console.log("username");
    let statement = `INSERT INTO tblaccounts(Usernames, Passwords) VALUES ('${username}','${password}')`
    connection.query(statement, function (err) {
        if (err) throw err
    })
    //connection.end()
    res.send("saved")

})

app.post('/get-user/:username', function (req, res) {
    let username = req.params.username;
	console.log(username)
    let statement = `SELECT * FROM tblaccounts WHERE Usernames = '${username}'`
    connection.query(statement, function (err, result, fields) {
        if (err) throw err
        var token = jwt.sign({
            result
        }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        })
        res.status(200).send({
            token: token,
            user: result,
			status: "success"
        });

    })
})


app.listen(port, () => {
    console.log('server is up on ' + port);
})