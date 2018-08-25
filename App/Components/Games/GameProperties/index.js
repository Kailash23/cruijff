import React from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';
import Colors from '../../../Themes/Colors';
import I18n from '../../../I18n';
import Text from '../../Common/Text';
import gameDetailsFragment from '../../../GraphQL/Games/Fragments/gameDetails';

//------------------------------------------------------------------------------
// STYLE:
//------------------------------------------------------------------------------
const Container = styled.View`
  display: flex;
  flex-direction: column;
`;
//------------------------------------------------------------------------------
const TitleContainer = styled.View`
  display: flex;
  margin-bottom: 8px;
`;
//------------------------------------------------------------------------------
const Title = styled(Text.M)`
  font-size: 22px;
  color: ${props => props.textColor || '#000'};
`;
//------------------------------------------------------------------------------
const Row = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-vertical: 4px;
`;
//------------------------------------------------------------------------------
const Label = styled(Text.SM)`
  flex: 1;
  color: ${props => props.textColor || '#000'};
  padding-horizontal: 20px;
`;
//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const GameProperties = ({ game, onSpotPress }) => (
  <Container>
    <TitleContainer>
      <Title>{game.name}</Title>
    </TitleContainer>
    <Row>
      <Icon name="event" size={22} color={Colors.shade} />
      <Label>
        {moment(game.start_time).format('DD-MM-YYYY')}
      </Label>
    </Row>
    <Row>
      <Icon name="watch-later" size={22} color={Colors.shade} />
      <Label>
        {moment(game.start_time).format('HH:mm')} - {moment(game.end_time).format('HH:mm')}
      </Label>
    </Row>
    <Row>
      <Icon name="label" size={22} color={Colors.shade} />
      <Label>
        {I18n.t(game.sport.category)}
      </Label>
    </Row>
    <Row>
      <TouchableOpacity
        style={{ flexDirection: 'row' }}
        onPress={() => { onSpotPress({ spotUuid: game.spot.uuid }); }}
      >
        <Icon name="place" size={22} color={Colors.shade} />
        <Label>{game.spot.name}</Label>
      </TouchableOpacity>
    </Row>
  </Container>
);

GameProperties.propTypes = {
  game: propType(gameDetailsFragment).isRequired,
  onSpotPress: PropTypes.func,
};

GameProperties.defaultProps = {
  onSpotPress: () => {},
};

export default GameProperties;