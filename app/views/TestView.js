import React from 'react'
import {ScrollView, View, StyleSheet, Text, TextInput as RNTextInput, KeyboardAvoidingView, TouchableHighlight, Image} from 'react-native'
import { Title, Card, TextInput, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { getUserTestResults, setUserTestResults, setUserTestComments, setUserTestImage } from '../services/api';
import LoadingModule from '../modules/LoadingModule';
import {ImagePicker, Permissions} from 'expo'



export default class TestView extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: navigation.state.params.name
  })

  state = {
    loading:true,
    currentTest: [],
    criteria:[],
    scores:[],
    accumulated:0,
    imageOne:null,
    imageTwo:null,
    imageThree:null,
    imageFour:null,
  }


  initState = async () => {
    let {images, categories_grades, criteria_comments} = await getUserTestResults(this.props.screenProps.currentUser.key, this.props.screenProps.currentEvent.key, this.props.screenProps.currentTest.key)
    
    let imageOne = {base64:images.imageOne}
    let imageTwo = {base64:images.imageTwo}
    let imageThree = {base64:images.imageThree}
    let imageFour = {base64:images.imageFour}

    this.setState({scores:categories_grades, criteria:criteria_comments, imageOne, imageTwo, imageThree, imageFour, loading:false}) 
    // this.setState({scores:categories_grades, criteria:criteria_comments, loading:false}) 
    this.updateTotalScore(categories_grades) 
  }

  selectTest = async (testKey) => {
    const currentTest = this.props.screenProps.tests.find(({key})=>key===testKey)
    this.setState({currentTest})
    await this.initState()    
  }

  async componentDidMount() {
    await this.selectTest(this.props.navigation.state.params.key)
    this.timer = setInterval(()=> this.initState(), 16000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  
  _updateCriteriaComments = (key, comments) => {
    let newCriteria = this.state.criteria
    newCriteria[key] = comments
    setUserTestComments(
      this.props.screenProps.currentUser.key, 
      this.props.screenProps.currentEvent.key, 
      this.props.screenProps.currentTest.key, 
      newCriteria, 
      key, 
      comments
    )
    this.setState({criteria:newCriteria})
  }

  _updateCatScore = (key, scoreValue, max_score) => {
    if(!isNaN(scoreValue)) {
      if(scoreValue < 1) scoreValue = 0;
      scoreValue = parseFloat(scoreValue)
      max_score = parseFloat(max_score)
      if(scoreValue <= max_score) {
        if(isNaN(scoreValue)) scoreValue = 0
        this._recordCatScore(key, scoreValue)
      }
    } else {
      console.log(`${scoreValue} is not a number. Max Score = ${max_score}`)
    }
  }

  _recordCatScore = (key, scoreValue) => {
    let newScores = this.state.scores
    newScores[key] = scoreValue
    // Send information to the server
    setUserTestResults(
      this.props.screenProps.currentUser.key, 
      this.props.screenProps.currentEvent.key, 
      this.props.screenProps.currentTest.key, 
      newScores, 
      key, 
      scoreValue
    )
    this.setState({scores:newScores},()=>{
      this.updateTotalScore()        
    })
  }
  
  updateTotalScore = (categories_grades) => {
    let accumulated = 0
    const scores = categories_grades || this.state.scores
    // console.log(scores)
    Object.values(scores).map((score)=>{
      accumulated += score
    })
    this.setState({accumulated})
  }


  renderSteps = ({key, name, categories}) => (
    <View key={key}>
      <Card style={testViewStyles.cards}>
        <Card.Content>
          <Title>{name}</Title>
        </Card.Content>
      </Card>
      {categories.map(category=>this.renderCategories(category))}
    </View>
  )

  
  renderCategories = ({key, name, max_score, criteria}) => {
    return (
      <Card key={key} style={testViewStyles.cards}>
        <Card.Content>
          <Title style={{fontSize:18}}>{name}</Title>
          <View style={{flexDirection:'row'}}>  
            <View style={{width:600,}}>
              {criteria.map(_criteria=>this.renderCriteria(_criteria))}
            </View>
            <View style={{justifyContent:'center'}}>
              <RNTextInput  
                style={{
                  width:100, 
                  height:100, 
                  backgroundColor:'#74b9ff',
                  color:'white',
                  fontSize:48,
                  textAlign:'center',
                  borderRadius:5,
                }}
                label="Score"
                underlineColorAndroid='transparent'
                value={
                  (this.state.scores[key]===0 ? '' : this.state.scores[key].toString())
                }
                onChangeText={score=>this._updateCatScore(key, score, max_score)}
                keyboardType='numeric'
              />
              <Text style={{
                color:'#74b9ff',
                fontSize:10,
                textAlign:'center'
              }}
              >
                Max Score {max_score}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    ) 
  }
  
  renderCriteria = ({key, name}) => {
    return (
      <View key={key} style={{marginTop:10, marginLeft:15, marginRight:5, flexDirection:'row'}}>
        <Text style={{width:200}}>{name}</Text>
        <TextInput
          style={{width:300}}
          type='outlined'
          label="To Improve"
          value={
            (this.state.criteria[key]===0 ? '' : this.state.criteria[key].toString())
          }
          onChangeText={comments=>this._updateCriteriaComments(key, comments)}
        />
      </View>
    )
  }
  

  _launchCameraAsync = async (imagePos) => {
    let permStatus = await  Promise.all([
      await Permissions.askAsync(Permissions.CAMERA_ROLL),
      await Permissions.askAsync(Permissions.CAMERA)
    ])
    if(permStatus.some((status)=>status === 'granted')) {
      console.error('Camera perms not granted')
      return;
    }
    
    let img = await ImagePicker.launchCameraAsync({allowsEditing:true, base64:true});
    if(!img.cancelled) {
      // console.log(img.uri)
      this.setState({[imagePos]:img})
      setUserTestImage(
        this.props.screenProps.currentUser.key, 
        this.props.screenProps.currentEvent.key, 
        this.props.screenProps.currentTest.key, 
        imagePos, 
        img.base64
      )
    }
  }

  _picturesContainer = (key) => (
    <View style={testViewStyles.pictureCard}>
      {
        this.state[key] && (
          <Image source={{uri:`data:image/jpeg;base64,${this.state[key].base64}`}} style={testViewStyles.pictureImage} resizeMode='cover' />
        )
      }
      <View style={testViewStyles.pictureButtonContainer}>
        <TouchableHighlight style={testViewStyles.pictureButton}
          underlayColor='rgb(116, 185, 255)'
          onPress={()=>{
            this._launchCameraAsync(key);
          }}
        >
          <MaterialIcons name="photo-camera" size={32} color='white' />
        </TouchableHighlight>
      </View>
    </View>
  )

  render() {
    if(this.state.loading) {
      return <LoadingModule />
    }
    // return <Text>Fabian</Text>
    return (
      <KeyboardAvoidingView behavior="padding" enabled style={{flex:1, alignItems:'center', justifyContent:'flex-start'}}>
        <Card style={testViewStyles.cardContainer}>
          <Card.Content style={{flexDirection:'row'}}>
            <MaterialIcons style={{marginRight:15}} name="account-circle" size={32} />
            <Title>{this.props.screenProps.currentUser.name}</Title>
            <Text style={{
              fontSize:20,
              textAlign:'right',
              position:'absolute',
              right:15,
              top:15,
            }}>Score: {this.state.accumulated}</Text>
          </Card.Content>
        </Card>

        <ScrollView style={{
          flex:1,
          alignSelf:'stretch',
          paddingRight:15,
          paddingBottom:15,
          paddingLeft:15
        }}>
          {this.state.currentTest.steps.map(step=>this.renderSteps(step))}
          <Card style={testViewStyles.cards}>
            <Card.Content>
              <View style={{
                flexDirection:'row',
                alignSelf:'stretch',
              }}>
                <View style={{
                  flex:1,
                }}>
                  {this._picturesContainer('imageOne')}
                  {this._picturesContainer('imageTwo')}
                </View>
                <View style={{
                  flex:1,
                }}>
                  {this._picturesContainer('imageThree')}
                  {this._picturesContainer('imageFour')}
                </View>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>



      </KeyboardAvoidingView>
    )
  }
}

const testViewStyles = StyleSheet.create({
  cardContainer:{
    marginTop:15,
    marginRight:15,
    marginBottom:15,
    marginLeft:15,
    alignSelf:'stretch',
  },
  cards:{
    marginTop:10, 
    paddingTop:5, 
    paddingRight:5, 
    paddingBottom:5,
  },
  pictureCard: {
    alignSelf:'stretch',
    height:300,
    backgroundColor:'#dfe6e9',
    alignItems:'center',
    justifyContent:'center',
    marginTop:5,
    marginRight:5,
    marginBottom:5,
    marginLeft:5,
    justifyContent:'flex-end',
    borderRadius:10,
    overflow:'hidden',
  },
  pictureImage:{
    height:300, 
    width:400, 
    position:'absolute', 
    top:0, 
    left:0
  },
  pictureButtonContainer:{
    alignSelf:'stretch',
    height:75,
    backgroundColor:'rgba(9, 132, 227,0.5)',
    alignItems:'center',
    justifyContent:'center',
  },
  pictureButton:{
    width:50,
    height:50,
    borderRadius:25,
    backgroundColor:'rgb(9, 132, 227)',
    alignItems:'center',
    justifyContent:'center',
  },
})