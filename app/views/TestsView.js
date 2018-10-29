/*
 * (C) Hand and Nail Harmony 2018
 * Author: Fabian Nino
 */
import React from 'react'
import { View, FlatList } from 'react-native'
import {List} from 'react-native-paper'
import LoadingModule from '../modules/LoadingModule';



export default class TestsView extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: `Tests for ${navigation.state.params.user.name}`,
  })

  state={
    loading:true
  }

  async componentDidMount() {
    await this.props.screenProps.getTests()
    this.setState({loading:false})
  }

  _goToEvent = (test) => {
    this.props.screenProps.setTest(test)
    this.props.navigation.navigate('Test', {key:test.key, name:test.name})
  }
 
  _renderListItem = ({item}) => {
    return (
      <List.Item
        title={item.name}
        // description={item.date.toLocaleString('en-US', {month:'short', day:'numeric', year:'numeric'})}
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
          data={this.props.screenProps.tests}
          renderItem={item=>this._renderListItem(item)}
        />
      </View>
    )
  }
}