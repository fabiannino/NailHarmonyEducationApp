/*
 * (C) Hand and Nail Harmony 2018
 * Author: Fabian Nino
 */
import { NetInfo } from 'react-native'
import storageManager from './storageManager';

const  NAILHARMONY_API = 'https://nailharmony.net/education/api'
export const CREDENTIALS = {username:'', password:''} 







/*
 * Getters
 */

/*
 * getEvents () => Array
 * It tries to get the event from the server
 * if the network is not available
 * or if there are no events on the server, 
 * then, it tries to fetch the stored events on the app
 * if no events stored, then it shows a default 
 * event array
 * 
 * It stores the server-fetched events into the app.
 */


export const getEvents = async () => {

  let isConnected = await NetInfo.isConnected.fetch()
  if(isConnected) {
    let response = await fetch(`${NAILHARMONY_API}/events`, {
      method:'post', 
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({username:CREDENTIALS.username, password:CREDENTIALS.password})
    })

    if(response.status === 200) {
      let res = await response.json()
      storageManager('set', '@events', JSON.stringify(res))
      return res
    }
    
  } else {
    // It is not connected Then...
    let fromStorage = await storageManager('get', '@events')

    if(fromStorage !== null) {
      return JSON.parse(fromStorage);
    } else {
      // Nothing in storage, so show default
      return events;
    }
  }
}

/*
 * getUsers() => Array
 * It tries to get the users for this event from the 
 * server's database. If the server is not available, 
 * it tries to fetch the stored users on the app. Otherwise, 
 * it shows a default no-user array.
 * 
 * It stores the server-fetched users into the app.
 */

export const getUsers = async (eventId) => {
  let isConnected = await NetInfo.isConnected.fetch()
  if(isConnected) {
    let response = await fetch(`${NAILHARMONY_API}/usersByEvent/${eventId}`, {
      method:'post', 
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        username:CREDENTIALS.username, 
        password:CREDENTIALS.password,
      })
    })
    
    if(response.status === 200) {
      let res = await response.json()
      // console.log(res)
      try {
        if(!res.error) {
          storageManager('set', '@users', JSON.stringify(res))
          return res[eventId]
        } else {
          // throw new Error(res.error)
        }
      } catch(error) {
        console.log(error.message)
      }
    }
    
  } else {
    // console.log('no-network')
  }

  let fromStorage = await storageManager('get', '@users')
  
  if(fromStorage !== null) {
    let eventUsers = JSON.parse(fromStorage);
    if(eventUsers[eventId]) {
      return eventUsers[eventId]
    }
  } 

  return users;

  }


/*
 * getTests() => array
 */

export const getTests = async () => {
  // check if there's network
  let isConnected = NetInfo.isConnected.fetch();
  if(isConnected) {
    let response = await fetch(`${NAILHARMONY_API}/testsList`, {
      method:'post', 
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        username:CREDENTIALS.username, 
        password:CREDENTIALS.password,
      })
    })
    
    if(response.status === 200) {
      // let res = await response.text()
      // console.log(res);
      let res = await response.json()
      try {
        if(!res.error) {
          storageManager('set', '@tests', JSON.stringify(res))
          return res
        } else {
          // throw new Error(res.error)
        }
      } catch(error) {
        console.log(error.message)
      }
    }
  } else {
    // there's no network then
    let fromStorage = await storageManager('get', '@tests')

    if(fromStorage !== null) {
      return JSON.parse(fromStorage);
    } else {
      // Nothing in storage, so show default
      return tests;
    }
  }
}

export const getUserTestResults = async (students_id, events_id, tests_id) => {
  // Check if there's network
  let isConnected = NetInfo.isConnected.fetch()
  if(isConnected) {
    let response = await fetch(`${NAILHARMONY_API}/getUserTestResults`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        username:CREDENTIALS.username,
        password:CREDENTIALS.password,
        students_id:students_id, 
        events_id:events_id, 
        tests_id:tests_id,
      })
    })
    // console.log(`getUserTestResults ${students_id}, ${events_id}, ${tests_id}`)
    if(response.status === 200) {
      // try {
        let res = await response.json()
      // } catch(error) {
      //   let resText = await response.text()
      //   throw new Error ('Error in Json at getUserTestResults:'+resText+error)
      // }
      try {
        if(!res.error) {
          return res
        } else {
          // throw new Error(res.error)
        }
      } catch(error) {
        console.log(error.message)
      }
    }
  } else {
    // There is not network
    let fromStorage = await storageManager('get', '@pendingPush:user:tests')
    if(fromStorage !== null) {
      return (JSON.parse(fromStorage))[students_id][events_id][tests_id]
    } else {
      // Nothing in storage, nothing to show
      return false
    }
  }
}



