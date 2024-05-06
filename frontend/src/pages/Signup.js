import { useState } from 'react';
import { useSignup } from '../hooks/useSignup';
import { Form, Button, Alert, Container } from 'react-bootstrap';

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signup, error, isLoading } = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await signup(email, password)
    }

    return (
        <Container style={{ maxWidth: '400px', marginTop: '20px' }}>
            <Form onSubmit={handleSubmit}>
                <h3>Sign up</h3>

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
                    Sign up
                </Button>

                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Form>
            We will not sell your email address or spam you.<br />
            Your account is used to save your citations.
        </Container>
    );
};


export default Signup