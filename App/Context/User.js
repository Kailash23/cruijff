import React from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';
import { AsyncStorage } from 'react-native';
import { Buffer } from 'buffer';
import firebase from 'react-native-firebase';
import SeedorfAPI from '../Services/SeedorfApi';
import { client } from '../GraphQL';
import I18n from '../I18n';
import userDetailsFragment from '../GraphQL/Users/Fragments/userDetails';
import GET_USER_DETAILS from '../GraphQL/Users/Queries/GET_USER_DETAILS';
import CenteredActivityIndicator from '../Components/Common/CenteredActivityIndicator';
import { Events, IncomingLinks, urlToEvent } from '../Services/IncomingLinks';

/*
  user:
    undefined - not checked yet
    null      - user not logged in
    object    - the current logged in user object
*/

// The defaultValue argument is ONLY used when a component does not have a matching
// Provider above it in the tree. This can be helpful for testing components in isolation
// without wrapping them. Note: passing undefined as a Provider value does not cause
// consuming components to use defaultValue.
const defaultValue = {
  user: {
    name: 'Mock User',
    uuid: '12345',
    profile: {
      uuid: '12345',
      id: '1234',
      year_of_birth: 2000,
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Abraham_de_Vries_-_Portret_van_een_onbekende_man%2C_mogelijk_de_koopman_Adriaen_van_der_Tock_%281584-85-1661%29_-_10539_A_B_-_Museum_Rotterdam.jpg',
      spots: [],
    },
  },
  login: () => {},
  loginWithToken: () => {},
  logout: () => {},
  refresh: () => {},
};

export const UserContext = React.createContext(defaultValue);

export const userPropTypes = {
  user: propType(userDetailsFragment),
  login: PropTypes.func,
  loginWithToken: PropTypes.func,
  logout: PropTypes.func,
  refresh: PropTypes.func,
};

const setToken = async (token) => {
  await AsyncStorage.setItem('TOKEN', token);
  SeedorfAPI.setToken(token);
  client.setToken(token);
};

export class UserProvider extends React.Component {
  state = {
    user: undefined,
  }

  magicTokenHandler = async (magicToken) => {
    console.log('handling magic token');
    const result = await SeedorfAPI.confirmMagicLoginLink(magicToken);
    const { token } = result.data;
    const loginWentOkay = !!(await this.loginWithToken(token));
    console.log('loginWentOkay?', loginWentOkay);
    if (loginWentOkay) {
      // that's great
    } else {
      console.log('token failed', result);
      // todo: implement failure (probably bad token was received)
    }
  }

  async componentWillMount() {
    IncomingLinks.on(Events.MAGIC_LINK_LOGIN, this.magicTokenHandler);
    IncomingLinks.on(Events.LOGIN_TOKEN, this.loginWithToken);

    const initialURL = await firebase.links().getInitialLink();
    if (initialURL) {
      const event = urlToEvent(initialURL);
      if (event) {
        if (event.type === Events.MAGIC_LINK_LOGIN || event.type === Events.LOGIN_TOKEN) {
          IncomingLinks.emitEvent(event);
          return;
        }
      }
    }

    const token = await AsyncStorage.getItem('TOKEN');

    if (token && await this.loginWithToken(token)) {
      return;
    }

    this.logout();
  }

  componentWillUnmount() {
    IncomingLinks.removeListener(Events.MAGIC_LINK_LOGIN, this.magicTokenHandler);
    IncomingLinks.removeListener(Events.LOGIN_TOKEN, this.loginWithToken);
  }

  queryUser = async () => {
    const token = await AsyncStorage.getItem('TOKEN');
    const claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('ascii'));
    const { uuid } = claims;
    const queryResult = await client.query({
      fetchPolicy: 'network-only',
      query: GET_USER_DETAILS,
      variables: { uuid },
    });
    return queryResult.data.user;
  }

  refresh = async () => {
    console.log('refreshing user');
    const user = await this.queryUser();
    this.setState({ user });
    return true;
  }

  setUserLanguage = async () => {
    const user = await this.queryUser();
    try {
      const res = await SeedorfAPI.updateUserLanguage({
        userUUID: user.uuid,
        userProfileUUID: user.profile.uuid,
        language: I18n.locale.substr(0, 2),
      });
      console.log('RESPONSE SET LANG', res);
    } catch (exc) {
      console.log(exc);
    }
  }

  loginWithToken = async (token) => {
    const verifyTokenResult = await SeedorfAPI.verifyToken(token);
    if (verifyTokenResult.ok) {
      await setToken(token);
      return this.refresh();
    }
    return false;
  }

  login = async ({ email, password }) => {
    let res;

    try {
      res = await SeedorfAPI.login({
        username: email,
        email,
        password,
      });

      if (res.ok) {
        const { token } = res.data;
        await setToken(token);
        await this.refresh();
      }
    } catch (exc) {
      console.log(exc);
    }

    return res;
  }

  logout = async () => {
    this.setState({ user: null });
    client.setToken(null);
    SeedorfAPI.setToken(null);
    client.resetStore();
    await AsyncStorage.removeItem('TOKEN');
  }

  render() {
    const { user } = this.state;

    if (user === undefined) {
      return <CenteredActivityIndicator />;
    }

    const { children } = this.props;

    return (
      <UserContext.Provider
        value={{
          user,
          login: this.login,
          loginWithToken: this.loginWithToken,
          logout: this.logout,
          refresh: this.refresh,
        }}
      >
        {children}
      </UserContext.Provider>
    );
  }
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const UserConsumer = UserContext.Consumer;

export const withUser = Component => props => (
  <UserConsumer>
    {userProps => <Component {...props} {...userProps} />}
  </UserConsumer>
);
