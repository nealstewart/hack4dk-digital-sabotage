import * as React from 'react';
import { SFC } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const logoIcon = require('./logo.svg');
const cameraIcon = require('./icon_camera.svg');
const infoName = require('./info_name.svg');
const infoDate = require('./info_date.svg');

const Home: SFC = () => (
    <div className="Home">
        <div className="top">
            <img src={logoIcon} className="logo"/>
        </div>
        
        <div className="card-container">
            <div className="card">
                <div className="img-container img-1"> </div>
                <div className="img-info">
                    <img src={infoDate}/>
                    <img src={infoName}/>
                </div>
            </div>
            <div className="card">
                <div className="img-container img-2"> </div>
                <div className="img-info">
                    <img src={infoDate}/>
                    <img src={infoName}/>
                </div>
            </div>
            <div className="card">
                <div className="img-container img-3"> </div>
                <div className="img-info">
                    <img src={infoDate}/>
                    <img src={infoName}/>
                </div>
            </div>
        </div>
        <div className="my-bottom buttom-center">
            <Link to="/camera" className="button">
                <img src={cameraIcon} className="icon"/>
                <span className="link-text">Add entry</span>
            </Link>
        </div>
    </div>
);

export default Home;