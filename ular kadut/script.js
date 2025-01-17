const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startGameButton');

// Ukuran kotak
const box = 20;

// Variabel global
let snake;
let direction;
let nextDirection;
let food;
let score;
let highScore = localStorage.getItem('highScore') || 0; // Ambil high score dari local storage
let speed;
let gameRunning = false;
let isPaused = false; // Menambahkan status pause

function generateFood() {
    const margin = 2; // Margin aman dari dinding dalam grid
    const minX = margin; // Minimum posisi X (grid)
    const minY = margin; // Minimum posisi Y (grid)
    const maxX = (canvas.width / grid) - margin - 1; // Maksimal posisi X (grid)
    const maxY = (canvas.height / grid) - margin - 1; // Maksimal posisi Y (grid)

    food.x = Math.floor(Math.random() * (maxX - minX + 1) + minX) * grid;
    food.y = Math.floor(Math.random() * (maxY - minY + 1) + minY) * grid;
}

// Fungsi untuk memulai ulang permainan
function resetGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    generateFood();
    score = 0;
    speed = 200;
    gameRunning = true;
    isPaused = false; // Pastikan game dimulai dalam keadaan berjalan
    draw();
    startGameLoop();
}

// Mulai game loop
let gameLoop;
function startGameLoop() {
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(game, speed);
}

// Fungsi untuk menggambar game
function draw() {
    // Bersihkan layar
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gambar border
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Gambar ular
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'lime' : 'white';
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    // Gambar makanan
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Gambar skor
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`High Score: ${highScore}`, 10, 50); // Menampilkan high score

    // Tampilkan pesan "Paused" jika permainan dalam mode pause
    if (isPaused) {
        ctx.fillStyle = 'yellow';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Paused', canvas.width / 2, canvas.height / 2);
    }
}

// Logika pergerakan ular
function update() {
    if (isPaused) return; // Jangan update game jika dalam mode pause

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    direction = nextDirection;

    if (direction === 'a') snakeX -= box;
    if (direction === 'w') snakeY -= box;
    if (direction === 'd') snakeX += box;
    if (direction === 's') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };
    snake.unshift(newHead);

    if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= canvas.width ||
        snakeY >= canvas.height ||
        snake.slice(1).some(segment => segment.x === snakeX && segment.y === snakeY)
    ) {
        clearInterval(gameLoop);
        gameRunning = false;

        // Perbarui high score jika perlu
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore); // Simpan ke local storage
        }

        alert(`Game Over! Your score is ${score}. High Score: ${highScore}. Press "Start Game" to play again.`);
    }
}

// Logika utama game
function game() {
    if (!gameRunning) return;
    update();
    draw();
}

// Mendengarkan input keyboard
document.addEventListener('keydown', event => {
    if (!gameRunning) return;

    // Pause/Resume dengan tombol Esc
    if (event.key === 'Escape') {
        isPaused = !isPaused; // Toggle pause
        draw(); // Pastikan "Paused" ditampilkan di layar
        return;
    }

    // Kontrol arah
    if (event.key === 'A' && direction !== 'RIGHT') nextDirection = 'LEFT';
    if (event.key === 'W' && direction !== 'DOWN') nextDirection = 'UP';
    if (event.key === 'D' && direction !== 'LEFT') nextDirection = 'RIGHT';
    if (event.key === 'S' && direction !== 'UP') nextDirection = 'DOWN';
});

// Tombol "Mulai Game"
startButton.addEventListener('click', resetGame);

// Inisialisasi awal
resetGame();
