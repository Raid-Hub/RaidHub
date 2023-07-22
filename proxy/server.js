const { createServer } = require("https")
const { parse } = require("url")
const next = require("next")
const fs = require("fs")

require("dotenv").config()

const app = next({ dev: true })
const handle = app.getRequestHandler()

const httpsOptions = {
    key: fs.readFileSync("./proxy/localhost-key.pem"),
    cert: fs.readFileSync("./proxy/localhost.pem")
}

const host = process.env.NEXTAUTH_URL
app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true)
        handle(req, res, parsedUrl)
    }).listen(host.split(":")[2], err => {
        if (err) throw err
        console.log(`> Ready on ${host}`)
    })
})
