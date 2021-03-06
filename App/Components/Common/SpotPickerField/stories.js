import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Query } from 'react-apollo';
import styled from 'styled-components/native';
import GET_SPOT_DETAILS from '../../../GraphQL/Spots/Queries/GET_SPOT_DETAILS';
import Block from '../Block';
import SpotPickerFiled from '.';

const StyledView = styled.View`
  height: 80px;
`;

const dummyNavigator = {
  navigate: () => null,
  state: {
    params: { spotId: 455 },
  },
};

const Container = () => (
  <Query
    query={GET_SPOT_DETAILS}
    variables={{ uuid: dummyNavigator.state.params.spotId }}
  >
    {({ loading, error, data }) => (
      loading || error ? null : (
        <Block>
          <StyledView>
            <SpotPickerFiled
              value={data.spot}
            />
          </StyledView>
        </Block>
      ))}
  </Query>
);

storiesOf('Spots.SpotPickerField', module)
  .add('SpotPickerField default', () => (
    <Container />
  ));
