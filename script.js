

// Shooting Game State
let shootingState = {
    score: 0,
    level: 1,
    enemies: [],
    bullets: [],
    player: { x: 250, y: 450 },
    currentAnswer: 0,
    gameInterval: null,
    spawnInterval: null,
    timeLeft: 60,
    timerInterval: null,
    enemiesDestroyed: 0,
    lives: 3,
    canShoot: false
};

// Game State
let gameState = {
    score: 0,
    level: 1,
    timeLeft: 30,
    maxTime: 30,
    currentAnswer: 0,
    timerInterval: null,
    mode: 'classic',
    practiceOp: null,
    combo: 0,
    bestCombo: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    operationStats: { '+': {correct: 0, total: 0}, '-': {correct: 0, total: 0}, '*': {correct: 0, total: 0}, '/': {correct: 0, total: 0} },
    currentOperation: null,
    activePowerUps: {},
    shieldActive: false,
    difficultyLevel: 'medium'
};

// Persistent Stats (localStorage)
let persistentStats = {
    bestScore: 0,
    totalGames: 0,
    avgAccuracy: 0,
    bestCombo: 0,
    badges: [],
    operationStats: { '+': {correct: 0, total: 0}, '-': {correct: 0, total: 0}, '*': {correct: 0, total: 0}, '/': {correct: 0, total: 0} },
    coins: 0,
    streak: 0,
    lastPlayedDate: null,
    powerUps: { timeFreeze: 3, doublePoints: 3, shield: 3, hint: 3 },
    unlockedThemes: ['default'],
    currentTheme: 'default',
    soundEnabled: true,
    musicEnabled: true,
    selectedAvatar: 'ðŸ§ '
};

// Badge Definitions
const BADGES = {
    firstWin: { id: 'firstWin', name: 'First Steps', icon: 'ðŸŽ¯', desc: 'Complete your first game', coins: 50 },
    speedMaster: { id: 'speedMaster', name: 'Speed Master', icon: 'âš¡', desc: 'Reach level 10', coins: 100 },
    mathNinja: { id: 'mathNinja', name: 'Math Ninja', icon: 'ðŸ¥·', desc: 'Reach level 25', coins: 250 },
    century: { id: 'century', name: 'Century Club', icon: 'ðŸ’¯', desc: '100 correct answers', coins: 200 },
    combo10: { id: 'combo10', name: 'Combo King', icon: 'ðŸ”¥', desc: '10 combo streak', coins: 150 },
    perfectionist: { id: 'perfectionist', name: 'Perfectionist', icon: 'âœ¨', desc: '100% accuracy in a game', coins: 300 },
    weekWarrior: { id: 'weekWarrior', name: 'Week Warrior', icon: 'ðŸ“…', desc: '7 day streak', coins: 500 },
    millionaire: { id: 'millionaire', name: 'Millionaire', icon: 'ðŸ’°', desc: 'Earn 1000 coins', coins: 0 }
};

// Themes
const THEMES = {
    default: { name: 'Classic', colors: ['#667eea', '#764ba2'], cost: 0, icon: 'ðŸŽ¨' },
    ocean: { name: 'Ocean', colors: ['#2E3192', '#1BFFFF'], cost: 100, icon: 'ðŸŒŠ' },
    sunset: { name: 'Sunset', colors: ['#FF512F', '#F09819'], cost: 100, icon: 'ðŸŒ…' },
    forest: { name: 'Forest', colors: ['#134E5E', '#71B280'], cost: 150, icon: 'ðŸŒ²' },
    galaxy: { name: 'Galaxy', colors: ['#000428', '#004e92'], cost: 200, icon: 'ðŸŒŒ' },
    fire: { name: 'Fire', colors: ['#f12711', '#f5af19'], cost: 150, icon: 'ðŸ”¥' },
    candy: { name: 'Candy', colors: ['#D38312', '#A83279'], cost: 100, icon: 'ðŸ­' },
    neon: { name: 'Neon', colors: ['#B721FF', '#21D4FD'], cost: 200, icon: 'ðŸ’«' }
};

// Avatars
const AVATARS = ['ðŸ§ ', 'ðŸŽ“', 'ðŸš€', 'â­', 'ðŸ†', 'ðŸ‘‘', 'ðŸ¦¸', 'ðŸ§™', 'ðŸ¤–', 'ðŸ‘¾', 'ðŸ‰', 'ðŸ¦„'];

