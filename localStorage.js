let highscoreArray = [];

if(localStorage.length === 0){
    localStorage.setItem('highscore', JSON.stringify(highscoreArray));
}


const settingScores = score => {
    let scoresToParse = localStorage.getItem('highscore');
    let scores = JSON.parse(scoresToParse);
    scores.push(score);
    scores.sort((a, b) => {
        return b - a;
    });
    localStorage.setItem('highscore', JSON.stringify(scores));
}

const showingScores = () => {
    const content = document.querySelector('.highscores__content');
    const scoreArray = JSON.parse(localStorage.getItem('highscore'));
    let placeholderContent = "";

    for(i = 0; i < 5; i++){
        placeholderContent += `<div class="highscores__score"> ${i + 1}. ${scoreArray[i]} </div>`
    }

    content.innerHTML = placeholderContent;
}