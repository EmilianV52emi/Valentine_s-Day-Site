// Selectare elemente DOM
let cat = document.getElementById('cat');
let game = document.getElementById('game');
let score = 0;
let scoreElement = document.getElementById('score');
let heartsCollectedElement = document.getElementById('hearts-collected');
let heartsNeededElement = document.getElementById('hearts-needed');
let jumpBtn = document.getElementById('jumpBtn');
let restartBtn = document.getElementById('restartBtn');
let isGameRunning = true;
let gameLoop = null;

// Poziția și viteza pisicii
let catPos = {
    x: 800,
    y: 20,
    speedY: 0,
    speedX: 0
};

// Constante pentru fizică
const GRAVITY = 0.8;
const JUMP_FORCE = 15;
const GROUND_LEVEL = 20;
let isJumping = false;

// Funcția de săritură
function jump() {
    if (!isJumping && isGameRunning) {
        catPos.speedY = JUMP_FORCE;
        isJumping = true;
    }
}

// Event listeners pentru săritură
function setupEventListeners() {
    jumpBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        jump();
    });

    jumpBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        jump();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.code === 'Space') {
            jump();
        }
    });

    restartBtn.addEventListener('click', restartGame);
}

// Generare inimioare
function spawnHeart() {
    if (!isGameRunning) return;

    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = window.innerWidth + 'px';
    heart.style.bottom = '180px';
    game.appendChild(heart);

    let heartPos = window.innerWidth;
    const moveHeart = setInterval(() => {
        if (!isGameRunning) {
            clearInterval(moveHeart);
            return;
        }
        heartPos -= 10;
        heart.style.left = heartPos + 'px';

        if (heartPos < -40) {
            clearInterval(moveHeart);
            heart.remove();
        }
    }, 20);
}

// Verificare coliziuni
function checkCollisions() {
    const hearts = document.getElementsByClassName('heart');
    const catRect = cat.getBoundingClientRect();

    Array.from(hearts).forEach(heart => {
        const heartRect = heart.getBoundingClientRect();
        if (catRect.right > heartRect.left &&
            catRect.left < heartRect.right &&
            catRect.bottom > heartRect.top &&
            catRect.top < heartRect.bottom &&
            !heart.collected) {

            heart.collected = true;
            heart.style.visibility = 'hidden';
            score += 2;
            scoreElement.textContent = 'Scor: ' + score;
            heartsCollectedElement.textContent = 'Inimioare colectate: ' + (score/2);
            heartsNeededElement.textContent = 'Mai ai nevoie de: ' + (24-score)/2;

            if (score >= 24) {
                showWinMessage();
            }
        }
    });
}

// Funcție pentru afișarea mesajului de victorie
function showWinMessage() {
    const winMessage = document.getElementById('winMessage');
    isGameRunning = false;

    setTimeout(() => {
        winMessage.classList.remove('hidden');
        setTimeout(() => {
            winMessage.classList.add('show');
        }, 100);
    }, 500);
}

// Funcția de restart
function restartGame() {
    // Resetare scor
    score = 0;
    scoreElement.textContent = 'Scor: 0';
    heartsCollectedElement.textContent = 'Inimioare colectate: 0';
    heartsNeededElement.textContent = 'Mai ai nevoie de: 12';

    // Resetare poziție pisică
    catPos.x = 600;
    catPos.y = 20;
    catPos.speedY = 0;

    // Ștergere toate inimioarele existente
    const hearts = document.getElementsByClassName('heart');
    while(hearts.length > 0) {
        hearts[0].remove();
    }

    // Ascunde mesajul de victorie
    const winMessage = document.getElementById('winMessage');
    winMessage.classList.remove('show');
    setTimeout(() => {
        winMessage.classList.add('hidden');
    }, 1000);

    // Repornește jocul
    isGameRunning = true;
    isJumping = false;

    // Actualizează poziția pisicii
    cat.style.left = catPos.x + 'px';
    cat.style.bottom = catPos.y + 'px';
    cat.style.transform = 'rotate(0deg)';

    // Asigură-te că game loop-ul rulează
    if (!gameLoop) {
        gameLoop = requestAnimationFrame(update);
    }
}

// Animație pentru pisică
function updateCatAnimation() {
    if (catPos.speedY > 0) {
        cat.style.transform = 'rotate(-15deg)';
    } else if (catPos.speedY < 0) {
        cat.style.transform = 'rotate(15deg)';
    } else {
        cat.style.transform = 'rotate(0deg)';
    }
}

// Game loop principal
function update() {
    if (!isGameRunning) {
        gameLoop = null;
        return;
    }

    // Mișcare automată spre dreapta
    catPos.x += catPos.speedX;

    // Aplicare gravitație
    catPos.speedY -= GRAVITY;
    catPos.y += catPos.speedY;

    // Verificare coliziune cu pământul
    if (catPos.y < GROUND_LEVEL) {
        catPos.y = GROUND_LEVEL;
        catPos.speedY = 0;
        isJumping = false;
    }

    // Reset poziție când ajunge la capătul ecranului
    if (catPos.x > window.innerWidth) {
        catPos.x = -60;
    }

    // Actualizare poziție pisicuță pe ecran
    cat.style.left = catPos.x + 'px';
    cat.style.bottom = catPos.y + 'px';

    // Actualizare animație pisică
    updateCatAnimation();

    // Verificare coliziuni
    checkCollisions();

    // Continuă loop-ul
    gameLoop = requestAnimationFrame(update);
}

// Funcție pentru redimensionarea ferestrei
function handleResize() {
    if (catPos.x > window.innerWidth) {
        catPos.x = -60;
    }
}

// Event listener pentru redimensionare
window.addEventListener('resize', handleResize);

// Inițializare joc
setupEventListeners();
setInterval(spawnHeart, 2000);
update();
