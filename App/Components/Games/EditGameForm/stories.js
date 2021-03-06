import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'react-native';
import { Query } from 'react-apollo';
import GET_GAME_DETAILS from '../../../GraphQL/Games/Queries/GET_GAME_DETAILS';
import EditGameForm from '.';

storiesOf('Games.EditGameForm', module)
  .add('EditGameForm', () => (
    <View style={{ flex: 1 }}>
      <Query
        query={GET_GAME_DETAILS}
        variables={{ uuid: 455 }}
      >
        {({ loading, error, data }) =>
          (loading || error ? null : (
            <EditGameForm
              game={data.game}
            />
          ))
        }
      </Query>
    </View>
  ));
