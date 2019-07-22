import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import Switch from "react-switch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BarChart from './visualizations/BarChart/BarChart';
import {
  getPropertyAvg,
  getFirstX,
  replaceComma,
  sortByPropertyAsc,
  sortByPropertyDesc,
} from './utils/data-utils';
import countriesData from './data/countries-general-data.csv'
import './App.scss';

function App() {
  const [countryData, setCountryData] = useState([]);
  const [sortOptions, setSortOptions] = useState([]);
  const [visData, setVisData] = useState([]);
  const [sortProperty, setSortProperty] = useState('population');
  const [compareProperty, setCompareProperty] = useState('area');
  const [worldAvgCountry, setWorldAvgCountry] = useState({});
  const [sortDisplayName, setSortDisplayName,] = useState('');
  const [compareDisplayName, setCompareDisplayName] = useState('');
  const [hoveredCountry, setHoveredCountry] = useState('')
  const [tooltipPosition, setTooltipPosition] = useState({x: 0, y: 0});
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [showWorldAverage, setShowWorldAverage] = useState(true);

  const barsPerChart = 10;

  const setVisDataWithAvg = (data, avgCountry) => {
    const barsToShow = showAllCountries ? data.length : barsPerChart;
    const visDataWithAvg = getFirstX(data, barsToShow);
    const additionalCountry = avgCountry || worldAvgCountry;

    if (Object.keys(additionalCountry).length && showWorldAverage) {
      visDataWithAvg.push(additionalCountry);
    }

    setVisData(visDataWithAvg);
  }

  const getPropertyAvgs = (data, properties) => {
    const avgCountry = properties.reduce(
      (acc, property) => {
        acc[property] = {
          value: getPropertyAvg(data, property),
          displayName: data[0][property].displayName,
        }
        return acc;
      }, {}
    );
    avgCountry.country = { value: 'World Average' };
    return avgCountry;
  }

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
      setSortDisplayName(getDisplayName(parsedCountriesData, sortProperty))
      setCompareDisplayName(getDisplayName(parsedCountriesData, compareProperty));
      
      const sortedData = sortByPropertyAsc(parsedCountriesData, sortProperty);

      // all countries have the same properties, so we can just pick any to get the properties in a list
      const exampleCountry = parsedCountriesData[0];
      const sortableProperties = Object.keys(exampleCountry).filter(property => (exampleCountry[property].sortable === true))

      const avgCountry = getPropertyAvgs(parsedCountriesData, sortableProperties);

      setWorldAvgCountry(avgCountry);
      setVisDataWithAvg(sortedData, avgCountry);
      setSortOptions(sortableProperties.map(property => ({ name: property, displayName: exampleCountry[property].displayName })));
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

  // just for logging when sort and compare property changes
  useEffect(() => {
    const visDataProperties = visData.map(country => country[sortProperty]);
    const visDataCompareProperties = visData.map(country => country[compareProperty]);

    // temp logging 
    console.log('visDataProperties', getFirstX(visDataProperties, barsPerChart));
    console.log('visDataCompareProperties', getFirstX(visDataCompareProperties, barsPerChart));
  }, [visData, sortProperty, compareProperty])


  useEffect(() => {
    setVisDataWithAvg(getSortFunction()(countryData, sortProperty))
  }, [showAllCountries, showWorldAverage])

  // optional param for sortOrder, if it's not defined, use sortOrder from state
  const getSortFunction = (newSortOrder) => (((newSortOrder || sortOrder) === 'asc') ? sortByPropertyAsc : sortByPropertyDesc);

  // re-sort countries based on the new property
  const handleSelectSort = (e) => {
    const newSortProperty = e.target.value;

    setVisDataWithAvg(getSortFunction()(countryData, newSortProperty))
    setSortProperty(newSortProperty);
  }

  // no sorting done, changes which property the second chart displays
  const handleSelectCompare = (e) => {
    const newCompareProperty = e.target.value;

    setCompareProperty(newCompareProperty);
  }

  // re-sort countries ascending vs descending
  const handleSelectSortOrder = (e) => {
    const newSortOrder = e.target.value;

    setSortOrder(newSortOrder);
    setVisDataWithAvg(getSortFunction(newSortOrder)(countryData, sortProperty));
  }

  const getDisplayName = (data, property) => (data.length ? data[0][property].displayName : '');

  const onCountryHover = (country) => {
    setHoveredCountry(country);
  }

  const switchSortAndCompare = () => {
    const newCompareProperty = sortProperty;
    setSortProperty(compareProperty);
    setCompareProperty(newCompareProperty)
    setVisDataWithAvg(getSortFunction()(countryData, compareProperty))
  }

  const toggleShowWorldAverage = () => {
    setShowWorldAverage(!showWorldAverage)
    //
  }

  const toggleShowAllCountries = () => {
    setShowAllCountries(!showAllCountries)
  }

  const manyCountriesShown = visData.length > 50;

  const switchProps = {
    onColor: '#86d3ff',
    onHandleColor: '#2693e6',
    handleDiameter: 20,
    uncheckedIcon: false,
    checkedIcon: false,
    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.6)',
    activeBoxShadow: '0px 0px 1px 10px rgba(0, 0, 0, 0.2)',
    height: 15,
    width: 32,
    className: 'toggle-switch',
  }

  const barChartProps = {
    width: 800, 
    height: 300, 
    visData,
    onCountryHover,
    hoveredCountry,
    setTooltipPosition,
    tooltipPosition,
    manyCountriesShown,
  }

  const sortOrders = {
    asc: 'Highest',
    desc: 'Lowest',
  }

  return (
    <div className="App">
      <header className="App-header">
          <h2>Country Data Comparison</h2>
      </header>
      <div className='app-content'>
        <div className='chart-options'>
          <div className='select-container countries-sort-list'>
              <h4 className='select-header'>See countries with...</h4>
              <select
                className='property-select'
                value={sortOrder}
                onChange={handleSelectSortOrder} 
              >
                <option value='asc'>{sortOrders['asc']}</option>
                <option value='desc'>{sortOrders['desc']}</option>
              </select>
              <select
                className='property-select'
                value={sortProperty}
                onChange={handleSelectSort} 
              >
                {sortOptions.map((property) => <option value={property.name}>{property.displayName}</option>)}
              </select>
          </div>
          
          <button className='swap-btn' onClick={switchSortAndCompare} title='Swap properies between charts'>
            {/* <FontAwesomeIcon icon='angle-double-up' className='swap-arrow swap-up' /> */}
            <span>Swap</span>
            {/* <FontAwesomeIcon icon='angle-double-up' className='swap-arrow swap-down' /> */}
            <FontAwesomeIcon icon='exchange-alt' className='swap-arrows' />
          </button>

          <div className='select-container countries-compare-list'>
              <h4 className='select-header'>How do those countries compare in...</h4>
              <select
                className='property-select'
                value={compareProperty}
                onChange={handleSelectCompare} 
              >
                {sortOptions.map((property) => <option value={property.name}>{property.displayName}</option>)}
              </select>
          </div>

          <div className='toggle-options'>
            <label className='toggle-container show-avg-toggle'>
              <span>Show World Average</span>
              <Switch
                checked={showWorldAverage}
                onChange={toggleShowWorldAverage}
                {...switchProps}
              />
            </label>
            <label className='toggle-container show-avg-toggle'>
              <span>Show All Countries</span>
              <Switch
                checked={showAllCountries}
                onChange={toggleShowAllCountries}
                {...switchProps}
              />
            </label>
          </div>
        </div> 
        <div className='charts'>
          <BarChart 
            dataProperty={sortProperty} 
            chartTitle={`${sortOrders[sortOrder]} ${sortDisplayName}`}
            {...barChartProps}
          />
          <BarChart 
            dataProperty={compareProperty} 
            chartTitle={compareDisplayName} 
            {...barChartProps}
          />
        </div>
      </div> 
    </div>
  );
}

export default App;
