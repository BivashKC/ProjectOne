document.addEventListener('DOMContentLoaded', function() {
    let timer = 30;
    let score = 0;
    let totalQuestions = 0;
    const timerElement = document.getElementById('timer');
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const resultElement = document.getElementById('result');
    const finalMessage = document.getElementById('final-message');
    let timerInterval;
    let correctAnswerIndex;

    // Fetch quiz questions from quiz.txt
    fetch('quiz.txt')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n').filter(line => line.trim() !== '');
            totalQuestions = lines.length;
            const questions = lines.map(line => {
                const parts = line.split('|');
                const question = parts[0];
                const answers = parts.slice(1, -1);
                const correctIndex = parseInt(parts[parts.length - 1]);
                return { question, answers, correctIndex };
            });
            startQuiz(questions);
        });

    function startQuiz(questions) {
        let currentQuestionIndex = 0;

        function showQuestion(index) {
            if (index >= questions.length) {
                clearInterval(timerInterval);
                showFinalMessage();
                return;
            }

            const { question, answers, correctIndex } = questions[index];
            questionElement.textContent = question;
            answersElement.innerHTML = answers.map((answer, i) => `
                <button class="btn btn-primary answer-btn col-5 m-1" data-answer="${i}">${String.fromCharCode(65 + i)}: ${answer}</button>
            `).join('');
            correctAnswerIndex = correctIndex; // Set the correct answer index

            startTimer();
        }

        function startTimer() {
            timer = 30;
            timerElement.textContent = timer;
            timerInterval = setInterval(() => {
                timer--;
                timerElement.textContent = timer;
                if (timer <= 0) {
                    clearInterval(timerInterval);
                    resultElement.textContent = 'Time is up!';
                    handleAnswerSelection(null); // Auto-handle when time is up
                }
            }, 1000);
        }

        function handleAnswerSelection(selectedAnswer) {
            const buttons = answersElement.querySelectorAll('.answer-btn');
            buttons.forEach((button, index) => {
                if (index === correctAnswerIndex) {
                    button.classList.add('correct');
                } else if (index === selectedAnswer) {
                    button.classList.add('incorrect');
                }
            });
            if (selectedAnswer === correctAnswerIndex) {
                score++;
                resultElement.textContent = 'Correct!';
            } else {
                resultElement.textContent = 'Incorrect!';
            }
            setTimeout(() => {
                resultElement.textContent = '';
                currentQuestionIndex++;
                showQuestion(currentQuestionIndex);
            }, 2000);
        }

        function showFinalMessage() {
            const percentage = (score / totalQuestions) * 100;
            if (percentage == 100) {
                finalMessage.textContent = 'Excellent work! You nailed it with 100% correct answers!';
            } else if (percentage > 90) {
                finalMessage.textContent = 'Excellent work! You nailed it with over 90% correct answers!';
            } else if (percentage > 75) {
                finalMessage.textContent = 'Great job! You answered over 75% of the questions correctly!';
            } else if (percentage > 50) {
                finalMessage.textContent = 'Good effort! You got more than 50% of the answers right!';
            } else {
                finalMessage.textContent = 'Keep practicing! You answered less than 50% of the questions correctly. Better luck next time!';
            }
        }

        answersElement.addEventListener('click', function(event) {
            if (event.target.classList.contains('answer-btn')) {
                const selectedAnswer = event.target.dataset.answer;
                clearInterval(timerInterval);
                handleAnswerSelection(parseInt(selectedAnswer));
            }
        });

        showQuestion(0);
    }
});