/*
 * Setters
 */

/*
 * addUser() => null
 * It saves on the app the newly input user. 
 * Then it tries to push it onto the server. 
 * If the server is not available, 
 * it stores the user information into a separate
 * key memory in the app for later upload/push to 
 * the server.
 */

export const addUser = async (newUser, eventId) => {

  // Save in local memory
  let currentUsers = await storageManager('get', '@users');
  if(currentUsers) {
    currentUsers = JSON.parse(currentUsers);
  } else {
    currentUsers = [];
  }
  if(!currentUsers[eventId]) {
    currentUsers[eventId] = []
  }
  currentUsers[eventId].push(newUser)
  let newUsers = currentUsers
  await storageManager('set', '@users', JSON.stringify(newUsers))
  
  // currentUsers = await storageManager('get', '@users');
  // console.log(currentUsers)

  /*
   * Push to Server
   * If network is not available
   * save into @pendingPush['user'][eventId][{userInfo}]
   */

  NetInfo.isConnected.fetch().then(async isConnected => {
    if(isConnected) {
      let response = await fetch(`${NAILHARMONY_API}/addNewUser`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          username:CREDENTIALS.username, 
          password:CREDENTIALS.password,
          userData:newUser,
          eventId:eventId,
        })
      })
      if(response.status === 200) {
        let res = await response.json()
        try {
          if(res.error) {
            // throw new Error(res.error)
          } else {
            return;
          }
        } catch(error) {
          console.log(error.message)
        }
      }
    } else {
      // It is not connected then
      let currentPendingPush = await storageManager('get', '@pendingPush:user')
      if(currentPendingPush !== null) {
        currentPendingPush = JSON.parse(currentPendingPush)
        currentPendingPush[eventId].push(newUser)
      } else {
        currentPendingPush = {[eventId]:[newUser]}
      }
      await storageManager('set', '@pendingPush:user', JSON.stringify(currentPendingPush))
    }
  })

}


export const setUserTestResults = async (students_id, events_id, tests_id, scores, key, scoreValue) => {
  let fromStorage = await storageManager('get', '@pendingPush:user:tests')
  let userTestResults = {}
  if(fromStorage !== null) {
    userTestResults = JSON.parse(fromStorage)
  }
  if(!userTestResults[students_id]) userTestResults[students_id] = {}
  if(!userTestResults[students_id][events_id]) userTestResults[students_id][events_id] = {}
  if(!userTestResults[students_id][events_id][tests_id]) userTestResults[students_id][events_id][tests_id] = {}

  userTestResults[students_id][events_id][tests_id] = {
    categories_grades:scores,
  }
  await storageManager('set', '@pendingPush:user:tests', JSON.stringify(userTestResults))

  let isConnected = NetInfo.isConnected.fetch()
  if(isConnected) {
    let response = await fetch(`${NAILHARMONY_API}/setUserTestResults`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        username:CREDENTIALS.username,
        password:CREDENTIALS.password,
        students_id:students_id, 
        events_id:events_id, 
        tests_id:tests_id,
        key:key,
        scoreValue:scoreValue,
      })
    }) 
    // console.log(`getUserTestResults ${students_id}, ${events_id}, ${tests_id}`)
    if(response.status === 200) {
      // let res = await response.text()
      let res = await response.json()
      // console.log(res)
      try {
        if(res.error) {
          throw new Error(res.error)
        } else {
          return;
        }
      } catch(error) {
        console.log(error.message)
      }
    }
  }

}

// setUserTestComments(
//   this.props.screenProps.currentUser.key, 
//   this.props.screenProps.currentEvent.key, 
//   this.props.screenProps.currentTest.key, 
//   newCriteria, 
//   key, 
//   comments
// )

