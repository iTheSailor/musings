import React from 'react';
import {
    FormInput,
    FormGroup,
    Form,
    Segment,
    Button
} from 'semantic-ui-react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const FavoritesForm = ({onSubmit}) => {

    FavoritesForm.propTypes = {
        onSubmit: PropTypes.func.isRequired,
        address: PropTypes.string.isRequired,
    };
    const [nickname, setNickname] = useState('');
    const user = JSON.parse(localStorage.getItem('userId')) || '';
    const address = JSON.parse(localStorage.getItem('address')) || '';
    console.log('user:', user, 'address:', address);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(
            `${process.env.REACT_APP_API_URL}/api/weather`,
            {address, nickname, user}
        ).then((response) => {
            onSubmit(response.data);
        }).catch((error) => {
            console.error('Failed to add favorite:', error);
        }
        );
        
    };

    return (
        <Segment>
            <Form onSubmit={(handleSubmit)}>
                <FormGroup>
                    <FormInput
                        label="Nickname"
                        placeholder={address}
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </FormGroup>
                <input type="hidden" value={user} />
                <input type="hidden" value={address} />

                <Button type="submit">Add Favorite</Button>
            </Form>
        </Segment>
    );
}

export default FavoritesForm;