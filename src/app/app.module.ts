import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodolistService } from './service/todolist.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AuthentificationComponent } from './authentification/authentification.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from './service/auth.service';
import { SignUpComponent } from './authentification/sign-up/sign-up.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { AuthGardService } from './service/authgard.service';
import { ListIDComponent } from './todo-list/list-id/list-id.component';
import { provideStorage,getStorage } from '@angular/fire/storage';
import {NgxQRCodeModule} from '@techiediaries/ngx-qrcode';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore'

let appRouter : Routes =[ 
  {path : 'auth',component : AuthentificationComponent},
  {path : 'todolist',canActivate : [AuthGardService],component : TodoListComponent},
  {path : 'todolist/list',canActivate : [AuthGardService],component : ListIDComponent},
  {path : 'auth/signein',component : SignUpComponent},
  {path : '',redirectTo : 'auth', pathMatch : 'full'},
  {path : '**',redirectTo : 'auth'},
]  
@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    AuthentificationComponent,
    SignUpComponent,
    ListIDComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxQRCodeModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forRoot(appRouter),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [TodolistService,AuthService,AuthGardService],
  bootstrap: [AppComponent]
})
export class AppModule {}
