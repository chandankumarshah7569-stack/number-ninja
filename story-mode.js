// ========== STORY MODE - INDIA MATH JOURNEY ==========

const INDIA_CITIES = {
    mumbai: { name: 'Mumbai', state: 'Maharashtra', icon: '🏙️', difficulty: 1, boss: 'Bollywood Star', bossIcon: '⭐' },
    delhi: { name: 'Delhi', state: 'Delhi', icon: '🏛️', difficulty: 2, boss: 'Parliament Master', bossIcon: '👑' },
    bangalore: { name: 'Bangalore', state: 'Karnataka', icon: '💻', difficulty: 2, boss: 'Tech Guru', bossIcon: '🤖' },
    kolkata: { name: 'Kolkata', state: 'West Bengal', icon: '🎭', difficulty: 3, boss: 'Cultural Champion', bossIcon: '🎨' },
    chennai: { name: 'Chennai', state: 'Tamil Nadu', icon: '🏖️', difficulty: 3, boss: 'Temple Guardian', bossIcon: '🕉️' },
    hyderabad: { name: 'Hyderabad', state: 'Telangana', icon: '💎', difficulty: 3, boss: 'Biryani King', bossIcon: '👨‍🍳' },
    pune: { name: 'Pune', state: 'Maharashtra', icon: '🎓', difficulty: 2, boss: 'Education Master', bossIcon: '📚' },
    ahmedabad: { name: 'Ahmedabad', state: 'Gujarat', icon: '🏭', difficulty: 2, boss: 'Business Tycoon', bossIcon: '💼' },
    jaipur: { name: 'Jaipur', state: 'Rajasthan', icon: '🏰', difficulty: 3, boss: 'Royal Maharaja', bossIcon: '👑' },
    lucknow: { name: 'Lucknow', state: 'Uttar Pradesh', icon: '🕌', difficulty: 3, boss: 'Nawab', bossIcon: '🤴' },
    chandigarh: { name: 'Chandigarh', state: 'Punjab', icon: '🌳', difficulty: 2, boss: 'City Planner', bossIcon: '🏗️' },
    goa: { name: 'Goa', state: 'Goa', icon: '🏝️', difficulty: 1, boss: 'Beach Master', bossIcon: '🏄' },
    kochi: { name: 'Kochi', state: 'Kerala', icon: '🚢', difficulty: 2, boss: 'Spice Trader', bossIcon: '🌶️' },
    bhopal: { name: 'Bhopal', state: 'Madhya Pradesh', icon: '🏞️', difficulty: 2, boss: 'Lake Guardian', bossIcon: '🦢' },
    patna: { name: 'Patna', state: 'Bihar', icon: '📖', difficulty: 3, boss: 'Ancient Scholar', bossIcon: '🧙' }
};

let storyState = {
    currentCity: null,
    matchesCompleted: 0,
    totalMatches: 10,
    isBossFight: false,
    bossLives: 10,
    playerLives: 3,
    currentAnswer: 0,
    score: 0,
    completedCities: [],
    currentQuestion: 1,
    wrongAnswers: 0
};

function startStoryMode() {
    mainMenu.classList.add('hidden');
    document.getElementById('story-screen').classList.remove('hidden');
    showCitySelection();
}

function showCitySelection() {
    document.getElementById('story-city-selection').classList.remove('hidden');
    document.getElementById('story-game-area').classList.add('hidden');
    document.getElementById('story-boss-fight').classList.add('hidden');
    document.getElementById('story-victory').classList.add('hidden');
    
    const cityGrid = document.getElementById('city-grid');
    cityGrid.innerHTML = '';
    
    Object.keys(INDIA_CITIES).forEach(cityKey => {
        const city = INDIA_CITIES[cityKey];
        const isCompleted = storyState.completedCities.includes(cityKey);
        
        const cityCard = document.createElement('div');
        cityCard.className = `city-card ${isCompleted ? 'completed' : ''}`;
        cityCard.innerHTML = `
            <div class="city-icon">${city.icon}</div>
            <div class="city-name">${city.name}</div>
            <div class="city-state">${city.state}</div>
            <div class="city-difficulty">${'⭐'.repeat(city.difficulty)}</div>
            ${isCompleted ? '<div class="completed-badge">✓ Completed</div>' : ''}
        `;
        
        if (!isCompleted) {
            cityCard.addEventListener('click', () => selectCity(cityKey));
        }
        
        cityGrid.appendChild(cityCard);
    });
}

function selectCity(cityKey) {
    storyState.currentCity = cityKey;
    storyState.matchesCompleted = 0;
    storyState.isBossFight = false;
    storyState.score = 0;
    storyState.currentQuestion = 1;
    storyState.wrongAnswers = 0;
    
    startCityMatch();
}

