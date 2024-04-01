import React from 'react';
import {
    FormInput,
    FormField,
    Form,
    Segment,
    Button,
    Header,


} from 'semantic-ui-react';
import { useState } from 'react';
import IsButton from '../../components/IsButton';
import IsPortal from '../../components/IsPortal';
import PropTypes from 'prop-types';


const TodoPage = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    const user = localStorage.getItem('userId');
    const handleNewTodoChange = (e) => {
        setNewTodo(e.target.value);
    }

    const handleNewTodoSubmit = async (e) => {
        e.preventDefault();
        if (!newTodo) {
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/todo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ title: newTodo, user: user}),
            });
            const data = await response.json();
            if (data.code === 200) {
                setTodos([...todos, data.todo]);
                setNewTodo('');
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('An error occurred', error);
        }
    }

    const handleTodoDelete = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/todo/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            if (data.code === 200) {
                setTodos(todos.filter(todo => todo.id !== id));
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('An error occurred', error);
        }
    }

    return (
        <Segment style={{ padding: '4em 0em' }} vertical>
            <Header>
                Todo List
            </Header>
            <IsPortal
                label="Add Item"
                
            />  
            <Form onSubmit={handleNewTodoSubmit}>
                <FormField>
                    <FormInput
                        placeholder='New Todo Title'
                        value={newTodo}
                        onChange={handleNewTodoChange}
                    />
                    <FormInput
                        placeholder='New Todo Description'
                        value={newTodo}
                        onChange={handleNewTodoChange}
                    />

                    
                </FormField>
                <Button type='submit'>Add</Button>
            </Form>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        {todo.title}
                        <Button onClick={() => handleTodoDelete(todo.id)}>Delete</Button>
                    </li>
                ))}
            </ul>
        </Segment>
    );
}

export default TodoPage;