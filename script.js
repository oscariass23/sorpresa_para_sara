// Global variables
let isMusicPlaying = false;
let audio = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMusic();
    
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
});

// Initialize music player
function initializeMusic() {
    audio = document.getElementById('backgroundMusic');
    
    // Set initial volume
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider && audio) {
        audio.volume = volumeSlider.value / 100;
    }
    
    // Add event listeners for audio
    if (audio) {
        audio.addEventListener('ended', function() {
            // Loop is enabled, so this shouldn't happen, but just in case
            audio.play();
        });
        
        audio.addEventListener('error', function(e) {
            console.error('Error loading audio:', e);
            showNotification('❌ Error al cargar la música');
        });
    }
}

// Toggle music play/pause
function toggleMusic() {
    if (!audio) return;
    
    if (isMusicPlaying) {
        audio.pause();
        isMusicPlaying = false;
        updateMusicButton('▶️');
        showNotification('🎵 Música pausada');
    } else {
        audio.play().then(() => {
            isMusicPlaying = true;
            updateMusicButton('⏸️');
            showNotification('🎵 Música reproduciéndose');
        }).catch(error => {
            console.error('Error playing audio:', error);
            showNotification('❌ Error al reproducir música');
        });
    }
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// Update music button icon
function updateMusicButton(icon) {
    const musicBtn = document.querySelector('.music-btn');
    if (musicBtn) {
        musicBtn.textContent = icon;
    }
}

// Change volume
function changeVolume() {
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider && audio) {
        audio.volume = volumeSlider.value / 100;
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 10000;
        animation: notificationSlide 3s ease-in-out forwards;
        max-width: 90%;
        text-align: center;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

// Add notification animation to CSS
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes notificationSlide {
        0% {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        10% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        90% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// Handle orientation change
window.addEventListener('orientationchange', function() {
    // The cube animation will continue automatically
    // No need to reset anything as the CSS handles the animation
});

// Handle visibility change (app switching)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause music when app is not visible
        if (audio && isMusicPlaying) {
            audio.pause();
        }
    } else {
        // Resume music when app becomes visible again
        if (audio && isMusicPlaying) {
            audio.play().catch(error => {
                console.error('Error resuming audio:', error);
            });
        }
    }
});

// Add error handling
window.addEventListener('error', function(e) {
    console.error('Error occurred:', e.error);
    showNotification('❌ Ocurrió un error. Por favor, recarga la página.');
});

// Add offline/online handling
window.addEventListener('offline', function() {
    showNotification('📡 Sin conexión a internet');
});

window.addEventListener('online', function() {
    showNotification('📡 Conexión restaurada');
});

// Prevent context menu on long press
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
