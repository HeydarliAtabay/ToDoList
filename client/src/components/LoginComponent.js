import { Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('') ;
  
  const handleSubmit = (event) => {
      event.preventDefault();
      setErrorMessage('');
      const credentials = { username, password };
      
      // SOME VALIDATION, ADD MORE!!!
      let valid = true;
      if(username === '' || password === '' || password.length < 6)
          valid = false;
      
      if(valid)
      {
        props.login(credentials);
      }
      else {
        // show a better error message...
        setErrorMessage('Error(s) in the form, please fix it.')
      }
  };

  return (
    <>
    <div className="loginForm" >
    <Form  >
      {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
      <Form.Group controlId='username'>
          <Form.Label>Email address</Form.Label>
          <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} size="lg" />
      </Form.Group>
      <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} size="lg" />
      </Form.Group>
      <Button size="lg" onClick={handleSubmit}>Login</Button>
    </Form>
    </div>
    </>
    )
}

export { LoginForm };