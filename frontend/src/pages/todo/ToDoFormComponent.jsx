import React from 'react';
import { FormInput, FormField, Form } from 'semantic-ui-react';
import IsButton from '../../components/IsButton';
import PropTypes from 'prop-types';
import { useState } from 'react';




const ToDoFormComponent = () => {
    const [newTodo, setNewTodo] = useState('');
    const handleNewTodoChange = (e) => {
        setNewTodo(e.target.value);
    }
    
    return (
        <Form onSubmit={handleNewTodoSubmit}>
            <FormField>
                <FormInput
                    type='text'
                    placeholder='Enter a new to-do item'
                    value={newTodo}
                    onChange={handleNewTodoChange}
                />
            </FormField>
            <IsButton
                type='submit'
                color='green'
                content='Add To-Do'
            />
        </Form>
    );


}
