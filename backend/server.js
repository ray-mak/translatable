require("dotenv").config()
const express = require("express")
const app = express()
const path = require("path")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const corsOptions = require("./config/corsOptions")
const PORT = process.env.PORT || 3500

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

app.use("/", express.static(path.join(__dirname, '/public')))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))