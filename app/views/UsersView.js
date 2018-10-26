import React from 'react'
import {Button, Text, View, FlatList, StyleSheet, Platform } from 'react-native'
import {List} from 'react-native-paper'

import {users} from '../services/api'



export default class UsersView extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: `${navigation.state.params.name}, ${navigation.state.params.date.toLocaleString('en-US', {month:'short', day:'numeric', year:'numeric'})}`,
    headerRight: (
      <Button 
        style={homeStyles.headerRight}
        onPress={()=>{navigation.navigate('AddUser')}}
        title='Add Student'
      />
    )
  })


  componentDidMount() {
    this.props.screenProps.getUsers()
  }


  _goToEvent = (id) => {
    this.props.navigation.navigate('Users', {id})
  }
 
  _renderListItem = ({item}) => {
  return (
    <List.Item
      title={item.name}
      left={props=><List.Icon {...props} icon="account-circle" />}
      onPress={()=>this._goToEvent(item.key)}
    />
  )
}

  render () {
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <FlatList
          style={{flex:1, alignSelf:'stretch'}}
          data={this.props.screenProps.users}
          renderItem={item=>this._renderListItem(item)}
        />
      </View>
    )
  }
}

const homeStyles = StyleSheet.create({
  headerButton: {
    ...Platform.select({
      android: {
        backgroundColor:'red'
      }
    })
  },
})