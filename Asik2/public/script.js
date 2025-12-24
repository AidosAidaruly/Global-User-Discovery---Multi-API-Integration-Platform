console.log('script.js loaded');

async function fetchAndRender() {
    console.log('Requesting /api/data');
    const contentDiv = document.getElementById('content');
    const userSec = document.getElementById('user-section');
    const countrySec = document.getElementById('country-section');
    const newsSec = document.getElementById('news-section');
    
    
    contentDiv.style.display = 'block';
    userSec.innerHTML = '<div class="card"><p>Loading...</p></div>';

    try {
        const response = await fetch('/api/data');
        console.log('Fetch /api/data status', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);

        
        if (!data.user) {
            throw new Error('User data is missing');
        }

        
        userSec.innerHTML = `
            <div class="card">
                ${data.user.photo ? `<img src="${data.user.photo}" alt="Profile">` : '<p>No photo available</p>'}
                <h2>${data.user.name} (${data.user.gender})</h2>
                <p><strong>Age:</strong> ${data.user.age} (DOB: ${data.user.dob})</p>
                <p><strong>Address:</strong> ${data.user.address}</p>
            </div>
        `;

        
        countrySec.innerHTML = `
            <div class="card">
                ${data.country.flag ? `<img src="${data.country.flag}" width="100" alt="Flag">` : ''}
                <h3>Country: ${data.country.name}</h3>
                <p><strong>Capital:</strong> ${data.country.capital}</p>
                <p><strong>Language:</strong> ${data.country.languages}</p>
                <p><strong>Currency Rate:</strong> 1 ${data.country.currency} = ${data.rates.toUSD} USD, ${data.rates.toKZT} KZT</p>
            </div>
        `;

      
        if (data.news && data.news.length > 0) {
            newsSec.innerHTML = '<h3>Local News</h3>' + data.news.map(n => `
                <div class="news-item">
                    <h4><a href="${n.url}" target="_blank">${n.title}</a></h4>
                    ${n.image ? `<img src="${n.image}" alt="News image">` : ''}
                    <p>${n.description || 'No description available'}</p>
                </div>
            `).join('');
        } else {
            newsSec.innerHTML = '<h3>Local News</h3><div class="card"><p>No news available for this country</p></div>';
        }

    } catch (err) {
        console.error('Error fetching data from server', err);
        contentDiv.style.display = 'block';
        userSec.innerHTML = `
            <div class="card">
                <p style="color:red"><strong>Error:</strong> ${err.message || err}</p>
                <p>Please check the console for more details and try again.</p>
            </div>
        `;
        countrySec.innerHTML = '';
        newsSec.innerHTML = '';
    }
}

document.getElementById('fetchBtn').addEventListener('click', fetchAndRender);


window.addEventListener('load', () => {
    console.log('window.load - auto fetching');
    fetchAndRender();

});
