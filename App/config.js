import { Text } from 'react-native';
import Config from 'react-native-config';
import './I18n/I18n'
import { log } from "App/Stores/Log";


if (typeof global.self === 'undefined') {
  // needed for apollo client
  global.self = global;
}

// Allow/disallow font-scaling in app
// Text.defaultProps.allowFontScaling = true;
Text.allowFontScaling = true;

const settings = {
  chatkitInstanceLocator: Config.CHATKIT_INSTANCE_LOCATOR,
  codepushDeploymentAndroidKey: Config.CODEPUSH_DEPLOYMENT_ANDROID_KEY,
  codepushDeploymentIosKey: Config.CODEPUSH_DEPLOYMENT_IOS_KEY,
  deeplinkHost: Config.DEEPLINK_HOST,
  logGraphQLQueries: false,
  logRoute: false,
  seedorfChatkitUrl: Config.SEEDORF_CHATKIT_URL,
  seedorfGraphQLUrl: Config.SEEDORF_GRAPHQL_URL,
  seedorfRestUrl: Config.SEEDORF_REST_URL,
  testBuild: Config.TEST_BUILD === 'YES',
  testHostUrl: Config.TEST_HOST_URL,
  useFixtures: Config.USE_FIXTURES === 'YES', // DISABLED FOR NOW DUE TO BUG
  sentryDSN: Config.SENTRY_DSN
};

if (settings.testBuild) {
  console.disableYellowBox = true;
}

const enableNetworkRequestInspection = () => {
  // use this to enable network request inspection in the (chrome) debugger.
  // NOTE: you'll need to disable CORS checking e.g. by running chrome with `--disable-web-security`.

  // To see all the requests in the chrome Dev tools in the network tab.
  XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
    GLOBAL.originalXMLHttpRequest :
    GLOBAL.XMLHttpRequest;

  // fetch logger
  global._fetch = fetch;
  global.fetch = function (uri, options, ...args) {
    return global._fetch(uri, options, ...args).then((response) => {
      console.log('Fetch', { request: { uri, options, ...args }, response });
      return response;
    });
  };
}

if (__DEV__) {
  // enableNetworkRequestInspection();
  // If ReactNative's yellow box warnings are too much, it is possible to turn
  // it off, but the healthier approach is to fix the warnings.  =)
  // console.disableYellowBox = false;
}

if (Config.ENVIRONMENT === 'TOM') {
  /* Fast overrides for Tom :) */

  settings.seedorfRestUrl = 'https://api.sportyspots.com/api';
  // settings.seedorfRestUrl = 'https://tom-dev.ngrok.io/api';
  settings.seedorfGraphQLUrl = 'https://api.sportyspots.com/graphql';
  // settings.seedorfGraphQLUrl = 'https://tom-dev.ngrok.io/graphql';
  // settings.seedorfRestUrl = 'https://training.sportyspots.com/api';
  // settings.seedorfGraphQLUrl = 'https://training.sportyspots.com/graphql';
  // settings.seedorfRestUrl = 'http://10.0.2.2:8000/api';
  // settings.seedorfGraphQLUrl = 'http://10.0.2.2:8000/graphql';
  // settings.testHostUrl = 'ws://10.0.2.2:8020';

  // settings.seedorfRestUrl = 'http://localhost:8000/api';
  // settings.seedorfGraphQLUrl = 'http://localhost:8000/graphql';
  // settings.testHostUrl = 'ws://localhost:8020';
  // settings.logRoute = true;
  // settings.logGraphQLQueries = true;
  settings.testBuild = false;
}

log.info('settings', settings);

export default settings;
