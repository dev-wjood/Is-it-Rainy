// Get elements from HTML tags
const container = document.querySelector('.container');
const cityInput = document.querySelector('.cityInput');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error400 = document.querySelector('.not-found');

const cityName = document.querySelector('.weather-box .cityName');
const image = document.querySelector('.weather-box img');
const temperature = document.querySelector('.weather-box .temperature');
const description = document.querySelector('.weather-box .description');
const humidity = document.querySelector('.weather-details .humidity span');
const wind = document.querySelector('.weather-details .wind span');

const APIKey = 'Your API Key';

let lat;
let lon;
let city;

// Listen for clicking search icon event
search.addEventListener('click', () => {
    city = document.querySelector('.search-box input').value;

    if (city === '') {
        return;
    }

    getCityLatitude();

});
// Listen for pressing the key enter
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        city = document.querySelector('.search-box input').value;

        if (city === '') {
            return;
        }

        getCityLatitude();

    }
});

// Search for Latitude and Longatude addresses of the city
function getCityLatitude() {
    // Create the API URL
    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;

    // Send the API request
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Handle the API response
            if (data.length > 0) {
                lat = data[0].lat;
                lon = data[0].lon;

                console.log(data);

                setTimeout(fetchAndViewWeather, 1000);

            } else {
                // Handle not finding the city
                console.log("City not found");
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error400.style.display = 'block';
                error400.classList.add('fadeIn');
                return;
            }
        })
        .catch(error => console.log(error));
}

// Fetch the city weather data from API and view it on the website
function fetchAndViewWeather() {
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {

            // Remove error image
            error400.style.display = 'none';
            error400.classList.remove('fadeIn');

            console.log(json);

            // Change weather images based on the current weather
            switch (json.current.weather[0].main) {
                case 'Clear':
                    image.src = 'images/sunny.png';
                    break;

                case 'Rain':
                    image.src = 'images/rainy.png';
                    break;

                case 'Snow':
                    image.src = 'images/snowy.png';
                    break;

                case 'Clouds':
                    image.src = 'images/cloudy.png';
                    break;

                case 'Haze':
                    image.src = 'images/windy.png';
                    break;

                case 'Dust':
                    image.src = 'images/dust.png';
                    break;

                default:
                    image.src = '';
            }

            // Get city name
            let name = json.timezone.split('/')[1];
            console.log(name);

            // View the fetched data
            cityName.innerHTML = `${name}`;
            temperature.innerHTML = `${parseInt(json.current.temp)}<span>°C</span>`;
            description.innerHTML = `${json.current.weather[0].description}`;
            humidity.innerHTML = `${json.current.humidity}%`;
            wind.innerHTML = `${parseInt(json.current.wind_speed)}Km/h`;

            // Set the weather card
            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '620px';

        });
}