function startCityMatch() {
    document.getElementById('story-city-selection').classList.add('hidden');
    document.getElementById('story-game-area').classList.remove('hidden');
    
    const city = INDIA_CITIES[storyState.currentCity];
    
    document.getElementById('story-city-name').textContent = city.name;
    document.getElementById('story-city-icon').textContent = city.icon;
    document.getElementById('story-matches-progress').textContent = 
        `Match ${storyState.matchesCompleted + 1} / ${storyState.totalMatches}`;
    
    updateStoryUI();
    generateStoryQuestion();
    document.getElementById('story-answer').focus();
}

function generateStoryQuestion() {
    const city = INDIA_CITIES[storyState.currentCity];
    const difficulty = city.difficulty;
    
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    const maxNum = 10 + (difficulty * 10);
    let num1 = Math.floor(Math.random() * maxNum) + 1;
    let num2 = Math.floor(Math.random() * maxNum) + 1;
    
    if (operation === '/') {
        num2 = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * (Math.floor(Math.random() * 12) + 1);
    }
    
    if (operation === '-' && num2 > num1) {
        [num1, num2] = [num2, num1];
    }
    
    document.getElementById('story-question').textContent = `${num1} ${operation} ${num2} = ?`;
    
    switch(operation) {
        case '+': storyState.currentAnswer = num1 + num2; break;
        case '-': storyState.currentAnswer = num1 - num2; break;
        case '*': storyState.currentAnswer = num1 * num2; break;
        case '/': storyState.currentAnswer = num1 / num2; break;
    }
}

function checkStoryAnswer() {
    const userAnswer = parseInt(document.getElementById('story-answer').value);
    
    if (isNaN(userAnswer)) return;
    
    const feedbackEl = document.getElementById('story-feedback');
    
    if (userAnswer === storyState.currentAnswer) {
        storyState.score += 10;
        feedbackEl.textContent = '✓ Correct! +10';
        feedbackEl.className = 'story-feedback correct';
        playSound('correct');
        addCoins(1);
        
        storyState.matchesCompleted++;
        
        if (storyState.matchesCompleted >= storyState.totalMatches) {
            // Start boss fight
            setTimeout(() => startBossFight(), 1000);
        } else {
            setTimeout(() => {
                storyState.currentQuestion++;
                generateStoryQuestion();
                updateStoryUI();
            }, 800);
        }
    } else {
        feedbackEl.textContent = `✗ Wrong! Answer: ${storyState.currentAnswer}`;
        feedbackEl.className = 'story-feedback wrong';
        playSound('wrong');
        storyState.wrongAnswers++;
        
        setTimeout(() => {
            generateStoryQuestion();
        }, 1500);
    }
    
    setTimeout(() => {
        feedbackEl.textContent = '';
    }, 2000);
    
    document.getElementById('story-answer').value = '';
    updateStoryUI();
}

function updateStoryUI() {
    document.getElementById('story-score').textContent = storyState.score;
    document.getElementById('story-matches-progress').textContent = 
        `Match ${storyState.matchesCompleted + 1} / ${storyState.totalMatches}`;
    
    const progress = (storyState.matchesCompleted / storyState.totalMatches) * 100;
    document.getElementById('story-progress-bar').style.width = progress + '%';
}

function startBossFight() {
    document.getElementById('story-game-area').classList.add('hidden');
    document.getElementById('story-boss-fight').classList.remove('hidden');
    
    const city = INDIA_CITIES[storyState.currentCity];
    
    storyState.isBossFight = true;
    storyState.bossLives = 10;
    storyState.playerLives = 3;
    storyState.currentQuestion = 1;
    
    document.getElementById('boss-name').textContent = city.boss;
    document.getElementById('boss-icon').textContent = city.bossIcon;
    document.getElementById('boss-city').textContent = `Boss of ${city.name}`;
    
    updateBossUI();
    generateBossQuestion();
    document.getElementById('boss-answer').focus();
    
    showNotification(`⚔️ Boss Fight! Defeat ${city.boss}!`, 'info');
}

function generateBossQuestion() {
    const city = INDIA_CITIES[storyState.currentCity];
    const difficulty = city.difficulty + 1; // Boss is harder
    
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    const maxNum = 15 + (difficulty * 10);
    let num1 = Math.floor(Math.random() * maxNum) + 1;
    let num2 = Math.floor(Math.random() * maxNum) + 1;
    
    if (operation === '/') {
        num2 = Math.floor(Math.random() * 15) + 1;
        num1 = num2 * (Math.floor(Math.random() * 15) + 1);
    }
    
    if (operation === '-' && num2 > num1) {
        [num1, num2] = [num2, num1];
    }
    
    document.getElementById('boss-question').textContent = `${num1} ${operation} ${num2} = ?`;
    
    switch(operation) {
        case '+': storyState.currentAnswer = num1 + num2; break;
        case '-': storyState.currentAnswer = num1 - num2; break;
        case '*': storyState.currentAnswer = num1 * num2; break;
        case '/': storyState.currentAnswer = num1 / num2; break;
    }
}

