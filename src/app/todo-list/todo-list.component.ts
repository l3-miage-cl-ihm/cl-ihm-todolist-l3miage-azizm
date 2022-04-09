import { Component, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable} from 'rxjs';
import { TabUser, TodoItem, TodoList,TodolistService } from '../service/todolist.service';

export let num = -1;
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {

  private newObs!: Observable<TabUser>; 
  private obs!: Observable<TodoList>; 
  id = num;
  constructor(private tds: TodolistService,public auth: AngularFireAuth, private root :Router) {
    this.auth.onAuthStateChanged(
      (U)=>{
      if(U){
        this.obs = this.tds.items;
        this.newObs = this.tds.ObsId;
      }
    }
    )    
   }
  ngOnInit(): void {
  }
  
  Delete(id:number,tab:TabUser){
    console.log(id);
    this.tds.deleteByid(id,tab);
  }

  logout(){
    this.auth.signOut();
  }
 
  get NewObs() {
    return this.newObs;
  }
  get Obs() {
    return this.obs;
  }
  @HostListener('document:keydown.control.z') undo(event: KeyboardEvent) {
   
  }
  affichList(id : any){
    if(id!==-1){
    this.tds.setIdObsList(id);
    this.root.navigate(['/todolist/list'])
  }
  }
  addNewList(){
    this.tds.ajouterList();
  }
  
}
