function returnToMenu() {
    window.location.href = "../";
}

const params = new URLSearchParams(window.location.search);
const quizType = params.get("quiz");
if (!quizType) {
    returnToMenu();
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const quizPath = `../assets/quiz/${quizType}/`

let quiz;
let domLoaded = false;
let quizInitialized = false;

function initQuiz() {
    if (quizInitialized || !domLoaded || !quiz) return;
    quizInitialized = true;

    shuffleArray(quiz.vragen);

    console.log(quiz.vragen);
    // TODO: Initialize quiz
}

document.addEventListener("DOMContentLoaded", () => {
    domLoaded = true;
    initQuiz();
});

$.getJSON(quizPath + "quiz.json", (result) => {
    quiz = result;
    initQuiz();
}).fail(() => {
    returnToMenu();
});