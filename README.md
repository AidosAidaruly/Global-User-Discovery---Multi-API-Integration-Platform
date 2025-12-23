# Global-User-Discovery---Multi-API-Integration-Platform
This project is a full-stack web application that demonstrates the integration of multiple REST APIs to create a comprehensive user information platform. The application generates random user profiles and enriches them with relevant data from various sources, providing users with an engaging and informative experience.
# Random User Information Application

## Project Description
This is a web application that integrates multiple APIs to display comprehensive information about random users from around the world. The application fetches user data, country information, currency exchange rates, and relevant news articles.

## Features
- **Random User Generation**: Fetches random user profiles with personal details
- **Country Information**: Displays country data including flag, capital, and languages
- **Currency Exchange**: Shows real-time exchange rates to USD and KZT
- **News Integration**: Retrieves relevant news articles for the user's country

## Technologies Used
- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **APIs Used**:
  - Random User Generator API
  - REST Countries API
  - Exchange Rate API
  - News API

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd your-project-folder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory with the following content:
   ```
   NEWS_API_KEY=your_news_api_key
   EXCHANGE_RATE_KEY=your_exchange_rate_api_key
   PORT=3000
   ```

   **How to get API keys:**
   - **News API**: Register at https://newsapi.org/ to get a free API key
   - **Exchange Rate API**: Register at https://www.exchangerate-api.com/ to get a free API key

4. **Run the application**
   ```bash
   node server.js
   ```

5. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure
```
project/
├── .env                    # Environment variables (API keys)
├── package.json            # Project dependencies
├── package-lock.json       # Dependency lock file
├── server.js               # Express server with API endpoints
├── README.md               # Project documentation
└── public/                 # Frontend files
    ├── index.html          # Main HTML file
    ├── script.js           # Client-side JavaScript
    └── styles.css          # Styling
```

## API Integration Details

### 1. Random User API
- **Endpoint**: `https://randomuser.me/api/`
- **Purpose**: Generates random user profiles
- **Data Retrieved**: Name, gender, age, date of birth, address, profile picture

### 2. REST Countries API
- **Endpoint**: `https://restcountries.com/v3.1/name/{country}`
- **Purpose**: Fetches country information based on user's location
- **Data Retrieved**: Country name, capital, languages, currency code, flag

### 3. Exchange Rate API
- **Endpoint**: `https://v6.exchangerate-api.com/v6/{API_KEY}/latest/{CURRENCY}`
- **Purpose**: Gets current exchange rates
- **Data Retrieved**: Conversion rates to USD and KZT

### 4. News API
- **Endpoint**: `https://newsapi.org/v2/everything`
- **Purpose**: Fetches news articles related to the user's country
- **Data Retrieved**: Article title, description, URL, image

## Design Decisions

### Backend Architecture
- Used Express.js for efficient routing and middleware support
- Implemented centralized error handling to manage API failures gracefully
- Environment variables used for secure API key management
- Server-side API calls to protect API keys from client exposure

### Frontend Design
- Clean, modern UI with gradient backgrounds and card-based layouts
- Responsive design that works on mobile and desktop devices
- Loading states to improve user experience
- Error handling with user-friendly messages

### Code Organization
- Separation of concerns: server logic in `server.js`, client logic in `script.js`
- Modular approach with clear function responsibilities
- Comprehensive error logging for debugging

## Usage

1. Click the "Get Random User" button
2. The application will:
   - Fetch a random user profile
   - Retrieve country information for that user
   - Get current exchange rates for the country's currency
   - Search for news articles related to the country
3. All information is displayed in organized sections with visual elements

## Error Handling
- If any API fails, the application continues to work with available data
- User-friendly error messages are displayed
- Detailed error logs in the server console for debugging

## Limitations
- Free tier API keys have rate limits:
  - News API: Limited requests per day
  - Exchange Rate API: Limited requests per month
- Some countries may have limited news coverage
- Exchange rates update periodically, not in real-time

## Future Improvements
- Add caching to reduce API calls
- Implement user preferences for currency selection
- Add more data visualization (charts, graphs)
- Include weather information for user's location
- Add map integration to show user's country

## Author
Aidos (Student ID: if applicable)

## License
This project is created for educational purposes as part of a Web Development course assignment.

## Acknowledgments
- Random User API: https://randomuser.me/
- REST Countries API: https://restcountries.com/
- Exchange Rate API: https://www.exchangerate-api.com/
- News API: https://newsapi.org/
