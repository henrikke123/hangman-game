
/* Velger HTML-elementer ved hjelp av querySelector for senere bruk */
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");

/* Variabler for gjeldende ord og antall feilgjettede bokstaver */
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6; /* Maksimalt tillatt antall feilgjettede bokstaver
 */

/* Funksjon for å tilbakestille spillet til starttilstand */
const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0; /* Tilbakestiller antallet feilgjettede bokstaver */ 
    hangmanImage.src = "images/hangman-0.svg"; /* Tilbakestiller hangaman bilde */
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`; /*  Oppdaterer visningen for antall feilgjettede bokstaver */
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false); /* aktiverer tastene på tastaturet igjen */
    gameModal.classList.remove("show"); /* fjernes modalen som viser spillets slutt */
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

// Funksjon for å initialisere spillet
const initialiserSpill = () => { /* henter lagrede data fra localStorage, eller bruker standardordlisten hvis det ikke fines lagrede data */
    let lagredeData = henteDataFraLocalStorage(); // Henter lagrede data fra localStorage
    if (!lagredeData) { // Sjekker om det ikke er lagrede data tilgjengelig
        lagredeData = ordListe; // Bruker standardordlisten hvis det ikke er lagrede data
        lagreDataILocalStorage(lagredeData); // Lagrer standardordlisten i localStorage
    }

    // Velger et tilfeldig ord fra den lagrede ordlisten og lagrer det som gjeldende ord
    currentWord = lagredeData[Math.floor(Math.random() * lagredeData.length)].word;

    // Setter hintet for det valgte ordet ved å finne ordet i lagrede data og hente hintet
    document.querySelector(".hint-text b").innerText = lagredeData.find(item => item.word === currentWord).hint;

    resetGame(); // Tilbakestiller spillet
}

// Kjør initialiserSpill-funksjonen når siden lastes
window.addEventListener('DOMContentLoaded', initialiserSpill);

// Funksjon for å velge et tilfeldig ord fra ordlisten, sette det som gjeldende ord og tilbakestille spillet
const getRandomWord = () => {
    const { word, hint } = ordListe[Math.floor(Math.random() * ordListe.length)]; // Velger et tilfeldig ord fra ordlisten
    currentWord = word; // Setter det valgte ordet som gjeldende ord
    document.querySelector(".hint-text b").innerText = hint; // Setter hintet for det valgte ordet
    resetGame(); // Tilbakestiller spillet
}

// Funksjon for å avslutte spillet og vise resultatet (seier eller tap)
const gameOver = (isVictory) => {
    const modalText = isVictory ? `Du fant ordet:` : 'Riktig ord:'; // Velger modaltekst basert på om spillet ble vunnet eller tapt
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`; // Velger bildet for modalen basert på seier eller tap
    gameModal.querySelector("h4").innerText = isVictory ? 'Gratulerer!' : 'Spillet er ferdig!'; // Setter overskriftsteksten for modalen basert på seier eller tap
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`; // Setter teksten for modalen basert på seier eller tap, og inkluderer det gjeldende ordet
    gameModal.classList.add("show"); // Viser modalen
}

// Funksjon for å håndtere gjetting av bokstaver og oppdatering av spilltilstanden
const initGame = (button, clickedLetter) => {
    if(currentWord.includes(clickedLetter)) { // Sjekker om den gjettete bokstaven er en del av det gjeldende ordet
        [...currentWord].forEach((letter, index) => { // Går gjennom hvert tegn i det gjeldende ordet
            if(letter === clickedLetter) { // Sjekker om det gjeldende tegnet er den gjettete bokstaven
                correctLetters.push(letter); // Legger den riktige bokstaven til i listen over korrekte bokstaver
                wordDisplay.querySelectorAll("li")[index].innerText = letter; // Oppdaterer visningen for den gjettete bokstaven i ordet
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed"); // Legger til klassen "guessed" for å vise at bokstaven er gjettet riktig
            }
        });
    } else {
        wrongGuessCount++; // Øker antallet feilgjettede bokstaver
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`; // Oppdaterer bildet av hangman basert på antallet feilgjettede bokstaver
    }
    button.disabled = true;  // Deaktiverer den gjettete bokstaven på tastaturet
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`; // Oppdaterer visningen for antall feilgjettede bokstaver

    if(wrongGuessCount === maxGuesses) return gameOver(false); // Kaller gameOver-funksjonen hvis antallet feilgjettede bokstaver er likt maksimalt tillatt
    if(correctLetters.length === currentWord.length) return gameOver(true); // Kaller gameOver-funksjonen hvis alle bokstavene i ordet er gjettet riktig
}

// Oppretter tastene på tastaturet og legger til eventlyttere for hver tast
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button"); // Oppretter en <button> for hver bokstav i alfabetet
    button.innerText = String.fromCharCode(i); // Setter teksten på knappen til den gjeldende bokstaven
    keyboardDiv.appendChild(button); // Legger til knappen i tastaturet
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i))); // Legger til en eventlytter som kaller initGame-funksjonen når knappen klikkes
}

getRandomWord(); // Velger et tilfeldig ord og starter spillet
playAgainBtn.addEventListener("click", getRandomWord); // Legger til en eventlytter som starter et nytt spill når "Spill på nytt"-knappen klikkes

