import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import I18n from '../../../I18n/index';
import Colors from '../../../Themes/Colors';
import GET_GAME_DETAILS from '../../../GraphQL/Games/Queries/GET_GAME_DETAILS';
import CenteredActivityIndicator from '../../../Components/Common/CenteredActivityIndicator';
import NothingFound from '../../../Components/Common/NothingFound';
import GameDetails from '../../../Components/Games/GameDetails';
import { addGlobalRef } from '../../../globalRefs';

//------------------------------------------------------------------------------
// STYLE:
//------------------------------------------------------------------------------
const Container = styled(ScrollView)`
  background-color: ${Colors.white};
`;
//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class GameDetailsScreen extends React.PureComponent {
  get gameUUID() {
    const { navigation } = this.props;
    return navigation.state.params.uuid;
  }

  // Check whether or not the current user is involved in the game in any way
  // (attending or dropped out from the game)
  getUserRSVP = (game) => {
    const { user } = this.props;

    for (const attendee of game.attendees) {
      if (user && attendee.user.uuid === user.uuid) {
        return attendee;
      }
    }
    return null;
  };

  handleSpotPress = ({ spotUuid }) => {
    const { navigation } = this.props;
    navigation.navigate('SpotDetailsScreen', { uuid: spotUuid });
  }

  handleAttendeesPress = () => {
    const { navigation } = this.props;
    navigation.navigate('GamePlayerScreen', { uuid: this.gameUUID });
  }

  handleRSVPLoggedOut = () => {
    const { navigation } = this.props;
    navigation.navigate('LoggedOutScreen');
  }

  render() {
    const { user } = this.props;

    console.log('PROPS', this.props);

    return (
      <Query
        query={GET_GAME_DETAILS}
        variables={{ uuid: this.gameUUID }}
        fetchPolicy="cache-and-network"
      >
        {({
          loading,
          error,
          data,
          refetch,
        }) => {
          console.log('ERROR', error);
          console.log('DATA', data);
          if (loading) { return <CenteredActivityIndicator />; }
          if (error || !data || !data.game) {
            return (
              <NothingFound
                icon="calendar-plus"
                text={I18n.t('Game not found')}
              />
            );
          }

          const userRSVP = this.getUserRSVP(data.game);
          const userStatus = userRSVP ? userRSVP.status : null;

          return (
            <Container testID="gameDetails">
              <GameDetails
                ref={addGlobalRef('gameDetails')}
                game={data.game}
                user={user}
                userRSVP={userRSVP}
                userStatus={userStatus}
                onSpotPress={this.handleSpotPress}
                onAttendeesPress={this.handleAttendeesPress}
                onRSVPLoggedOut={this.handleRSVPLoggedOut}
                onRSVPSuccess={refetch}
              />
            </Container>
          );
        }}
      </Query>
    );
  }
}

GameDetailsScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        uuid: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  // TODO: use userFragment
  user: PropTypes.object, // eslint-disable-line
};

GameDetailsScreen.defaultProps = {
  user: null,
};

// Redux integration
const mapStateToProps = ({ user }) => ({ user });
const withRedux = connect(mapStateToProps, null);

export default withRedux(GameDetailsScreen);