// Power-up Definitions
const POWERUPS = {
    timeFreeze: { name: 'Time Freeze', icon: 'â¸ï¸', desc: 'Pause timer for 10s', cost: 50 },
    doublePoints: { name: 'Double Points', icon: '2ï¸âƒ£', desc: '2x points for 30s', cost: 75 },
    shield: { name: 'Shield', icon: 'ðŸ›¡ï¸', desc: 'Protect from 1 wrong answer', cost: 100 },
    hint: { name: 'Hint', icon: 'ðŸ’¡', desc: 'Show answer range', cost: 30 }
};

// Sound Effects (using Web Audio API)
const playSound = (type) => {
    if (!persistentStats.soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'correct') {
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } else if (type === 'wrong') {
        oscillator.frequency.value = 200;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'levelup') {
        oscillator.frequency.value = 1000;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } else if (type === 'powerup') {
        oscillator.frequency.value = 1200;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'coin') {
        oscillator.frequency.value = 900;
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    }
};

// Load stats from localStorage
function loadStats() {
    const saved = localStorage.getItem('mathMasterStats');
    if (saved) {
        const loaded = JSON.parse(saved);
        persistentStats = { ...persistentStats, ...loaded };
    }
    
    // Check daily streak
    checkDailyStreak();
    
    // Apply saved theme (if function exists)
    if (typeof applyTheme === 'function') {
        applyTheme(persistentStats.currentTheme);
    }
}

// Check and update daily streak
function checkDailyStreak() {
    const today = new Date().toDateString();
    const lastPlayed = persistentStats.lastPlayedDate;
    
    if (lastPlayed) {
        const lastDate = new Date(lastPlayed);
        const todayDate = new Date(today);
        const diffTime = todayDate - lastDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            // Consecutive day
            persistentStats.streak++;
            persistentStats.coins += 10; // Daily bonus
            if (typeof showNotification === 'function') {
                showNotification(`ðŸ”¥ ${persistentStats.streak} Day Streak! +10 coins`);
            }
        } else if (diffDays > 1) {
            // Streak broken
            persistentStats.streak = 1;
        }
    } else {
        persistentStats.streak = 1;
    }
    
    persistentStats.lastPlayedDate = today;
    saveStats();
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('mathMasterStats', JSON.stringify(persistentStats));
}

// DOM Elements - will be initialized after DOM loads
let mainMenu, practiceMenu, gameScreen, shootingScreen, gameOverScreen, analyticsScreen;
let levelEl, scoreEl, timerEl, timerBar, comboEl, accuracyEl, questionEl, answerInput, submitBtn, feedbackEl, pauseBtn;

// Initialize
loadStats();

