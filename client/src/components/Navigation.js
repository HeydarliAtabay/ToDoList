import {Navbar, Nav, Form} from 'react-bootstrap/';
import { PersonCircle, CheckAll } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function Navigation(props) {


  return (
    <Navbar bg="success" variant="dark" fixed="top">
      { /* <Navbar.Toggle aria-controls="left-sidebar" onClick={this.showSidebar}/> */}
      <Navbar.Toggle aria-controls="left-sidebar"/>
      <Navbar.Brand href="/">
        <CheckAll className="mr-1" size="30" /> ToDo Manager
      </Navbar.Brand>
      <Form inline className="my-0 mx-auto" action="#" role="search" aria-label="Quick search">
        <Form.Control className="mr-2" type="search" placeholder="Search" aria-label="Search query" />
      </Form>
      <Nav className="ml-auto">
        <Nav.Item>
          <Nav.Link onClick={props.logout} href={props.link}> {props.info}
            <PersonCircle size="30" />
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  )
}

export default Navigation;


