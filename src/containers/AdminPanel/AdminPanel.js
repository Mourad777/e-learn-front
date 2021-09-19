import React, { Component } from 'react';
import { connect } from 'react-redux'

import Aux from '../../hoc/Auxiliary/Auxiliary'
import classes from './AdminPanel.module.css';

class AdminPanel extends Component {

    render () {
        return (
            <Aux>
                <h1>Admin Panel</h1>
            </Aux>
        )
    }
}

// const mapStateToProps = state => {
//     return {
//         //token gives info on authentication
//         isAuthenticated: state.auth.token !== null
//     }
// }

// export default connect(mapStateToProps)(Admin);

export default AdminPanel