// Wait for DOM to be ready before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Initialize DOM elements
    mainMenu = document.getElementById('main-menu');
    practiceMenu = document.getElementById('practice-menu');
    gameScreen = document.getElementById('game-screen');
    shootingScreen = document.getElementById('shooting-screen');
    gameOverScreen = document.getElementById('game-over');
    analyticsScreen = document.getElementById('analytics-screen');
    
    levelEl = document.getElementById('level');
    scoreEl = document.getElementById('score');
    timerEl = document.getElementById('timer');
    timerBar = document.getElementById('timer-bar');
    comboEl = document.getElementById('combo');
    accuracyEl = document.getElementById('accuracy');
    questionEl = document.getElementById('question');
    answerInput = document.getElementById('answer');
    submitBtn = document.getElementById('submit-btn');
    feedbackEl = document.getElementById('feedback');
    pauseBtn = document.getElementById('pause-btn');
    
    console.log('DOM elements initialized');
    
    // Mode Selection
    const modeButtons = document.querySelectorAll('.mode-btn');
    console.log('Found mode buttons:', modeButtons.length);
    
    modeButtons.forEach(btn => {
        console.log('Attaching listener to button:', btn.dataset.mode);
        btn.addEventListener('click', () => {
            console.log('Mode button clicked:', btn.dataset.mode);
            const mode = btn.dataset.mode;
            if (mode === 'practice') {
                mainMenu.classList.add('hidden');
                practiceMenu.classList.remove('hidden');
            } else if (mode === 'shooting') {
                startShootingMode();
            } else if (mode === 'battle') {
                startBattleMode();
            } else if (mode === 'story') {
                startStoryMode();
            } else {
                startGame(mode);
            }
        });
    });

    // Practice Operation Selection
    document.querySelectorAll('.operation-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            gameState.practiceOp = btn.dataset.op;
            startGame('practice');
        });
    });

    document.getElementById('back-to-menu').addEventListener('click', () => {
        practiceMenu.classList.add('hidden');
        mainMenu.classList.remove('hidden');
    });

    // View Analytics
    document.getElementById('view-stats-btn').addEventListener('click', showAnalytics);
    document.getElementById('close-analytics').addEventListener('click', () => {
        analyticsScreen.classList.add('hidden');
        mainMenu.classList.remove('hidden');
    });

    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = document.getElementById('theme-toggle');
        icon.textContent = document.body.classList.contains('dark-mode') ? 'â˜€ï¸' : 'ðŸŒ™';
    });
    
    // Game Event Listeners
    if (submitBtn) {
        submitBtn.addEventListener('click', checkAnswer);
    }
    
    if (answerInput) {
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkAnswer();
        });
    }

    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            startGame(gameState.mode);
        });
    }

    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            gameOverScreen.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            if (gameState.timerInterval) {
                clearInterval(gameState.timerInterval);
                gameState.timerInterval = null;
                pauseBtn.textContent = 'â–¶ï¸ Resume';
                answerInput.disabled = true;
                submitBtn.disabled = true;
            } else {
                startTimer();
                pauseBtn.textContent = 'â¸ï¸ Pause';
                answerInput.disabled = false;
                submitBtn.disabled = false;
                answerInput.focus();
            }
        });
    }
    
    
    // Shooting Mode Event Listeners
    const shootingSubmit = document.getElementById('shooting-submit');
    if (shootingSubmit) {
        shootingSubmit.addEventListener('click', checkShootingAnswer);
    }
    
    const shootingAnswer = document.getElementById('shooting-answer');
    if (shootingAnswer) {
        shootingAnswer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkShootingAnswer();
        });
    }
    
    const shootingRestart = document.getElementById('shooting-restart');
    if (shootingRestart) {
        shootingRestart.addEventListener('click', () => {
            document.getElementById('shooting-game-area').classList.remove('hidden');
            document.getElementById('shooting-game-over').classList.add('hidden');
            
            shootingState = {
                score: 0,
                level: 1,
                enemies: [],
                bullets: [],
                player: { x: 250, y: 450 },
                currentAnswer: 0,
                gameInterval: null,
                spawnInterval: null,
                timeLeft: 60,
                timerInterval: null,
                enemiesDestroyed: 0,
                lives: 3,
                canShoot: false
            };
            
            generateShootingQuestion();
            startShootingGame();
            document.getElementById('shooting-answer').focus();
        });
    }
    
    const shootingMenu = document.getElementById('shooting-menu');
    if (shootingMenu) {
        shootingMenu.addEventListener('click', () => {
            if (shootingState.gameInterval) {
                clearInterval(shootingState.gameInterval);
                clearInterval(shootingState.spawnInterval);
                clearInterval(shootingState.timerInterval);
            }
            document.getElementById('shooting-game-area').classList.remove('hidden');
            document.getElementById('shooting-game-over').classList.add('hidden');
            shootingScreen.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
    }
    
    const shootingExit = document.getElementById('shooting-exit');
    if (shootingExit) {
        shootingExit.addEventListener('click', () => {
            if (shootingState.gameInterval) {
                clearInterval(shootingState.gameInterval);
                clearInterval(shootingState.spawnInterval);
                clearInterval(shootingState.timerInterval);
            }
            shootingScreen.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
    }
    
    // Initialize Battle Mode
    initBattleMode();
    
    // Initialize Story Mode
    initStoryMode();
});

// Game Functions
function startGame(mode) {
    gameState = {
        score: 0,
        level: 1,
        timeLeft: mode === 'hardcore' ? 20 : 30,
        maxTime: mode === 'hardcore' ? 20 : 30,
        currentAnswer: 0,
        timerInterval: null,
        mode: mode,
        practiceOp: gameState.practiceOp,
        combo: 0,
        bestCombo: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        operationStats: { '+': {correct: 0, total: 0}, '-': {correct: 0, total: 0}, '*': {correct: 0, total: 0}, '/': {correct: 0, total: 0} },
        currentOperation: null,
        activePowerUps: {},
        shieldActive: false,
        difficultyLevel: 'medium'
    };
    
    mainMenu.classList.add('hidden');
    practiceMenu.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    gameOverScreen.classList.add('hidden');
    
    updateUI();
    updatePowerUpUI();
    generateQuestion();
    startTimer();
    answerInput.focus();
}

function generateQuestion() {
    const operations = gameState.mode === 'practice' ? [gameState.practiceOp] : ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    gameState.currentOperation = operation;
    
    const maxNum = Math.min(10 + (gameState.level * 3), 100);
    
    let num1 = Math.floor(Math.random() * maxNum) + 1;
    let num2 = Math.floor(Math.random() * maxNum) + 1;
    
    if (operation === '/') {
        num2 = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * (Math.floor(Math.random() * 12) + 1);
    }
    
    if (operation === '-' && num2 > num1) {
        [num1, num2] = [num2, num1];
    }
    
    questionEl.textContent = `${num1} ${operation} ${num2} = ?`;
    
    switch(operation) {
        case '+': gameState.currentAnswer = num1 + num2; break;
        case '-': gameState.currentAnswer = num1 - num2; break;
        case '*': gameState.currentAnswer = num1 * num2; break;
        case '/': gameState.currentAnswer = num1 / num2; break;
    }
}

function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateTimerUI();
        
        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function updateTimerUI() {
    timerEl.textContent = gameState.timeLeft;
    const percentage = (gameState.timeLeft / gameState.maxTime) * 100;
    timerBar.style.width = percentage + '%';
    
    if (percentage < 30) {
        timerBar.style.background = '#f44336';
    } else if (percentage < 60) {
        timerBar.style.background = '#ff9800';
    } else {
        timerBar.style.background = '#4caf50';
    }
}

function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);
    
    if (isNaN(userAnswer)) return;
    
    gameState.totalQuestions++;
    gameState.operationStats[gameState.currentOperation].total++;
    
    if (userAnswer === gameState.currentAnswer) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
    
    updateUI();
    answerInput.value = '';
    
    setTimeout(() => {
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';
    }, 2000);
    
    generateQuestion();
}

