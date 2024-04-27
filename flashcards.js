document.getElementById('setNameForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('cardCreator').style.display = 'block';
    const setName = document.getElementById('setName').value;
    flashcards.setName(setName);
    localStorage.setItem(setName, JSON.stringify(flashcards.cards));
});

const flashcards = {
    setName: function(name) {
        this.name = name;
        this.cards = JSON.parse(localStorage.getItem(name) || '[]');
    },
    addCard: function(question, answer) {
        this.cards.push({ question, answer });
        localStorage.setItem(this.name, JSON.stringify(this.cards));
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
    const displayDiv = document.getElementById('flashcardDisplay');
    displayDiv.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const cards = JSON.parse(localStorage.getItem(key));
        const cardList = cards.map(card => `${card.question} - ${card.answer}`).join('<br>');
        displayDiv.innerHTML += `<h3>${key}</h3>${cardList}`;
    }
}