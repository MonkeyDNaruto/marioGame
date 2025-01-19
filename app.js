document.addEventListener("DOMContentLoaded", function () {
    const mario = document.querySelector('.mario');
    const wart = document.querySelector('.obstacle');
    const gameOver = document.querySelector(".game-over");
    const scoreValue = document.querySelector("#score");
    const restartBtn = document.querySelector(".restart-btn");
    const startBtn = document.getElementById('start-btn');
    const backgroundSound = document.getElementById('background-sound');
    const jumpSound = document.getElementById('jump-sound');
    const gameoverSound = document.getElementById('gameover-sound');
    const mobileControls = document.getElementById("mobile-controls");

    let score = 0;
    let cross = true;
    let gameActive = false;
    let jumping = false;
    let wartInitialDuration;

    function captureWartInitialProperties() {
        wartInitialDuration = window.getComputedStyle(wart).animationDuration;
    }

    wart.style.animationPlayState = "paused"; 

    function startGame() {
        captureWartInitialProperties();
        backgroundSound.currentTime = 0;
        backgroundSound.play();
        gameActive = true;
        startBtn.style.display = "none";
        wart.style.animationPlayState = "running";

        document.onkeydown = function (e) {
            if (e.keyCode === 38) marioJump();
            if (e.keyCode === 39) moveRight();
            if (e.keyCode === 37) moveLeft();
        };

        gameLoop();
    }

    function marioJump() {
        if (jumping) return;
        jumping = true;
        mario.classList.add("mario-jump");
        jumpSound.play();
        setTimeout(() => {
            mario.classList.remove("mario-jump");
            jumping = false;
        }, 600);
    }

    function moveLeft() {
        let marioX = parseInt(window.getComputedStyle(mario).left);
        if (marioX > 10) mario.style.left = (marioX - 90) + "px";
    }

    function moveRight() {
        let marioX = parseInt(window.getComputedStyle(mario).left);
        if (marioX < window.innerWidth - mario.offsetWidth - 10) {
            mario.style.left = (marioX + 90) + "px";
        }
    }

    function gameLoop() {
        setInterval(() => {
            if (!gameActive) return;

            let marioX = parseInt(window.getComputedStyle(mario).left);
            let marioY = parseInt(window.getComputedStyle(mario).top);
            let wartX = parseInt(window.getComputedStyle(wart).left);
            let wartY = parseInt(window.getComputedStyle(wart).top);

            let offsetX = Math.abs(marioX - wartX);
            let offsetY = Math.abs(marioY - wartY);

            if (offsetX < 80 && offsetY < 52) { 
                showGameOver();
            } else if (offsetX < 50 && cross) { 
                score += 1;
                updateScore(score);
                cross = false;
                setTimeout(() => cross = true, 1000);

                setTimeout(() => {
                    let aniDur = parseFloat(window.getComputedStyle(wart).animationDuration);
                    let newDur = Math.max(aniDur - 0.1, 2);
                    wart.style.animationDuration = newDur + 's';
                }, 500);
            }
        }, 10);
    }

    function updateScore(score) {
        scoreValue.textContent = "Your score: " + score;
    }

    function showGameOver() {
        gameOver.classList.add("show");
        restartBtn.classList.add("show");
        gameoverSound.play();
        backgroundSound.pause();
        wart.style.animationPlayState = "paused";
        gameActive = false;
    }

    function restartGame() {
        score = 0;
        updateScore(score);
        jumping = false;
        mario.style.left = "10px";
        mario.style.bottom = "40px";

        wart.style.animation = "none"; 
        void wart.offsetWidth;
        wart.style.animation = `wart ${wartInitialDuration} linear infinite`;
        wart.style.animationPlayState = "paused";

        backgroundSound.currentTime = 0;
        backgroundSound.play();
        gameOver.classList.remove("show");
        restartBtn.classList.remove("show");

        gameActive = true;
        wart.style.animationPlayState = "running";
    }

    function updateMobileControls() {
        if (window.innerWidth <= 768) {
            mobileControls.style.visibility = "visible";
        } else {
            mobileControls.style.visibility = "hidden";
        }
    }

    window.addEventListener("resize", updateMobileControls);
    updateMobileControls();

    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", restartGame);
    document.getElementById("jump-btn").addEventListener("click", marioJump);
    document.getElementById("left-btn").addEventListener("click", moveLeft);
    document.getElementById("right-btn").addEventListener("click", moveRight);
});
