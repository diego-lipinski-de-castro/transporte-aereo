import firebase from 'firebase/app'
import firestore from 'firebase/firestore'

const firebase_config = {
  apiKey: 'AIzaSyC-izbmtnzEZ1sctoK2FB_8Tii92YpBUbQ',
  authDomain: 'transporte-aereo.firebaseapp.com',
  databaseURL: 'https://transporte-aereo.firebaseio.com',
  projectId: 'transporte-aereo'
}

const fb_app = firebase.initializeApp(firebase_config)

const fs = firebase.firestore()
fs.enablePersistence()

export { fb_app, fs }
