import Users from "./mock/MockUsers"
import express from "express"
import cors from "cors"

const app = express()
const port = 5100

app.use(cors({
    origin: process.env.NODE_ENV === "development" ? "*" : "https://interknot.space"
}))

app.get("/", (_, res) => {
    res.type("text/plain").send("Inter-knot data server. Version 0.1.0-beta")
})

app.get("/profile/:uid", (req, res) => {
    const { uid } = req.params
    const user = Users.find(u => u.Uid.toString() === uid)

    if (user) {
        res.json(user)
    } else {
        res.status(404).json({ status: 404, message: "User not found" })
    }
})

app.get("/profiles", (req, res) => {
    const { query, listAll } = req.query

    if (listAll) {
        res.json(Users.map(u => u.Uid))
        return
    }

    let users = Users.filter(u => u.Information.Nickname.includes(query as string) || u.Uid.toString().includes(query as string))
    res.json(users)
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})