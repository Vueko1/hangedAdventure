let guessWord;
let lifeLoss = 0;
const loss = 'You lost...';
const victory = 'You won!';
const wordSpace = document.querySelector('.word');
let gameStatus = false;

const getWord = async resource => {
    const response = await fetch(resource);

    if (response.status !== 200) {
        throw new Error('cannot fetch word');
    }

    const word = await response.json();
    return word[0];
}

getWord('https://random-word-api.herokuapp.com/word?number=1&swear=0')
    .then(word => {
        console.log(word);
        guessWord = word;

        for (let i = 0; i < word.length; i++) {
            wordSpace.innerHTML += `<span class="word__letter" id="letter_${i}"> _ </span>`;
        }

        document.querySelector('.cover').classList.add('animatedRemoval');

    })
    .catch(err => document.querySelector('.cover').textContent = err);

const buttonList = Array.from(document.querySelectorAll('.keyboard__button'));

buttonList.forEach(e => {
    e.addEventListener('click', () => {
        if(gameStatus){
            return;
        }
        let correctCheck = 0;
        for (i = 0; i < guessWord.length; i++) {
            if(e.textContent === guessWord[i].toUpperCase() && document.getElementById('letter_' + i).textContent != e.textContent) {
                document.getElementById('letter_' + i).textContent = `${e.textContent}`;
                correctCheck++;
            }
            if(!wordSpace.textContent.includes('_') && wordSpace.textContent != loss && wordSpace.textContent != victory){
                wordSpace.textContent = victory;
                wordSpace.classList.add('animatedOutcome');
                gameStatus = true;
                break;
            }
        }

        e.style.visibility = 'hidden';

        if(correctCheck == 0) {
            lifeLoss++;
        }

        const healthbar = document.querySelector('.health__fill');
        switch(lifeLoss){
            case 1: healthbar.style.width = '90%';
            break;
            case 2: healthbar.style.width = '80%';
            break;
            case 3: healthbar.style.width = '70%';
            break;
            case 4: healthbar.style.width = '60%';
            break;
            case 5: healthbar.style.width = '50%';
            break;
            case 6: healthbar.style.width = '40%';
            break;
            case 7: healthbar.style.width = '30%';
            break;
            case 8: healthbar.style.width = '20%';
            break;
            case 9: healthbar.style.width = '10%';
            break;
            case 10: {
                healthbar.style.width = '0';
                wordSpace.textContent = loss;
                wordSpace.classList.add('animatedOutcome');
                gameStatus = true;
            };
        }
    })
});

