const axios = require('axios');

async function fetchRecentStockPrice(ticker) {
  try {
    const apiKey = process.env.API_KEY || 'demo'; // Use your API key here
    const apiLink = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=demo`;

    const response = await axios.get(apiLink);
    const stockMarketHistory = response.data["Time Series (Daily)"];
    
    // Get the most recent date
    const recentDate = Object.keys(stockMarketHistory)[0];
    const recentStockPrice = stockMarketHistory[recentDate]["1. open"];
    
    return recentStockPrice;
  } catch (error) {
    console.error("Error fetching stock market history:", error);
    throw error;
  }
}

module.exports = fetchRecentStockPrice;
