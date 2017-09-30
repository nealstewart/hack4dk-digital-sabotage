import * as React from 'react';
import { SFC } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const logo = require('./icon_camera.svg');

const Home: SFC = () => (
    <div className="Home">
        <div className="bottom">
            <Link to="/camera" className="add-entry">
                <img src={logo} className="icon"/>
                <span className="link-text">Add entry</span>
            </Link>
        </div>
    </div>
);

export default Home;