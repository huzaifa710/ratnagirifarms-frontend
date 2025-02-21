import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { ShoppingCart } from '@chakra-ui/icons';

function Navbar() {
  return (
    <nav>
      <Link to="/login">
        <Button variant="ghost">Login</Button>
      </Link>
      <Link to="/register">
        <Button variant="ghost">Register</Button>
      </Link>
      <Link to="/cart">
        <Button variant="ghost" size="icon">
          <ShoppingCart className="h-6 w-6" />
        </Button>
      </Link>
    </nav>
  );
}

export default Navbar;


//Login Page
import React from 'react';

function LoginPage() {
  return (
    <div>
      <h1>Login Page</h1>
      {/* Add login form here */}
    </div>
  );
}

export default LoginPage;


//Registration Page
import React from 'react';

function RegisterPage() {
  return (
    <div>
      <h1>Registration Page</h1>
      {/* Add registration form here */}
    </div>
  );
}

export default RegisterPage;


//Placeholder server-side routes (example using Express.js)
// const express = require('express');
// const app = express();

// app.get('/login', (req, res) => {
//   res.send('Login page');
// });

// app.get('/register', (req, res) => {
//   res.send('Register page');
// });

// app.listen(3000, () => console.log('Server started on port 3000'));