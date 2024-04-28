let firstCard = null; // Global variable to track the first selected card
let userProgress = 0; // Global variable to track the user's progress

//global timer variables
let startTime;
let updatedTime;
let difference;
let tInterval;
let running = false;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('timer').innerHTML = 'Time: 00:00.00';
    const setSelector = document.getElementById('setSelector');
    const gameBoard = document.getElementById('gameBoard');
    const userCar = document.getElementById('userCar');
    const npcCar = document.getElementById('npcCar');
    const trackLength = 1425; // Adjust this based on your race track size
    let npcInterval;

    // Fetch all flashcard sets from the server
    fetch('/flashcardSets')
        .then(response => response.json())
        .then(sets => {
            sets.forEach(setName => {
                const option = document.createElement('option');
                option.value = setName;
                option.textContent = setName;
                setSelector.appendChild(option);
            });
        });

    setSelector.addEventListener('change', function() {
        fetch(`/getFlashcards/${this.value}`)
            .then(response => response.json())
            .then(cards => initializeGameBoard(cards))
            .then(() => startNpcCar());
        startTimer();
    });

    // Call this function to start the timer
    function startTimer() {
        if (!running) {
        startTime = new Date().getTime();
         tInterval = setInterval(getShowTime, 10); // change the update interval to your liking
        running = true;
        }
    }
    // Call this function to stop the timer
    function stopTimer() {
        clearInterval(tInterval);
        running = false;
    }

    // Updates the time display
    function getShowTime() {
        updatedTime = new Date().getTime();
        difference = updatedTime - startTime;
    
        // Calculating minutes, seconds and hundredths
        let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((difference % (1000 * 60)) / 1000);
        let hundredths = Math.floor((difference % 1000) / 10);
    
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        hundredths = (hundredths < 10) ? "0" + hundredths : hundredths;
        document.getElementById('timer').innerHTML = `Time: ${minutes}:${seconds}.${hundredths}`;
    }

    function initializeGameBoard(cards) {
        gameBoard.innerHTML = ''; // Clear previous cards
        let mixedCards = cards.flatMap(card => [
            { content: card.question, matchId: card.answer, type: 'question' },
            { content: card.answer, matchId: card.question, type: 'answer' }
        ]);
        mixedCards = shuffle(mixedCards);

        mixedCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.textContent = card.content;
            cardElement.className = 'card';
            cardElement.dataset.matchId = card.matchId;
            cardElement.addEventListener('click', () => handleCardClick(card, cardElement)); // Changed to addEventListener
            gameBoard.appendChild(cardElement);
        });
    }

    function handleCardClick(card, cardElement) {
        // If no card has been selected yet, mark this card as selected
        if (!firstCard) {
            firstCard = { card, cardElement };
            cardElement.classList.add('selected');
        } else {
            // If a second card is selected and it's a match
            if (firstCard.card.matchId === card.content && firstCard.card.content === card.matchId) {
                firstCard.cardElement.classList.remove('selected');
                firstCard.cardElement.classList.add('matched');
                cardElement.classList.add('matched');

                // Removing event listeners from matched cards
                firstCard.cardElement.removeEventListener('click', firstCard.cardElement.onclick);
                cardElement.removeEventListener('click', cardElement.onclick);

                // Continue with the game logic...
                updateRacePosition();
            } else {
                // If it's not a match, remove the 'selected' class from the first card
                firstCard.cardElement.classList.remove('selected');
            }
            firstCard = null;
        }
    }

    function updateRacePosition() {
        const matchedPairs = document.querySelectorAll('.card.matched').length / 2;
        const totalPairs = document.querySelectorAll('.card').length / 2;
        userProgress++;
        const movePerMatch = trackLength / totalPairs;
        userCar.style.left = `${movePerMatch * userProgress}px`;
    
        // Check if the user has matched all pairs
        if (matchedPairs === totalPairs) {
            clearInterval(npcInterval);
            setTimeout(() => {
                alert('You win!');
            }, 500); // 0.5 second delay before showing the message
            stopTimer();
        }
    }
    

    function startNpcCar() {
        npcInterval = setInterval(() => {
            const currentLeft = parseInt(npcCar.style.left, 10);
            npcCar.style.left = `${currentLeft + 50}px`; // NPC car speed
            if (currentLeft >= trackLength - 75) { // Adjusted to consider the width of the car for a better visual cue
                clearInterval(npcInterval);
                alert('NPC wins!');
            }
        }, 1000); // Adjust timing to control speed
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
