import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components/native';
import GET_SPOT_DETAILS from '../../../GraphQL/Spots/Queries/GET_SPOT_DETAILS';
import Block from '../../Common/Block';
import BackgroundImage from '.';

const Container = styled.View`
  height: 80px;
`;

const dummyNavigator = {
  navigate: () => null,
  state: {
    params: { spotId: 455 },
  },
};

storiesOf('Spots.BackgroundImage', module)
  .add('BackgroundImage', () => (
    <Query
      query={GET_SPOT_DETAILS}
      variables={{ uuid: dummyNavigator.state.params.spotId }}
    >
      {({ loading, error, data }) => (
        loading || error ? null : (
          <Block bgColor="silver">
            <Container>
              <BackgroundImage
                images={data.spot.images}
                height={200}
                width={300}
              />
            </Container>
          </Block>
        ))}
    </Query>
  ));
