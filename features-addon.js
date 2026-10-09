// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== THEME SYSTEM ==========
function applyTheme(themeName) {
    const theme = THEMES[themeName];
    if (!theme) return;
    
    document.documentElement.style.setProperty('--primary', theme.colors[0]);
    document.documentElement.style.setProperty('--secondary', theme.colors[1]);
    persistentStats.currentTheme = themeName;
    saveStats();
}

// ========== POWER-UP SYSTEM ==========
function usePowerUp(powerUpType) {
    if (persistentStats.powerUps[powerUpType] <= 0) {
        showNotification('Not enough power-ups! Buy more in shop.', 'error');
        return false;
    }
    
    persistentStats.powerUps[powerUpType]--;
    playSound('powerup');
    
    switch(powerUpType) {
        case 'timeFreeze':
            activateTimeFreeze();
            break;
        case 'doublePoints':
            activateDoublePoints();
            break;
        case 'shield':
            activateShield();
            break;
        case 'hint':
            activateHint();
            break;
    }
    
    updatePowerUpUI();
    saveStats();
    return true;
}

function activateTimeFreeze() {
    clearInterval(gameState.timerInterval);
    gameState.activePowerUps.timeFreeze = true;
    showNotification('⏸️ Time Frozen for 10 seconds!', 'success');
    
    setTimeout(() => {
        gameState.activePowerUps.timeFreeze = false;
        startTimer();
        showNotification('⏯️ Time resumed!', 'info');
    }, 10000);
}

function activateDoublePoints() {
    gameState.activePowerUps.doublePoints = true;
    showNotification('2️⃣ Double Points for 30 seconds!', 'success');
    
    setTimeout(() => {
        gameState.activePowerUps.doublePoints = false;
        showNotification('Points back to normal', 'info');
    }, 30000);
}

function activateShield() {
    gameState.shieldActive = true;
    showNotification('🛡️ Shield Active! Next wrong answer protected', 'success');
}

function activateHint() {
    const answer = gameState.currentAnswer;
    const range = Math.max(5, Math.floor(answer * 0.2));
    const min = answer - range;
    const max = answer + range;
    showNotification(`💡 Hint: Answer is between ${min} and ${max}`, 'info');
}

function updatePowerUpUI() {
    const powerUpContainer = document.getElementById('powerup-container');
    if (!powerUpContainer) return;
    
    powerUpContainer.innerHTML = Object.keys(POWERUPS).map(key => {
        const powerup = POWERUPS[key];
        const count = persistentStats.powerUps[key] || 0;
        return `
            <button class="powerup-btn" onclick="usePowerUp('${key}')" ${count <= 0 ? 'disabled' : ''}>
                <span class="powerup-icon">${powerup.icon}</span>
                <span class="powerup-count">${count}</span>
            </button>
        `;
    }).join('');
}

// ========== COIN SYSTEM ==========
function addCoins(amount) {
    persistentStats.coins += amount;
    const coinCountEl = document.getElementById('coin-count');
    if (coinCountEl) {
        coinCountEl.textContent = persistentStats.coins;
    }
    playSound('coin');
    saveStats();
    
    // Animate coin
    const coinDisplay = document.getElementById('coins-display');
    if (coinDisplay) {
        coinDisplay.classList.add('coin-bounce');
        setTimeout(() => coinDisplay.classList.remove('coin-bounce'), 500);
    }
}

function updateCoinDisplay() {
    const coinEl = document.getElementById('coin-count');
    if (coinEl) {
        coinEl.textContent = persistentStats.coins;
    }
}