function handleCorrectAnswer() {
    gameState.correctAnswers++;
    gameState.operationStats[gameState.currentOperation].correct++;
    gameState.combo++;
    gameState.bestCombo = Math.max(gameState.bestCombo, gameState.combo);
    
    const comboBonus = Math.floor(gameState.combo / 5) * 5;
    let points = (gameState.level * 10) + comboBonus;
    
    // Apply double points power-up
    if (gameState.activePowerUps.doublePoints) {
        points *= 2;
    }
    
    gameState.score += points;
    gameState.timeLeft += 3;
    
    // Award coins
    const coinsEarned = Math.floor(points / 10);
    addCoins(coinsEarned);
    
    feedbackEl.textContent = `âœ“ Correct! +${points}${comboBonus > 0 ? ' (Combo!)' : ''}${gameState.activePowerUps.doublePoints ? ' (2x!)' : ''}`;
    feedbackEl.className = 'feedback correct';
    
    document.body.classList.add('celebrate');
    setTimeout(() => document.body.classList.remove('celebrate'), 500);
    playSound('correct');
    
    if (gameState.combo === 5 || gameState.combo === 10 || gameState.combo === 15) {
        showBadgeNotification(`ðŸ”¥ ${gameState.combo} Combo Streak!`);
    }
    
    const oldLevel = gameState.level;
    if (gameState.score >= gameState.level * 50 && gameState.level < 50) {
        gameState.level++;
        gameState.timeLeft += 10;
        gameState.maxTime = Math.max(gameState.maxTime - 1, gameState.mode === 'hardcore' ? 15 : 20);
        feedbackEl.textContent = `ðŸŽ‰ Level ${gameState.level}! +10s bonus!`;
        playSound('levelup');
        addCoins(gameState.level * 5); // Level up bonus
    }
}

function handleWrongAnswer() {
    // Check if shield is active
    if (gameState.shieldActive) {
        gameState.shieldActive = false;
        feedbackEl.textContent = `ðŸ›¡ï¸ Shield Protected! Answer: ${gameState.currentAnswer}`;
        feedbackEl.className = 'feedback correct';
        playSound('powerup');
        showNotification('Shield absorbed the wrong answer!', 'success');
    } else {
        gameState.combo = 0;
        gameState.timeLeft -= 5;
        
        feedbackEl.textContent = `âœ— Wrong! Correct answer: ${gameState.currentAnswer}`;
        feedbackEl.className = 'feedback wrong';
        
        document.body.classList.add('shake');
        setTimeout(() => document.body.classList.remove('shake'), 500);
        playSound('wrong');
    }
}

function showBadgeNotification(text) {
    const badgeDisplay = document.getElementById('badges-display');
    badgeDisplay.textContent = text;
    badgeDisplay.classList.add('show');
    setTimeout(() => badgeDisplay.classList.remove('show'), 2000);
}

function updateUI() {
    levelEl.textContent = gameState.level;
    scoreEl.textContent = gameState.score;
    comboEl.textContent = gameState.combo;
    const accuracy = gameState.totalQuestions > 0 ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) : 100;
    accuracyEl.textContent = accuracy + '%';
    updateTimerUI();
}

