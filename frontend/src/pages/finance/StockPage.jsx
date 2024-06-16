import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Segment } from 'semantic-ui-react';

const StockPage = () => {
    const { symbol } = useParams();
    const [stock, setStock] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_stock`, {
            params: { symbol }
        })
        .then(res => {
            setStock(res.data.symbol);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        });
    }, [symbol]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!stock) {
        return <div>No stock data available.</div>;
    }

    return (
        <Container>
            <Segment>
                <h1>{stock.symbol} - {stock.shortName}</h1>
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
        </Container>
    );
};

export default StockPage;
