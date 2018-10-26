import React from 'react'
import {View, StyleSheet} from 'react-native'
import { Title, TextInput, Card, Button } from 'react-native-paper';

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
    zipCode:'',
  }

  _updateForm = (field, value) => {
    this.setState({[field]:value})
  }

  _saveStudent = () => {
    this.props.screenProps.addUser(this.state)
    this.props.navigation.navigate('Users')
  }
  render () {
    return(
      <View style={{
        width:600,
        flex:1,
        alignSelf:'center',
      }}>
        <Title>Student Information</Title>
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
              onChangetext={email=>this._updateForm('email',email)}
              keyboardType='email-address'
            />
            <TextInput
              label="Phone"
              value={this.state.phone}
              onChangetext={phone=>this._updateForm('phone',phone)}
              keyboardType='phone-pad'
            />
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
              onChangetext={city=>this._updateForm('city',city)}
            />
            <View style={{flexDirection:'row'}}>
              <TextInput
                style={{flex:1}}
                label="State"
                value={this.state.state}
                onChangetext={state=>this._updateForm('state',state)}
              />
              <TextInput
                style={{flex:1}}
                label="Country"
                value={this.state.country}
                onChangetext={country=>this._updateForm('country',country)}
              />
              <TextInput
                style={{flex:1}}
                label="Zip Code"
                value={this.state.zipCode}
                onChangetext={zipCode=>this._updateForm('zipCode',zipCode)}
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