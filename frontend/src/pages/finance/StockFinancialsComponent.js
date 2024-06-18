import React from 'react';
import { Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const StockFinancials = ({ stock }) => (
    <Segment>
        <p>Current Price: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.currentPrice)}</p>
        <p>High: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.regularMarketDayHigh)}</p>
        <p>Low: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.regularMarketDayLow)}</p>
        <p>Open: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.regularMarketOpen)}</p>
        <p>Close: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.regularMarketPreviousClose)}</p>
        <p>Volume: {Intl.NumberFormat().format(stock.regularMarketVolume)}</p>
        <p>Website: <a href={stock.website}>Home</a> / <a href={stock.irWebsite}>Investor Relations</a></p>
        <p>Industry: {stock.industry}</p>
        <p>Sector: {stock.sector}</p>
        <p>Market Cap: {Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(stock.marketCap)}</p>
    </Segment>
);

StockFinancials.propTypes = {
    stock: PropTypes.object.isRequired,
};

export default StockFinancials;
