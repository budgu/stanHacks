document.getElementById('setNameForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('cardCreator').style.display = 'block';
    const setName = document.getElementById('setName').value;
    flashcards.setName(setName);
});

const flashcards = {
    setName: function(name) {
        this.name = name;
        this.cards = [];
    },
    addCard: function(question, answer) {
        fetch('/addFlashcard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ setName: this.name, question, answer })
        }).then(response => response.text())
          .then(data => console.log(data));
        this.cards.push({ question, answer });
    }
};

function addFlashcard() {
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;
    flashcards.addCard(question, answer);
    document.getElementById('question').value = '';
    document.getElementById('answer').value = '';
}

function viewAllFlashcards() {
    fetch('/flashcardSets')
        .then(response => response.json())
        .then(sets => {
            sets.forEach(setName => {
                // For each set, fetch the cards and display them
                fetch(`/getFlashcards/${setName}`)
                    .then(response => response.json())
                    .then(cards => {
                        const displayDiv = document.getElementById('flashcardDisplay');
                        let cardList = cards.map(card => `${card.question} - ${card.answer}`).join('<br>');
                        displayDiv.innerHTML += `<h3>${setName}</h3>${cardList}<br>`;
                    });
            });
        })
        .catch(error => {
            console.error('Error fetching flashcards:', error);
        });
}
