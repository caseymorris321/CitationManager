import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

const CustomNavbar = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleClick = () => {
    logout()
  }

  return (
    <Navbar bg="light" expand="lg" className="mb-3"> {/* Bootstrap navbar with light background */}
      <Container> {/* Container to align contents properly */}
        <Navbar.Brand as={Link} to="/">Citation Buddy</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto"> {/* Align navigation items to the right */}
            {user ? (
              <>
                <Nav.Item className="me-3 mt-3"> {/* Margin right for spacing */}
                  <span>{user.email}</span>
                </Nav.Item>
                <Button variant="outline-primary" onClick={handleClick}>Log out</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="me-2">Login</Nav.Link> {/* Bootstrap Nav.Link with right margin */}
                <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar