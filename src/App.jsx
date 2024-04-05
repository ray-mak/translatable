import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightLong } from '@fortawesome/free-solid-svg-icons'
import microphoneWhite from "/microphone-white.svg"
import microphoneOrange from "/microphone-orange.svg"
import { useState, useEffect, useRef } from "react"
import { OpenAI } from "openai"

function App() {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState([])
  const [error, setError] = useState(null)
  const outputContainerRef = useRef(null)
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()
  recognition.continuous = false
  recognition.interimResults = true
  recognition.lang = "en-US"
  
  console.log(transcript)

  //translate English to target language
  
  useEffect(() => {
    if (transcript.length > 0) {
      async function translateText() {
        try {
          const text = transcript.slice(-1)
          console.log(text)
          const openai = new OpenAI({
            apiKey: import.meta.env.VITE_OPENAI_KEY,
            dangerouslyAllowBrowser: true
          })
          const data = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                "role": "system",
                "content": "You will be provided with a sentence in English, and your task is to translate it into Chinese. Respond with '' if you don't hear anything"
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
          // const data = await res.json()
          console.log(data)
          console.log(data.choices[0].message.content)
        } catch (error) {
          console.error("Error occurred in translation: ", error)
        }
      }
      translateText()
    } 
  }, [transcript])

  const englishText = transcript.map((text, index) => {
    if (text !== "") {
      return <div className="text-container" key={index}>
      <p className="english-text">{text}</p>
    </div>
    }
  })
  
  function toggleListening() {
    if (listening) {
      setTimeout(() => {
        setListening(false); 
      }, 1000); 
    } else {
      setListening(prevState => !prevState)
    }
  }

  useEffect(() => {
    let tempScript = []
    function handleResult(e) {
      if (e.results[0].isFinal === true) {
        tempScript.push(e.results[0][0].transcript)
        console.log(tempScript)
      }
    }
    function handleEnd() {
      // console.log("recognition ended")
      if (listening) {
        recognition.start()
      }
    }

    recognition.addEventListener('result', handleResult)
    recognition.addEventListener('end', handleEnd)

    return () => {
      if (tempScript.length > 0) {
        setTranscript(prevScript => [...prevScript, tempScript.join(", ")])
      }
      recognition.removeEventListener('result', handleResult)
      recognition.removeEventListener('end', handleEnd)
    }
  }, [listening])

  useEffect(() => {
    if (listening) {
      recognition.start()
    } else {
      recognition.stop()
    }
  }, [listening])

  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight
    }
  }, [transcript])

  

  return (
    <div className="main-container">
      <h1>Translatable</h1>
      <p>Transcribe and translate English to another language</p>
      <div className="selection-container">
        <p>English</p>
        <FontAwesomeIcon icon={faRightLong} />
        <select>
          <option value="chinese">Chinese</option>
          <option value="spanish">Spanish</option>
          <option value="french">French</option>
          <option value="arabic">Arabic</option>
        </select>
      </div>
      <div className="output-container" ref={outputContainerRef}>
        <div className="text-container">
          <p className="english-text">Hello, this is a test message</p>
          <div className="divider"></div>
          <p className="translated-text">您好，这是一条测试消息</p>
        </div>
        {/* <div className="text-container">
          <p className="english-text">Just writing some more random text to fill out the text container. This will be a slightly longer message. Nice!</p>
          <div className="divider"></div>
          <p className="translated-text">只需编写一些随机文本来填充文本容器即可。这将是一条稍长的消息。好的！</p>
        </div>
         */}
        {englishText}
        {error && <p className="error">{error}</p>} 
      </div>
      
      <div className="button-container">
        {listening && <p className="listening">Listening...</p>}    
           
        <button className="record-btn" type="button" aria-label="record audio" onClick={toggleListening}></button>
        {!listening && <img className="microphone" src={microphoneWhite} alt="white microphone icon"/>}
        {listening && <img className="microphone" src={microphoneOrange} alt="orange microphone icon"/>}
        {listening && <div className="pulse">
          <span></span>
          <span className="delay1"></span>
          <span className="delay2"></span>
          <span className="delay3"></span>
          <span className="delay4"></span>
        </div>}
      </div>
      
    </div>
  )
}

export default App
