const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/data', async (req, res) => {
    try {
        // 1. Random User API
        console.log('=== Step 1: Fetching random user ===');
        const userRes = await axios.get('https://randomuser.me/api/');
        const user = userRes.data.results[0];
        
        if (!user) {
            throw new Error('No user data received from Random User API');
        }
        
        console.log('✓ User received:', user.name.first, user.name.last);
        console.log('✓ User location:', user.location.country);
        
        const countryName = user.location.country;

        // 2. REST Countries API
        console.log('\n=== Step 2: Fetching country data for', countryName, '===');
        const countryRes = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);
        
        if (!countryRes.data || countryRes.data.length === 0) {
            throw new Error(`No country data found for ${countryName}`);
        }
        
        const countryData = countryRes.data[0];
        console.log('✓ Country received:', countryData.name.common);
        
        // Извлекаем код валюты
        if (!countryData.currencies) {
            console.warn('⚠ No currency data available, using USD as default');
        }
        const currencyCode = Object.keys(countryData.currencies || { USD: {} })[0];
        console.log('✓ Currency code:', currencyCode);

        // 3. Exchange Rate API
        console.log('\n=== Step 3: Fetching exchange rates for', currencyCode, '===');
        
        if (!process.env.EXCHANGE_RATE_KEY) {
            throw new Error('EXCHANGE_RATE_KEY not found in .env file');
        }
        
        const rateRes = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_KEY}/latest/${currencyCode}`);
        
        if (rateRes.data.result === 'error') {
            throw new Error(`Exchange Rate API error: ${rateRes.data['error-type']}`);
        }
        
        const rates = rateRes.data.conversion_rates;
        console.log('✓ Exchange rates received (USD:', rates.USD, ', KZT:', rates.KZT, ')');

        // 4. News API
        console.log('\n=== Step 4: Fetching news for', countryName, '===');
        
        if (!process.env.NEWS_API_KEY) {
            console.warn('⚠ NEWS_API_KEY not found, skipping news...');
        }
        
        let newsArticles = [];
        
        try {
            const newsRes = await axios.get('https://newsapi.org/v2/everything', {
                params: {
                    q: countryName,
                    language: 'en',
                    pageSize: 5,
                    apiKey: process.env.NEWS_API_KEY
                }
            });
            
            if (newsRes.data.status === 'error') {
                console.warn('⚠ News API error:', newsRes.data.message);
                console.warn('⚠ Continuing without news...');
            } else {
                newsArticles = newsRes.data.articles || [];
                console.log('✓ News received:', newsArticles.length, 'articles');
            }
        } catch (newsError) {
            console.warn('⚠ News API failed:', newsError.message);
            if (newsError.response) {
                console.warn('⚠ News API response:', newsError.response.status, newsError.response.data);
            }
            console.warn('⚠ Continuing without news...');
        }

        // Собираем всё в один объект для фронтенда
        const finalData = {
            user: {
                name: `${user.name.first} ${user.name.last}`,
                gender: user.gender,
                photo: user.picture?.large || user.picture?.medium || '',
                age: user.dob?.age || 'N/A',
                dob: user.dob?.date ? new Date(user.dob.date).toLocaleDateString() : 'N/A',
                address: `${user.location.street?.number || ''} ${user.location.street?.name || ''}, ${user.location.city || ''}, ${user.location.country || ''}`
            },
            country: {
                name: countryData.name?.common || countryName,
                capital: countryData.capital ? countryData.capital[0] : 'N/A',
                languages: countryData.languages ? Object.values(countryData.languages).join(', ') : 'N/A',
                currency: currencyCode,
                flag: countryData.flags?.svg || countryData.flags?.png || ''
            },
            rates: {
                toUSD: rates.USD || 'N/A',
                toKZT: rates.KZT || 'N/A'
            },
            news: newsArticles.slice(0, 5).map(art => ({
                title: art.title || 'No title',
                description: art.description || 'No description available',
                url: art.url || '#',
                image: art.urlToImage || ''
            }))
        };

        console.log('\n✓✓✓ All data collected successfully! Sending to client...\n');
        res.json(finalData);
        
    } catch (error) {
        console.error('\n❌ ERROR occurred:');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        if (error.response) {
            console.error('API Response status:', error.response.status);
            console.error('API Response data:', error.response.data);
        }
        
        res.status(500).json({ 
            error: error.message || 'Failed to fetch data from APIs',
            details: error.response?.data || 'No additional details',
            step: error.config?.url || 'Unknown step'
        });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log('📝 Environment variables loaded:');
    console.log('  - NEWS_API_KEY:', process.env.NEWS_API_KEY ? '✓ Set' : '✗ Missing');
    console.log('  - EXCHANGE_RATE_KEY:', process.env.EXCHANGE_RATE_KEY ? '✓ Set' : '✗ Missing');
    console.log('  - PORT:', PORT);
    console.log('\n');
});