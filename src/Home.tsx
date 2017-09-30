import * as React from 'react';
import { SFC } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home: SFC = () => (
    <div className="Home">
        <div className="bottom">
            <Link to="/camera">Add a entry</Link>
        </div>
    </div>
);

export default Home;