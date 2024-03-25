let loadingQuiz = false;
let showingOverlay = false;

function showOverlay(quiz, quizName) {
    $('#overlayQuizNaam').text(quizName.toUpperCase());
    $('#overlayQuizdesc').text(quiz.omschrijving);
    $('#verderBtn').attr('href', 'vragen/?quiz=' + quizName.toLowerCase());
    $('#overlayInfo').css('display', 'block');
    showingOverlay = true;
}

function hideOverlay() {
    $('#overlayInfo').css('display', 'none');
    showingOverlay = false;
}

function selectQuiz(quizName) {
    if (loadingQuiz || showingOverlay) return;
    loadingQuiz = true;

    const quizPath = `assets/quiz/${quizName}/`;

    $.getJSON(quizPath + "quiz.json", (quiz) => {
        showOverlay(quiz, quizName);
    }).always(() => {
        loadingQuiz = false;
    });
}