function endGame() {
    clearInterval(gameState.timerInterval);
    
    // Update persistent stats
    persistentStats.totalGames++;
    persistentStats.bestScore = Math.max(persistentStats.bestScore, gameState.score);
    persistentStats.bestCombo = Math.max(persistentStats.bestCombo, gameState.bestCombo);
    
    // Merge operation stats
    for (let op in gameState.operationStats) {
        persistentStats.operationStats[op].correct += gameState.operationStats[op].correct;
        persistentStats.operationStats[op].total += gameState.operationStats[op].total;
    }
    
    // Check for new badges
    const newBadges = checkBadges();
    
    // Calculate average accuracy
    let totalCorrect = 0, totalQuestions = 0;
    for (let op in persistentStats.operationStats) {
        totalCorrect += persistentStats.operationStats[op].correct;
        totalQuestions += persistentStats.operationStats[op].total;
    }
    persistentStats.avgAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    
    saveStats();
    
    // Show game over screen
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    
    const accuracy = gameState.totalQuestions > 0 ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) : 0;
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('final-level').textContent = gameState.level;
    document.getElementById('final-accuracy').textContent = accuracy + '%';
    document.getElementById('final-combo').textContent = gameState.bestCombo;
    
    // Show new badges
    const newBadgesEl = document.getElementById('new-badges');
    if (newBadges.length > 0) {
        newBadgesEl.innerHTML = '<h3>ðŸŽ‰ New Badges Earned!</h3>' + 
            newBadges.map(b => `<div class="badge-earned">${b.icon} ${b.name}</div>`).join('');
    } else {
        newBadgesEl.innerHTML = '';
    }
    
    // Show weak topics
    showWeakTopics();
}

function checkBadges() {
    const newBadges = [];
    
    if (!persistentStats.badges.includes('firstWin') && persistentStats.totalGames === 1) {
        persistentStats.badges.push('firstWin');
        newBadges.push(BADGES.firstWin);
        addCoins(BADGES.firstWin.coins);
    }
    
    if (!persistentStats.badges.includes('speedMaster') && gameState.level >= 10) {
        persistentStats.badges.push('speedMaster');
        newBadges.push(BADGES.speedMaster);
        addCoins(BADGES.speedMaster.coins);
    }
    
    if (!persistentStats.badges.includes('mathNinja') && gameState.level >= 25) {
        persistentStats.badges.push('mathNinja');
        newBadges.push(BADGES.mathNinja);
        addCoins(BADGES.mathNinja.coins);
    }
    
    let totalCorrect = 0;
    for (let op in persistentStats.operationStats) {
        totalCorrect += persistentStats.operationStats[op].correct;
    }
    if (!persistentStats.badges.includes('century') && totalCorrect >= 100) {
        persistentStats.badges.push('century');
        newBadges.push(BADGES.century);
        addCoins(BADGES.century.coins);
    }
    
    if (!persistentStats.badges.includes('combo10') && gameState.bestCombo >= 10) {
        persistentStats.badges.push('combo10');
        newBadges.push(BADGES.combo10);
        addCoins(BADGES.combo10.coins);
    }
    
    const accuracy = gameState.totalQuestions > 0 ? (gameState.correctAnswers / gameState.totalQuestions) * 100 : 0;
    if (!persistentStats.badges.includes('perfectionist') && accuracy === 100 && gameState.totalQuestions >= 10) {
        persistentStats.badges.push('perfectionist');
        newBadges.push(BADGES.perfectionist);
        addCoins(BADGES.perfectionist.coins);
    }
    
    if (!persistentStats.badges.includes('weekWarrior') && persistentStats.streak >= 7) {
        persistentStats.badges.push('weekWarrior');
        newBadges.push(BADGES.weekWarrior);
        addCoins(BADGES.weekWarrior.coins);
    }
    
    if (!persistentStats.badges.includes('millionaire') && persistentStats.coins >= 1000) {
        persistentStats.badges.push('millionaire');
        newBadges.push(BADGES.millionaire);
    }
    
    return newBadges;
}

function showWeakTopics() {
    const weakTopicsEl = document.getElementById('weak-topics');
    const weakOps = [];
    
    for (let op in gameState.operationStats) {
        const stats = gameState.operationStats[op];
        if (stats.total > 0) {
            const accuracy = (stats.correct / stats.total) * 100;
            if (accuracy < 70) {
                const opName = {'+': 'Addition', '-': 'Subtraction', '*': 'Multiplication', '/': 'Division'}[op];
                weakOps.push(`${opName} (${Math.round(accuracy)}%)`);
            }
        }
    }
    
    if (weakOps.length > 0) {
        weakTopicsEl.innerHTML = `<h3>ðŸ“š Practice Recommended</h3><p>Focus on: ${weakOps.join(', ')}</p>`;
    } else {
        weakTopicsEl.innerHTML = '';
    }
}