function checkBossAnswer() {
    const userAnswer = parseInt(document.getElementById('boss-answer').value);
    
    if (isNaN(userAnswer)) return;
    
    const feedbackEl = document.getElementById('boss-feedback');
    
    if (userAnswer === storyState.currentAnswer) {
        storyState.bossLives--;
        storyState.score += 20;
        feedbackEl.textContent = `💥 Hit! Boss HP: ${storyState.bossLives}/10`;
        feedbackEl.className = 'story-feedback correct';
        playSound('correct');
        addCoins(2);
        
        if (storyState.bossLives <= 0) {
            // Victory!
            setTimeout(() => showCityVictory(), 1000);
        } else {
            setTimeout(() => {
                generateBossQuestion();
            }, 800);
        }
    } else {
        storyState.playerLives--;
        feedbackEl.textContent = `❌ Wrong! Lives: ${storyState.playerLives}/3 | Answer: ${storyState.currentAnswer}`;
        feedbackEl.className = 'story-feedback wrong';
        playSound('wrong');
        
        if (storyState.playerLives <= 0) {
            // Defeat
            setTimeout(() => showBossDefeat(), 1000);
        } else {
            setTimeout(() => {
                generateBossQuestion();
            }, 1500);
        }
    }
    
    setTimeout(() => {
        feedbackEl.textContent = '';
    }, 2000);
    
    document.getElementById('boss-answer').value = '';
    updateBossUI();
}

function updateBossUI() {
    document.getElementById('boss-lives').textContent = '❤️'.repeat(storyState.bossLives);
    document.getElementById('player-lives-boss').textContent = '💚'.repeat(storyState.playerLives);
    
    const bossHPPercent = (storyState.bossLives / 10) * 100;
    document.getElementById('boss-hp-bar').style.width = bossHPPercent + '%';
}

function showCityVictory() {
    document.getElementById('story-boss-fight').classList.add('hidden');
    document.getElementById('story-victory').classList.remove('hidden');
    
    const city = INDIA_CITIES[storyState.currentCity];
    
    // Mark city as completed
    if (!storyState.completedCities.includes(storyState.currentCity)) {
        storyState.completedCities.push(storyState.currentCity);
    }
    
    // Save progress
    persistentStats.storyProgress = storyState.completedCities;
    saveStats();
    
    document.getElementById('victory-city-name').textContent = city.name;
    document.getElementById('victory-city-icon').textContent = city.icon;
    document.getElementById('victory-score').textContent = storyState.score;
    
    const bonusCoins = 50 + (city.difficulty * 20);
    addCoins(bonusCoins);
    document.getElementById('victory-coins').textContent = `+${bonusCoins} coins`;
    
    playSound('levelup');
    showNotification(`🎉 ${city.name} Conquered!`, 'success');
    
    // Check if all cities completed
    if (storyState.completedCities.length === Object.keys(INDIA_CITIES).length) {
        document.getElementById('victory-message').textContent = '🏆 You conquered all of India! Math Champion!';
    } else {
        document.getElementById('victory-message').textContent = `${Object.keys(INDIA_CITIES).length - storyState.completedCities.length} cities remaining!`;
    }
}

function showBossDefeat() {
    document.getElementById('story-boss-fight').classList.add('hidden');
    document.getElementById('story-city-selection').classList.remove('hidden');
    
    showNotification('💔 Boss defeated you! Try again!', 'error');
}

// Event Listeners
function initStoryMode() {
    // Load saved progress
    if (persistentStats.storyProgress) {
        storyState.completedCities = persistentStats.storyProgress;
    }
    
    const storySubmit = document.getElementById('story-submit');
    if (storySubmit) {
        storySubmit.addEventListener('click', checkStoryAnswer);
    }
    
    const storyAnswer = document.getElementById('story-answer');
    if (storyAnswer) {
        storyAnswer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkStoryAnswer();
        });
    }
    
    const bossSubmit = document.getElementById('boss-submit');
    if (bossSubmit) {
        bossSubmit.addEventListener('click', checkBossAnswer);
    }
    
    const bossAnswer = document.getElementById('boss-answer');
    if (bossAnswer) {
        bossAnswer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkBossAnswer();
        });
    }
    
    const storyExit = document.getElementById('story-exit');
    if (storyExit) {
        storyExit.addEventListener('click', () => {
            document.getElementById('story-screen').classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
    }
    
    const nextCity = document.getElementById('next-city');
    if (nextCity) {
        nextCity.addEventListener('click', () => {
            document.getElementById('story-victory').classList.add('hidden');
            showCitySelection();
        });
    }
    
    const storyMenu = document.getElementById('story-menu');
    if (storyMenu) {
        storyMenu.addEventListener('click', () => {
            document.getElementById('story-screen').classList.add('hidden');
            mainMenu.classList.remove('hidden');
        });
    }
}
