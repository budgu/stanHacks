document.addEventListener('DOMContentLoaded', function() {
    const setSelector = document.getElementById('setSelector');
    const gameBoard = document.getElementById('gameBoard');

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
    let firstCard = null;
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
            } else {
                firstCard.cardElement.classList.remove('selected');
            }
            firstCard = null;
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