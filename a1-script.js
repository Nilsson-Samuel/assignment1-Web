let i = 0;
function fetchDynamicPosts() {
    //API Endpoint: https://jsonplaceholder.typicode.com/posts
    fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Error with the status: " + response.status);
        }
        return response.json();
    })
    .then((posts) => {
        let container = document.getElementById("main-container");
        
        for (let a = 0; a < 3; a++) {
            console.log(posts[i]);
            if (i < posts.length) {
                const article = document.createElement("article");
                const title = document.createElement("h1");
                title.textContent = posts[i].title;
                article.appendChild(title);
                const body = document.createElement("p");
                body.textContent = posts[i].body;
                article.appendChild(body);
                container.appendChild(article);
                i++;
            }
        }
    })
}     






function fetchWeather() {
    const cities = [
        { name: "Tokyo", lat: 35.6895, lon: 139.6917 },
        { name: "Oslo", lat: 59.913868, lon: 10.752245 },
        { name: "Stockholm", lat: 59.329323, lon: 18.068581 },
        { name: "Moskva", lat: 55.755871, lon: 37.617680 },
        { name: "New-York", lat: 40.713051, lon: -74.007233 },
        { name: "New-Delhi", lat: 28.632429, lon: 77.218788 },
        { name: "Brasilia", lat: -15.793889, lon: -47.882778 }, 
        { name: "Madrid", lat: 40.416775, lon: -3.703790 }, 
        { name: "Dubai", lat: 25.204849, lon: -55.270782 }, 
        { name: "Mount Everest", lat: 27.988121, lon: 86.924973 }
    ];  
    
    let container = document.getElementById("weather-container");
    while(container.lastElementChild) {
        container.removeChild(container.lastElementChild);
    }

    const headerRow = document.createElement("div");
    headerRow.className = "grid-row gridHeader";
    const headers = ["City", "Temperature (°C)", "Wind speed (km/h)"];
    headers.forEach((gridHeader) => {
        const headerCell = document.createElement("div");
        headerCell.className = "grid-cell gridHeader";
        headerCell.textContent = gridHeader;
        headerRow.appendChild(headerCell);
    });
    container.appendChild(headerRow);
    
    // Array with all fetches:
    const fetchPromises = cities.map((city) => 
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error with the status: " + response.status);
            }
            return response.json();
        })
        .then((data) => ({
            name: city.name,
            temperature: data.current_weather.temperature,
            windSpeed: data.current_weather.windspeed
        }))
        .catch((error) => {
            console.error(`Error fetching weather data for ${city.name}:`, error);
            return null; 
        })
    );
    // Handles all API-calls at once with promise.all()
    Promise.all(fetchPromises).then((results) => {
        results.forEach((result) => {
            if (result) { 
                const row = document.createElement("div");
                row.className = "grid-row";

                const cityCell = document.createElement("div");
                cityCell.className = "grid-cell";
                cityCell.textContent = result.name;
                row.appendChild(cityCell);

                const temperatureCell = document.createElement("div");
                temperatureCell.className = "grid-cell";
                temperatureCell.textContent = `${result.temperature}°C`;
                row.appendChild(temperatureCell);

                const windSpeedCell = document.createElement("div");
                windSpeedCell.className = "grid-cell";
                windSpeedCell.textContent = `${result.windSpeed} km/h`;
                row.appendChild(windSpeedCell);

                container.appendChild(row);
            }
        });
    });
}