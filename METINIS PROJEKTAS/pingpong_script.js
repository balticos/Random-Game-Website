const gameContainer = document.getElementById('game-container');
const paddle1 = document.getElementById('paddle1');
const paddle2 = document.getElementById('paddle2');
const ball = document.getElementById('ball');
const player1ScoreDisplay = document.getElementById('player1-score');
const player2ScoreDisplay = document.getElementById('player2-score');
const paddleHeight = 100;
const ballSize = 20;
const paddleOffset = 10;
const paddleSpeed = 2;
const aiPaddleSpeed = 0.8;
const aiReactionPadding = 34;

function gameWidth() {
    return gameContainer.clientWidth;
}

function gameHeight() {
    return gameContainer.clientHeight;
}

function maxPaddleY() {
    return gameHeight() - paddleHeight;
}

function ballResetX() {
    return (gameWidth() - ballSize) / 2;
}

function ballResetY() {
    return (gameHeight() - ballSize) / 2;
}
// Track which keys are currently held down
const keysPressed = new Set();

document.addEventListener('keydown', (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    keysPressed.add(key);
});

document.addEventListener('keyup', (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    keysPressed.delete(key);
});

let paddle1Y = Math.max(0, (gameHeight() - paddleHeight) / 2);
let paddle2Y = Math.max(0, (gameHeight() - paddleHeight) / 2);
let ballX = ballResetX();
let ballY = ballResetY();
const baseBallSpeed = 1.25;
let ballSpeedX = baseBallSpeed;
let ballSpeedY = baseBallSpeed;
let player1Score = 0;
let player2Score = 0;

function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls
    if (ballY <= 0 || ballY >= gameHeight() - ballSize) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (ballX <= paddleOffset + 10 && ballY + ballSize >= paddle1Y && ballY <= paddle1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    } else if (
        ballX + ballSize >= gameWidth() - paddleOffset - 10 &&
        ballY + ballSize >= paddle2Y &&
        ballY <= paddle2Y + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball out of bounds
    if (ballX <= 0) {
        increasePlayer2Score();
        resetBall();
    } else if (ballX >= gameWidth() - ballSize) {
        increasePlayer1Score();
        resetBall();
    }

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

function increasePlayer1Score() {
    player1Score++;
    player1ScoreDisplay.textContent = player1Score;
}

function increasePlayer2Score() {
    player2Score++;
    player2ScoreDisplay.textContent = player2Score;
}

function resetBall() {
    ballX = ballResetX();
    ballY = ballResetY();
    ballSpeedX = Math.random() > 0.5 ? baseBallSpeed : -baseBallSpeed;
    ballSpeedY = Math.random() > 0.5 ? baseBallSpeed : -baseBallSpeed;
}

function gameLoop() {
    // Paddle 1 movement (W/S or arrow keys)
    if (keysPressed.has('w') && paddle1Y > 0) paddle1Y -= paddleSpeed;
    if (keysPressed.has('s') && paddle1Y < maxPaddleY()) paddle1Y += paddleSpeed;
    if (keysPressed.has('ArrowUp') && paddle1Y > 0) paddle1Y -= paddleSpeed;
    if (keysPressed.has('ArrowDown') && paddle1Y < maxPaddleY()) paddle1Y += paddleSpeed;

    // Paddle 2 AI: follow ball center with small dead zone.
    const targetY = ballY + ballSize / 2 - paddleHeight / 2;
    if (paddle2Y < targetY - aiReactionPadding) {
        paddle2Y += aiPaddleSpeed;
    } else if (paddle2Y > targetY + aiReactionPadding) {
        paddle2Y -= aiPaddleSpeed;
    }
    paddle2Y = Math.max(0, Math.min(maxPaddleY(), paddle2Y));

    paddle1.style.top = `${paddle1Y}px`;
    paddle2.style.top = `${paddle2Y}px`;

    updateBall();
    requestAnimationFrame(gameLoop);
}

gameLoop();