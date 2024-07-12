# Translatable - Transcribe and Translate Your Speech
<img src="https://github.com/ray-mak/translatable/blob/main/public/translate.png?raw=true" alt="translation logo" align="right" height="120" style="margin-left: 12px">

Translatable is a translation app that allows users to transcribe their speech and translate it to their desired language. It features a searchable dropdown menu that allows users to quickly select their desired input and output language. 

Transcriptions are done with Web Speech API while translations are powered with OpenAI.  

## Table of Contents
- [Demo](#demo)
    - [Screenshot](#screenshot)
    - [Online Demo](#online-demo)
- [My Process](#my-process)
    - [Built With](#built-with)
    - [Challenges/What I Learned](#challengeswhat-i-learned)
    - [Continued Development](#continued-development)
- [Author](#author)

## Demo

### Screenshot

### Online Demo
Live app: https://translatable.onrender.com

## My Process
This app can be broken down into three parts in terms of the amount of time and code: speech recognition/transcription, language input/output selection, and OpenAI API translation. 

### Built With
 - CSS
 - React
 - Express 

### Challenges/What I Learned
#### Speech Recognition
The first challenge I encountered when creating this app was implementing Speech Recognition from Web Speech API. Speech Recognition has a "continuous" property that allows users to continuously record their speech when active. If this property is inactive, Speech Recognition will end if there is a brief pause in the speech. 

However, an issue I encountered while leaving the "continuous" property active is that Speech Recognition would continue to run long after it's been prompted to stop (up to 30 seconds). To address this, I turned "continuous" off and combined the interim results in a useEffect.

#### Custom Dropdown
I had to create a component for a searchable dropdown menu with custom styles since ``` <select> ``` elements have limited styling. I wanted to implement a feature that allowed the user to select the first item in the dropdown when hitting "Enter" while focused on the input field. This was a bit difficult at first since the items in the dropdown menu were ```<li>``` elements. 
 
My solution to this problem was to attach a useRef to the first ```<li>``` that is generated in the dropdown and pass it's properties into a function. 

#### Storing API Keys
This is the first project that uses an API that I published. In previous projects, I just had API keys directly in my code since they were hosted locally. For this project, I had to learn how to use Express and create a server to store the API key as well as handle the API calls on the backend. 

While this wasn't overly complicated, it was a good opportunity to learn about the backend and how everything connects.

### Continued Development
The searchable dropdown menu is a component I would like to continue working on. I want make the code more reusable so that I can implement it in other applications. 

I also think there is a lot of potential in using OpenAI in other projects as well. With how flexible the prompts are, the OpenAI API can be used for much more than translating.

## Author
Released 2023 by [Ray Mak](https://github.com/ray-mak)