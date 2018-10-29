/*
 * (C) Hand and Nail Harmony 2018
 * Author: Fabian Nino
 */
import React from 'react';
import { View, Button, Text, KeyboardAvoidingView} from 'react-native'
import {Headline, Title, TextInput, Snackbar} from 'react-native-paper'
import {CREDENTIALS} from '../services/api'


export default class LoginScreen extends React.Component {

  state = {
    username: '', 
    password: '',
    errorMessage: false,
  }
  _username = (username) => {
    this.setState({username})
  }

  _password = (password) => {
    this.setState({password})
  }

  _saveLoginInfo = () => {
    CREDENTIALS.username = this.state.username
    CREDENTIALS.password = this.state.password
  }

  _login = () => {
    try {
      if(this.state.username !== 'fabian' || this.state.password !== '152.064') {
        throw new Error('Wrong Username and Password. Please try again.')
      } else {
        this._saveLoginInfo()
        this.props.navigation.navigate('Home')
      }
    } catch (err) {
      this.setState({errorMessage:err.message})
    }
  }

  render () {
    return (
      <KeyboardAvoidingView style={{flex:1, alignItems:'center', justifyContent:'center'}} behavior='padding' enabled>
        <Headline>Nail Harmony Education</Headline>
        <Title>Login</Title>
        <View style={{width:400}}>
          {this.state.errorMessage && <Text style={{color:'red', textAlign:'center',}}>
            {this.state.errorMessage}
          </Text>}
          <TextInput
            label='Username'
            value={this.state.username}
            onChangeText={username=>this._username(username)} 
            autoCapitalize='none'
          />
          <TextInput
            label='Password'
            value={this.state.password}
            onChangeText={password=>this._password(password)}
            secureTextEntry
            autoCapitalize='none'
          />
          <Button 
            onPress={this._login}
            title='Login'
            // color='#841584'
            accessibilityLabel='Login'
            />
        </View>
      </KeyboardAvoidingView>
    )
  }
}