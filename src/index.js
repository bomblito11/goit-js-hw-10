import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import _ from 'lodash';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function inputHandler(event) {
  let searchValue = event.target.value.trim();
  if (searchValue.length > 0) {
    fetchCountries(searchValue)
      .then(result => makeCountriesList(result))
      .catch(error => {
        console.error(error);
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}

function makeCountriesList(countries) {
  countryList.innerHTML = null;
  countryInfo.innerHTML = null;
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length >= 2 && countries.length <= 10) {
    Array.from(countries).forEach(country => {
      let countryElement = document.createElement('li');
      countryElement.innerHTML = `<img src="${country.flags.svg}" class="country-list__flag"><span class="country-list__name">${country.name.official}</span>`;
      countryList.appendChild(countryElement);
    });
  } else if (countries.length === 1) {
    Array.from(countries).map(country => {
      const languagesStringified = Object.values(country.languages);
      let countryElement = document.createElement('li');
      countryElement.innerHTML = `<ul><li><img src="${country.flags.svg}" class="country-list__flag"><span class="country-list__name">${country.name.official}</span></li>
    <li><b>Capital:</b> ${country.capital}</li>
    <li><b>Population:</b> ${country.population}</li>
    <li><b>Languages:</b> ${languagesStringified}</li>
    </ul>`;
      countryList.appendChild(countryElement);
    });
  }
}

searchBox.addEventListener('input', _.debounce(inputHandler, DEBOUNCE_DELAY));
