import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightLong } from '@fortawesome/free-solid-svg-icons'
import microphoneWhite from "../public/microphone-white.svg"
import microphoneOrange from "../public/microphone-orange.svg"
import { useState } from "react"

function App() {
  const [listening, setListening] = useState(false)
  function toggleListening() {
    setListening(prevState => !prevState)
  }

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
      <div className="output-container">
        <div className="text-container">
          <p className="english-text">Hello, this is a test message</p>
          <div className="divider"></div>
          <p className="translated-text">您好，这是一条测试消息</p>
        </div>
        <div className="text-container">
          <p className="english-text">Just writing some more random text to fill out the text container. This will be a slightly longer message. Nice!</p>
          <div className="divider"></div>
          <p className="translated-text">只需编写一些随机文本来填充文本容器即可。这将是一条稍长的消息。好的！</p>
        </div>
        <div className="text-container">
          <p className="english-text">Just writing some more random text to fill out the text container. This will be a slightly longer message. Nice!</p>
          <div className="divider"></div>
          <p className="translated-text">只需编写一些随机文本来填充文本容器即可。这将是一条稍长的消息。好的！</p>
        </div>
        <div className="text-container">
          <p className="english-text">Hello, this is a test message</p>
          <div className="divider"></div>
          <p className="translated-text">您好，这是一条测试消息</p>
        </div>
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
