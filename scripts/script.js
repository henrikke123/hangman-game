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
const maxGuesses = 6; /* Maksimalt tillatt antall feilgjettede bokstaver
*/
 
function resetGame() {
    // Tilbakestiller spillet til starttilstand
    correctLetters = [];
    wrongGuessCount = 0; // Tilbakestiller antallet feilgjettede bokstaver
    hangmanImage.src = "images/hangman-0.svg"; // Tilbakestiller hangman bilde
    guessesText.innerText = wrongGuessCount + " / " + maxGuesses; // Oppdaterer visningen for antall feilgjettede bokstaver
 
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
 
 
// Funksjon for å lagre data i localStorage
const lagreDataILocalStorage = (data) => {
    localStorage.setItem('lagretData', JSON.stringify(data)); /* lagrer data i localStorage som en JSON-streng */
}
 
// Funksjon for å hente data fra localStorage
const henteDataFraLocalStorage = () => {
    const lagretData = localStorage.getItem('lagretData'); /* henter data fra localStorage og konverterer JSON- streng til et javascript-objekt  */
    return lagretData ? JSON.parse(lagretData) : null;
}
 
function initialiserSpill() {
 
    // Henter lagrede data fra localStorage, eller bruker standardordlisten hvis det ikke finnes lagrede data
    let ordListe_localStorage = localStorage.getItem("ordliste");
    console.log(ordListe_localStorage)
 
    if (ordListe_localStorage) {
        ordListe = JSON.parse(ordListe_localStorage);
    }
 
    // Velger et tilfeldig ord fra den lagrede ordlisten og lagrer det som gjeldende ord
    let randomIndex = Math.floor(Math.random() * ordListe.length);
    currentWord = ordListe[randomIndex].word;
 
    // Setter hintet for det valgte ordet ved å finne ordet i lagrede data og hente hintet
    document.querySelector(".hint-text b").innerText = ordListe.find(function (item) {
        return item.word === currentWord;
    }).hint;
 
    resetGame(); // Tilbakestiller spillet
}
 
 
// Kjør initialiserSpill-funksjonen når siden lastes
window.addEventListener('DOMContentLoaded', initialiserSpill);
 
// Funksjon for å velge et tilfeldig ord fra ordlisten, sette det som gjeldende ord og tilbakestille spillet
function getRandomWord() {
    let randomIndex = Math.floor(Math.random() * ordListe.length);
    let randomWordObject = ordListe[randomIndex]; // Velger et tilfeldig ord fra ordlisten
    let word = randomWordObject.word;
    let hint = randomWordObject.hint;
 
    currentWord = word; // Setter det valgte ordet som gjeldende ord
    document.querySelector(".hint-text b").innerText = hint; // Setter hintet for det valgte ordet
    resetGame(); // Tilbakestiller spillet
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
 
    gameModal.querySelector("img").src = imageUrl; // Velger bildet for modalen basert på seier eller tap
    gameModal.querySelector("h4").innerText = headingText; // Setter overskriftsteksten for modalen basert på seier eller tap
    gameModal.querySelector("p").innerHTML = paragraphText; // Setter teksten for modalen basert på seier eller tap, og inkluderer det gjeldende ordet
    gameModal.classList.add("show"); // Viser modalen
}
 
function initGame(button, clickedLetter) {
    clickedLetter = clickedLetter.toLowerCase();
    // Sjekker om den gjettete bokstaven er en del av det gjeldende ordet
    if (currentWord.indexOf(clickedLetter) !== -1) {
        console.log("AUG")
        // Går gjennom hvert tegn i det gjeldende ordet
        for (let i = 0; i < currentWord.length; i++) {
            let letter = currentWord[i];
            if (letter === clickedLetter) {
                correctLetters.push(letter); // Legger den riktige bokstaven til i listen over korrekte bokstaver
                let listItems = wordDisplay.querySelectorAll("li");
                listItems[i].innerText = letter; // Oppdaterer visningen for den gjettete bokstaven i ordet
                listItems[i].classList.add("guessed"); // Legger til klassen "guessed" for å vise at bokstaven er gjettet riktig
            }
        }
    } else {
        wrongGuessCount++; // Øker antallet feilgjettede bokstaver
        hangmanImage.src = "images/hangman-" + wrongGuessCount + ".svg"; // Oppdaterer bildet av hangman basert på antallet feilgjettede bokstaver
    }
    button.disabled = true; // Deaktiverer den gjettete bokstaven på tastaturet
    guessesText.innerText = wrongGuessCount + " / " + maxGuesses; // Oppdaterer visningen for antall feilgjettede bokstaver
 
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
    allLetters.push(i); // Legger til kodepunktene for a til z
}
allLetters.push(198, 216, 197); // Legger til kodepunktene for Æ, Ø og Å
 
// Oppretter tastene på tastaturet og legger til eventlyttere for hver tast
for (let j = 0; j < allLetters.length; j++) {
    let button = document.createElement("button"); // Oppretter en <button> for hver bokstav
    button.innerText = String.fromCharCode(allLetters[j]); // Setter teksten på knappen til den gjeldende bokstaven
    keyboardDiv.appendChild(button); // Legger til knappen i tastaturet
    button.addEventListener("click", function (e) {
        initGame(e.target, e.target.innerText); // Legger til en eventlytter som kaller initGame-funksjonen når knappen klikkes
    });
}
 
getRandomWord(); // Velger et tilfeldig ord og starter spillet
playAgainBtn.addEventListener("click", getRandomWord); // Legger til en eventlytter som starter et nytt spill når "Spill på nytt"-knappen klikkes
 
 
