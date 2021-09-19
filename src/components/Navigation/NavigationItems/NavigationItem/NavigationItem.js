import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";
import ListItem from "@material-ui/core/ListItem";

const navigationItem = ({
    disabled,
    isDarkTheme,
    link,
    exact,
    children,
    selected,
    clicked,
}) => {
    const handleClick = (e) => {
        if (disabled) {
            e.preventDefault()
        } else {
            clicked()
        }
    }
    const cursor = disabled ? 'default' : 'pointer';
    return (
        <NavLink
            style={isDarkTheme ? { color: selected ? '#2196f3' : 'white', cursor } : { color: selected ? '#2196f3' : 'rgba(0, 0, 0, 0.87)', cursor }}
            onClick={handleClick}
            to={link}
            exact={exact}
        >
            <ListItem disabled={disabled} button={!disabled}>
                {children}
            </ListItem>
        </NavLink>
    )
}

const mapStateToProps = (state) => {
    return {
        isDarkTheme: state.common.isDarkTheme,
    };
};

export default connect(mapStateToProps)(navigationItem);