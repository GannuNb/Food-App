
import React from 'react';
import Home from './screens/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';
import Login from './screens/Login.js';
import '../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css'  //npm i bootstrap-dark-5 boostrap
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import Signup from './screens/Signup.js';
import { CartProvider } from './components/ContextReducer.js';
import Cart from './screens/Cart.js';
import MyOrder from './screens/MyOrder.js';



function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <div>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/Login" element={<Login />} />
                <Route exact path="/Signup" element={<Signup />} />
                <Route exact path="/myOrder" element={<MyOrder />} />
             


              </Routes>
            </div>
            <Footer />

          </div>
        </Router>

      </CartProvider>

    </>
  );

}

export default App;
