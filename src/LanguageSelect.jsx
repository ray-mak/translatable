import { React } from "react";
import arrowdown from "/arrowdown.svg"
import arrowup from "/arrowup.svg"
import search from "/search.svg"
import LanguagesList from "./data/LanguagesList.json"
import { useState, useEffect, useRef } from "react";

export default function LanguageSelect(props) {
    const languages= LanguagesList.map(language => {
        return <li onClick={(e) => {props.handleClick(e); removeFilter()}} key={language}>{language}</li>
    })
    //toggle language select box
    
    const [contentBox, setContentBox] = useState(false)
    function toggleContentBox() {
        setContentBox(prevState => !prevState)
    }
    const selectContainer = useRef(null)
    useEffect(() => {
        const handleClick = (e) => {
            if (selectContainer.current && !selectContainer.current.contains(e.target)){
                setContentBox(false)
                setSearchResults(languages)
            }
        }
        document.addEventListener("click", handleClick)
        return () => {
            document.removeEventListener("click", handleClick)
        }
    }, [])

    //create and filter languages list
    const [searchResults, setSearchResults] = useState(languages)
    const [emptySearch, setEmptySearch] = useState(true)
    
    function handleChange(e) {
        let inputValue = e.target.value.toLowerCase()
        if (inputValue != "") {
            setSearchResults(languages.filter(language => {
                return language.props.children.toLowerCase().startsWith(inputValue)
            }))
        } else {
            setSearchResults(languages)
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
                {!contentBox && <img className="arrow-icon" src={arrowdown} alt="down arrow icon"/>}
                {contentBox && <img className="arrow-icon" src={arrowup} alt="up arrow icon"/>}
            </div>
            {contentBox && <div className="content">
                <div className="search">
                    <input 
                        type="text" 
                        placeholder="Translate to" 
                        aria-label="search language" 
                        style={{backgroundImage:`url(${search})`}}
                        onChange={handleChange}
                    />
                </div>
                <ul className="options">
                    {searchResults}
                </ul>
            </div>}
        </div>
    )
}