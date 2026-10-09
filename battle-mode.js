// ========== 1v1 BATTLE MODE ==========

let battleState = {
    playerScore: 0,
    opponentScore: 0,
    playerCorrect: 0,
    opponentCorrect: 0,
    currentAnswer: 0,
    timeLeft: 60,
    timerInterval: null,
    questionsAnswered: 0,
    opponentName: '',
    opponentAvatar: '',
    opponentSpeed: 3000, // AI answer speed in ms
    opponentAccuracy: 0.75, // 75% accuracy
    gameActive: false
};

const OPPONENT_NAMES = ['MathNinja', 'QuickCalc', 'NumberWiz', 'AlgebraKing', 'SpeedMath', 'CalcMaster'];
const OPPONENT_AVATARS = ['🤖', '👾', '🦾', '🧙', '👑', '🎓'];

function startBattleMode() {
    mainMenu.classList.add('hidden');
    document.getElementById('battle-screen').classList.remove('hidden');
    
    // Random opponent
    battleState.opponentName = OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)];
    battleState.opponentAvatar = OPPONENT_AVATARS[Math.floor(Math.random() * OPPONENT_AVATARS.length)];
    
    // Adjust AI difficulty based on player stats
    const avgAccuracy = persistentStats.avgAccuracy || 70;
    battleState.opponentAccuracy = Math.min(0.95, (avgAccuracy / 100) + 0.1);
    battleState.opponentSpeed = Math.max(1500, 4000 - (avgAccuracy * 20));
    
    battleState = {
        playerScore: 0,
        opponentScore: 0,
        playerCorrect: 0,
        opponentCorrect: 0,
        currentAnswer: 0,
        timeLeft: 60,
        timerInterval: null,
        questionsAnswered: 0,
        opponentName: battleState.opponentName,
        opponentAvatar: battleState.opponentAvatar,
        opponentSpeed: battleState.opponentSpeed,
        opponentAccuracy: battleState.opponentAccuracy,
        gameActive: true
    };
    
    document.getElementById('opponent-name').textContent = battleState.opponentName;
    document.getElementById('opponent-avatar').textContent = battleState.opponentAvatar;
    
    generateBattleQuestion();
    startBattleTimer();
    updateBattleUI();
    
    document.getElementById('battle-answer').focus();
}

function generateBattleQuestion() {
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    const maxNum = 20;
    let num1 = Math.floor(Math.random() * maxNum) + 1;
    let num2 = Math.floor(Math.random() * maxNum) + 1;
    
    if (operation === '/') {
        num2 = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * (Math.floor(Math.random() * 10) + 1);
    }
    
    if (operation === '-' && num2 > num1) {
        [num1, num2] = [num2, num1];
    }
    
    document.getElementById('battle-question').textContent = `${num1} ${operation} ${num2} = ?`;
    
    switch(operation) {
        case '+': battleState.currentAnswer = num1 + num2; break;
        case '-': battleState.currentAnswer = num1 - num2; break;
        case '*': battleState.currentAnswer = num1 * num2; break;
        case '/': battleState.currentAnswer = num1 / num2; break;
    }
    
    // Simulate opponent answering
    if (battleState.gameActive) {
        simulateOpponentAnswer();
    }
}

function simulateOpponentAnswer() {
    const answerTime = battleState.opponentSpeed + (Math.random() * 1000 - 500);
    
    setTimeout(() => {
        if (!battleState.gameActive) return;
        
        const isCorrect = Math.random() < battleState.opponentAccuracy;
        
        if (isCorrect) {
            battleState.opponentCorrect++;
            battleState.opponentScore += 10;
            showOpponentFeedback('✓ Correct!', 'correct');
        } else {
            showOpponentFeedback('✗ Wrong', 'wrong');
        }
        
        updateBattleUI();
    }, answerTime);
}

function checkBattleAnswer() {
    const userAnswer = parseInt(document.getElementById('battle-answer').value);
    
    if (isNaN(userAnswer)) return;
    
    battleState.questionsAnswered++;
    
    const feedbackEl = document.getElementById('battle-feedback');
    
    if (userAnswer === battleState.currentAnswer) {
        battleState.playerCorrect++;
        battleState.playerScore += 10;
        feedbackEl.textContent = '✓ Correct! +10';
        feedbackEl.className = 'battle-feedback correct';
        playSound('correct');
        
        // Award coins
        addCoins(1);
    } else {
        feedbackEl.textContent = `✗ Wrong! Answer: ${battleState.currentAnswer}`;
        feedbackEl.className = 'battle-feedback wrong';
        playSound('wrong');
    }
    
    setTimeout(() => {
        feedbackEl.textContent = '';
    }, 1000);
    
    document.getElementById('battle-answer').value = '';
    updateBattleUI();
    generateBattleQuestion();
}

