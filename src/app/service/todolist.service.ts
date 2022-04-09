import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, finalize, map, Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

export interface TodoItem {
  readonly url : string;
  readonly label: string;
  readonly isDone: boolean;
  readonly id: number;
}

export interface TodoList {
  readonly label: string;
  readonly items: readonly TodoItem[];
}
export interface TabUser {
  tab: number[];
}

let idItem = 0;
let numlist = 0;
@Injectable({
  providedIn: 'root'
})
export class TodolistService implements OnInit {
  num = 0;
  private todoList: TodoList = { label: 'L3 MIAGE', items: [] };
  items !: Observable<TodoList>;
  obstabid  !: Observable<TabUser>
  private id = "";
  tabId: TabUser = { tab: [0] };
  constructor(private afs: AngularFirestore, private auth: AngularFireAuth,private storage : AngularFireStorage) {
    console.log("je suis la")
    this.auth.onAuthStateChanged(
      (user) => {
        if (user) {
          this.id = user.uid;
          this.setIdObsList(numlist);
          this.afs.doc<TabUser>(`/${this.id}/tabUserId`).set({tab :[0]}, { merge: true });
          this.obstabid = this.afs.doc<TabUser>(`/${this.id}/tabUserId`).valueChanges().pipe(
            map(L => L ?? { tab : [0] }));
        }
      }
    );
  }
  ngOnInit(): void {
    
  }
  
 get ObsId(){
   return this.obstabid;
 }
  get Obs() {
    return this.items;
  }
  create(...labels: readonly string[]): this {
    let item: TodoList = {
      ...this.todoList,
      items: [
        ...this.todoList.items,
        ...labels.filter(l => l !== '').map(
          label => ({ url : "",label, isDone: false, id: idItem++ })
        )
      ]
    }
    console.log(numlist);
    this.afs.doc<TodoList>(`/${this.id}/list` + this.num).set(item, { merge: true });
    return this;
  }
  get tab() {
    return this.tabId;
  }
   ObsById(id : number){
    return this.afs.doc<TodoList>(`/${this.id}/list` + numlist).valueChanges().pipe(
      map(L => this.todoList = L ?? { label: 'list' + numlist, items: [] }));
  }
  get Usernumber() {
    if (this.tabId.tab == null) {
      return 0
    } else {
      return this.tabId.tab.length - 1;
    }
  }
  setIdObsList(id: number) {
    numlist = id;
    this.items = this.afs.doc<TodoList>(`/${this.id}/list` + numlist).valueChanges().pipe(
      map(L => this.todoList = L ?? { label: 'list'+numlist, items: [] }));
  }
  ajouterList() {
    let num = this.tabId.tab[this.tabId.tab.length - 1];
    if(num==null){
      this.tabId.tab.push(0);
      this.afs.doc<TabUser>(`/${this.id}/tabUserId`).set(this.tabId, { merge: true });
    }else{
    console.log(num)
    num++;
    this.tabId.tab.push(num);
    console.log(this.tabId);
    this.afs.doc<TodoList>(`/${this.id}/list`+num).set({ label: 'List'+num, items: [] }, { merge: true });
    this.afs.doc<TabUser>(`/${this.id}/tabUserId`).set(this.tabId, { merge: true });
    numlist++;
  }
  }
  delete(...items: readonly TodoItem[]): this {
    let item: TodoList = {
      ...this.todoList,
      items: this.todoList.items.filter(item => items.indexOf(item) === -1)
    };
    this.afs.doc<TodoList>(`/${this.id}/list`+ numlist).update(item); 
    return this;
  }
 deleteByid(id: number, tab : TabUser){
   let T : TabUser ={
    tab : tab.tab.filter((tab)=> tab!=id)
   }
  console.log("delete list" +id)
  this.afs.doc<TabUser>(`/${this.id}/tabUserId`).update(T);
  this.afs.doc<TodoList>(`/${this.id}/list`+ id).delete().then( u=>
    console.log("delete reussi" + u)
  );
 }
  update(data: Partial<TodoItem>, ...items: readonly TodoItem[]): this {
    if (data.label !== "") {
      let item: TodoList = {
        ...this.todoList,
        items: this.todoList.items.map(item => items.indexOf(item) >= 0 ? { ...item, ...data } : item)
      }
      console.log(numlist)
      this.afs.doc<TodoList>(`/${this.id}/list`+numlist).update(item);
    } else {
      this.delete(...items);
    }
    return this;
  }

  selectedFile!: File;
  fb :string = " ";
  bhf= new BehaviorSubject<string>(this.fb);
  downloadURL= this.bhf.asObservable();
  onFileSelected(event: any) {
    var n = Date.now();
    const file = event.target.files[0];
    const fileRef = this.storage.ref(`/${this.id}/usersImages/${n+'.jpg'}`);
    const task = this.storage.upload(`/${this.id}/usersImages/${n+'.jpg'}`, file);
    task
    .snapshotChanges()
    .pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(url => {
          if (url) {
            this.bhf.next(url);
          }
         
        });
      })
    )
    .subscribe(url => {
      if (url) {
        console.log(url);
      }
    });
  }
     get Url(){
       return this.fb;
     }
     get ObsImg(){
      return this.downloadURL;
          }
     

}
