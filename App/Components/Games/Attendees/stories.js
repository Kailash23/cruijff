import { storiesOf } from '@storybook/react-native';
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import GET_GAME_DETAILS from '../../../GraphQL/Games/Queries/GET_GAME_DETAILS';
import Attendees from '.';
import { getAttendees } from '../utils';

const Container = ({ maxLength }) => (
  <Query
    query={GET_GAME_DETAILS}
    variables={{ uuid: 455 }}
  >
    {({ loading, error, data }) =>
      (loading || error ? null : (
        <Attendees
          attendees={getAttendees(data.game.attendees) || []}
          maxLength={maxLength}
        />
      ))
    }
  </Query>
);

Container.propTypes = {
  maxLength: PropTypes.number,
};

Container.defaultProps = {
  maxLength: 7,
};

storiesOf('Games.Attendees', module)
  .add('Attendees', () => (
    <Container />
  ))
  .add('Attendees maxLength 2', () => (
    <Container maxLength={2} />
  ));