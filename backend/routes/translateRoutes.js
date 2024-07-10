const express = require("express")
const router = express.Router()
const translateController = require("../controllers/translateController")

router.route("/")
    .post(translateController.getTranslation)

module.exports = router