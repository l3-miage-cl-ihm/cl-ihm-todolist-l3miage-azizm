import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { AuthService } from '../service/auth.service';
import { TodolistService } from '../service/todolist.service';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.scss']
})
export class AuthentificationComponent implements OnInit {

  signeForm : FormGroup = this.formBuilder.group({
  });
  errorMessage! : string;
  constructor(public auth: AngularFireAuth,private route : Router,private authentServ : AuthService,private formBuilder : FormBuilder,private tds : TodolistService) {
  }

  ngOnInit(): void {
    this.signeForm = this.formBuilder.group({
      email : ['', [Validators.required,Validators.email]],
      password : ['', [Validators.required,Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    })
  }
  onSignIN(){
    const email= this.signeForm.get('email')?.value;
    const password= this.signeForm.get('password')?.value;
    this.authentServ.singIn(email,password).then( 
    () =>{console.log("connexion reussi");
    this.route.navigate(['/todolist']);
  }, (error) => {
    this.errorMessage = error;
  }
    );
  }
  onCreateNewwUser(){
    this.route.navigate(['/auth/signein']);
  }
  signeOut(){
    this.authentServ.signOut();
  }
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
      ()=> { console.log("connexion reussi");
      this.route.navigate(['/todolist']);}
    );
  }
  logout() {
    this.auth.signOut();
  }
  

  

}
