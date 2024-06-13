import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Header, Table, Button, Icon, Modal, Form, Input, Message, Segment, Portal, Divider} from 'semantic-ui-react';
import { Grid } from 'semantic-ui-react';
import IsButton from '../../components/IsButton';
import IsPortal from '../../components/IsPortal';
import axios from 'axios';

const FinancePage = () => {
    const [symbol, setSymbol] = useState('');
    const [open, setOpen] = useState(false);
    const [stockSymbol, setStockSymbol] = useState('');
    const [stockCurrent, setStockCurrent] = useState('');
    const [stockHigh, setStockHigh] = useState('');
    const [stockLow, setStockLow] = useState('');
    const [stockOpen, setStockOpen] = useState('');
    const [stockClose, setStockClose] = useState('');
    const [stockVolume, setStockVolume] = useState('');

    const handleSearch = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/finance/get_stock`, {
            params: {
                symbol: symbol.toUpperCase()
            }
        })
            .then(res => {
                console.log(res.data);
                setStockSymbol(res.data.symbol);
                setStockCurrent(res.data.currentPrice);
                setStockHigh(res.data.regularMarketDayHigh);
                setStockLow(res.data.regularMarketDayLow);
                setStockOpen(res.data.regularMarketOpen);
                setStockClose(res.data.regularMarketPreviousClose);
                setStockVolume(res.data.regularMarketVolume);

                setOpen(true);
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <Container>
            <Portal open={open} onClose={() => setOpen(false)}>
                <Segment style={{ margin:'auto', left:'25%',position: 'fixed', top: '10%', zIndex: 1000, width: '50%'}}>
                    <Header as='h2'>{stockSymbol}</Header>
                    <Divider />
                    <Segment>
                        <Grid columns={3}>
                            <Grid.Column width={8}>
                                <Header as='h3'>Stock Information</Header>
                                <p>Current Price: {stockCurrent}</p>
                                <p>High: {stockHigh}</p>
                                <p>Low: {stockLow}</p>
                                <p>Open: {stockOpen}</p>
                                <p>Close: {stockClose}</p>
                                <p>Volume: {stockVolume}</p>
                            </Grid.Column>
                            <Grid.Column width={2}>
                            <Divider vertical />
                            </Grid.Column>
                    <Grid.Column width={6}>
                    <Header as='h3'>Company Information</Header>
                    <p>Company Name: </p>

                    </Grid.Column>

                        </Grid>
                    </Segment>
                </Segment>
            </Portal>

            <Segment>
            <Header as='h1'>Finance</Header>
            <p>Search for a stock symbol to get the latest information.</p>
            <Form onSubmit={handleSearch} >
                <Form.Field>
                    <Input
                        icon='search'
                        placeholder='Enter stock symbol...'
                        value={symbol}
                        onChange={e => setSymbol(e.target.value)}
                    />
                </Form.Field>
            <IsButton label='Search' value='Submit'/>
            </Form>
            </Segment>

            <Segment>
                <Header as='h2'>My Watchlist</Header>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Symbol</Table.HeaderCell>
                            <Table.HeaderCell>Price</Table.HeaderCell>
                            <Table.HeaderCell>Change</Table.HeaderCell>
                            <Table.HeaderCell>% Change</Table.HeaderCell>
                            <Table.HeaderCell>Volume</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>APPL</Table.Cell>
                            <Table.Cell>$150.00</Table.Cell>
                            <Table.Cell>+5.00</Table.Cell>
                            <Table.Cell>+3.33%</Table.Cell>
                            <Table.Cell>100,000</Table.Cell>
                            <Table.Cell>
                                <Button icon>
                                    <Icon name='edit' />
                                </Button>
                                <Button icon>
                                    <Icon name='trash' />
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Segment>
        </Container>
    );
}

export default FinancePage;