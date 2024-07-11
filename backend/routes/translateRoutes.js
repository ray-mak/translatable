const express = require("express")
const router = express.Router()
const translateController = require("../controllers/translateController")

router.route("/")
    .get(translateController.wakeServer)
    .post(translateController.getTranslation)

module.exports = router