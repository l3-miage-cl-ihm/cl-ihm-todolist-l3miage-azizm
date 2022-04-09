import { Injectable } from '@angular/core';
import  * as firebase from 'firebase/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

constructor(){}

createNewUser(email : string , password : string){
 let auth = firebase.getAuth();
 return new Promise<void>( (resolve,reject) => { 
  firebase.createUserWithEmailAndPassword(auth,email,password).then(
     ()=>{resolve()},
     (error)=>{reject(error);}
 )});
}

singIn(email : string , password : string){
    let auth = firebase.getAuth();
 return new Promise<void>( (resolve,reject) => {firebase.signInWithEmailAndPassword(auth,email,password).then(
     ()=>{resolve()},
     (error)=>{reject(error);}
 )});
}
signOut(){
    const auth = firebase.getAuth();
    firebase.signOut(auth);
  }
}