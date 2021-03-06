import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components/native';
import GET_GAME_DETAILS from '../../../GraphQL/Games/Queries/GET_GAME_DETAILS';
import { getAttendees } from '../utils';
import ClickableAttendees from '.';

const Box = styled.View`
  border: 1px solid black;
`;

storiesOf('Games.ClickableAttendees', module)
  .add('ClickableAttendees', () => (
    <Box>
      <Query
        query={GET_GAME_DETAILS}
        variables={{ uuid: 455 }}
      >
        {({ loading, error, data }) => (
          loading || error ? null : (
            <ClickableAttendees
              attendees={getAttendees(data.game.attendees)}
            />
          ))
        }
      </Query>
    </Box>
  ));
