import React from 'react'
import ReactNavigation, { StackNavigator } from 'react-navigation'

import styles from './Styles/NavigationStyles'
import SplashScreen from '../Containers/SplashScreen'
import OnboardingScreen from '../Components/Onboarding'
import { MainScreen } from './MainNavigator'
import AskLocation from '../Components/AskLocation'
import { connect } from 'react-redux'

export const RootNav = StackNavigator(
  {
    LocationPermissionScreen: {
      screen: ({ navigation }) => (
        <AskLocation onPress={() => navigation.navigate('DefaultNav')} />
      )
    },
    OnboardingScreen: { screen: OnboardingScreen },
    SplashScreen: { screen: SplashScreen },
    DefaultNav: { screen: MainScreen }
  },
  {
    // Default config for all screens
    headerMode: 'none',
    initialRouteName: 'SplashScreen',
    navigationOptions: {
      headerStyle: styles.header
    }
  }
)

const RootReduxNav = props => {
  const { dispatch, nav } = props
  const navigation = ReactNavigation.addNavigationHelpers({
    dispatch,
    state: nav
  })

  return <RootNav navigation={navigation} />
}

const mapStateToProps = state => ({ nav: state.nav })
export default connect(mapStateToProps)(RootReduxNav)
