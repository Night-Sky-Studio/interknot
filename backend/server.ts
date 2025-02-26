import Users from "./mock/MockUsers"
import express from "express"
import cors from "cors"

const app = express()
const port = 5100

app.use(cors({
    origin: process.env.NODE_ENV === "development" ? "*" : "https://interknot.space"
}))

app.get("/", (_, res) => {
    res.type("text/plain").send("Inter-knot data server. Version 0.1.1-beta")
})

app.get("/profile/:uid", (req, res) => {
    const { uid } = req.params
    const user = Users.find(u => u.Information.Uid.toString() === uid)

    if (user) {
        res.json(user)
    } else {
        res.status(404).json({ status: 404, message: "User not found" })
    }
})

app.get("/profile/:uid/character/:cid", (req, res) => {
    const { uid, cid } = req.params
    const character = Users
        .find(u => u.Information.Uid.toString() === uid)?.Characters
        .find(c => c.Id.toString() === cid)

    if (character) {
        res.json(character)
    } else {
        res.status(404).json({ status: 404, message: `Character ${cid} not found in user ${uid}` })
    }
})

app.get("/profiles", (req, res) => {
    const { query, listAll } = req.query

    if (listAll) {
        res.json(Users.map(u => u.Information.Uid))
        return
    }

    let users = Users.filter(u => u.Information.Nickname.includes(query as string) || u.Information.Uid.toString().includes(query as string))
    res.json(users)
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})