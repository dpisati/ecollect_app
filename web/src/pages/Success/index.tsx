import React from 'react';
import { FiLogIn, FiCheckCircle } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import './styles.css';
import { Link } from 'react-router-dom';

const Success = () => {
    return(
        <div className="success-main">
            <div className="title">
                <FiCheckCircle className="icon"/>
                <h1 className="title-h1">Thank you for subscribe!</h1>
            </div>
            <Link className="button" to="/">
                <span>
                    <FiLogIn />
                </span>
                <strong>Back to Home</strong>
            </Link>
        </div>
    )
};
export default Success;