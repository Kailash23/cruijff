import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { View } from 'react-native'
import SportAndTime from './SportAndTime'
import PickSpot from './PickSpot'
import Description from './Description'
import Created from './Created'
import { WithApolloMockProvider } from '../../GraphQL'

const gameDetails = {
  sport: null,
  timeStart: null,
  timeEnd: null,
  date: null
}

storiesOf('Plan')
  .add('Step 1: Sport/time', () => (
    <WithApolloMockProvider>
      <View style={{ flex: 1 }}>
        <SportAndTime
          gameDetails={gameDetails}
          setGameDetailField={() => null}
        />
      </View>
    </WithApolloMockProvider>
  ))
  .add('Step 2: Pick spot', () => (
    <WithApolloMockProvider>
      <View style={{ flex: 1 }}>
        <PickSpot gameDetails={gameDetails} setGameDetailField={() => null} />
      </View>
    </WithApolloMockProvider>
  ))
  .add('Step 3: Description', () => (
    <View style={{ flex: 1 }}>
      <Description gameDetails={gameDetails} setGameDetailField={() => null} />
    </View>
  ))
  .add('Step 4: Created', () => (
    <WithApolloMockProvider>
      <View style={{ flex: 1 }}>
        <Created gameDetails={gameDetails} setGameDetailField={() => null} />
      </View>
    </WithApolloMockProvider>
  ))
