import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Segment, Header, Grid, Button, Icon, Tab, Card, Image, Form, Input, Divider } from 'semantic-ui-react';
import Cookies from 'js-cookie';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';

// Register the components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale, zoomPlugin);

const StockPage = () => {
    const [user, setUser] = useState(localStorage.getItem('userId') || null);
    const { symbol } = useParams();
    const [ssymbol, setSsymbol] = useState('');
    const [stock, setStock] = useState(null);
    const [priceHistory, setPriceHistory] = useState({});
    const [loading, setLoading] = useState(true);
    const [officers, setOfficers] = useState([]);
    const [news, setNews] = useState([]);
    const [range, setRange] = useState('1y');
    const [interval, setInterval] = useState('1d');
    const [watchlist, setWatchlist] = useState([]);
    const [stockWatched, setStockWatched] = useState(false);

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_watchlist`, {
                    params: { user }
                });
                if (res.data.success) {
                    console.log(res.data.symbols);
                    console.log(res.data);
                    setWatchlist(res.data.symbols);
                } else {
                    console.log(res.data.message);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchWatchlist();
    }, [user]);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_full_stock`, {
                    params: { symbol, range, interval }
                });
                setStock(res.data.info);
                setPriceHistory(res.data.history);  // Assuming 'history' is part of the response
                setOfficers(res.data.info.companyOfficers);
                setNews(res.data.news);
                setLoading(false);
                setSsymbol(res.data.info.symbol);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };

        fetchStockData();
    }, [symbol, range, interval]);

    useEffect(() => {
        if (stock && Array.isArray(watchlist)) {
            setStockWatched(watchlist.includes(stock.symbol.toUpperCase()));
            console.log(watchlist, stock.symbol.toUpperCase(), watchlist.includes(stock.symbol.toUpperCase()));
        }
    }, [stock, watchlist]);

    const handleSearch = () => {
        window.location = (`/apps/finance/stock/${ssymbol}`);
    };

    const addToWatchlist = async (ssymbol) => {
        try {
            const formData = new FormData();
            formData.append('symbol', ssymbol);
            formData.append('user', user);
    
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/finance/add_watchlist`, formData, {
                withCredentials: true,
                headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
            });
    
            if (res.data.success) {
                setWatchlist((prevWatchlist) => [...(prevWatchlist || []), ssymbol.toUpperCase()]);
                setStockWatched(true);
            }
        } catch (err) {
            console.log(err);
        }
    };
    
    const removeFromWatchlist = async (ssymbol) => {
        try {
            const formData = new FormData();
            formData.append('symbol', ssymbol);
            
            formData.append('user', user);
            console.log(ssymbol, user);
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/finance/remove_watchlist`, formData, {
                withCredentials: true,
                headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
            });
    
            if (res.data.success) {
                setWatchlist((prevWatchlist) => (prevWatchlist || []).filter((item) => item !== ssymbol.toUpperCase()));
                setStockWatched(false);
            }
        } catch (err) {
            console.log(err);
        }
    };
    
    
    

    if (loading) {
        return <Segment>Loading...</Segment>;
    }

    if (!stock) {
        return <Segment>No stock data available.</Segment>;
    }

    const StockProfile = () => (
        <Segment>
            <Grid columns={2}>
                <Grid.Column width={8}>
                    <Header as='h2'>Company Information</Header>
                        <Grid columns={2}>
                            <Grid.Column width={8}>
                                <p><strong>Symbol:</strong></p>
                                <Divider />
                                <p><strong>Short Name:</strong></p>
                                <Divider />
                                <p><strong>Location:</strong></p>
                                <Divider />
                                <p><strong>Industry:</strong></p>
                                <Divider />
                                <p><strong>Sector:</strong></p>
                                <Divider />
                                <p><strong>Employees:</strong></p>
                                <Divider />
                                </Grid.Column>
                                <Grid.Column  textAlign='right'>
                                    <p>{stock.symbol}</p>
                                    <Divider />
                                    <p>{stock.shortName}</p>
                                    <Divider />
                                    <p>{stock.city}, {stock.state}, {stock.country}</p>
                                    <Divider />
                                    <p>{stock.industry}</p>
                                    <Divider />
                                    <p>{stock.sector}</p>
                                    <Divider />
                                    <p>{stock.fullTimeEmployees}</p>
                                    <Divider />
                                </Grid.Column>
                        </Grid>
                </Grid.Column>
                <Divider vertical />
                <Grid.Column width={8}>
                    <Header as='h2'>Company Description</Header>
                    <p>{stock.longBusinessSummary}</p>
                </Grid.Column>
            </Grid>
        </Segment>
    );

    const StockFinancials = () => {
        return (
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
    };

    const StockNews = () => (
        <>
            {news.map((article, i) => {
                const imageUrl = article.thumbnail && article.thumbnail.resolutions && article.thumbnail.resolutions.length > 0
                    ? article.thumbnail.resolutions[0].url
                    : null;

                return (
                    <Card key={i} fluid>
                        <Card.Content>
                            <Grid columns={2}>
                                <Grid.Column verticalAlign='middle' width={10}>
                                    <a href={article.link}>
                                        <Header as='h2'>
                                            {article.title}
                                        </Header>
                                    </a>
                                    <br />
                                    <p>
                                        <em>{article.publisher}</em>
                                    </p>
                                    <br />
                                    <p>
                                        Related Tickers: 
                                        {article.relatedTickers.map((ticker, index) => (
                                            <span key={index}>
                                                <a href={`/apps/finance/stock/${ticker}`}>{ticker}</a>
                                                {index < article.relatedTickers.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </p>
                                </Grid.Column>
                                <Grid.Column textAlign='right' width={6}>
                                    {imageUrl && <Image bordered size='medium' src={imageUrl} alt={article.title} />}
                                </Grid.Column>
                            </Grid>
                        </Card.Content>
                    </Card>
                );
            })}
        </>
    );

    const StockAnalysis = () => {
        const dates = Object.keys(priceHistory);
        const closes = dates.map(date => priceHistory[date].Close);
        const opens = dates.map(date => priceHistory[date].Open);
        const highs = dates.map(date => priceHistory[date].High);
        const lows = dates.map(date => priceHistory[date].Low);
        const volumes = dates.map(date => priceHistory[date].Volume);

        const data = {
            labels: dates,
            datasets: [
                {
                    label: 'Close Price',
                    data: closes,
                    fill: false,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    tension: 0.1,
                    yAxisID: 'y',
                },
                {
                    label: 'Open Price',
                    data: opens,
                    fill: false,
                    backgroundColor: 'rgba(153,102,255,0.4)',
                    borderColor: 'rgba(153,102,255,1)',
                    tension: 0.1,
                    yAxisID: 'y',
                },
                {
                    label: 'High Price',
                    data: highs,
                    fill: false,
                    backgroundColor: 'rgba(255,159,64,0.4)',
                    borderColor: 'rgba(255,159,64,1)',
                    tension: 0.1,
                    yAxisID: 'y',
                },
                {
                    label: 'Low Price',
                    data: lows,
                    fill: false,
                    backgroundColor: 'rgba(255,99,132,0.4)',
                    borderColor: 'rgba(255,99,132,1)',
                    tension: 0.1,
                    yAxisID: 'y',
                },
                {
                    label: 'Volume',
                    data: volumes,
                    type: 'bar',
                    backgroundColor: 'rgba(54,162,235,0.5)',
                    borderColor: 'rgba(54,162,235,1)',
                    yAxisID: 'y1',
                }
            ],
        };

        const options = {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: interval === '1m' || interval === '5m' || interval === '15m' || interval === '30m' || interval === '1h' ? 'minute' :
                              interval === '1d' ? 'day' :
                              interval === '1wk' ? 'week' :
                              'month', // default to month
                    },
                    min: new Date(dates[0]).getTime(),
                    max: new Date(dates[dates.length - 1]).getTime(),
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    min: Math.min(...lows) * 0.9,
                    max: Math.max(...highs) * 1.1,
                    ticks: {
                        beginAtZero: true,
                    },
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    max: Math.max(...volumes) * 1.2,
                    grid: {
                        drawOnChartArea: false,
                    },
                },
            },
            plugins: {
                zoom: {
                    limits: {
                        x: {
                            min: new Date(dates[0]).getTime(),
                            max: new Date(dates[dates.length - 1]).getTime(),
                            minRange: 1000 * 60 * 60 * 24, // 1 day in milliseconds
                            maxRange: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds
                        },
                        y: {
                            min: Math.min(...lows) * 0.9,
                            max: Math.max(...highs) * 1.1,
                        },
                        y1: {
                            min: 0,
                            max: Math.max(...volumes) * 1.1,
                        },
                    },
                    pan: {
                        enabled: true,
                        mode: 'x',
                        threshold: 5,
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true,
                        },
                        mode: 'x',
                    },
                },
            },
        };
        
        
        

        return (
            <Segment>
                <Grid columns={2}>
                    <Grid.Column textAlign='left' >
                        <Header as='h2'>Price History</Header>
                    </Grid.Column>
                    <Grid.Column floated='right'>
                        <Button.Group floated='right' size='mini'>
                            <Button onClick={() => setRange('1d')}>Day</Button>
                            <Button onClick={() => setRange('5d')}>Week</Button>
                            <Button onClick={() => setRange('1mo')}>Month</Button>
                            <Button onClick={() => setRange('3mo')}>3M</Button>
                            <Button onClick={() => setRange('6mo')}>6M</Button>
                            <Button onClick={() => setRange('1y')}>1Y</Button>
                            <Button onClick={() => setRange('5y')}>5Y</Button>
                            <Button onClick={() => setRange('max')}>Max</Button>
                        </Button.Group>
                        <Button.Group floated='right' size='mini' toggle>
                            <Button onClick={() => setInterval('1m')}>1m</Button>
                            <Button onClick={() => setInterval('5m')}>5m</Button>
                            <Button onClick={() => setInterval('15m')}>15m</Button>
                            <Button onClick={() => setInterval('30m')}>30m</Button>
                            <Button onClick={() => setInterval('1h')}>1h</Button>
                            <Button onClick={() => setInterval('1d')}>1d</Button>
                            <Button onClick={() => setInterval('1wk')}>1w</Button>
                            <Button onClick={() => setInterval('1mo')}>1mo</Button>
                        </Button.Group>
                    </Grid.Column>
                </Grid>
                <br />
                <Line data={data} options={options} />
            </Segment>
        );
    };

    const panes = [
        { menuItem: 'Profile', render: () => <Tab.Pane><StockProfile /></Tab.Pane> },
        { menuItem: 'Financials', render: () => <Tab.Pane><StockFinancials /></Tab.Pane> },
        { menuItem: 'News', render: () => <Tab.Pane><StockNews /></Tab.Pane> },
        { menuItem: 'Analysis', render: () => <Tab.Pane><StockAnalysis /></Tab.Pane> },
    ];

    return (
        <Container>
            <Segment>
                <Grid.Column textAlign='left' className='d-flex '>
                    <Button icon href='/apps/finance'>
                        <Icon name='arrow left' />  
                    </Button>
                    <Form onSubmit={handleSearch} className='w-100'>
                        <Form.Field>
                            <Input
                                icon='search'
                                placeholder='Enter stock symbol...'
                                value={ssymbol}
                                onChange={e => setSsymbol(e.target.value)}
                            />
                        </Form.Field>
                    </Form>
                </Grid.Column>
            </Segment>
            <Segment>
                <Grid columns={2}>
                <Grid.Column textAlign='left' className='d-flex align-items-center' width={10} >
                    <Button icon href='/apps/finance'>
                        <Icon name='arrow left' />
                        Back
                    </Button>
                    <Header as='h2' className='m-0'> {stock.symbol} - {stock.shortName}</Header>
                    {stockWatched ? (
                        <>
                            <Button size='mini' icon inverted onClick={() => removeFromWatchlist(ssymbol)}>
                                <Icon name='minus' color='red' />
                            </Button>
                            <span><em>remove from watchlist</em></span>
                        </>
                    ) : (
                        <>
                            <Button size='mini' icon inverted onClick={() => addToWatchlist(ssymbol)}>
                                <Icon name='add' color='green' />
                            </Button>
                            <span><em>add to watchlist</em></span>
                        </>
                    )}
                </Grid.Column>

                    <Grid.Column textAlign='right' verticalAlign='middle' width={'6'}>
                        <p><em>{stock.address1 || null} {stock.address2 || null} {stock.city} {stock.state || null} {stock.zip || null} {stock.country || null} </em></p>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment>
                <Tab panes={panes} />
            </Segment>
        </Container>
    );
};

export default StockPage;
