let guessWord;
let lifeLoss = 0;
const loss = 'You lost...';
const victory = 'You won!';
const wordSpace = document.querySelector('.word');
const gameEnd = document.querySelector('#finishScreen');
const scoreMessage = document.querySelector('#scoreMessage');
let finalScore = 0;
let combo = 0;

const scoreCalculation = (score, combo) => {
    finalScore += score * combo;
    console.log(finalScore);
}

const getWord = async resource => {
    const response = await fetch(resource);

    if (response.status !== 200) {
        throw new Error('cannot fetch word');
    }

    // picking random word from defined range
    const randomWord = Math.floor(Math.random() * (2287 - 1) + 1);
    const word = await response.json();
    return word[randomWord];
}

// displaying game over screen with aquired points and enabling user
// to play again by reloading site
const gameOver = score => {
    gameEnd.classList.add('finishScreen');
    scoreMessage.classList.add('scoreMessage');
    scoreMessage.innerHTML =
        `You lost with score of ${score} points ! <br>
    <button class="again">Play Again</button>`

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


buttonList.forEach(e => {
    e.addEventListener('click', () => {

        // checking if any letter was guessed
        let isCorrect = false;
        for (i = 0; i < guessWord.length; i++) {
            if (e.textContent === guessWord[i].toUpperCase() && document.getElementById('letter_' + i).textContent != e.textContent) {
                document.getElementById('letter_' + i).textContent = `${e.textContent}`;
                isCorrect = true;
                combo++;
                scoreCalculation(10, combo);
            }

            // disabling button after it has been clicked to prevent multiple clicks
            // of the wrong or already guessed letter
            e.style.visibility = 'hidden';

            // ending the game if all letters have been found
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
            combo = 0;
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

