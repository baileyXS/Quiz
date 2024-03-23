function returnToMenu() {
    window.location.href = "../";
}

const params = new URLSearchParams(window.location.search);

const questions = params.getAll('question');
const answers = params.getAll('answer');
const results = params.getAll('result');

if (questions.length == 0 || questions.length != answers.length || answers.length != results.length) {
    returnToMenu();
}

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById('tableBody');

    for (let i = 0; i < questions.length; i++) {
        let tr = document.createElement('tr');
        let q = document.createElement('td');
        let a = document.createElement('td');
        let r = document.createElement('td');

        q.innerText = questions[i];
        a.innerText = answers[i];
        r.innerText = results[i] == "true" ? 'Goed' : 'Fout';

        tr.appendChild(q);
        tr.appendChild(a);
        tr.appendChild(r);
        tableBody.appendChild(tr);
    }
});

