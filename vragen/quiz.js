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

const quizPath = `../assets/quiz/${quizType}/`;

let quiz;
let domLoaded = false;
let quizInitialized = false;
let existingButtons = [];

function onInputKeyPress(inputField, event) {
    if (event.key !== "Enter") return;

    checkResult(inputField.value);
}

function checkResult(antwoord) {
    $('#overlayAntwoord').css('display', 'flex');

    const question = quiz.vragen[questionIndex];
    
    let good = antwoord?.toLowerCase() === question.goedAntwoord?.toLowerCase();

    document.documentElement.style.setProperty('--resultColor', good ? 'green' : 'red');
    $('#antwoordOverlayTekst').text(`Je antwoord is ${good ? 'correct' : 'fout'}`);
}

function nextQuestion() {
    questionIndex++;
    const question = quiz.vragen[questionIndex];

    $('#maintext').text(`VRAAG ${questionIndex + 1}`);
    $('#vraagtext').text(question.vraag);
    $('#img-vraag').attr('src', question.plaatje);

    const isOpen = !question.fouteAntwoorden || question.fouteAntwoorden.length == 0;
    $('#antwoordlijsten-container').css('display', isOpen ? 'none' : 'flex');
    $('#inputField').css('display', isOpen ? 'flex' : 'none');

    existingButtons.forEach(element => {
        element.remove();   
    });
    existingButtons.length = 0;

    $('#inputField').val('');

    if (isOpen) {
        const inputField = $('#inputField');
        inputField.val('');
    }
    else {
        const prefab = $('#buttonPrefab');

        let antwoorden = [];
        question.fouteAntwoorden.forEach(x => {
            antwoorden.push(x);
        });
        antwoorden.push(question.goedAntwoord);

        shuffleArray(antwoorden);

        let right = false;
        antwoorden.forEach(x => {
            const parent = $(right ? '#antwoorden-rechts' : '#antwoorden-links');
            right = !right;
            const button = prefab.clone();
            existingButtons.push(button);
            button.attr('id', null);
            button.children('.buttonText')[0].innerText = x;
            button.on('click', () => checkResult(x));

            parent.append(button);
        });
    }
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