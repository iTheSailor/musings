import React from 'react';
import {
    FormField,
    FormInput,
    Form,
    Segment,
    Button
} from 'semantic-ui-react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../utils/AuthContext'; // Ensure this path is correct

const LoginForm = ({ onLoginSuccess }) => {
    // Define propTypes right after component declaration
    LoginForm.propTypes = {
        onLoginSuccess: PropTypes.func.isRequired,
    };

    const { logIn } = useAuth(); // Use the logIn function from the AuthContext

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let hasErrors = false;
        if (!username) {
            setUsernameError('Username is required');
            hasErrors = true;
        }
        if (!password) {
            setPasswordError('Password is required');
            hasErrors = true;
        }
        if (hasErrors) return; // Stop the form submission if there are errors

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            // if (response.status ) {
                logIn(data.token); // Log in user
                // onLoginSuccess(data); // You can keep this if you still need to do something with data on successful login
                // let userId = data.user_id
                // localStorage.setItem('userId', JSON.stringify(userId))
                // let username = data.username
                // localStorage.setItem('username',JSON.stringify(username))
            // } else {
            //     console.error('Login failed:', data.message);
            // }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <Segment className='authFormSegment' style={{width:'100%'}}>
            <Form className='loginForm' onSubmit={handleSubmit} style={{width:'100%', display:'flex', flexDirection:'column'}}>
                <FormField>
                    <FormInput
                        label='Username'
                        placeholder='Username'
                        value={username}
                        onChange={handleUsernameChange}
                        error={usernameError ? {content: 'Username is required', pointing: 'below'} : false}
                    />
                </FormField>
                <FormField>
                    <FormInput
                        label='Password'
                        placeholder='Password'
                        type='password'
                        value={password}
                        onChange={handlePasswordChange}
                        error={passwordError ? {content: 'Password is required', pointing: 'below'} : false}
                    />
                </FormField>

                <Button type='submit' style={{margin:'auto'}}>Submit</Button>
            </Form>
        </Segment>
    );
};

export default LoginForm;