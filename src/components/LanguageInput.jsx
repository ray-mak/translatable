import arrowdown from "/arrowdown.svg"
import arrowup from "/arrowup.svg"
import search from "/search.svg"
import { useState, useEffect, useRef } from "react"

const LanguageInput = (props) => {
    const firstItemRef = useRef(null)
    const languages = props.languageList.map(language => {
        return (
            <li
                onClick={(e) => {
                    props.selectInputLanguage(e);
                    props.selectInputLanguageCode(language.languageCode);
                    removeFilter()
                }}
                key={language.languageCode}
            >
                {language.language}
            </li>
        )
    })

    const [searchResults, setSearchResults] = useState(languages)

    const [contentBox, setContentBox] = useState(false)
    const inputRef = useRef(null)

    function toggleContentBox() {
        setContentBox(prevState => !prevState)
    }

    useEffect(() => {
        if (contentBox && inputRef.current) {
            inputRef.current.focus()
        }
    }, [contentBox])

    useEffect(() => {
        if (searchResults.length > 0) {
            firstItemRef.current = searchResults[0]
        }
    }, [searchResults])

    const selectContainer = useRef(null)
    useEffect(() => {
        const handleClick = (e) => {
            if (selectContainer.current && !selectContainer.current.contains(e.target)) {
                setContentBox(false)
                setSearchResults(languages)
            }
        }
        document.addEventListener("click", handleClick)
        return () => {
            document.removeEventListener("click", handleClick)
        }
    }, [])

    function handleChange(e) {
        let inputValue = e.target.value.toLowerCase()
        if (inputValue != "") {
            console.log(firstItemRef.current)
            setSearchResults(languages.filter(language => {
                return language.props.children.toLowerCase().startsWith(inputValue)
            }))
        } else {
            setSearchResults(languages)
        }
    }

    //firstItemRef.current returns a React element. This is how we select the language and code
    function handleEnter(e) {
        if (e.key === "Enter" && firstItemRef.current) {
            props.keydownLanguage(firstItemRef.current.props.children)
            props.keydownLanguageCode(firstItemRef.current.key)
            removeFilter()
        }
    }

    function removeFilter() {
        setSearchResults(languages)
        setContentBox(false)
    }

    return (
        <div className="select-container" ref={selectContainer}>
            <div className="select-btn" onClick={toggleContentBox}>
                <span>{props.language}</span>
                {!contentBox && <img className="arrow-icon" src={arrowdown} alt="down arrow icon" />}
                {contentBox && <img className="arrow-icon" src={arrowup} alt="up arrow icon" />}
            </div>
            {contentBox && <div className="content">
                <div className="search">
                    <input
                        type="text"
                        placeholder="Translate to"
                        aria-label="search language"
                        style={{ backgroundImage: `url(${search})` }}
                        onChange={handleChange}
                        onKeyDown={handleEnter}
                        ref={inputRef}
                    />
                </div>
                <ul className="options">
                    {searchResults}
                </ul>
            </div>}
        </div>
    )
}

export default LanguageInput