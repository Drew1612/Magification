let totalCardCount = 0; // Track the total number of cards
let cardList = []; // Track all the cards in the list

// On page load, do not load cards from localStorage (reset card list)
window.onload = function() {
    // Initialize the card list for this session, no localStorage persistence
    cardList = [];
    totalCardCount = 0;
    updateCardDisplay();
    document.getElementById("totalCardsCount").textContent = `Total Cards: ${totalCardCount}`;
};

// Open the MTGO popup
function openMTGOPopup() {
    document.getElementById("mtgoPopup").style.display = "flex";
}

// Close the MTGO popup
function closeMTGOPopup() {
    document.getElementById("mtgoPopup").style.display = "none";
}

// Search a card by name
function searchCard() {
    const cardName = document.getElementById("cardSearch").value;
    fetchCardData(cardName);
}

// Import cards from MTGO list
function importMTGOCards() {
    const mtgoText = document.getElementById("mtgoInput").value;
    const cardNames = mtgoText.split("\n").map(line => line.trim()).filter(Boolean);
    
    // For each line in the MTGO input (formatted as quantity cardName), fetch data
    cardNames.forEach(cardLine => {
        const [quantity, ...cardNameParts] = cardLine.split(" ");
        const cardName = cardNameParts.join(" ");
        fetchCardData(cardName, parseInt(quantity));
    });

    closeMTGOPopup();
}

// Fetch card data from Scryfall API
function fetchCardData(cardName, quantity = 1) {
    fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`)
        .then(response => response.json())
        .then(data => {
            if (data.object === "card") {
                addCardToList(data, quantity);
                updateCardCount(quantity); // Update card count after adding a card
            } else {
                console.log("Card not found:", cardName);
            }
        })
        .catch(error => console.log('Error fetching card data:', error));
}

// Add or update a card in the list
function addCardToList(card, quantity) {
    const existingCard = cardList.find(c => c.name === card.name);

    if (existingCard) {
        // If the card already exists, increase its quantity
        existingCard.quantity += quantity;
    } else {
        // If the card doesn't exist, create a new entry
        cardList.push({ name: card.name, quantity, image: card.image_uris.small });
    }

    // Re-render the card list
    updateCardDisplay();
}

// Remove a card or reduce its quantity
function removeCard(cardName) {
    const cardIndex = cardList.findIndex(card => card.name === cardName);

    if (cardIndex > -1) {
        const card = cardList[cardIndex];

        // If the quantity is more than 1, reduce it
        if (card.quantity > 1) {
            card.quantity -= 1;
            updateCardCount(-1); // Decrease the total card count by 1
        } else {
            // If the quantity is 1, remove the card entirely
            cardList.splice(cardIndex, 1);
            updateCardCount(-1); // Decrease the total card count by 1
        }

        // Re-render the card list
        updateCardDisplay();
    }
}

// Update the card count display
function updateCardCount(amount) {
    totalCardCount += amount;
    document.getElementById("totalCardsCount").textContent = `Total Cards: ${totalCardCount}`;
}

// Update the display after removing or adding cards
function updateCardDisplay() {
    const cardListContainer = document.getElementById("cardList");
    cardListContainer.innerHTML = ''; // Clear the list

    // Re-add remaining cards
    cardList.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card-container");

        const cardImage = document.createElement("img");
        cardImage.classList.add("card-image");
        cardImage.src = card.image;
        cardElement.appendChild(cardImage);

        const cardName = document.createElement("div");
        cardName.classList.add("card-name");
        cardName.textContent = `${card.quantity} ${card.name}`;
        cardElement.appendChild(cardName);

        // Add remove button
        const removeBtn = document.createElement("button");
        removeBtn.classList.add("remove-btn");
        removeBtn.textContent = "Remove";
        removeBtn.onclick = function() {
            removeCard(card.name); // Remove only the specific card clicked
        };
        cardElement.appendChild(removeBtn);

        // Add card to the list and display it
        cardListContainer.appendChild(cardElement);
    });
}

// Save all cards to the collection (update current localStorage data)
function saveToCollection() {
    // Retrieve existing data from localStorage
    const storedCards = localStorage.getItem("cardCollection");
    let existingCards = storedCards ? JSON.parse(storedCards) : [];

    // Merge new cards with existing ones
    cardList.forEach(newCard => {
        const existingCard = existingCards.find(c => c.name === newCard.name);
        if (existingCard) {
            // If the card exists, update its quantity
            existingCard.quantity += newCard.quantity;
        } else {
            // If the card doesn't exist, add it to the collection
            existingCards.push(newCard);
        }
    });

    // Save the updated collection back to localStorage
    localStorage.setItem("cardCollection", JSON.stringify(existingCards));
    alert("Cards updated in collection!");

    // Clear the card list after saving (this will keep the localStorage saved data intact)
    cardList = [];
    updateCardDisplay();
    totalCardCount = 0;
    document.getElementById("totalCardsCount").textContent = `Total Cards: ${totalCardCount}`;
}
