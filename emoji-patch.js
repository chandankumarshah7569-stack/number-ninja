// Emoji Patch - Load this after script.js to fix corrupted emojis
// This file uses proper UTF-8 encoding

// Fix Power-ups
if (typeof POWERUPS !== 'undefined') {
    POWERUPS.timeFreeze.icon = '⏸️';
    POWERUPS.doublePoints.icon = '2️⃣';
    POWERUPS.shield.icon = '🛡️';
    POWERUPS.hint.icon = '💡';
}

// Fix Badges
if (typeof BADGES !== 'undefined') {
    BADGES.firstWin.icon = '🎯';
    BADGES.speedMaster.icon = '⚡';
    BADGES.mathNinja.icon = '🥷';
    BADGES.century.icon = '💯';
    BADGES.combo10.icon = '🔥';
    BADGES.perfectionist.icon = '✨';
    BADGES.weekWarrior.icon = '📅';
    BADGES.millionaire.icon = '💰';
}

// Fix Themes
if (typeof THEMES !== 'undefined') {
    THEMES.default.icon = '🎨';
    THEMES.ocean.icon = '🌊';
    THEMES.sunset.icon = '🌅';
    THEMES.forest.icon = '🌲';
    THEMES.galaxy.icon = '🌌';
    THEMES.fire.icon = '🔥';
    THEMES.candy.icon = '🍭';
    THEMES.neon.icon = '💫';
}

// Fix Avatars
if (typeof AVATARS !== 'undefined' && Array.isArray(AVATARS)) {
    AVATARS[0] = '🧠';
    AVATARS[1] = '🎓';
    AVATARS[2] = '🚀';
    AVATARS[3] = '⭐';
    AVATARS[4] = '🏆';
    AVATARS[5] = '👑';
    AVATARS[6] = '🦸';
    AVATARS[7] = '🧙';
    AVATARS[8] = '🤖';
    AVATARS[9] = '👾';
    AVATARS[10] = '🐉';
    AVATARS[11] = '🦄';
}

// Fix persistent stats default avatar
if (typeof persistentStats !== 'undefined' && persistentStats.selectedAvatar) {
    // Only fix if it's corrupted
    if (persistentStats.selectedAvatar.includes('ðŸ') || persistentStats.selectedAvatar.includes('â')) {
        persistentStats.selectedAvatar = '🧠';
        if (typeof saveStats === 'function') {
            saveStats();
        }
    }
}

// Add Background Themes (Free)
window.BACKGROUNDS = {
    none: { name: 'None', desc: 'Clean solid background', icon: '⬜', cost: 0 },
    stars: { name: 'Starry Night', desc: 'Animated stars', icon: '✨', cost: 0 },
    particles: { name: 'Particles', desc: 'Floating particles', icon: '🔮', cost: 0 },
    waves: { name: 'Waves', desc: 'Animated waves', icon: '🌊', cost: 0 },
    matrix: { name: 'Matrix', desc: 'Digital rain effect', icon: '💻', cost: 0 },
    bubbles: { name: 'Bubbles', desc: 'Floating bubbles', icon: '🫧', cost: 0 }
};

// Initialize background settings in persistentStats if not exists
if (typeof persistentStats !== 'undefined') {
    if (!persistentStats.currentBackground) {
        persistentStats.currentBackground = 'none';
    }
    if (typeof saveStats === 'function') {
        saveStats();
    }
}

console.log('✅ Emoji patch applied successfully!');


// Apply saved background on page load
window.addEventListener('DOMContentLoaded', () => {
    if (typeof persistentStats !== 'undefined' && persistentStats.currentBackground) {
        const bgKey = persistentStats.currentBackground;
        if (bgKey !== 'none') {
            document.body.classList.add(`bg-${bgKey}`);
        }
    }
});