export const setUserTestComments = async (students_id, events_id, tests_id, criteria, key, comments) => {
  let fromStorage = await storageManager('get', '@pendingPush:user:tests')
  let userTestResults = {}
  if(fromStorage !== null) {
    userTestResults = JSON.parse(fromStorage)
  }
  if(!userTestResults[students_id]) userTestResults[students_id] = {}
  if(!userTestResults[students_id][events_id]) userTestResults[students_id][events_id] = {}
  if(!userTestResults[students_id][events_id][tests_id]) userTestResults[students_id][events_id][tests_id] = {}

  userTestResults[students_id][events_id][tests_id] = {
    criteria_comments:criteria,
  }
  await storageManager('set', '@pendingPush:user:tests', JSON.stringify(userTestResults))

  let isConnected = NetInfo.isConnected.fetch()
  if(isConnected) {
    let response = await fetch(`${NAILHARMONY_API}/setUserTestComments`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        username:CREDENTIALS.username,
        password:CREDENTIALS.password,
        students_id:students_id, 
        events_id:events_id, 
        tests_id:tests_id,
        key:key,
        comments:comments,
      })
    }) 
    // console.log(`getUserTestResults ${students_id}, ${events_id}, ${tests_id}`)
    if(response.status === 200) {
      // let res = await response.text()
      let res = await response.json()
      // console.log(res)
      try {
        if(res.error) {
          throw new Error(res.error)
        } else {
          return;
        }
      } catch(error) {
        console.log(error.message)
      }
    }
  }

}

export const setUserTestImage = async (students_id, events_id, tests_id, key, image) => {
  let fromStorage = await storageManager('get', '@pendingPush:user:tests')
  let userTestResults = {}
  if(fromStorage !== null) {
    userTestResults = JSON.parse(fromStorage)
  }
  if(!userTestResults[students_id]) userTestResults[students_id] = {}
  if(!userTestResults[students_id][events_id]) userTestResults[students_id][events_id] = {}
  if(!userTestResults[students_id][events_id][tests_id]) userTestResults[students_id][events_id][tests_id] = {}

  userTestResults[students_id][events_id][tests_id][key] = image

  // await storageManager('set', '@pendingPush:user:tests', JSON.stringify(userTestResults))

  let isConnected = NetInfo.isConnected.fetch()
  if(isConnected) {
    let response = await fetch(`${NAILHARMONY_API}/setUserTestImage`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        username:CREDENTIALS.username,
        password:CREDENTIALS.password,
        students_id:students_id, 
        events_id:events_id, 
        tests_id:tests_id,
        key:key,
        image:image,
      })
    }) 
    // console.log(`getUserTestResults ${students_id}, ${events_id}, ${tests_id}`)
    if(response.status === 200) {
      // let res = await response.text()
      let res = await response.json()
      // console.log(res)
      try {
        if(res.error) {
          throw new Error(res.error)
        } else {
          return;
        }
      } catch(error) {
        console.log(error.message)
      }
    }
  }

}


/*
 * Default values for getters
 */


const events = [
  {
    key: '1',
    name: "Missing Events",
    date:'Jan 1, 2001'
  }
]



const users = [
  {
    key: 'missing',
    name: 'Missing Students',
    events:['1'],
  }, 
]





const tests = [
  {
    key: '1',
    name: 'Gelish Dip Color',
    steps: [
      {
        key: '1.1',
        name: 'Gelish Dip Color Application',
        categories: [
          {
            key: '1.1.1',
            name: 'Preparation', 
            evaluationCriteria: [
              {
                key: '1.1.1.1',
                name: 'Manicure',
              }, 
              {
                key: '1.1.1.2',
                name: 'Pedicure',
              }, 
              {
                key: '1.1.1.3',
                name:'Overal Nail Prep'
              },
            ],
          },
          {
            key: '1.1.2',
            name: 'Color Application', 
            evaluationCriteria: [
              {
                key: '1.1.2.1',
                name: 'Horizontal lines - demarcation lines left between dips',
              }, 
              {
                key: '1.1.2.2',
                name: 'Shadows - Uneven Color Application',
              }, 
              {
                key: '1.1.3.3',
                name:'Drag Lines - Pressing too hard/brush needs cleaning'
              },
              {
                key: '1.1.3.4',
                name: 'Thinkness - Product Applied Too Think/Thin'
              },
            ],
          },
        ],
      }
    ],
  },
]

