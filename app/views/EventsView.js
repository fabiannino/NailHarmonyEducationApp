import React from 'react'
import { Text, View, FlatList } from 'react-native'
import {List} from 'react-native-paper'

import {events} from '../services/api'



export default class EventsView extends React.Component {

  _goToEvent = ({key, name, date}) => {
    this.props.navigation.navigate('Users', {key, name, date, navigation: this.props.navigation})
  }
 
  _renderListItem = ({item}) => {
  return (
    <List.Item
      title={item.name}
      description={item.date.toLocaleString('en-US', {month:'short', day:'numeric', year:'numeric'})}
      left={props=><List.Icon {...props} icon="folder" />}
      onPress={()=>this._goToEvent(item)}
    />
  )
}

  render () {
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <FlatList
          style={{flex:1, alignSelf:'stretch'}}
          data={events}
          renderItem={item=>this._renderListItem(item)}
        />
      </View>
    )
  }
}