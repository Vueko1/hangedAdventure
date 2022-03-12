let guessWord;
let lifeLoss = 0;
const loss = 'You lost...';
const victory = 'You won!';
const wordSpace = document.querySelector('.word');
const gameEnd = document.querySelector('#finishScreen');
const scoreMessage = document.querySelector('#scoreMessage');
const scoreDisplay = document.querySelector('.progress__score');
const comboDisplay = document.querySelector('.progress__combo');
const scoreIcon = document.querySelector('.utilities__icon--score');
const helpIcon = document.querySelector('.utilities__icon--help');
const scoreClose = document.querySelector('.highscores__close');
const highscores = document.querySelector('.highscores');
let finalScore = 0;
let combo = 1;

const showData = () => {
    scoreDisplay.textContent = finalScore;
    comboDisplay.textContent = combo;
}

const scoreCalculation = (score, comboCounter) => {
    finalScore += score * comboCounter;
    showData();
}

// displaying game over screen with aquired points and enabling user
// to play again by reloading site
const gameOver = score => {
    gameEnd.classList.add('finishScreen');
    scoreMessage.classList.add('scoreMessage');
    scoreMessage.innerHTML =
        `You lost with score of ${score} points ! <br>
    <button class="again">Play Again</button>`
    settingScores(score);

    const buttonAgain = document.querySelector('.again');
    buttonAgain.addEventListener('click', () => {
        location.reload();
    })
}

let newWord = () => {
    getWord('words.json')
        .then(word => {

            // assigning word to a global value
            guessWord = word;

            wordSpace.innerHTML = "";
            // creating span tags depending on words' length
            for (let i = 0; i < word.length; i++) {
                wordSpace.innerHTML += `<span class="word__letter" id="letter_${i}"> _ </span>`;
            }

            // smoothly removing loading screen
            document.querySelector('.cover').classList.add('animatedRemoval');

        })
        .catch(err => document.querySelector('.cover').textContent = err);
}

newWord();


// creating array of clickable buttons
const buttonList = Array.from(document.querySelectorAll('.keyboard__button'));

scoreIcon.addEventListener('click', () => {
    const highscoresContent = document.querySelector('.highscores__content');

    highscores.classList.remove('highscores--hidden');
    showingScores();
})

scoreClose.addEventListener('click', () => {
    highscores.classList.add('highscores--hidden');
})

buttonList.forEach(e => {
    e.addEventListener('click', () => {

        // checking if any letter was guessed
        let isCorrect = false;
        for (i = 0; i < guessWord.length; i++) {
            if (e.textContent === guessWord[i].toUpperCase() && document.getElementById('letter_' + i).textContent != e.textContent) {
                document.getElementById('letter_' + i).textContent = `${e.textContent}`;
                isCorrect = true;
                scoreCalculation(10, combo);
                combo++;
            }

            // disabling button after it has been clicked to prevent multiple clicks
            // of the wrong or already guessed letter
            e.style.visibility = 'hidden';

            // fetching another word
            if (!wordSpace.textContent.includes('_') && wordSpace.textContent != loss && wordSpace.textContent != victory) {
                newWord();
                buttonList.forEach(e => {
                    e.style.visibility = 'visible';
                })
                if(lifeLoss <= 5) {
                    lifeLoss = 0;
                } else {
                    lifeLoss -= 5;
                }
                break;
            }
        }

        // if value of isCorrect is false incrementing lifeLoss value
        if (!isCorrect) {
            lifeLoss++;
            combo = 1;
            showData();
        }

        // creating percentage value for the helthbar
        let percentValue = 100 - (lifeLoss * 10);
        console.log(percentValue);

        // setting the width of the fill in healthbar depending on wrong
        // letter picked by the user
        const healthbar = document.querySelector('.health__fill');
        healthbar.style.width = percentValue + '%';

        // ending the game if helth dropps to 0
        if (percentValue == '0') {
            gameOver(finalScore);
            gameStatus = true;
        }
    })
});

