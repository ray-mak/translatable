import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightLong } from '@fortawesome/free-solid-svg-icons'
import microphoneWhite from "/microphone-white.svg"
import microphoneOrange from "/microphone-orange.svg"
import { useState, useEffect, useRef } from "react"
import SyncLoader from "react-spinners/SyncLoader"
import ScaleLoader from "react-spinners/ScaleLoader"
import LanguageInput from "./components/LanguageInput"
import InputLanguages from "./data/InputLanguages.json"
import LanguagesList from "./data/LanguagesList.json"

function App() {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState([])
  const [outputText, setOutputText] = useState([])
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState("Select Language")
  const [inputLanguage, setInputLanguage] = useState("Select Language")
  const [inputLanguageCode, setInputLanguageCode] = useState("")
  const outputContainerRef = useRef(null)


  //toggle listening

  function toggleListening() {
    if (language === "Select Language" || inputLanguage === "Select Language") {
      alert("Please select a language")
    } else {
      if (listening) {
        setTimeout(() => {
          setListening(false)
        }, 500)
      } else {
        setListening(prevState => !prevState)
      }
    }
  }

  useEffect(() => {
    if (listening) {
      recognition.start()
    } else {
      recognition.stop()
    }
  }, [listening])

  //set up voice recognition

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()
  recognition.continuous = false
  recognition.interimResults = true
  recognition.lang = inputLanguageCode

  useEffect(() => {
    let tempScript = []
    function handleResult(e) {
      if (e.results[0].isFinal === true) {
        const str = e.results[0][0].transcript
        const newStr = str[0].toUpperCase() + str.slice(1)
        tempScript.push(newStr)
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
        setTranscript(prevScript => [...prevScript, tempScript.join(". ")])
        setLoading(true)
      }
      recognition.removeEventListener('result', handleResult)
      recognition.removeEventListener('end', handleEnd)
    }
  }, [listening])

  //translate English to target language

  useEffect(() => {
    if (transcript.length > 0) {
      async function translateText() {
        try {
          const text = transcript.slice(-1)

          const response = await fetch("http://localhost:3500/api/translate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              inputLanguage,
              language,
              text
            })
          })

          const data = await response.json()
          console.log(data)
          console.log(data.choices[0].message.content)
          const translation = data.choices[0].message.content
          setOutputText(prevText => {
            setLoading(false)
            return [...prevText, {
              "transcript": text,
              "translation": translation
            }]
          })
        } catch (error) {
          console.error("Error occurred in translation: ", error)
        }
      }
      translateText()
    }
  }, [transcript])


  //map translations onto output container

  const translatedText = outputText.map((text, index) => {
    return <div className="text-container" key={index}>
      <p className="english-text">{text.transcript}</p>
      <div className="divider"></div>
      <p className="translated-text">{text.translation}</p>
    </div>
  })

  //scroll output container when new translation is added

  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight
    }
  }, [outputText])

  //Select country function

  function selectLanguage(e) {
    setLanguage(e.target.innerText)
  }

  function selectInputLanguage(e) {
    setInputLanguage(e.target.innerText)
  }

  function selectInputLanguageCode(languageCode) {
    setInputLanguageCode(languageCode)
  }

  function keydownLanguage(language) {
    setInputLanguage(language)
  }

  function keydownLanguageCode(languageCode) {
    setInputLanguageCode(languageCode)
  }

  //empty functions since language code is not necessary for Output languages
  function selectInputLanguageCodeOutput() { }

  function keydownLanguageOutput(language) {
    setLanguage(language)
  }

  function keydownLanguageCodeOutput() {
  }


  return (
    <div className="main-container">
      <h1>Translatable</h1>
      <p>Transcribe and translate your speech to another language</p>
      <div className="selection-container">
        {/* <p>English</p> */}
        <LanguageInput
          language={inputLanguage}
          languageList={InputLanguages}
          selectInputLanguage={selectInputLanguage}
          selectInputLanguageCode={selectInputLanguageCode}
          keydownLanguage={keydownLanguage}
          keydownLanguageCode={keydownLanguageCode}
        />
        <FontAwesomeIcon icon={faRightLong} />
        <LanguageInput
          language={language}
          languageList={LanguagesList}
          selectInputLanguage={selectLanguage}
          selectInputLanguageCode={selectInputLanguageCodeOutput}
          keydownLanguage={keydownLanguageOutput}
          keydownLanguageCode={keydownLanguageCodeOutput}
        />
      </div>
      <div className="output-container" ref={outputContainerRef}>
        {loading && <SyncLoader
          color="#fca311"
          style={{
            position: "absolute",
            top: "45%"
          }}
        />}
        {translatedText}
      </div>

      <div className="button-container">
        {listening && <ScaleLoader
          color="#fca311"
          style={{
            position: "absolute",
            top: "-80px",
            left: "8px"
          }}
        />}
        {listening && <p className="listening">Listening...</p>}
        <button className="record-btn" type="button" aria-label="record audio" onClick={toggleListening}></button>
        {!listening && <img className="microphone" src={microphoneWhite} alt="white microphone icon" />}
        {listening && <img className="microphone" src={microphoneOrange} alt="orange microphone icon" />}
      </div>

    </div>
  )
}

export default App
