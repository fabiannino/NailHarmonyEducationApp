/*
 * (C) Hand and Nail Harmony 2018
 * Author: Fabian Nino
 */
import React from 'react';
import AppNavigation  from './app/views/HomeScreen'
import { Provider as PaperProvider } from 'react-native-paper'
import { getUsers, addUser, getEvents, getTests } from './app/services/api';

export default class App extends React.Component {
  state = {}

  getEvents = async () => {
    const events = await getEvents();
    this.setState({events})
  }

  setEvent = (currentEvent) => {
    this.setState({currentEvent})
  }

  getUsers = async (eventId) => {
    const users = await getUsers(eventId);
    this.setState({users})
  }

  addUser = (newUser, eventId) => {
    this.setState(prevState=>({
      users: [...prevState.users, newUser]
    }))
    addUser(newUser, eventId)
  }

  setUser = (currentUser) => {
    this.setState({currentUser})
  }

  getTests = async () => {
    const tests = await getTests();
    this.setState({tests})
  }

  setTest = (currentTest) => {
    this.setState({currentTest})
  }

  render() {
    return (
      <PaperProvider>
        <AppNavigation
          screenProps={{
            events: this.state.events,
            getEvents: this.getEvents,
            setEvent: this.setEvent,
            currentEvent: this.state.currentEvent,

            users: this.state.users,
            addUser: this.addUser,
            getUsers: this.getUsers,
            setUser: this.setUser,
            currentUser: this.state.currentUser,

            tests: this.state.tests,
            getTests: this.getTests,
            setTest: this.setTest,
            currentTest: this.state.currentTest,
          }}
        />
      </PaperProvider>
    );
  }
}