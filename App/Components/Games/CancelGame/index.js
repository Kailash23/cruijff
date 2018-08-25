import React from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';
import I18n from '../../../I18n/index';
import gameDetailsFragment from '../../../GraphQL/Games/Fragments/gameDetails';
import GameProperties from '../GameProperties';
import Attendees from '../Attendees';
import { Block, BlockLabel, HorizontalView } from '../style';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const CancelGame = ({
  game,
  onSpotPress,
  onAttendeesPress,
}) => [
  <Block key="game-properties">
    <GameProperties game={game} onSpotPress={onSpotPress} />
  </Block>,
  <Block key="game-attendees">
    <Attendees
      game={game}
      onAttendeesPress={onAttendeesPress}
    />
  </Block>,
];

CancelGame.propTypes = {
  game: propType(gameDetailsFragment).isRequired,
  onSpotPress: PropTypes.func,
  onAttendeesPress: PropTypes.func,
};

CancelGame.defaultProps = {
  onSpotPress: () => {},
  onAttendeesPress: () => {},
};

export default CancelGame;