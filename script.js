const dropList = document.querySelectorAll("form select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
  for (let currency_code in country_list) {
    let selected =
      i == 0
        ? currency_code == "USD" ? "selected" : ""
        : currency_code == "EWC" ? "selected" : "";
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
  });
}

function loadFlag(element) {
  for (let code in country_list) {
    if (code == element.value) {
      let imgTag = element.parentElement.querySelector("img");
      if (element.value === "EWC") {
        imgTag.src = "https://i.postimg.cc/x8YzsqGy/Ecowater-Coin.png";
      } else if (element.value === "USD") {
        imgTag.src = "https://flagcdn.com/48x36/us.png";
      } else {
        imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
      }
    }
  }
}

window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate");
  let amountVal = amount.value;

  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = 1;
  }

  exchangeRateTxt.innerText = "Obteniendo tasa de cambio...";

  let fromCurrencyCode = fromCurrency.value;
  let toCurrencyCode = toCurrency.value;

  if (fromCurrencyCode === "EWC") {
    // Convertir EWC a USD
    fromCurrencyCode = "USD";
    amountVal *= 10.20;
  } else if (toCurrencyCode === "EWC") {
    // Convertir USD a EWC
    toCurrencyCode = "USD";
    amountVal /= 10.20;
  }

  let url = `https://v6.exchangerate-api.com/v6/3b0ced116570a94553360516/latest/${fromCurrencyCode}`;

  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrencyCode];
      let totalExRate = (amountVal * exchangeRate).toFixed(2);
      exchangeRateTxt.innerText = `${totalExRate} ${toCurrency.value}`;
    })
    .catch(() => {
      exchangeRateTxt.innerText = "Ha ocurrido un error";
    });
}
