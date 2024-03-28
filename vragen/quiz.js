let questionIndex = -1;

function returnToMenu() {
    window.location.href = "../";
}

// terug naar menu

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

// voor array met antwoorden 

const quizPath = `../assets/quiz/${quizType}/`;

let quiz;
let domLoaded = false;
let quizInitialized = false;
let existingButtons = [];
let showingAnswer = false;
let results = [];

function onInputKeyPress(inputField, event) {
    if (event.key !== "Enter") return;

    inputField.blur();
    checkResult(inputField.value);
}

//enter key voor volgende op open vraag

function checkResult(antwoord) {
    if (showingAnswer) return;

    showingAnswer = true;

    const question = quiz.vragen[questionIndex];

    let good = antwoord?.toLowerCase() === question.goedAntwoord.toLowerCase(); //lowercase of uppercase is goed gerekend.

    results.push({
        question: question.vraag,
        answer: antwoord,
        result: good
    });

    document.documentElement.style.setProperty('--resultColor', good ? '#225522CC' : '#552222CC');
    $('#antwoordOverlayTekst').text(`Je antwoord is ${good ? 'correct' : 'fout'}`);
    $('#beschrijvingAntwoord').text(`Het goede antwoord is: '${question.goedAntwoord}'`);
    if (questionIndex >= quiz.vragen.length - 1) {
        $('#buttonVolgende').children('.buttonText')[0].innerText = "Bekijk de resultaten";
    }

    $('#overlayAntwoord').css('display', 'flex');
}

function goToResults() {
    const query = new URLSearchParams();
    query.append('quiz', quizType);
    results.forEach(x => {
        query.append('question', x.question);
        query.append('answer', x.answer);
        query.append('result', x.result);
    });

    window.location.href = "../resultaat/?" + query;
}
// resultaat
function nextQuestion() {
    questionIndex++;

    if (questionIndex >= quiz.vragen.length) {
        goToResults();
        return;
    }

    const question = quiz.vragen[questionIndex];

    $('#maintext').text(`VRAAG ${questionIndex + 1}`);
    $('#vraagtext').text(question.vraag);
    $('#img-vraag').attr('src', quizPath + question.plaatje); //voor de plaatje, vraag en maintext

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
        antwoorden.push(question.goedAntwoord); //voor goeie antwoorden

        shuffleArray(antwoorden);

        let right = false;
        antwoorden.forEach(x => {
            const parent = $(right ? '#antwoorden-rechts' : '#antwoorden-links'); //clone the buttons zodat er 6 zijn
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

function goToNext() {
    if (!showingAnswer) return;

    showingAnswer = false;

    $('#overlayAntwoord').css('display', 'none');
    nextQuestion(); //laat oude antwoorden verdwijnen voor snellere pagina
}

function initQuiz() {
    if (quizInitialized || !domLoaded || !quiz) return;
    quizInitialized = true;

    shuffleArray(quiz.vragen);

    document.documentElement.style.setProperty('--background', `url('${quizPath + quiz.achtergrondPlaatje}')`);  //achtergrond plaatje zetten voor de gekozen quiz.

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

// als fout/error optreed ga naar landingspagina.