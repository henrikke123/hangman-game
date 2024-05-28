/* Velger HTML-elementer ved hjelp av querySelector for senere bruk */
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");
 
/* Variabler for gjeldende ord og antall feilgjettede bokstaver */
let currentWord, correctLetters, wrongGuessCount;
let ordListe = ordListe_local;
const maxGuesses = 6;
 
function resetGame() {
    // Tilbakestiller spillet til starttilstand
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "images/hangman-0.svg";
    guessesText.innerText = wrongGuessCount + " / " + maxGuesses;
 
    // Viser bokstavene i ordet som tomme bokser
    var wordDisplayContent = "";
    for (var i = 0; i < currentWord.length; i++) {
        wordDisplayContent += '<li class="letter"></li>';
    }
    wordDisplay.innerHTML = wordDisplayContent;
 
    // Aktiverer tastene på tastaturet igjen
    var buttons = keyboardDiv.querySelectorAll("button");
    for (var j = 0; j < buttons.length; j++) {
        buttons[j].disabled = false;
    }
 
    // Fjerner modalen som viser spillets slutt
    gameModal.classList.remove("show");
}
 
 
// Kjør getRandomWord-funksjonen når siden lastes
window.addEventListener('DOMContentLoaded', getRandomWord);
 
// Funksjon for å velge et tilfeldig ord fra ordlisten, sette det som gjeldende ord og tilbakestille spillet
function getRandomWord() {
 
    // Henter lagrede data fra localStorage, eller bruker standardordlisten hvis det ikke finnes lagrede data
    let ordListe_localStorage = localStorage.getItem("ordliste");
    console.log(ordListe_localStorage)
 
    if (ordListe_localStorage) {
        ordListe = JSON.parse(ordListe_localStorage);
    }
    else {
        ordListe = ordListe_local;
    }
 
    // Velger et tilfeldig ord fra den lagrede ordlisten og lagrer det som gjeldende ord
    let randomIndex = Math.floor(Math.random() * ordListe.length);
    let randomWordObject = ordListe[randomIndex];
    let word = randomWordObject.word;
    let hint = randomWordObject.hint;
    currentWord = word;
 
    // Setter hintet til å være lik dette ordet sitt hint
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}
 
// Funksjon for å avslutte spillet og vise resultatet (seier eller tap)
function gameOver(isVictory) {
    let modalText;
    let imageUrl;
    let headingText;
 
    if (isVictory) {
        modalText = 'Du fant ordet:';
        imageUrl = 'images/victory.gif';
        headingText = 'Gratulerer!';
 
        let newOrdListe = [];
        for (let i = 0; i < ordListe.length; i++) {
            if (ordListe[i].word !== currentWord) {
                newOrdListe.push(ordListe[i]);
            }
        }
 
        localStorage.setItem("ordliste", JSON.stringify(newOrdListe));
    } else {
        modalText = 'Riktig ord:';
        imageUrl = 'images/lost.gif';
        headingText = 'Spillet er ferdig!';
    }
 
    let paragraphText = modalText + ' <b>' + currentWord + '</b>';
 
    gameModal.querySelector("img").src = imageUrl;
    gameModal.querySelector("h4").innerText = headingText;
    gameModal.querySelector("p").innerHTML = paragraphText;
    gameModal.classList.add("show");
}
 
function initGame(button, clickedLetter) {
    clickedLetter = clickedLetter.toLowerCase();
    // Sjekker om den gjettete bokstaven er en del av det gjeldende ordet
    if (currentWord.indexOf(clickedLetter) !== -1) {
        // Går gjennom hvert tegn i det gjeldende ordet
        for (let i = 0; i < currentWord.length; i++) {
            let letter = currentWord[i];
            if (letter === clickedLetter) {
                correctLetters.push(letter);
                let listItems = wordDisplay.querySelectorAll("li");
                listItems[i].innerText = letter;
                listItems[i].classList.add("guessed");
            }
        }
    } else {
        wrongGuessCount++; // Øker antallet feilgjettede bokstaver
        hangmanImage.src = "images/hangman-" + wrongGuessCount + ".svg";
    }
    button.disabled = true;
    guessesText.innerText = wrongGuessCount + " / " + maxGuesses;
 
    // Kaller gameOver-funksjonen hvis antallet feilgjettede bokstaver er likt maksimalt tillatt
    if (wrongGuessCount === maxGuesses) {
        return gameOver(false);
    }
 
    // Kaller gameOver-funksjonen hvis alle bokstavene i ordet er gjettet riktig
    if (correctLetters.length === currentWord.length) {
        return gameOver(true);
    }
}
 
// Oppretter en array som inneholder Unicode-kodepunktene for alle bokstavene, inkludert Æ, Ø og Å
let allLetters = [];
for (let i = 97; i <= 122; i++) {
    allLetters.push(i);
}
allLetters.push(198, 216, 197); // Legger til kodepunktene for Æ, Ø og Å
 
// Oppretter tastene på tastaturet og legger til eventlyttere for hver tast
for (let j = 0; j < allLetters.length; j++) {
    let button = document.createElement("button");
    button.innerText = String.fromCharCode(allLetters[j]);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", function (e) {
        initGame(e.target, e.target.innerText);
    });
}
 
getRandomWord(); // Velger et tilfeldig ord og starter spillet
playAgainBtn.addEventListener("click", getRandomWord); // Legger til en eventlytter som starter et nytt spill når "Spill på nytt"-knappen klikkes
 
 