function showOpponentFeedback(text, type) {
    const feedbackEl = document.getElementById('opponent-feedback');
    feedbackEl.textContent = text;
    feedbackEl.className = `battle-feedback ${type}`;
    
    setTimeout(() => {
        feedbackEl.textContent = '';
    }, 1000);
}

function startBattleTimer() {
    battleState.timerInterval = setInterval(() => {
        battleState.timeLeft--;
        updateBattleUI();
        
        if (battleState.timeLeft <= 0) {
            endBattle();
        }
    }, 1000);
}

function updateBattleUI() {
    document.getElementById('battle-timer').textContent = battleState.timeLeft;
    document.getElementById('player-score').textContent = battleState.playerScore;
    document.getElementById('opponent-score').textContent = battleState.opponentScore;
    
    // Update progress bars
    const maxScore = Math.max(battleState.playerScore, battleState.opponentScore, 100);
    const playerPercent = (battleState.playerScore / maxScore) * 100;
    const opponentPercent = (battleState.opponentScore / maxScore) * 100;
    
    document.getElementById('player-progress').style.width = playerPercent + '%';
    document.getElementById('opponent-progress').style.width = opponentPercent + '%';
    
    // Update timer bar
    const timerPercent = (battleState.timeLeft / 60) * 100;
    document.getElementById('battle-timer-bar').style.width = timerPercent + '%';
}

function endBattle() {
    clearInterval(battleState.timerInterval);
    battleState.gameActive = false;
    
    document.getElementById('battle-game-area').classList.add('hidden');
    document.getElementById('battle-result').classList.remove('hidden');
    
    const playerWon = battleState.playerScore > battleState.opponentScore;
    const resultTitle = document.getElementById('battle-result-title');
    const resultIcon = document.getElementById('battle-result-icon');
    
    if (playerWon) {
        resultTitle.textContent = 'Victory!';
        resultIcon.textContent = '🏆';
        playSound('levelup');
        
        // Award bonus coins
        const bonus = Math.floor(battleState.playerScore / 10);
        addCoins(bonus);
        document.getElementById('battle-coins-earned').textContent = `+${bonus} coins earned!`;
    } else if (battleState.playerScore === battleState.opponentScore) {
        resultTitle.textContent = 'Draw!';
        resultIcon.textContent = '🤝';
        document.getElementById('battle-coins-earned').textContent = 'Good effort!';
    } else {
        resultTitle.textContent = 'Defeat';
        resultIcon.textContent = '😔';
        document.getElementById('battle-coins-earned').textContent = 'Try again!';
    }
    
    document.getElementById('battle-final-player-score').textContent = battleState.playerScore;
    document.getElementById('battle-final-opponent-score').textContent = battleState.opponentScore;
    document.getElementById('battle-player-accuracy').textContent = 
        battleState.questionsAnswered > 0 ? Math.round((battleState.playerCorrect / battleState.questionsAnswered) * 100) + '%' : '0%';
}

// Event Listeners (will be attached in main script)
function initBattleMode() {
    const battleSubmit = document.getElementById('battle-submit');
    if (battleSubmit) {
        battleSubmit.addEventListener('click', checkBattleAnswer);
    }
    
    const battleAnswer = document.getElementById('battle-answer');
    if (battleAnswer) {
        battleAnswer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkBattleAnswer();
        });
    }
    
    const battleRestart = document.getElementById('battle-restart');
    if (battleRestart) {
        battleRestart.addEventListener('click', () => {
            document.getElementById('battle-game-area').classList.remove('hidden');
            document.getElementById('battle-result').classList.add('hidden');
            startBattleMode();
        });
    }
    
    const battleMenu = document.getElementById('battle-menu');
    if (battleMenu) {
        battleMenu.addEventListener('click', () => {
            if (battleState.timerInterval) {
                clearInterval(battleState.timerInterval);
            }
            document.getElementById('battle-screen').classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
    }
    
    const battleExit = document.getElementById('battle-exit');
    if (battleExit) {
        battleExit.addEventListener('click', () => {
            if (battleState.timerInterval) {
                clearInterval(battleState.timerInterval);
            }
            battleState.gameActive = false;
            document.getElementById('battle-screen').classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
    }
}
