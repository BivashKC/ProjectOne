document.addEventListener('DOMContentLoaded', function() {
    const timerDuration = 120; // 2 minutes in seconds
    let timer = timerDuration;
    let score = 0;
    const timerElement = document.getElementById('timer');
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const resultElement = document.getElementById('result');
    const finalMessage = document.getElementById('final-message');
    let timerInterval;
    let correctAnswerIndex;

    // Fetch IQ questions from iq.txt
    fetch('iq.txt')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n').filter(line => line.trim() !== '');
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
        }

        function startTimer() {
            timerElement.textContent = `${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`;
            timerInterval = setInterval(() => {
                timer--;
                timerElement.textContent = `${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`;
                if (timer <= 0) {
                    clearInterval(timerInterval);
                    showFinalMessage();
                }
            }, 1000);
        }

        function handleAnswerSelection(selectedAnswer) {
            if (selectedAnswer === correctAnswerIndex) {
                score++;
            }
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        }

        function showFinalMessage() {
            let iqLevel;
            if (score === questions.length) {
                iqLevel = 'Einstein';
            } else if (score > 28) {
                iqLevel = 'Stephen Hawking';
            } else if (score > 24) {
                iqLevel = 'Marie Curie';
            } else if (score > 20) {
                iqLevel = 'Leonardo da Vinci';
            } else if (score > 16) {
                iqLevel = 'Isaac Newton';
            } else if (score > 12) {
                iqLevel = 'Charles Darwin';
            } else if (score > 8) {
                iqLevel = 'Galileo Galilei';
            } else if (score > 4) {
                iqLevel = 'Thomas Edison';
            } else {
                iqLevel = 'Keep practicing!';
            }

            finalMessage.textContent = `Thank you for taking part in our IQ test. Your score is ${score}/${questions.length}. You are close to ${iqLevel}'s IQ level.`;

            // Hide question and answers
            questionElement.style.display = 'none';
            answersElement.style.display = 'none';
            timerElement.style.display = 'none';
            resultElement.style.display = 'none';
        }

        answersElement.addEventListener('click', function(event) {
            if (event.target.classList.contains('answer-btn')) {
                const selectedAnswer = event.target.dataset.answer;
                handleAnswerSelection(parseInt(selectedAnswer));
            }
        });

        showQuestion(0);
        startTimer();
    }
});