// ========== SHOP SYSTEM ==========
function openShop() {
    const shopHTML = `
        <div class="shop-overlay" id="shop-overlay">
            <div class="shop-container">
                <h2>🛒 Shop</h2>
                <button class="shop-close" onclick="closeShop()">✕</button>
                
                <div class="shop-tabs">
                    <button class="shop-tab active" onclick="showShopTab('powerups')">Power-ups</button>
                    <button class="shop-tab" onclick="showShopTab('themes')">Themes</button>
                    <button class="shop-tab" onclick="showShopTab('backgrounds')">Backgrounds</button>
                    <button class="shop-tab" onclick="showShopTab('avatars')">Avatars</button>
                </div>
                
                <div id="shop-content" class="shop-content"></div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', shopHTML);
    showShopTab('powerups');
}

function closeShop() {
    document.getElementById('shop-overlay').remove();
}

function showShopTab(tab) {
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    const content = document.getElementById('shop-content');
    
    if (tab === 'powerups') {
        content.innerHTML = Object.keys(POWERUPS).map(key => {
            const powerup = POWERUPS[key];
            return `
                <div class="shop-item">
                    <div class="shop-item-icon">${powerup.icon}</div>
                    <div class="shop-item-info">
                        <h3>${powerup.name}</h3>
                        <p>${powerup.desc}</p>
                    </div>
                    <button class="shop-buy-btn" onclick="buyPowerUp('${key}')">
                        💰 ${powerup.cost}
                    </button>
                </div>
            `;
        }).join('');
    } else if (tab === 'themes') {
        content.innerHTML = Object.keys(THEMES).map(key => {
            const theme = THEMES[key];
            const owned = persistentStats.unlockedThemes.includes(key);
            const active = persistentStats.currentTheme === key;
            return `
                <div class="shop-item ${active ? 'active' : ''}">
                    <div class="shop-item-icon">${theme.icon}</div>
                    <div class="shop-item-info">
                        <h3>${theme.name}</h3>
                        <div class="theme-preview" style="background: linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})"></div>
                    </div>
                    ${owned ? 
                        `<button class="shop-buy-btn ${active ? 'active' : ''}" onclick="applyTheme('${key}')">
                            ${active ? '✓ Active' : 'Use'}
                        </button>` :
                        `<button class="shop-buy-btn" onclick="buyTheme('${key}')">
                            💰 ${theme.cost}
                        </button>`
                    }
                </div>
            `;
        }).join('');
    } else if (tab === 'backgrounds') {
        content.innerHTML = Object.keys(BACKGROUNDS).map(key => {
            const bg = BACKGROUNDS[key];
            const active = persistentStats.currentBackground === key;
            return `
                <div class="shop-item ${active ? 'active' : ''}">
                    <div class="shop-item-icon">${bg.icon}</div>
                    <div class="shop-item-info">
                        <h3>${bg.name}</h3>
                        <p>${bg.desc}</p>
                    </div>
                    <button class="shop-buy-btn ${active ? 'active' : ''}" onclick="applyBackground('${key}')">
                        ${active ? '✓ Active' : bg.cost === 0 ? 'FREE' : '💰 ' + bg.cost}
                    </button>
                </div>
            `;
        }).join('');
    } else if (tab === 'avatars') {
        content.innerHTML = AVATARS.map(avatar => {
            const active = persistentStats.selectedAvatar === avatar;
            return `
                <div class="shop-item avatar-item ${active ? 'active' : ''}">
                    <div class="shop-item-icon large">${avatar}</div>
                    <button class="shop-buy-btn ${active ? 'active' : ''}" onclick="selectAvatar('${avatar}')">
                        ${active ? '✓ Active' : 'Select'}
                    </button>
                </div>
            `;
        }).join('');
    }
}

function buyPowerUp(type) {
    const powerup = POWERUPS[type];
    if (persistentStats.coins >= powerup.cost) {
        persistentStats.coins -= powerup.cost;
        persistentStats.powerUps[type]++;
        updateCoinDisplay();
        saveStats();
        showNotification(`Bought ${powerup.name}!`, 'success');
        showShopTab('powerups');
    } else {
        showNotification('Not enough coins!', 'error');
    }
}

function buyTheme(themeName) {
    const theme = THEMES[themeName];
    if (persistentStats.coins >= theme.cost) {
        persistentStats.coins -= theme.cost;
        persistentStats.unlockedThemes.push(themeName);
        updateCoinDisplay();
        saveStats();
        showNotification(`Unlocked ${theme.name} theme!`, 'success');
        showShopTab('themes');
    } else {
        showNotification('Not enough coins!', 'error');
    }
}

function selectAvatar(avatar) {
    persistentStats.selectedAvatar = avatar;
    const avatarEl = document.getElementById('current-avatar');
    if (avatarEl) {
        avatarEl.textContent = avatar;
    }
    saveStats();
    showShopTab('avatars');
}

function applyBackground(bgKey) {
    persistentStats.currentBackground = bgKey;
    saveStats();
    
    // Remove all existing background classes
    document.body.classList.remove('bg-stars', 'bg-particles', 'bg-waves', 'bg-matrix', 'bg-bubbles');
    
    // Apply new background
    if (bgKey !== 'none') {
        document.body.classList.add(`bg-${bgKey}`);
    }
    
    showNotification(`Background changed to ${BACKGROUNDS[bgKey].name}!`, 'success');
    showShopTab('backgrounds');
}

// ========== SETTINGS SYSTEM ==========
function openSettings() {
    const settingsHTML = `
        <div class="settings-overlay" id="settings-overlay">
            <div class="settings-container">
                <h2>⚙️ Settings</h2>
                <button class="settings-close" onclick="closeSettings()">✕</button>
                
                <div class="settings-content">
                    <div class="setting-item">
                        <label>🔊 Sound Effects</label>
                        <label class="toggle">
                            <input type="checkbox" id="sound-toggle" ${persistentStats.soundEnabled ? 'checked' : ''} onchange="toggleSound()">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label>🎵 Background Music</label>
                        <label class="toggle">
                            <input type="checkbox" id="music-toggle" ${persistentStats.musicEnabled ? 'checked' : ''} onchange="toggleMusic()">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label>📊 Difficulty</label>
                        <select id="difficulty-select" onchange="changeDifficulty()">
                            <option value="easy">Easy</option>
                            <option value="medium" selected>Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    
                    <button class="danger-btn" onclick="resetProgress()">🗑️ Reset All Progress</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', settingsHTML);
}

function closeSettings() {
    document.getElementById('settings-overlay').remove();
}

function toggleSound() {
    persistentStats.soundEnabled = document.getElementById('sound-toggle').checked;
    saveStats();
}

function toggleMusic() {
    persistentStats.musicEnabled = document.getElementById('music-toggle').checked;
    saveStats();
}

function changeDifficulty() {
    gameState.difficultyLevel = document.getElementById('difficulty-select').value;
}

function resetProgress() {
    if (confirm('Are you sure? This will delete all your progress!')) {
        localStorage.removeItem('mathMasterStats');
        location.reload();
    }
}

// Initialize on load
function initializeFeatures() {
    if (typeof persistentStats === 'undefined') return;
    
    updateCoinDisplay();
    
    const streakEl = document.getElementById('streak-count');
    if (streakEl) streakEl.textContent = persistentStats.streak;
    
    const avatarEl = document.getElementById('current-avatar');
    if (avatarEl) avatarEl.textContent = persistentStats.selectedAvatar;
    
    // Event listeners
    const shopBtn = document.getElementById('shop-btn');
    if (shopBtn) shopBtn.addEventListener('click', openShop);
    
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) settingsBtn.addEventListener('click', openSettings);
}

// Wait for both DOM and script.js to be ready
setTimeout(() => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFeatures);
    } else {
        initializeFeatures();
    }
}, 100);
