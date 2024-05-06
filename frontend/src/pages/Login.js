import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { Form, Button, Alert, Container } from 'react-bootstrap';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, error, isLoading } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await login(email, password)
    }

    return (
        <Container style={{ maxWidth: '400px' }}>
            <Form onSubmit={handleSubmit}>
                <h3>Log in</h3>
                
                <Form.Group className="mb-3">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control 
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control 
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isLoading}>
                    Log in
                </Button>

                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Form>
        </Container>
    );
};

export default Login