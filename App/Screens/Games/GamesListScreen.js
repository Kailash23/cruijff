import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { uniqBy } from 'ramda';
import moment from 'moment';
import styled from 'styled-components';
import Colors from '../../Themes/Colors';
import GET_GAMES_LIST from '../../GraphQL/Games/Queries/GET_GAMES_LIST';
import Text from '../../Components/Text';
import GamesList from '../../Components/Games/GamesList';
import Card from '../../Components/Games/GameListCard';

//------------------------------------------------------------------------------
// STYLE:
//------------------------------------------------------------------------------
const Container = styled.View`
  flex: 1;
  padding: 0 8px;
  background-color: ${Colors.white};
`;
//------------------------------------------------------------------------------
// AUX FUNCTIONS:
//------------------------------------------------------------------------------
/**
 * @summary (This is a hack) for some reason some of the games have no spot
 * associated to them, so we filter them in order to avoid errors in the child
 * components.
 */
const curatedGames = games => (
  games && games.length > 0
    ? uniqBy(({ uuid }) => (uuid), games.filter(game => game.spot))
    : []
);
//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class GamesListScreen extends React.Component {
  handleCardPress = (gameId) => {
    this.props.navigation.navigate('GameDetailsScreen', {
      uuid: gameId,
    });
  }

  render() {
    return (
      <Query
        query={GET_GAMES_LIST}
        variables={{
          offset: 0,
          limit: 100,
          ordering: 'start_time',
          start_time__gte: moment(new Date()).startOf('day'),
        }}
        fetchPolicy="cache-and-network"
      >
        {({
          loading,
          error,
          data,
          refetch,
          // fetchMore,
        }) => {
          if (error) return <Text>Error :( {JSON.stringify(error)}</Text>;

          /* const loadMore = () => {
            fetchMore({
              variables: {
                offset: (data && data.games && data.games.length) || 0,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return Object.assign({}, prev, {
                  games: [...prev.games, ...fetchMoreResult.games],
                });
              },
            });
          }; */

          return (
            <Container>
              <GamesList
                games={(data && data.games && curatedGames(data.games)) || []}
                cardComponent={Card}
                onCardPress={this.handleCardPress}
                // FlatList props
                onRefresh={refetch}
                refreshing={loading}
                // onEndReached={loadMore}
                // onEndReachedThreshold={0}
              />
            </Container>
          );
        }}
      </Query>
    );
  }
}

GamesListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default GamesListScreen;
