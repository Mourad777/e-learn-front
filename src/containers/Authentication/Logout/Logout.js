import React, { useEffect } from 'react'
import * as actions from '../../../store/actions/index'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { set } from 'idb-keyval';

const Logout = ({onLogout}) => {
    useEffect( () => {
        onLogout()
        const resetToken = async () => {
            await set('token', null)
        }
        resetToken()
    }, [])

    
    return <Redirect to="/authentication" />

}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => {
            dispatch(actions.logout())
        }
    }
}

export default connect(null, mapDispatchToProps)(Logout)