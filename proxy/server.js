const { createServer } = require("https")
const { parse } = require("url")
const next = require("next")
const fs = require("fs")

require("dotenv").config({
    path: "./.env.local"
})

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
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
