const cryptoSelect = document.querySelector('#crypto');
const fiatSelect = document.querySelector('#fiat');
const form = document.querySelector('#form');
const result = document.querySelector('#result');
const divMessage = document.querySelector('#divMessage');

const coins = { fiat: '', crypto: ''};
const readValue = event => {coins[event.target.name] = event.target.value};

document.addEventListener('DOMContentLoaded', consultCrypto);
cryptoSelect.addEventListener('change', readValue);
fiatSelect.addEventListener('change', readValue);
form.addEventListener('submit', submitForm);

async function consultCrypto() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    const response = await fetch(url);
    const data = await response.json();
    selectCryptos(data.Data);
}

function selectCryptos(cryptocurrencies) {
    cryptocurrencies.forEach( cripto => {
        const { FullName, Name } = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        cryptoSelect.appendChild(option);
    })
}

function submitForm(event) {
    event.preventDefault();
    if(coins.fiat === '' || coins.crypto === '' ) {
        showAlert('Both field are required');
        return;
    }else{
        getData();
    }
}

function showAlert(message) {
    if(!divMessage.classList.contains('error')) {
        divMessage.classList.add('error', 'alert', 'alert-danger', 'text-center');
        divMessage.textContent = message;
        setTimeout(() => divMessage.remove(), 3000);
    }else{
        divMessage.classList.remove('error', 'alert', 'alert-danger', 'text-center');
        window.location.reload();
    }
}   

async function getData() {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coins.crypto}&tsyms=${coins.fiat}`;
    showSpinner();
    const response = await fetch(url);
    const data = await response.json();
    showResults(data.DISPLAY[coins.crypto][coins.fiat])
}

function showResults(dataResults) {
    cleanHtml();
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE, SUPPLY} = dataResults;
    console.log(dataResults)
    result.classList.add('card', 'mt-3');
    const price = document.createElement('p');
    price.classList.add('font-weight-bold');
    price.innerHTML = `Price: <span class='font-weight-normal'>${PRICE}</span>`;

    const HighPrice = document.createElement('p');
    HighPrice.classList.add('font-weight-bold');
    HighPrice.innerHTML = `High price of day: <span class='font-weight-normal'>${HIGHDAY}</span>`;

    const LowPrice = document.createElement('p');
    LowPrice.classList.add('font-weight-bold');
    LowPrice.innerHTML = `Low price of day: <span class='font-weight-normal'>${LOWDAY}</span>`;

    const lastHours = document.createElement('p');
    lastHours.classList.add('font-weight-bold');
    lastHours.innerHTML = `Variation last 24 hours: <span class='font-weight-normal'>${CHANGEPCT24HOUR}%</span>`;

    const lastUpdate = document.createElement('p');
    lastUpdate.classList.add('font-weight-bold');
    lastUpdate.innerHTML = `Last update:  <span class='font-weight-normal'>${LASTUPDATE}</span>`;

    const supply = document.createElement('p');
    supply.classList.add('font-weight-bold');
    supply.innerHTML = `Supply: <span class='font-weight-normal'>${SUPPLY}</span>`;

    result.appendChild(price);
    result.appendChild(HighPrice);
    result.appendChild(LowPrice);
    result.appendChild(lastHours);
    result.appendChild(lastUpdate);
    result.appendChild(supply);
}

function cleanHtml() {
    while(result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

function showSpinner() {
    cleanHtml();
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    result.appendChild(spinner);
}