import React from 'react';
import { Button } from 'semantic-ui-react';
import { useAuth } from '../utils/AuthContext';


const LogOut = () => {

    const { logOut } = useAuth();


    return (
        <Button onClick={logOut}>Log Out</Button>
    );
}

export default LogOut;