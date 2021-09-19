import React from 'react';
import { useGoogleLogout } from 'react-google-login';

const clientId = '168517433618-2e4giic6h3ci75h3qum0skb1h36re1mh.apps.googleusercontent.com';

function GoogleLogout() {
  const onLogoutSuccess = (res) => {
    console.log('Logged out Success');
  };

  const onFailure = () => {
    console.log('Handle failure cases');
  };

  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess,
    onFailure,
  });

  return (
    <button onClick={signOut} className="button">
      <img src="icons/google.svg" alt="google login" className="icon"></img>

      <span className="buttonText">Sign out</span>
    </button>
  );
}

export default GoogleLogout;