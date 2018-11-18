//`http://data.fixer.io/api/latest?access_key=${fixerIOKey}`;
//`https://restcountries.eu/rest/v2/currency/${currency}`;
const axios = require('axios');
// const getExchageRate = (from, to) => {
//     return axios.get('http://data.fixer.io/api/latest?access_key=2159d50029535534603af1ca98403ae4&format=1')
//     .then(r => {
//         return r.data.rates[to]/r.data.rates[from];
//         // const rate = euro*r.data.rates[to];
//         // return rate
//     });
// };

// with async
const getExchageRate = async (from, to) => {
    const r = await axios.get('http://data.fixer.io/api/latest?access_key=2159d50029535534603af1ca98403ae4&format=1');
    return r.data.rates[to]/r.data.rates[from];
};

const getCountries = async (currencyCode) => {
    const r = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
    return r.data.map(c => c.name);
}

const convertCurrency = async (from, to, amount) => {
    const rate = await getExchageRate(from, to);
    const convertedAmount = (amount * rate).toFixed(2);
    const countriesName = (await getCountries(to)).join(', ');

    return `${from} ${amount} is worth ${to} ${convertedAmount} (${rate.toFixed(2)}) and can be spend in: ${countriesName}`;
}

convertCurrency('USD', 'EUR', 20)
.then(v => console.log(v))
.catch(err => console.log(err, err));

// getExchageRate('USD', 'CAD')
// .then(rate => console.log(rate))
// .catch(e => console.log('error', e));

// getCountries('EUR')
// .then(rate => console.log(rate))
// .catch(e => console.log('error', e));

