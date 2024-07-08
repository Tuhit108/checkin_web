import React, { Component } from "react";
import { Container } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="footer px-0 px-lg-3" style={{ width: '100%' }}>
        <Container fluid>
          <nav>
            <p className="copyright text-center">© {new Date().getFullYear()}{" "}Design by team 8 </p>
          </nav>
        </Container>
      </footer>
    );
  }
}

export default Footer;
