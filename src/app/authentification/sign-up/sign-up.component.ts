import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import * as  firebase from 'firebase/auth';
import { getAuth, updateProfile } from "firebase/auth";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signeForm : FormGroup = this.formBuilder.group({
  });
  errorMessage! : string;
  constructor(private authentServ : AuthService , private formBuilder : FormBuilder, private route : Router) { }

  ngOnInit(): void {
    this.signeForm = this.formBuilder.group({
      sexe : [false , Validators.required ],
      lastName : ['', Validators.required],
      firstName : ['', Validators.required],
      email : ['', [Validators.required,Validators.email]],
      password : ['', [Validators.required,Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    })
  }
  onSigneIn(){
    this.route.navigate(['/auth']);
  }
  
  getPhotoSexe(){
    const sexe= this.signeForm.get('sexe')?.value;
    console.log(sexe)
 if(sexe){
  return "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png"
 }else {
   return "https://icon-library.com/images/icon-avatars/icon-avatars-12.jpg"
 }
 }
 auth = getAuth();
 updateProfil(){
  const lastName= this.signeForm.get('lastName')?.value;
  const firstName= this.signeForm.get('firstName')?.value;
   if(this.auth.currentUser!=null)
firebase.updateProfile(this.auth.currentUser, {
  displayName: lastName + " " + firstName, photoURL: this.getPhotoSexe()
}).then(() => {
 console.log(this.auth.currentUser?.displayName);
}).catch((error) => {
  // An error occurred
  // ...
});
}
  onCreateNewUser(){
    const email= this.signeForm.get('email')?.value;
    const password= this.signeForm.get('password')?.value;
    this.authentServ.createNewUser(email,password).then( 
      () =>{
        console.log("inscreption reussi");
        this.updateProfil();
        this.route.navigate(["/todolist"]);
    }, (error) => {
      this.errorMessage = error;
    }
      );
  }
  signeOut(){
    this.authentServ.signOut();
  }
  
}
