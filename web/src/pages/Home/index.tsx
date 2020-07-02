import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import './styles.css';
import { Link } from 'react-router-dom';

const Home = () => {
    return(
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecolect" />
                </header>
                <main>
                    <h1>Your recycling marketplace.</h1>
                    <p>We help people find recycling hubs efficiently.</p>

                    <Link to="/register-point">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Register a recycling hub</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
};
export default Home;