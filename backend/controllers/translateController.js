const asyncHandler = require("express-async-handler")
const { OpenAI } = require("openai")

//@desc wake up Render server
//@route GET /api/translate
//@access Private
const wakeServer = asyncHandler(async (req, res) => {
    res.status(200).json("Server is up!")
})

//@desc get translation
//@route POST /api/translate
//@access Private
const getTranslation = asyncHandler(async (req, res) => {
    const { text, inputLanguage, language } = req.body

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_KEY
    })

    const data = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": `You will be provided with a sentence in ${inputLanguage}, and your task is to translate it into ${language}.`
            },
            {
                "role": "user",
                "content": `${text}`
            }
        ],
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1,
    })

    res.json(data)
})

module.exports = {
    wakeServer,
    getTranslation
} 