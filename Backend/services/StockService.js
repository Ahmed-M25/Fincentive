const axios = require('axios');

async function fetchRecentStockPrice(ticker) {
  try {
    const apiKey = process.env.API_KEY || 'demo';
    const apiLink = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${apiKey}`;

    const response = await axios.get(apiLink);
    const stockMarketHistory = response.data["Time Series (Daily)"];

    if (!stockMarketHistory) {
      console.error('Stock market history data is missing or undefined.');
      throw new Error('Stock market history data is missing or undefined.');
    }
    
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