function showAnalytics() {
    mainMenu.classList.add('hidden');
    analyticsScreen.classList.remove('hidden');
    
    document.getElementById('best-score').textContent = persistentStats.bestScore;
    document.getElementById('total-games').textContent = persistentStats.totalGames;
    document.getElementById('avg-accuracy').textContent = persistentStats.avgAccuracy + '%';
    document.getElementById('best-combo-stat').textContent = persistentStats.bestCombo;
    
    // Operation stats
    const operationStatsEl = document.getElementById('operation-stats');
    const opNames = {'+': 'Addition', '-': 'Subtraction', '*': 'Multiplication', '/': 'Division'};
    operationStatsEl.innerHTML = '';
    
    for (let op in persistentStats.operationStats) {
        const stats = persistentStats.operationStats[op];
        const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        const bar = document.createElement('div');
        bar.className = 'stat-bar';
        bar.innerHTML = `
            <span class="stat-name">${opNames[op]}</span>
            <div class="bar-container">
                <div class="bar-fill" style="width: ${accuracy}%"></div>
            </div>
            <span class="stat-percent">${accuracy}%</span>
        `;
        operationStatsEl.appendChild(bar);
    }
    
    // Earned badges
    const earnedBadgesEl = document.getElementById('earned-badges');
    earnedBadgesEl.innerHTML = '';
    
    for (let badgeId of persistentStats.badges) {
        const badge = BADGES[badgeId];
        const badgeEl = document.createElement('div');
        badgeEl.className = 'badge-card';
        badgeEl.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
            <div class="badge-desc">${badge.desc}</div>
        `;
        earnedBadgesEl.appendChild(badgeEl);
    }
    
    if (persistentStats.badges.length === 0) {
        earnedBadgesEl.innerHTML = '<p class="no-badges">No badges earned yet. Keep playing!</p>';
    }
}

// ========== SHOOTING GAME MODE ==========

function startShootingMode() {
    mainMenu.classList.add('hidden');
    shootingScreen.classList.remove('hidden');
    
    shootingState = {
        score: 0,
        level: 1,
        enemies: [],
        bullets: [],
        player: { x: 250, y: 450 },
        currentAnswer: 0,
        gameInterval: null,
        spawnInterval: null,
        timeLeft: 60,
        timerInterval: null,
        enemiesDestroyed: 0,
        lives: 3,
        canShoot: false
    };
    
    generateShootingQuestion();
    startShootingGame();
    document.getElementById('shooting-answer').focus();
}

function generateShootingQuestion() {
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    const maxNum = 15 + (shootingState.level * 5);
    let num1 = Math.floor(Math.random() * maxNum) + 1;
    let num2 = Math.floor(Math.random() * maxNum) + 1;
    
    if (operation === '/') {
        num2 = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * (Math.floor(Math.random() * 10) + 1);
    }
    
    if (operation === '-' && num2 > num1) {
        [num1, num2] = [num2, num1];
    }
    
    document.getElementById('shooting-question').textContent = `${num1} ${operation} ${num2} = ?`;
    
    switch(operation) {
        case '+': shootingState.currentAnswer = num1 + num2; break;
        case '-': shootingState.currentAnswer = num1 - num2; break;
        case '*': shootingState.currentAnswer = num1 * num2; break;
        case '/': shootingState.currentAnswer = num1 / num2; break;
    }
}

function startShootingGame() {
    const canvas = document.getElementById('shooting-canvas');
    const ctx = canvas.getContext('2d');
    
    // Game loop
    shootingState.gameInterval = setInterval(() => {
        updateShootingGame(ctx);
        renderShootingGame(ctx);
    }, 1000 / 60); // 60 FPS
    
    // Spawn enemies - ensure minimum spawn time
    const spawnTime = Math.max(500, 2000 - (shootingState.level * 100));
    shootingState.spawnInterval = setInterval(() => {
        spawnEnemy();
    }, spawnTime);
    
    // Timer
    shootingState.timerInterval = setInterval(() => {
        shootingState.timeLeft--;
        updateShootingUI();
        
        if (shootingState.timeLeft <= 0 || shootingState.lives <= 0) {
            endShootingGame();
        }
    }, 1000);
    
    updateShootingUI();
}

function spawnEnemy() {
    const enemy = {
        x: Math.random() * 450 + 25,
        y: -30,
        speed: 1 + (shootingState.level * 0.2),
        size: 30,
        color: ['#f44336', '#e91e63', '#9c27b0', '#673ab7'][Math.floor(Math.random() * 4)]
    };
    shootingState.enemies.push(enemy);
}

function updateShootingGame(ctx) {
    // Update enemies
    for (let i = shootingState.enemies.length - 1; i >= 0; i--) {
        const enemy = shootingState.enemies[i];
        enemy.y += enemy.speed;
        
        // Remove if off screen
        if (enemy.y > 520) {
            shootingState.enemies.splice(i, 1);
            shootingState.lives--;
            updateShootingUI();
            
            if (shootingState.lives > 0) {
                playSound('wrong');
            }
        }
    }
    
    // Update bullets with homing behavior
    for (let i = shootingState.bullets.length - 1; i >= 0; i--) {
        const bullet = shootingState.bullets[i];
        
        // Find nearest enemy for aggressive homing
        let nearestEnemy = null;
        let nearestDistance = Infinity;
        
        shootingState.enemies.forEach(enemy => {
            const dx = enemy.x - bullet.x;
            const dy = enemy.y - bullet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        });
        
        // Apply strong homing to nearest enemy
        if (nearestEnemy) {
            const dx = nearestEnemy.x - bullet.x;
            const dy = nearestEnemy.y - bullet.y;
            const angle = Math.atan2(dy, dx);
            
            // Very strong homing - bullet actively tracks target
            const homingStrength = 2.5;
            bullet.speedX += Math.cos(angle) * homingStrength;
            bullet.speedY += Math.sin(angle) * homingStrength;
            
            // Limit max speed
            const speed = Math.sqrt(bullet.speedX * bullet.speedX + bullet.speedY * bullet.speedY);
            if (speed > 90) {
                bullet.speedX = (bullet.speedX / speed) * 90;
                bullet.speedY = (bullet.speedY / speed) * 90;
            }
        }
        
        // Move bullet in its direction
        bullet.x += bullet.speedX;
        bullet.y += bullet.speedY;
        
        // Remove if off screen
        if (bullet.y < 0 || bullet.y > 500 || bullet.x < 0 || bullet.x > 500) {
            shootingState.bullets.splice(i, 1);
            continue;
        }
        
        // Check collision with enemies (very generous hitbox)
        for (let j = shootingState.enemies.length - 1; j >= 0; j--) {
            const enemy = shootingState.enemies[j];
            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Much larger collision radius for guaranteed hits
            if (distance < (enemy.size / 2 + bullet.size / 2 + 15)) {
                // Hit!
                shootingState.enemies.splice(j, 1);
                shootingState.bullets.splice(i, 1);
                shootingState.score += 50;
                shootingState.enemiesDestroyed++;
                
                // Level up every 10 enemies
                if (shootingState.enemiesDestroyed % 10 === 0 && shootingState.enemiesDestroyed > 0) {
                    shootingState.level++;
                    shootingState.timeLeft += 10;
                    
                    // Update spawn rate
                    clearInterval(shootingState.spawnInterval);
                    const spawnTime = Math.max(500, 2000 - (shootingState.level * 100));
                    shootingState.spawnInterval = setInterval(() => {
                        spawnEnemy();
                    }, spawnTime);
                }
                
                updateShootingUI();
                playSound('correct');
                createExplosion(ctx, enemy.x, enemy.y);
                break;
            }
        }
    }
}

function renderShootingGame(ctx) {
    // Clear canvas
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, 500, 500);
    
    // Draw stars background
    ctx.fillStyle = 'white';
    for (let i = 0; i < 50; i++) {
        const x = (i * 37) % 500;
        const y = (i * 73) % 500;
        ctx.fillRect(x, y, 2, 2);
    }
    
    // Draw targeting lines to closest enemy
    if (shootingState.enemies.length > 0) {
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        shootingState.enemies.forEach(enemy => {
            const dx = enemy.x - shootingState.player.x;
            const dy = enemy.y - shootingState.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        });
        
        if (closestEnemy) {
            ctx.strokeStyle = 'rgba(255, 235, 59, 0.3)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(shootingState.player.x, shootingState.player.y - 15);
            ctx.lineTo(closestEnemy.x, closestEnemy.y);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Highlight closest enemy
            ctx.strokeStyle = '#ffeb3b';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(closestEnemy.x, closestEnemy.y, closestEnemy.size / 2 + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    // Draw player
    ctx.fillStyle = '#4caf50';
    ctx.beginPath();
    ctx.moveTo(shootingState.player.x, shootingState.player.y - 15);
    ctx.lineTo(shootingState.player.x - 15, shootingState.player.y + 15);
    ctx.lineTo(shootingState.player.x + 15, shootingState.player.y + 15);
    ctx.closePath();
    ctx.fill();
    
    // Draw player glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#4caf50';
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Draw enemies
    shootingState.enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Enemy face
        ctx.fillStyle = 'white';
        ctx.fillRect(enemy.x - 5, enemy.y - 3, 3, 3);
        ctx.fillRect(enemy.x + 2, enemy.y - 3, 3, 3);
    });
    
    // Draw bullets with trail effect
    shootingState.bullets.forEach(bullet => {
        // Bullet trail (longer and brighter)
        ctx.strokeStyle = 'rgba(255, 235, 59, 0.7)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(bullet.x - bullet.speedX * 3, bullet.y - bullet.speedY * 3);
        ctx.lineTo(bullet.x, bullet.y);
        ctx.stroke();
        
        // Bullet glow
        ctx.fillStyle = '#ffeb3b';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner bright core
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.size / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    });
}

function createExplosion(ctx, x, y) {
    ctx.fillStyle = '#ff9800';
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const px = x + Math.cos(angle) * 20;
        const py = y + Math.sin(angle) * 20;
        ctx.fillRect(px, py, 4, 4);
    }
}

function checkShootingAnswer() {
    const userAnswer = parseInt(document.getElementById('shooting-answer').value);
    
    if (isNaN(userAnswer)) return;
    
    const feedbackEl = document.getElementById('shooting-feedback');
    
    if (userAnswer === shootingState.currentAnswer) {
        // Correct - Find and shoot closest enemy!
        if (shootingState.enemies.length > 0) {
            // Find closest enemy
            let closestEnemy = null;
            let closestDistance = Infinity;
            
            shootingState.enemies.forEach(enemy => {
                const dx = enemy.x - shootingState.player.x;
                const dy = enemy.y - shootingState.player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestEnemy = enemy;
                }
            });
            
            if (closestEnemy) {
                // Create bullet aimed at closest enemy
                const dx = closestEnemy.x - shootingState.player.x;
                const dy = closestEnemy.y - shootingState.player.y;
                const angle = Math.atan2(dy, dx);
                
                shootingState.bullets.push({
                    x: shootingState.player.x,
                    y: shootingState.player.y - 20,
                    speedX: Math.cos(angle) * 75,
                    speedY: Math.sin(angle) * 75,
                    size: 12,
                    targetX: closestEnemy.x,
                    targetY: closestEnemy.y
                });
            }
        }
        
        shootingState.score += 10;
        feedbackEl.textContent = 'ðŸŽ¯ FIRE!';
        feedbackEl.className = 'shooting-feedback correct';
        playSound('correct');
        
        document.body.classList.add('celebrate');
        setTimeout(() => document.body.classList.remove('celebrate'), 200);
    } else {
        // Wrong answer
        feedbackEl.textContent = `âŒ Wrong! Answer: ${shootingState.currentAnswer}`;
        feedbackEl.className = 'shooting-feedback wrong';
        playSound('wrong');
        
        document.body.classList.add('shake');
        setTimeout(() => document.body.classList.remove('shake'), 300);
    }
    
    setTimeout(() => {
        feedbackEl.textContent = '';
    }, 1000);
    
    document.getElementById('shooting-answer').value = '';
    generateShootingQuestion();
    updateShootingUI();
}

function updateShootingUI() {
    document.getElementById('shooting-score').textContent = shootingState.score;
    document.getElementById('shooting-level').textContent = shootingState.level;
    document.getElementById('shooting-timer').textContent = shootingState.timeLeft;
    document.getElementById('shooting-lives').textContent = 'â¤ï¸'.repeat(shootingState.lives);
}

function endShootingGame() {
    clearInterval(shootingState.gameInterval);
    clearInterval(shootingState.spawnInterval);
    clearInterval(shootingState.timerInterval);
    
    shootingState.gameInterval = null;
    shootingState.spawnInterval = null;
    shootingState.timerInterval = null;
    
    const finalScoreEl = document.getElementById('shooting-final-score');
    const finalLevelEl = document.getElementById('shooting-final-level');
    const finalEnemiesEl = document.getElementById('shooting-final-enemies');
    
    finalScoreEl.textContent = shootingState.score;
    finalLevelEl.textContent = shootingState.level;
    finalEnemiesEl.textContent = shootingState.enemiesDestroyed;
    
    document.getElementById('shooting-game-area').classList.add('hidden');
    document.getElementById('shooting-game-over').classList.remove('hidden');
}

