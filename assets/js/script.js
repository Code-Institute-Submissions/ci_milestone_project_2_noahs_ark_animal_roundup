//---------- Audio Controls ----------

class AudioController {
    constructor() {
        this.bgMusic = new Audio("assets/audio/roa-music-remember.mp3");
        this.flipSound = new Audio("assets/audio/hitting-bushes-branches-g.mp3");
        this.matchSound = new Audio("assets/audio/match.wav");
        this.victorySound = new Audio("assets/audio/vlad-gluschenko-boat.mp3");
        this.gameOverSound = new Audio("assets/audio/perfect-thunder-storm.mp3");
        this.bgMusic.volume = 0.1;
        this.bgMusic.loop = true;
        this.flipSound.volume = 0.5;
        this.matchSound.volume = 0.5;
        this.victorySound.volume = 0.3;
        this.victorySound.loop = true;
        this.gameOverSound.volume = 0.2;
        this.gameOverSound.loop = true;
        this.musicOn = true;
        this.sfxOn = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
        this.victorySound.pause();
        this.victorySound.currentTime = 0;
        this.gameOverSound.pause();
        this.gameOverSound.currentTime = 0;
    }
    stopSfx() {
        this.flipSound.pause();
        this.flipSound.currentTime = 0;
        this.matchSound.pause();
        this.matchSound.currentTime = 0;
    }
    musicToggle() {
        if (this.musicOn == true) {
            this.stopMusic();
            this.musicOn = false;
        }
        else {
            this.startMusic();
            this.musicOn = true;
        }
    }
    sfxToggle() {
        if (this.sfxOn == true) {
            this.stopSfx();
            this.sfxOn = false;
        }
        else {
            this.sfxOn = true;
        }
    }
    flip() {
        if (this.sfxOn == true) {
            this.flipSound.play();
        }
    }
    match() {
        if (this.sfxOn == true) {
            this.matchSound.play();
        }
    }
    victory() {
        this.stopMusic();
        if (this.musicOn == true) {
            this.victorySound.play();
        }
    }
    gameOver() {
        this.stopMusic();
        if (this.musicOn == true) {
            this.gameOverSound.play();
        }
    }
}

//---------- Main Function ----------

class AnimalRoundup {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById("flips");
        this.score = document.getElementById("score");
        this.audioController = new AudioController();
    }

    //---------- Overlays ----------

    startGame() {
        if (this.countdown !== undefined)
            clearInterval(this.countdown);
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.totalScore = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.audioController.stopMusic();
            if (this.audioController.musicOn == true) {
                this.audioController.startMusic();
            }
            this.shuffleCards();
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 300);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
        this.score.innerText = this.totalScore;
    }

    startCountdown() {
    
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }

    gameOver() {
        clearInterval(this.countdown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }

    victory() {
        clearInterval(this.countdown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }

    //---------- Card Functionality ----------

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            this.totalScore++;
            this.score.innerText = this.totalScore;
            card.classList.add('visible');

           if(this.cardToCheck)
                this.checkForCardMatch(card);
           else
            this.cardToCheck = card;
        }
    }

    //---------- Check to see if cards match ----------
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMisMatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }

    //---------- Cards are a match ----------
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }

    //---------- Cards are not a match ----------
     cardMisMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

    //---------- Check to see the card type ----------
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }

    //---------- Check to see if cards are allowed to flip ----------
    canFlipCard(card) {
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck);
    }

    //---------- Fisher-Yates Shuffle Algorithm ----------

    shuffleCards() {
        for (let i = this.cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }
}

//---------- Initial Loader ----------

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

//---------- Ready Function ----------

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new AnimalRoundup(100, cards);
    let musicToggle = document.getElementById('musicToggle');
    let sfxToggle = document.getElementById('sfxToggle');
    let musicIcon = document.getElementById('music-icon');
    let sfxIcon = document.getElementById('sfx-icon');
    let resetBtn = document.getElementById('resetButton');
    let normalMode = document.getElementById('normalMode');
    let hardMode = document.getElementById('hardMode');
    let modeDisplay = document.getElementById('mode');

    //---------- Overlay Start over on click ----------
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    //---------- Flip cards over on click ----------
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });

    //---------- Reset Button ----------
    resetBtn.addEventListener('click', () => {
        game.startGame();
    });

    //---------- Gamemode Toggle ----------

    function gamemodeToggle(totalTime) {
        game = new AnimalRoundup(totalTime, cards);
        game.startGame();
        modeDisplay.classList.toggle("disappear");
    }

    //---------- Normal Mode ----------
    normalMode.addEventListener('click', () => {
        clearInterval(game.countdown);
        gamemodeToggle(100);
    });

    //---------- Hard Mode ----------
    hardMode.addEventListener('click', () => {
        clearInterval(game.countdown);
        gamemodeToggle(50);
    });

    //---------- Music Toggle ----------
    musicToggle.addEventListener('click', () => {
        musicIcon.classList.toggle("fa-volume-up");
        musicIcon.classList.toggle("fa-volume-off");
        game.audioController.musicToggle();
    });

    //---------- SFX Toggle ----------
    sfxToggle.addEventListener('click', () => {
        sfxIcon.classList.toggle("fa-volume-up");
        sfxIcon.classList.toggle("fa-volume-off");
        game.audioController.sfxToggle();
    });
}

//---------- Contact Form Modal (from W3Schools tutorial in Credit) ----------

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

//----------Closes Modal when form submitted----------
var submitted = document.getElementsByClassName("submitted")[0];

submitted.onclick = function () {
    modal.style.display = "none";
};

// When the user clicks on the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};