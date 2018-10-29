/*
 * (C) Hand and Nail Harmony 2018
 * Author: Fabian Nino
 */
import React from 'react'
import {View, Alert} from 'react-native'
import { Title, TextInput, Card, Button, HelperText } from 'react-native-paper';

import uuidv4 from 'uuid/v4'
import { addUser } from '../services/api';


export default class AddUsersView extends React.Component {

  state = {
    key:uuidv4(),
    name:'',
    email:'',
    address:'',
    city:'',
    state:'',
    country:'',
    zip_code:'',
  }

  _updateForm = (field, value) => {
    this.setState({[field]:value})
  }

  _saveStudent = () => {
    if(this.state.email.length < 7) {
      Alert.alert('Email Required', 'Email address is required.')
      return;
    }
    if(this.state.name.length < 5) {
      Alert.alert('Name Required', "Please type the student's name and last name.")
      return;
    }
    this.props.screenProps.addUser(this.state, this.props.navigation.state.params.eventId)
    this.props.navigation.navigate('Users')
  }
  render () {
    return(
      <View style={{
        width:600,
        flex:1,
        alignSelf:'center',
      }}>
        <Title style={{marginTop:15, marginBottom:15}}>Student Information</Title>
        <Card style={{marginBottom:15}}>
          <Card.Content>
            <Title>Bio</Title>
            <TextInput
              label='Name and Last Name'
              value={this.state.name}
              onChangeText={name=>this._updateForm('name', name)} 
            />
            <TextInput
              label="Email"
              value={this.state.email}
              onChangeText={email=>this._updateForm('email',email)}
              keyboardType='email-address'
            />
            <TextInput
              label="Phone"
              value={this.state.phone}
              onChangeText={phone=>this._updateForm('phone',phone)}
              keyboardType='phone-pad'
            />
            <HelperText 
              type='error'
              visible={this.state.email.length>3 && !this.state.email.includes('@')}
            >
              Email address is invalid!
            </HelperText>
          </Card.Content>
        </Card>        
        <Card style={{marginBottom:15}}>
          <Card.Content>
            <Title>Address</Title>
            <TextInput
              label='Address'
              value={this.state.address}
              onChangeText={address=>this._updateForm('address', address)} 
            />
            <TextInput
              label="City"
              value={this.state.city}
              onChangeText={city=>this._updateForm('city',city)}
            />
            <View style={{flexDirection:'row'}}>
              <TextInput
                style={{flex:1}}
                label="State"
                value={this.state.state}
                onChangeText={state=>this._updateForm('state',state)}
              />
              <TextInput
                style={{flex:1}}
                label="Country"
                value={this.state.country}
                onChangeText={country=>this._updateForm('country',country)}
              />
              <TextInput
                style={{flex:1}}
                label="Zip Code"
                value={this.state.zip_code}
                onChangeText={zip_code=>this._updateForm('zip_code',zip_code)}
                keyboardType='numeric'
              />
            </View>
          </Card.Content>
        </Card>        
        <Card>
          <Card.Content>
            <Button
              icon="account-box"
              mode="contained"
              onPress={()=>this._saveStudent()}
            >
              Save New Student Information
            </Button>
          </Card.Content>
        </Card>
      </View>
    )
  }
}