import { Typography } from '@material-ui/core';
import React from 'react';
import { connect } from "react-redux"
import { useGoogleLogin } from 'react-google-login';
import * as actions from "../../../store/actions/index";
// refresh token
import { refreshTokenSetup } from './util/refreshGoogleToken';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

const clientId = '168517433618-2e4giic6h3ci75h3qum0skb1h36re1mh.apps.googleusercontent.com';

function GoogleLogin({ userType, authenticate, isDarkTheme }) {
    const { t } = useTranslation("common")
    const history = useHistory()

    const disabled = userType !== 'student' && userType !== 'instructor'

    const onSuccess = (res) => {
        console.log('Login Success: currentUser:', res.profileObj);
        const formData = {
            email: res.profileObj.email,
            type: userType,
            history,
            googleTokenId: res.tokenId
        }
        authenticate(formData);

        // refreshTokenSetup(res);
    };

    const onFailure = (res) => {
        console.log('Login failed: res:', res);
    };

    const { signIn } = useGoogleLogin({
        onSuccess,
        onFailure,
        clientId,
        isSignedIn: false,
        accessType: 'offline',
        // scope:'https://www.googleapis.com/auth/user.gender.read'
        // responseType: 'code',
        // prompt: 'consent',
    });

    return (
        <button style={{ width: '100%', backgroundColor: isDarkTheme ? "#424242" : '#fff', border: `3px solid ${isDarkTheme ? "#fff" : "#2196f3"}`, borderRadius: 3, padding: 3, cursor: disabled ? "" : 'pointer' }} disabled={userType !== 'student' && userType !== 'instructor'} onClick={signIn}>
            <img src="icons/google.svg" alt="google login" className="icon"></img>
            <Typography style={{color:isDarkTheme ? "#fff" : ""}}>{t("auth.buttons.continueWithGoogle")}</Typography>
        </button>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        authenticate: (formData) => {
            dispatch(actions.authenticationStart(formData));
        },
    }
}

const mapStateToProps = (state) => {
    return {
        isDarkTheme: state.common.isDarkTheme,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoogleLogin);