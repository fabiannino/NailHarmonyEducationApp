import React from 'react';
import {Platform, Button, StyleSheet} from 'react-native'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';

import LoginScreen from './LoginScreen';
import EventsView from './EventsView';
import UsersView from './UsersView';
import AddUsersView from './AddUsersView';



const stackNavigation = createStackNavigator({
  Events: {
    screen: EventsView, 
    navigationOptions: {
      title: 'Events'
    }
  }, 
  Users: {
    screen: UsersView,
  },
  AddUser: {
    screen: AddUsersView,
    navigationOptions: {
      title: 'Add Student',
    }
  }
})

const AppNavigation = createSwitchNavigator(
  {
    Login: {
      screen: LoginScreen
    },
    Home: {
      screen: stackNavigation
    }
  },
  {
    initialRouteName:'Home'
  }
)

export default AppNavigation

