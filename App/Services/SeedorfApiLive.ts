// a library to wrap and simplify api calls
import apisauce from 'apisauce';
import CookieManager from 'react-native-cookies';
import moment from 'moment';
import config from '../config';


// our "constructor"
const create = () => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    baseURL: config.seedorfRestUrl,
    headers: {
      'Cache-Control': 'no-cache',
      vary: '',
      cookie: null,
    },
    timeout: 10000,
  });

  // api.addMonitor(console.log);

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  const getUser = username => api.get('search/users/', { q: username });
  const getAllSpots = () => null;
  const getSpot = spotId => spotId;
  const getGame = gameId => gameId;
  const getGames = ({ month }) => api.get('search/games/', { q: month });
  const verifyToken = token => api.post('/auth/token-verify/', { token });

  const signup = ({ email, name, language }) => (
    api.post('/auth/registration/', {
      email,
      name,
      language,
    })
  );

  const login = ({ username, email, password }) => (
    api.post('/auth/login/', {
      username,
      email,
      password,
    })
  );

  const updateUserName = ({ userUUID, name }) => (
    api.patch(`/users/${userUUID}/`, {
      name,
    })
  );

  const updateUserAvatar = ({ userUUID, userProfileUUID, avatar }) => (
    api.patch(`/users/${userUUID}/profile/${userProfileUUID}/`, { avatar })
  );

  const updateUserLanguage = ({ userUUID, userProfileUUID, language }) => (
    api.patch(`/users/${userUUID}/profile/${userProfileUUID}/`, { language })
  );

  const submitRating = ({ spotUUID, userUUUID, rating }) => (
    api.post(`/games/${spotUUID}/reactions`, {
      // todo : construct proper post
    })
  );

  const createGame = ({
    title, startTZ, startTime, endTZ, endTime, capacity, description,
  }) => (
    api.post('/games/', {
      name: title,
      start_timezone: startTZ,
      start_time: startTime,
      end_timezone: endTZ,
      end_time: endTime,
      rsvp_open_time: moment().toISOString(),
      rsvp_close_time: startTime, // endTime
      capacity,
      description,
    })
  );

  const setGameSport = ({ gameUUID, sport }) => (
    api.post(`/games/${gameUUID}/sport/`, {
      uuid: sport.uuid,
    })
  );

  const setGameSpot = ({ gameUUID, spotUUID }) => (
    api.post(`/games/${gameUUID}/spot/`, {
      uuid: spotUUID,
    })
  );

  const setGameStatus = ({ gameUUID, status }) => (
    api.patch(`/games/${gameUUID}/`, {
      status: status.toLowerCase(),
    })
  );

  const setGameTimes = ({
    gameUUID,
    startTZ,
    startTime,
    endTZ,
    endTime,
  }) => (
    api.patch(`/games/${gameUUID}/`, {
      start_timezone: startTZ,
      start_time: startTime,
      end_timezone: endTZ,
      end_time: endTime,
      rsvp_open_time: moment().toISOString(),
      rsvp_close_time: startTime,
    })
  );

  const setGameName = ({ gameUUID, name }) => (
    api.patch(`/games/${gameUUID}/`, {
      name,
    })
  );

  const setGameInviteMode = ({ gameUUID, inviteMode }) => (
    api.patch(`/games/${gameUUID}/`, {
      invite_mode: inviteMode,
    })
  );

  const setGameDescription = ({ gameUUID, description }) => (
    api.patch(`/games/${gameUUID}/`, {
      description,
    })
  );

  const setGameCapacity = ({ gameUUID, capacity }) => (
    api.patch(`/games/${gameUUID}/`, {
      capacity,
    })
  );

  const deleteGame = ({ gameUUID }) => (
    api.delete(`/games/${gameUUID}`)
  );

  const setRSVPStatus = ({ gameUUID, status }) => (
    api.post(`/games/${gameUUID}/rsvps/`, {
      status: status.toLowerCase(),
    })
  );

  const updateRSVPStatus = ({ gameUUID, rsvpUUID, status }) => (
    api.patch(`/games/${gameUUID}/rsvps/${rsvpUUID}/`, {
      status: status.toLowerCase(),
    })
  );

  const sendMagicLoginLink = email => (
    api.post('/auth/create-magic-link/', {
      email,
    })
  );

  const confirmMagicLoginLink = async (token) => {
    await CookieManager.clearAll();
    return api.post('/auth/confirm-magic-link/', {
      token,
    });
  };

  const saveFCMToken = async ({ userUUID, fcmToken }) => {
    await CookieManager.clearAll();
    return api.post(`/users/${userUUID}/device/fcm/`, {
      registration_id: fcmToken,
      cloud_message_type: 'FCM',
    });
  };

  // const setGameStartTime = ({ gameUUID, start_date, start_time }) =>
  // api.put(`/games/${gameUUID}/`), {
  //   start_time:
  // }

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    getUser,
    getAllSpots,
    getSpot,
    getGame,
    getGames,
    createGame,
    setGameCapacity,
    setGameSport,
    setGameSpot,
    setGameTimes,
    setGameName,
    setGameInviteMode,
    setGameDescription,
    setGameStatus,
    deleteGame,
    signup,
    login,
    updateUserName,
    updateUserAvatar,
    updateUserLanguage,
    submitRating,
    verifyToken,
    setRSVPStatus,
    updateRSVPStatus,
    sendMagicLoginLink,
    confirmMagicLoginLink,
    saveFCMToken,
    setToken: (token) => {
      if (token) {
        api.setHeader('Authorization', `JWT ${token}`);
      } else {
        api.deleteHeader('Authorization');
        CookieManager.clearAll()
      }
    },
  };
};

// let's return back our create method as the default.
export default {
  create,
};
