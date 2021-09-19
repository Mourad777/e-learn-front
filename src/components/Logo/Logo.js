import React from 'react';
import logoPNG from '../../assets/images/book.png';
import classes from './Logo.module.css';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
            <span><img src={logoPNG} alt="Book Logo" /></span>
    </div>
);

export default logo;