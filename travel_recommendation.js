// Wait for the DOM to load before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Fetch data from the JSON file
    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch the JSON file. Status: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched travel recommendations:", data);
            displayRecommendations(data);
        })
        .catch(error => console.error("Error fetching JSON:", error));
});

// Function to display recommendations
function displayRecommendations(data) {
    const container = document.createElement("div");
    container.className = "recommendation-container";

    // Process each category: countries, temples, beaches
    for (const category in data) {
        const categorySection = document.createElement("section");
        categorySection.className = "recommendation-section";
        categorySection.innerHTML = `<h2>${capitalize(category)}</h2>`;

        // Process each item in the category
        data[category].forEach(item => {
            // Handle nested items for countries (cities)
            if (item.cities) {
                item.cities.forEach(city => {
                    const cityDiv = createRecommendationCard(city);
                    categorySection.appendChild(cityDiv);
                });
            } else {
                const itemDiv = createRecommendationCard(item);
                categorySection.appendChild(itemDiv);
            }
        });

        container.appendChild(categorySection);
    }

    document.body.appendChild(container);
}

// Function to create a recommendation card
function createRecommendationCard(item) {
    const card = document.createElement("div");
    card.className = "recommendation-card";

    // Use the imageUrl for the image path
    card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" class="recommendation-image">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
    `;

    return card;
}

// Function to capitalize category names
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

