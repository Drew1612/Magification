// On page load, load cards from localStorage (if any)
window.onload = function() {
    const savedCards = localStorage.getItem("cardCollection");
    if (savedCards) {
        const cardList = JSON.parse(savedCards);
        displayCollection(cardList);
    }
};

// Display cards in the collection
function displayCollection(cardList) {
    const cardListContainer = document.getElementById("cardList");
    cardListContainer.innerHTML = ''; // Clear the list

    // Loop through and display each card
    cardList.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card-container");

        const cardImage = document.createElement("img");
        cardImage.classList.add("card-image");
        cardImage.src = card.image;  // Assuming card.image contains the image URL
        cardElement.appendChild(cardImage);

        const cardName = document.createElement("div");
        cardName.classList.add("card-name");
        cardName.textContent = `${card.quantity} ${card.name}`;
        cardElement.appendChild(cardName);

        cardListContainer.appendChild(cardElement);
    });
}

// Search collection for a card
function searchCollection() {
    const query = document.getElementById("collectionSearch").value.toLowerCase();
    const savedCards = localStorage.getItem("cardCollection");
    
    if (savedCards) {
        const cardList = JSON.parse(savedCards);
        const filteredCards = cardList.filter(card => card.name.toLowerCase().includes(query));
        displayCollection(filteredCards);
    }
}
