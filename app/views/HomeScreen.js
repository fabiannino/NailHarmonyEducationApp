/*
 * (C) Hand and Nail Harmony 2018
 * Author: Fabian Nino
 */
import React from 'react'
import { createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { MaterialIcons } from '@expo/vector-icons';


import LoginScreen from './LoginScreen';
import EventsView from './EventsView';
import UsersView from './UsersView';
import AddUsersView from './AddUsersView';
import TestsView from './TestsView';
import TestView from './TestView';
import SettingsView from './SettingsView';


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
  },
  Tests: {
    screen: TestsView,
  },
  Test: {
    screen: TestView,
  },
})

const tabNavigation = createBottomTabNavigator({
  App: {
    screen:stackNavigation,
    navigationOptions: {
      tabBarIcon:({tintColor}) => <MaterialIcons name="supervisor-account" color={tintColor}/>,
    }
  }, 
  Settings: {
    screen: SettingsView,
    navigationOptions: {
      tabBarIcon:({tintColor}) => <MaterialIcons name="settings" color={tintColor}/>
    }
  }
}, {
  initialRouteName:'App',
  tabBarOptions: {
    activeTintColor: 'white',
    activeBackgroundColor: '#0984e3',
    inactiveTintColor: '#666',
    
  },
})


const AppNavigation = createSwitchNavigator(
  {
    Login: {
      screen: LoginScreen
    },
    Home: {
      screen: tabNavigation
    }
  },
  {
    // initialRouteName:'Login'
    initialRouteName:'Home'
  }
)

export default AppNavigation

