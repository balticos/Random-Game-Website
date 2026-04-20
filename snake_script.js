const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const difSelect = document.querySelector("#dif-select");
const difDisplay = document.querySelector("#dif-display");
const gridSize = 10;
let snake = [{ x: 160, y: 160 }, { x: 150, y: 160 }, { x: 140, y: 160 }];
let food = { x: 420, y: 220 };
let direction = { x: gridSize, y: 0 };
let score = 0;
let gameInterval;
let isGameOver = false;
let gameStarted = false;
let dif = difSelect.value;
const headImage = new Image();
headImage.src = 'images/face_snake.png';
const tailImage = new Image();
tailImage.src = 'images/tail_snake.png';

function getRotationFromVector(vectorX, vectorY) {
    if (vectorX > 0) return 0;
    if (vectorX < 0) return Math.PI;
    if (vectorY > 0) return Math.PI / 2;
    if (vectorY < 0) return -Math.PI / 2;
    return 0;
}

function drawRotatedImage(image, x, y, angle) {
    const centerX = x + gridSize / 2;
    const centerY = y + gridSize / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.drawImage(image, -gridSize / 2, -gridSize / 2, gridSize, gridSize);
    ctx.restore();
}

function playEatSound() {
    let audio = new Audio('snake_eat.ogg');
    audio.volume = 0.2;
    audio.play();
}

function playGameOverSound() {
    let audio = new Audio('snake_gameover.ogg');
    audio.volume = 0.2;
    audio.play();
}
difDisplay.innerText = dif;

difSelect.addEventListener("input", function(){
    dif = difSelect.value;
    difDisplay.innerText = "Sudėtingumas: " + dif;
});

function startGame() {
    snake = [{ x: 160, y: 160 }, { x: 150, y: 160 }, { x: 140, y: 160 }];
    food = { x: 420, y: 220 };
    direction = { x: gridSize, y: 0 };
    score = 0;
    isGameOver = false;
    gameStarted = true;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 150 - 9*Number(dif)); //padaryti, kad 150 butu leciausias, o 30 greiciausias
    drawGame();
}

function endGame() {
    clearInterval(gameInterval);
    isGameOver = true;
    drawGame();
}

function changeDirection(event) {
    if (isGameOver) return;
    const key = event.key.toLowerCase();

    if ((key === 'w' || event.key === 'ArrowUp') && direction.y === 0) {
        direction = { x: 0, y: -gridSize };
    } else if ((key === 's' || event.key === 'ArrowDown') && direction.y === 0) {
        direction = { x: 0, y: gridSize };
    } else if ((key === 'a' || event.key === 'ArrowLeft') && direction.x === 0) {
        direction = { x: -gridSize, y: 0 };
    } else if ((key === 'd' || event.key === 'ArrowRight') && direction.x === 0) {
        direction = { x: gridSize, y: 0 };
    }
}

function detectCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function eatFood() {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        snake.push({});
        playEatSound();
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
        };
    }
}

function gameLoop() {
    if (detectCollision()) {
        playGameOverSound();
        endGame();
        return;
    }

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    eatFood();

    if (!isGameOver) {
        snake.pop();
    }

    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.forEach((segment, index) => {
        const isHead = index === 0;

        if (isHead && headImage.complete && headImage.naturalWidth > 0) {
            const headAngle = getRotationFromVector(direction.x, direction.y);
            drawRotatedImage(headImage, segment.x, segment.y, headAngle);
            return;
        }

        if (!isHead && tailImage.complete && tailImage.naturalWidth > 0) {
            const prevSegment = snake[index - 1];
            const segmentVectorX = prevSegment ? segment.x - prevSegment.x : -direction.x;
            const segmentVectorY = prevSegment ? segment.y - prevSegment.y : -direction.y;
            const segmentAngle = getRotationFromVector(segmentVectorX, segmentVectorY);
            drawRotatedImage(tailImage, segment.x, segment.y, segmentAngle);
            return;
        }

        if (isHead) {
            ctx.fillStyle = '#6867d6';
        } else {
            ctx.fillStyle = '#b8b7e6';
        }
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    ctx.fillStyle = 'red';
    ctx.beginPath(), ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2), ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Obuoliai: ' + score, 10, 30);

    if (isGameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Žaidimas baigtas!', canvas.width / 2 - 110, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Obuoliai: ' + score, canvas.width / 2 - 40, canvas.height / 2 + 30);
        ctx.fillText('Spauskite, kad pradėti iš naujo', canvas.width / 2 - 130, canvas.height / 2 + 60);
    } else if (!gameStarted) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Spauskite, kad pradėti!', canvas.width / 2 - 160, canvas.height / 2);
    }
}

const fullscreenBtn = document.getElementById('fullscreen-btn');
if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', async () => {

        if (document.fullscreenElement) {
            await document.exitFullscreen?.();
            return;
        }

        const requestFullscreen =
            canvas.requestFullscreen ||
            canvas.webkitRequestFullscreen ||
            canvas.msRequestFullscreen;

        if (requestFullscreen) {
            await requestFullscreen.call(canvas);
        }
    });
}

window.addEventListener('keydown', changeDirection);

canvas.addEventListener('click', () => {
    if (isGameOver) {
        startGame();
    } else if (!gameStarted) {
        startGame();
    }
});
drawGame();
