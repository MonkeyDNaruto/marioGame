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

    let score = 0;
    let cross = true;
    let jumping = false;
    let gameActive = false; 

    let wartInitialDuration;

    function captureWartInitialProperties() {
        wartInitialDuration = window.getComputedStyle(wart).animationDuration;
    }

    wart.style.animationPlayState = "paused"; 

    startBtn.addEventListener("click", function () {
        captureWartInitialProperties();

        backgroundSound.currentTime = 0; 
        backgroundSound.play();
        gameActive = true;

        startBtn.style.display = "none";
        wart.style.animationPlayState = "running";

        document.onkeydown = function (e) {
            if (e.keyCode === 38 && !jumping) { 
                jumping = true;
                mario.classList.add("mario-jump");
                jumpSound.play();

                setTimeout(() => {
                    mario.classList.remove("mario-jump");
                    jumping = false;
                }, 600);
            }
            if (e.keyCode === 39) { 
                let marioX = parseInt(window.getComputedStyle(mario).left);
                if (marioX < window.innerWidth - mario.offsetWidth - 10) {
                    mario.style.left = (marioX + 90) + "px";
                }
            }
            if (e.keyCode === 37) { 
                let marioX = parseInt(window.getComputedStyle(mario).left);
                if (marioX > 10) {
                    mario.style.left = (marioX - 90) + "px";
                }
            }
        };

        setInterval(() => {
            if (!gameActive) return;

            let dx = parseInt(window.getComputedStyle(mario).left);
            let dy = parseInt(window.getComputedStyle(mario).top);

            let wx = parseInt(window.getComputedStyle(wart).left);
            let wy = parseInt(window.getComputedStyle(wart).top);

            let offsetX = Math.abs(dx - wx);
            let offsetY = Math.abs(dy - wy);

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

        restartBtn.addEventListener("click", function () {
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
        });

        document.addEventListener("DOMContentLoaded", function () {
            const mario = document.querySelector('.mario');
            const wart = document.querySelector('.obstacle');
            const mobileControls = document.getElementById("mobile-controls");
        
            // Detect if the device is mobile
            function isMobileDevice() {
                return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            }
        
            // Show mobile controls only if the user is on a mobile device
            if (isMobileDevice()) {
                mobileControls.classList.remove("hidden");
                mobileControls.style.visibility = "visible";
            }
        
            // Add event listeners for mobile buttons
            document.getElementById("jump-btn").addEventListener("click", () => {
                if (!mario.classList.contains("mario-jump")) {
                    mario.classList.add("mario-jump");
                    setTimeout(() => {
                        mario.classList.remove("mario-jump");
                    }, 600);
                }
            });
        
            document.getElementById("left-btn").addEventListener("click", () => {
                let marioX = parseInt(window.getComputedStyle(mario).left);
                if (marioX > 10) mario.style.left = (marioX - 90) + "px";
            });
        
            document.getElementById("right-btn").addEventListener("click", () => {
                let marioX = parseInt(window.getComputedStyle(mario).left);
                if (marioX < window.innerWidth - mario.offsetWidth - 10) {
                    mario.style.left = (marioX + 90) + "px";
                }
            });
        });
        

    });
});
