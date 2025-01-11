document.addEventListener('DOMContentLoaded', function() {
    const amount = document.getElementById('amount');
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const swapButton = document.getElementById('swap-currencies');
    const popularRatesGrid = document.getElementById('popular-rates-grid');

    async function fetchExchangeRate() {
        try {
            const response = await axios.get(`/currency/rates?base_currency=${fromCurrency.value}&currencies=${toCurrency.value}`);
            const rate = response.data[0].rate;
            updateConversionResult(rate);
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
        }
    }

    function updateConversionResult(rate) {
        const convertedAmount = (amount.value * rate).toFixed(2);
        document.querySelector('.conversion-result').innerHTML = `
            <span class="amount">${amount.value} ${fromCurrency.value} = </span>
            <span class="converted-amount">${convertedAmount} ${toCurrency.value}</span>
        `;
        document.getElementById('update-time').textContent = 'Just now';
    }

    async function fetchPopularRates() {
        try {
            const popularCurrencies = 'EUR,GBP,JPY,AUD,CAD';
            const response = await axios.get(`/currency/rates?base_currency=USD&currencies=${popularCurrencies}`);
            displayPopularRates(response.data);
        } catch (error) {
            console.error('Error fetching popular rates:', error);
        }
    }

    function displayPopularRates(rates) {
        popularRatesGrid.innerHTML = rates.map(rate => `
            <div class="rate-card">
                <div class="currency-pair">USD / ${rate.code}</div>
                <div class="rate-value">${rate.rate.toFixed(4)}</div>
            </div>
        `).join('');
    }

    // Event Listeners
    [amount, fromCurrency, toCurrency].forEach(element => {
        element.addEventListener('change', fetchExchangeRate);
    });

    swapButton.addEventListener('click', () => {
        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
        fetchExchangeRate();
    });

    // Initial fetch
    fetchExchangeRate();
    fetchPopularRates();
}); 