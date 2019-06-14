import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import BarChart from './visualizations/BarChart';
import {
  getFirstX,
  sortByPropertyAsc,
} from './utils/data-utils';
import countriesData from './data/countries-general-data.csv'
import './App.css';

function App() {
  const [countryData, setCountryData] = useState([]);
  useEffect(() => {
    let parsedCountriesData = [];
    d3.csv(countriesData,
      (country) => {
        parsedCountriesData.push({
          agriculture: country.Agriculture,
          arable: country['Arable (%)'],
          area: country['Area (sq. mi.)'],
          birthrate: country.Birthrate,
          climate: country.Climate,
          coastline: country['Coastline (coast/area ratio)'],
          country: country.Country,
          crops: country['Crops (%)'],
          Deathrate: country.Deathrate,
          gdp: country['GDP ($ per capita)'],
          industry: country.Industry,
          infantMortality: country['Infant mortality (per 1000 births)'],
          literacy: country['Literacy (%)'],
          migration: country['Net migration'],
          other: country['Other (%)'],
          phones: country['Phones (per 1000)'],
          popDensity: country['Pop. Density (per sq. mi.)'],
          population: +country.Population,
          region: country.Region,
          service: country.Service,
        });
      }
    )
    .then(() => setCountryData(sortByPropertyAsc(parsedCountriesData, 'population')))

    // Agriculture: "0,005"
    // Arable (%): "23,46"
    // Area (sq. mi.): "244820"
    // Birthrate: "10,71"
    // Climate: "3"
    // Coastline (coast/area ratio): "5,08"
    // Country: "United Kingdom "
    // Crops (%): "0,21"
    // Deathrate: "10,13"
    // GDP ($ per capita): "27700"
    // Industry: "0,237"
    // Infant mortality (per 1000 births): "5,16"
    // Literacy (%): "99,0"
    // Net migration: "2,19"
    // Other (%): "76,33"
    // Phones (per 1000): "543,5"
    // Pop. Density (per sq. mi.): "247,6"
    // Population: "60609153"
    // Region: "WESTERN EUROPE                     "
    // Service: "0,758"
  }, []);




  return (
    <div className="App">
      <header className="App-header">
        <BarChart visData={getFirstX(countryData, 10)} width={800} height={500} dataProperty='population' />
      </header>
    </div>
  );
}

export default App;
