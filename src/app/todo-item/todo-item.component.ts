import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { TodoItem, TodolistService } from '../service/todolist.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnInit {
  @Input() data!: TodoItem;
  @Output() updat = new EventEmitter<Partial<TodoItem>>();
  @Output() remove = new EventEmitter<TodoItem>();
  isEditting = false;
  constructor(private tds: TodolistService) { }
  @Input() filtre =false;
  removeEmmiter() {
    this.remove.emit(this.data);
  }
  isEdit() {
    console.log(this.isEditting);
    this.isEditting = true;
    console.log(this.isEditting);
  }
  updateEmmiter(partItem: Partial<TodoItem>) {
    this.updat.emit(partItem);
  }
  URL = "";
  init(str:string){
    this.URL = str;
  }
  ngOnInit(): void {
  }
   get ObsImg(){
     return this.tds.ObsImg;
   }
   url = this.tds.fb;
  onFileSelected(e : any){
    this.tds.onFileSelected(e);
  }
}
