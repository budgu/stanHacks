document.addEventListener('DOMContentLoaded', function() {
    const setSelector = document.getElementById('setSelector');
    const gameBoard = document.getElementById('gameBoard');
    const userCar = document.getElementById('userCar');
    const npcCar = document.getElementById('npcCar');
    const trackLength = 800; // Adjust this based on your race track size
    let npcInterval;

    // Load flashcard sets from localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        setSelector.appendChild(option);
    }

    setSelector.addEventListener('change', function() {
        const selectedSet = JSON.parse(localStorage.getItem(this.value));
        initializeGameBoard(selectedSet);
        startNpcCar();
    });

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
            cardElement.onclick = () => handleCardClick(card, cardElement);
            gameBoard.appendChild(cardElement);
        });
    }

    function startNpcCar() {
        npcInterval = setInterval(() => {
            const currentLeft = parseInt(npcCar.style.left, 10);
            npcCar.style.left = `${currentLeft + 30}px`; // NPC car speed
            if (currentLeft >= trackLength - 20) { // Adjusted to consider the width of the car for a better visual cue
                clearInterval(npcInterval);

            }
        }, 1000); // Adjust timing to control speed
    }
    

    let firstCard = null;
    let userProgress = 0;
    function handleCardClick(card, cardElement) {
        if (!firstCard) {
            firstCard = { card, cardElement };
            cardElement.classList.add('selected');
        } else {
            if (firstCard.card.matchId === card.content && firstCard.card.content === card.matchId) {
                firstCard.cardElement.classList.add('matched');
                cardElement.classList.add('matched');
                firstCard.cardElement.removeEventListener('click', firstCard.cardElement.onclick);
                cardElement.removeEventListener('click', cardElement.onclick);
                updateRacePosition();
            } else {
                firstCard.cardElement.classList.remove('selected');
            }
            firstCard = null;
        }
    }

    function updateRacePosition() {
        const totalPairs = document.querySelectorAll('.card').length / 2;
        userProgress++;
        const movePerMatch = trackLength / totalPairs;
        userCar.style.left = `${movePerMatch * userProgress}px`;
        if (userProgress >= totalPairs) {
            clearInterval(npcInterval);
            setTimeout(() => {
                alert('You win!');
            }, 0.5); // 0.5 second delay before showing the message
        }
    }
    

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
