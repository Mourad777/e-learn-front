import React from 'react';
import  {connect } from 'react-redux'
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';
import Aux from '../../../hoc/Auxiliary/Auxiliary'
// <NavigationItem link="/" exact>Main Area</NavigationItem>
const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
    
        
        { props.studentLoggedIn ?
        <NavigationItem link="/student-panel">Student Portal</NavigationItem>
        : null }
        { props.instructorLoggedIn ?
            <Aux>
                <NavigationItem exact link="/instructor-panel/feed">Instructor Portal</NavigationItem>
                <NavigationItem link="/instructor-panel/instructor-workbench">Workbench</NavigationItem>
            </Aux>
            : null }
        { props.adminLoggedIn ?
        <NavigationItem link="/admin-panel">Admin Portal</NavigationItem>
        : null }
        { props.isAuthenticated ? <NavigationItem link="/logout">Logout</NavigationItem> : null}
    </ul>
);

const mapStateToProps = state => {
    return {
        // loading: state.authentication.loading,

        error: state.authentication.error,
        isAuthenticated: state.authentication.token !== null,
        studentLoggedIn:state.authentication.studentLoggedIn,
        instructorLoggedIn:state.authentication.instructorLoggedIn,
        adminLoggedIn:state.authentication.adminLoggedIn,
        // authRedirectPath: state.authentication.authRedirectPath,
        // formIsSignup: state.authentication.formIsSignup,
        // formTouched:state.form.AuthenticationForm.anyTouched
    };
};

export default connect(mapStateToProps)(navigationItems)

