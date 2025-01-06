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
            // Store the fetched data for later use
            window.travelData = data;  // Store globally for later reference
        })
        .catch(error => console.error("Error fetching JSON:", error));

    // Add event listener to the search button
    const searchButton = document.querySelector("button[type='button']");
    searchButton.addEventListener("click", handleSearch);
});

// Function to handle the search functionality
function handleSearch() {
    const query = document.querySelector("input[type='text']").value.toLowerCase();
    if (!query) return;

    const filteredData = filterRecommendations(query);
    displayRecommendations(filteredData);
}

// Function to filter recommendations based on the search query
function filterRecommendations(query) {
    const filteredData = { countries: [], temples: [], beaches: [] };

    // Loop through categories and filter items based on the query
    for (const category in window.travelData) {
        window.travelData[category].forEach(item => {
            if (item.name.toLowerCase().includes(query) || (item.cities && item.cities.some(city => city.name.toLowerCase().includes(query)))) {
                filteredData[category].push(item);
            }
        });
    }

    return filteredData;
}

// Function to display filtered recommendations
function displayRecommendations(data) {
    // Clear the previous results
    let container = document.querySelector(".recommendation-container");  // Use 'let' instead of 'const'
    if (container) {
        container.innerHTML = '';  // Clear previous results
    } else {
        container = document.createElement("div");
        container.className = "recommendation-container";
        document.body.appendChild(container);
    }

    // Process each category: countries, temples, beaches
    for (const category in data) {
        const categorySection = document.createElement("section");
        categorySection.className = "recommendation-section";
        categorySection.innerHTML = `<h2>${capitalize(category)}</h2>`;

        // Process each item in the category
        data[category].forEach(item => {
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
}



// Function to create a recommendation card
function createRecommendationCard(item) {
    const card = document.createElement("div");
    card.className = "recommendation-card";

    // Use the imageUrl for the image path
    card.innerHTML = `
    <img src="${item.imageUrl}" alt="${item.name}" style="width:100%; height:auto; border-radius:10px; margin-bottom:10px;">
    <h3>${item.name}</h3>
    <p>${item.description}</p>`;


    return card;
}

// Function to capitalize category names
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
