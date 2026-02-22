// ============================================
// Quiz Engine - Reusable Quiz System
// ============================================
class QuizEngine {
    constructor(containerId, questions) {
        this.container = document.getElementById(containerId);
        this.questions = questions;
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.isFinished = false;
        this.isAnswered = false;
    }

    init() {
        this.render();
    }

    render() {
        if (!this.container) return;
        
        if (this.isFinished) {
            this.renderResult();
        } else {
            this.renderQuestion();
        }
    }

    renderQuestion() {
        const q = this.questions[this.currentQuestion];
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        
        this.container.innerHTML = `
            <div class="quiz-progress">
                <div class="quiz-progress-bar" style="width: ${progress}%"></div>
            </div>
            <div class="quiz-header">
                <span class="quiz-number">Soal ${this.currentQuestion + 1} dari ${this.questions.length}</span>
                <span class="quiz-score">Skor: ${this.score}</span>
            </div>
            <div class="quiz-body">
                <div class="quiz-question">
                    <p>${q.question}</p>
                </div>
                <div class="quiz-options">
                    ${q.options.map((opt, idx) => `
                        <button class="quiz-option" data-index="${idx}">
                            <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                            <span class="option-text">${opt}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="quiz-navigation">
                <button class="quiz-btn quiz-btn-secondary" id="prevBtn" ${this.currentQuestion === 0 ? 'disabled style="opacity:0.5"' : ''}>Sebelumnya</button>
                <button class="quiz-btn quiz-btn-primary" id="nextBtn" style="display:none;">Selanjutnya</button>
            </div>
        `;
        
        this.bindQuestionEvents();
    }

    renderResult() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        let message = '';
        let grade = '';
        
        if (percentage >= 90) {
            message = 'Luar biasa! Kamu sudah menguasai materi dengan sangat baik!';
            grade = 'A';
        } else if (percentage >= 80) {
            message = 'Bagus sekali! Pemahamanmu sudah sangat baik!';
            grade = 'B';
        } else if (percentage >= 70) {
            message = 'Cukup baik! Terus tingkatkan pemahamanmu.';
            grade = 'C';
        } else if (percentage >= 60) {
            message = 'Kamu perlu belajar lebih giat lagi.';
            grade = 'D';
        } else {
            message = 'Jangan menyerah! Coba pelajari materi kembali.';
            grade = 'E';
        }
        
        this.container.innerHTML = `
            <div class="quiz-result">
                <div class="result-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9 12l2 2 4-4"/>
                    </svg>
                </div>
                <h3>Kuis Selesai!</h3>
                <div class="result-score">
                    <span class="score-number">${this.score}</span>
                    <span class="score-divider">/</span>
                    <span class="score-total">${this.questions.length}</span>
                </div>
                <div class="result-percentage">${percentage}%</div>
                <div class="result-grade">Grade: ${grade}</div>
                <p class="result-message">${message}</p>
                <div class="result-actions">
                    <button class="quiz-btn quiz-btn-primary" id="retryBtn">Ulangi Kuis</button>
                    <button class="quiz-btn quiz-btn-secondary" id="reviewBtn">Lihat Pembahasan</button>
                </div>
            </div>
        `;
        
        this.bindResultEvents();
    }

    renderReview() {
        let reviewHTML = `
            <div class="quiz-review">
                <h3>Pembahasan Kuis</h3>
                <div class="review-list">
        `;
        
        this.questions.forEach((q, idx) => {
            const userAnswer = this.answers[idx];
            const isCorrect = userAnswer === q.correct;
            
            reviewHTML += `
                <div class="review-item ${isCorrect ? 'correct' : 'wrong'}">
                    <div class="review-header">
                        <span class="review-number">Soal ${idx + 1}</span>
                        <span class="review-status">${isCorrect ? 'Benar' : 'Salah'}</span>
                    </div>
                    <p class="review-question">${q.question}</p>
                    <div class="review-answers">
                        <p><strong>Jawaban kamu:</strong> ${q.options[userAnswer] || 'Tidak dijawab'}</p>
                        <p><strong>Jawaban benar:</strong> ${q.options[q.correct]}</p>
                    </div>
                    ${q.explanation ? `<p class="review-explanation"><strong>Penjelasan:</strong> ${q.explanation}</p>` : ''}
                </div>
            `;
        });
        
        reviewHTML += `
                </div>
                <div class="result-actions">
                    <button class="quiz-btn quiz-btn-primary" id="backToResult">Kembali ke Hasil</button>
                </div>
            </div>
        `;
        
        this.container.innerHTML = reviewHTML;
        
        const backBtn = this.container.querySelector('#backToResult');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.renderResult());
        }
    }

    bindQuestionEvents() {
        const options = this.container.querySelectorAll('.quiz-option');
        const prevBtn = this.container.querySelector('#prevBtn');
        const nextBtn = this.container.querySelector('#nextBtn');
        
        options.forEach(opt => {
            opt.addEventListener('click', () => this.selectAnswer(parseInt(opt.dataset.index)));
        });
        
        if (prevBtn && !prevBtn.disabled) {
            prevBtn.addEventListener('click', () => this.prevQuestion());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
    }

    bindResultEvents() {
        const retryBtn = this.container.querySelector('#retryBtn');
        const reviewBtn = this.container.querySelector('#reviewBtn');
        
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.retry());
        }
        
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => this.renderReview());
        }
    }

    selectAnswer(index) {
        if (this.isAnswered) return;
        this.isAnswered = true;
        
        this.answers[this.currentQuestion] = index;
        
        const correct = index === this.questions[this.currentQuestion].correct;
        if (correct) {
            this.score++;
        }
        
        const options = this.container.querySelectorAll('.quiz-option');
        options.forEach((opt, idx) => {
            opt.disabled = true;
            if (idx === this.questions[this.currentQuestion].correct) {
                opt.classList.add('correct');
            } else if (idx === index && !correct) {
                opt.classList.add('wrong');
            }
        });
        
        // Update score display
        const scoreDisplay = this.container.querySelector('.quiz-score');
        if (scoreDisplay) {
            scoreDisplay.textContent = `Skor: ${this.score}`;
        }
        
        // Show next button
        const nextBtn = this.container.querySelector('#nextBtn');
        if (nextBtn) {
            nextBtn.style.display = 'block';
            if (this.currentQuestion === this.questions.length - 1) {
                nextBtn.textContent = 'Lihat Hasil';
            }
        }
    }

    nextQuestion() {
        this.isAnswered = false;
        
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.render();
        } else {
            this.isFinished = true;
            this.render();
        }
    }

    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.isAnswered = this.answers[this.currentQuestion] !== undefined;
            this.render();
        }
    }

    retry() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.isFinished = false;
        this.isAnswered = false;
        this.render();
    }
}