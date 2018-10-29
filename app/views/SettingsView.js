import React from 'react'
import { ScrollView, View, Text, SafeAreaView, Button} from 'react-native'
import { Title } from 'react-native-paper';
import {Constants} from 'expo'
import storageManager from '../services/storageManager';


const renderMemory = (title, data, that) => (
  <View style={{flex:1}}>
    <Text>{title}</Text>
    <Button 
      title={`Clean ${title}`}
      onPress={async ()=>{
        await storageManager('set', title, '')
        that.getStoreData()
      }}
    />
    <ScrollView style={{flex:1}}>
      <Text selectable>{data}</Text>
    </ScrollView>
  </View>
)

export default class SettingsView extends React.Component {
  state={
    events:'',
    users:'',
    tests:'',
    pendingPush:'',
    pendingPushUserTests:'',
  }
  getStoreData = async (data) => {
    const events = await storageManager('get', '@events')
    const users = await storageManager('get', '@users')
    const tests = await storageManager('get', '@tests')
    const pendingPush = await storageManager('get', '@pendingPush:user')
    const pendingPushUserTests = await storageManager('get', '@pendingPush:user:tests')
    this.setState({events, users, tests, pendingPush, pendingPushUserTests})
  }

  async componentWillMount() {
    await this.getStoreData()
  }

  render () {
    return (
        <SafeAreaView style={{flex:1, alignSelf:'stretch', alignContent:'center', marginTop:Constants.statusBarHeight}}>
          <Title>Settings</Title>
          <Button 
            title='Refresh'
            onPress={()=>this.getStoreData()}
            />
          {renderMemory('@events', this.state.events, this)}
          {renderMemory('@users', this.state.users, this)}
          {renderMemory('@tests', this.state.tests, this)}
          {renderMemory('@pendingPush:user', this.state.pendingPush, this)}
          {renderMemory('@pendingPush:user:tests', this.state.pendingPushUserTests, this)}
        </SafeAreaView>
    )
  }
}