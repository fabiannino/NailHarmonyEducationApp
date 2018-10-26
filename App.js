import React from 'react';
import AppNavigation  from './app/views/HomeScreen'
import { Provider as PaperProvider } from 'react-native-paper'
import { users, addUser } from './app/services/api';

export default class App extends React.Component {
  state = {}

  getUsers = () => {
    this.setState({users:users})
  }

  addUser = (newUser) => {
    this.setState(prevState=>({
      users: [...prevState.users, newUser]
    }))
    addUser(newUser)
  }

  render() {
    return (
      <PaperProvider>
        <AppNavigation
          screenProps={{
            users: this.state.users,
            addUser: this.addUser,
            getUsers: this.getUsers,
          }}
        />
      </PaperProvider>
    );
  }
}