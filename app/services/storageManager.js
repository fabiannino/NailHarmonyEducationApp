/*
 * (C) Hand and Nail Harmony 2018
 * Author: Fabian Nino
 */
import { AsyncStorage } from 'react-native'

export default storageManager = async (action, key, value) => {
  try {
    switch(action) {
      case 'get':
        const result = await AsyncStorage.getItem(key)
        return result || null;
      break;
      case 'set':
        await AsyncStorage.setItem(key ,value)
      break;
    }
  } catch (err) {
    throw new Error('storageManager.js Error managing internal storage:'+err)
  }
}