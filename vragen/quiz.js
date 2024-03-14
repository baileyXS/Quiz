let questionIndex = -1;

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

function nextQuestion() {
    questionIndex++;
    const question = quiz.vragen[questionIndex];

    $('#maintext').text(`VRAAG ${questionIndex + 1}`);
    $('#vraagtext').text(question.vraag);
    $('#img-vraag').attr('src', question.plaatje);
}

function initQuiz() {
    if (quizInitialized || !domLoaded || !quiz) return;
    quizInitialized = true;

    shuffleArray(quiz.vragen);

    document.documentElement.style.setProperty('--background', `url('${quizPath + quiz.achtergrondPlaatje}')`);
    document.documentElement.style.setProperty('--kleur1', quiz.kleur1);

    nextQuestion();
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