/*
 * (C) Hand and Nail Harmony 2018
 * Author: Fabian Nino
 */
import React from 'react'
import { View, FlatList } from 'react-native'
import {List} from 'react-native-paper'
import LoadingModule from '../modules/LoadingModule';



export default class EventsView extends React.Component {

  state = {
    loading:true,
  }

  async componentDidMount() {
    await this.props.screenProps.getEvents()
    this.setState({loading:false})
  }

  _goToEvent = (event) => {
    this.props.screenProps.setEvent(event)
    this.props.navigation.navigate('Users', {key:event.key, name:event.name, date:event.date})
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
    if(this.state.loading) {
      return <LoadingModule />
    }
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <FlatList
          style={{flex:1, alignSelf:'stretch'}}
          data={this.props.screenProps.events}
          renderItem={item=>this._renderListItem(item)}
        />
      </View>
    )
  }
}