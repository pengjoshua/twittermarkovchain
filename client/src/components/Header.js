import React from 'react';
import { Navbar } from 'react-bootstrap';

function Header() {
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <strong>Twitter Markov Chain</strong>
        </Navbar.Brand>
      </Navbar.Header>
    </Navbar>
  );
}

export default Header;
