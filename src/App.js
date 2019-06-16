import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import BarChart from './visualizations/BarChart';
import {
  getFirstX,
  replaceComma,
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
          agriculture: +replaceComma(country.Agriculture),
          arable: +replaceComma(country['Arable (%)']),
          area: +country['Area (sq. mi.)'],
          birthrate: +replaceComma(country.Birthrate),
          climate: +replaceComma(country.Climate),
          coastline: +replaceComma(country['Coastline (coast/area ratio)']),
          country: country.Country,
          crops: +replaceComma(country['Crops (%)']),
          deathrate: +replaceComma(country.Deathrate),
          gdp: +country['GDP ($ per capita)'],
          industry: +replaceComma(country.Industry),
          infantMortality: +replaceComma(country['Infant mortality (per 1000 births)']),
          literacy: +replaceComma(country['Literacy (%)']),
          netMigration: +replaceComma(country['Net migration']),
          other: +replaceComma(country['Other (%)']),
          phones: +replaceComma(country['Phones (per 1000)']),
          popDensity: +replaceComma(country['Pop. Density (per sq. mi.)']),
          population: +country.Population,
          region: country.Region.trim().toLowerCase(),
          service: +replaceComma(country.Service),
        });
      }
    )
    .then(() => setCountryData(sortByPropertyAsc(parsedCountriesData, 'population')))

    // agriculture: number "0,005"
    // arable: number % "23,46"
    // area: (sq. mi.) "244820"
    // birthrate: number "10,71"
    // climate: number "3"
    // coastline: number (coast/area ratio) "5,08"
    // country: string "United Kingdom "
    // crops: number (%) "0,21"
    // deathrate: number "10,13"
    // gdp: number ($ per capita): "27700"
    // industry: number "0,237"
    // infantMortality: number (per 1000 births): "5,16"
    // literacy: number (%) "99,0"
    // netMigration: number "2,19"
    // other: number (%) "76,33"
    // phones: number (per 1000): "543,5"
    // popDensity: number (per sq. mi.): "247,6"
    // population: number "60609153"
    // region: string "WESTERN EUROPE                     "
    // service: number "0,758"
  }, []);

  useEffect(() => {
    console.log('countryData', countryData);
  }, [countryData]);




  return (
    <div className="App">
      <header className="App-header">
        <BarChart visData={getFirstX(countryData, 10)} width={800} height={300} dataProperty='population' />
        <BarChart visData={getFirstX(countryData, 10)} width={800} height={300} dataProperty='area' />
      </header>
    </div>
  );
}

export default App;
