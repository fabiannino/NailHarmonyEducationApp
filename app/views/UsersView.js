/*
 * (C) Hand and Nail Harmony 2018
 * Author: Fabian Nino
 */
import React from 'react'
import {Button, Text, View, FlatList, StyleSheet, Platform } from 'react-native'
import {List} from 'react-native-paper'
import LoadingModule from '../modules/LoadingModule';



export default class UsersView extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: `${navigation.state.params.name}, ${navigation.state.params.date.toLocaleString('en-US', {month:'short', day:'numeric', year:'numeric'})}`,
    headerRight: (
      <Button 
        style={homeStyles.headerRight}
        onPress={()=>{navigation.navigate('AddUser', {eventId:navigation.state.params.key})}}
        title='Add Student'
      />
    )
  })

  state = {
    loading:true,
  }

  async componentDidMount() {
    await this.props.screenProps.getUsers(this.props.navigation.state.params.key)
    this.setState({loading:false})
  }


  _goToEvent = (user) => {
    this.props.screenProps.setUser(user);
    this.props.navigation.navigate('Tests', {user})
  }
 
  _renderListItem = ({item}) => {
    return (
      <List.Item
        title={item.name}
        left={props=><List.Icon {...props} icon="account-circle" />}
        onPress={()=>this._goToEvent(item)}
      />
    )
  }

  render () {
    if(this.state.loading) {
      return <LoadingModule />
    }
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
        marginRight:15
      }
    })
  },
})