import React from 'react';
import { AsyncStorage } from 'react-native'


export let events = [
  {
    key: '1',
    name:'Brea Training',
    date:'Nov 11, 2018'
  }
]

export let users = [
  {
    key: '1',
    name: 'Fabian Nino',
  }, 
  {
    key: '2',
    name: 'John Smith',
  }
]

export const addUser = (userInfo) => {
  users = [...users, userInfo]
  // users.push(userInfo)
}