const params = new URLSearchParams(window.location.search);
const quizType = params.get("quiz");
if (!quizType) {
    window.location.href = "../";
}