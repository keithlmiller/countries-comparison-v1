import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import BarChart from './visualizations/BarChart/BarChart';
import {
  getFirstX,
  replaceComma,
  sortByPropertyAsc,
} from './utils/data-utils';
import countriesData from './data/countries-general-data.csv'
import './App.scss';

function App() {
  const [countryData, setCountryData] = useState([]);
  const [sortOptions, setSortOptions] = useState([]);
  const [visData, setVisData] = useState([]);
  const [sortProperty, setSortProperty] = useState('population');
  const [compareProperty, setCompareProperty] = useState('area');
  const [sortDisplayName, setSortDisplayName,] = useState('');
  const [compareDisplayName, setCompareDisplayName] = useState('');

  useEffect(() => {
    let parsedCountriesData = [];
    d3.csv(countriesData,
      (country) => {
        parsedCountriesData.push({
          agriculture: { value: +replaceComma(country.Agriculture) },
          arable: { 
            value: +replaceComma(country['Arable (%)']),
            displayName: 'Arable Land Percentage',
            sortable: true,
          },
          area: { 
            value: +country['Area (sq. mi.)'],
            displayName: 'Area (sq. mi.)',
            sortable: true,
          },
          birthrate: { 
            value: +replaceComma(country.Birthrate),
            displayName: 'Birthrate',
            sortable: true,
          },
          climate: { value: +replaceComma(country.Climate) },
          coastline: { value: +replaceComma(country['Coastline (coast/area ratio)']) },
          country: { value: country.Country },
          crops: { value: +replaceComma(country['Crops (%)']) },
          deathrate: { 
            value: +replaceComma(country.Deathrate),
            displayName: 'Deathrate',
            sortable: true,
          },
          gdp: { 
            value: +country['GDP ($ per capita)'],
            displayName: 'GDP ($ per capita)',
            sortable: true,
          },
          industry: { value: +replaceComma(country.Industry) },
          infantMortality: { 
            value: +replaceComma(country['Infant mortality (per 1000 births)']),
            displayName: 'Infant Mortality (per 1000 births)',
            sortable: true,
          },
          literacy: { 
            value: +replaceComma(country['Literacy (%)']),
            displayName: 'Literacy Percentage',
            sortable: true,
          },
          netMigration: { 
            value: +replaceComma(country['Net migration']),
            displayName: 'Net migration',
            sortable: false,
          },
          other: { value: +replaceComma(country['Other (%)']) },
          phones: { 
            value: +replaceComma(country['Phones (per 1000)']),
            displayName: 'Phones per 1000',
            sortable: true,
          },
          popDensity: { 
            value: +replaceComma(country['Pop. Density (per sq. mi.)']),
            displayName: 'Population Density (per sq. mi.)',
            sortable: true,
          },
          population: { 
            value: +country.Population,
            displayName: 'Population',
            sortable: true,          
          },
          region: { value: country.Region.trim().toLowerCase() },
          service: { value: +replaceComma(country.Service) },
        });
      }
    )
    .then(() => {
      setCountryData(parsedCountriesData);
      setVisData(sortByPropertyAsc(parsedCountriesData, sortProperty));
      setSortDisplayName(getDisplayName(parsedCountriesData, sortProperty))
      setCompareDisplayName(getDisplayName(parsedCountriesData, compareProperty));

      // all countries have the same properties, so we can just pick any to get the properties in a list
      const exampleCountry = parsedCountriesData[0];
      setSortOptions(Object.keys(exampleCountry).filter(property => {
        return exampleCountry[property].sortable === true;
      }).map(property => ({ name: property, displayName: exampleCountry[property].displayName })));
    })

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
    setSortDisplayName(getDisplayName(visData, sortProperty))
  }, [visData, sortProperty])


  useEffect(() => {
    setCompareDisplayName(getDisplayName(visData, compareProperty))
  }, [visData, compareProperty])

  useEffect(() => {
    const visDataProperties = visData.map(country => country[sortProperty]);
    const visDataCompareProperties = visData.map(country => country[compareProperty]);

    console.log('visDataProperties', getFirstX(visDataProperties, 10));
    console.log('visDataCompareProperties', getFirstX(visDataCompareProperties, 10));


  }, [visData, sortProperty, compareProperty])

  const handleSelectSort = (e) => {
    const newSortProperty = e.target.value;

    setVisData(sortByPropertyAsc(countryData, newSortProperty))
    setSortProperty(newSortProperty);
  }

  const handleSelectCompare = (e) => {
    const newCompareProperty = e.target.value;

    setCompareProperty(newCompareProperty);
  }

  const getDisplayName = (data, property) => (data.length ? data[0][property].displayName : '');
  const onDataHover = () => {
    //placeholder
    console.log('data hovered');
  }

  const switchSortAndCompare = () => {
    const newCompareProperty = sortProperty;
    setSortProperty(compareProperty);
    setCompareProperty(newCompareProperty)
    setVisData(sortByPropertyAsc(countryData, compareProperty))
  }

  return (
    <div className="App">
      <header className="App-header">
          <h2>Countries Comparison</h2>
      </header>
      <div className='app-content'>
        <div className='chart-options'>
          <div className='countries-sort-list'>
              <h4>See top countries by...</h4>
              <select
                className='property-select'
                value={sortProperty}
                onChange={handleSelectSort} 
              >
                {sortOptions.map((property) => <option value={property.name}>{property.displayName}</option>)}
              </select>
          </div>
          <button className='switch-btn' onClick={switchSortAndCompare}>Swap Chart Properties</button>
          <div className='countries-compare-list'>
              <h4>How do those countries compare in...</h4>
              <select
                className='property-select'
                value={compareProperty}
                onChange={handleSelectCompare} 
              >
                {sortOptions.map((property) => <option value={property.name}>{property.displayName}</option>)}
              </select>
          </div>
        </div> 
        <div className='charts'>
          <BarChart 
            visData={getFirstX(visData, 10)} 
            width={800} height={300} 
            dataProperty={sortProperty} 
            chartTitle={sortDisplayName} 
            onDataHover={onDataHover}
          />
          <BarChart 
            visData={getFirstX(visData, 10)} 
            width={800} height={300} 
            dataProperty={compareProperty} 
            chartTitle={compareDisplayName} 
          />
        </div>
      </div> 
    </div>
  );
}

export default App;
