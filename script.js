document.getElementById("searchButton").addEventListener("click", function() {
    const searchQuery = document.getElementById("searchInput").value.trim();

    if (searchQuery) {
        fetch(`https://api.scryfall.com/cards/search?q=${searchQuery}`)
            .then(response => response.json())
            .then(data => {
                const cardDisplay = document.getElementById("cardDisplay");
                cardDisplay.innerHTML = ""; // Clear existing cards

                // Create and display the cards
                data.data.forEach(card => {
                    const cardContainer = document.createElement("div");
                    cardContainer.classList.add("card-container");

                    const cardBox = document.createElement("div");
                    cardBox.classList.add("card-box");

                    const cardImage = document.createElement("img");
                    cardImage.classList.add("card-image");
                    cardImage.src = card.image_uris.normal;

                    const cardText = document.createElement("div");
                    cardText.classList.add("card-text");
                    cardText.textContent = card.name;

                    cardBox.appendChild(cardImage);
                    cardBox.appendChild(cardText);
                    cardContainer.appendChild(cardBox);
                    cardDisplay.appendChild(cardContainer);
                });

                // If content is generated, trigger the appearance of the bottom background
                document.body.classList.add('page-has-content');
            })
            .catch(error => console.error("Error fetching data:", error));
    }
});
