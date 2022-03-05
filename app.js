const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs");
const Console = require("console");
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, () => console.log('Server online'))
app.use(express.static('public'))

const loadData = () => {
    return fs.readFileSync("account.json", {encoding:'utf8'})

}

app.post("/getBoard", (req, res) => {
    if (req.body['shuffleBoard'] === true){
        shuffleBoard(req.body['target'])
    }
    const targetData = JSON.parse(loadData()).accounts.find(item => item['name'] === req.body['target'])
    res.json(targetData)
})

app.post("/newChecked", (req, res) => {
    let data = JSON.parse(loadData())
    let targetAccount = data.accounts.find(item => item['name'] === req.body['name'])
    let targetSquare = targetAccount['squares'].find(item => item['square'] === req.body['square'])
    targetSquare['checked'] = req.body['checked']
    fs.writeFileSync('account.json', JSON.stringify(data, null, 2))
    Console.log("Write Checked")
})

app.post("/getAccounts", (req, res) => {
    let data = JSON.parse(loadData())
    const accountnames = []
    for (let i = 0; i < data.accounts.length; i++) {
        accountnames.push(data.accounts[i].name)
    }
    res.json(accountnames)
})

function shuffleBoard(accountName){
    const content = fs.readFileSync("inhalt.txt", {encoding: 'utf8'}).split('\n')

    let data = JSON.parse(loadData())
    let targetAccount = data.accounts.find(item => item['name'] === accountName)

    for (let i = 0; i < 16; i++) {
        let targetSquare = targetAccount['squares'].find(item => item['square'] === i)

        let j
        do {
            j = Math.trunc(Math.random() * content.length)
        } while (content[j] === "");
        targetSquare['text'] = content[j]
        targetSquare['checked'] = false
        content[j] = ''
    }

    fs.writeFileSync('account.json', JSON.stringify(data, null, 2), finished)
    function finished(err) {
        console.log('Shuffled Board for ${accoutName}')
    }
}

