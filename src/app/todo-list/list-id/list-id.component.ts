import { Component, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, finalize, map, Observable, switchMap, zip } from 'rxjs';
import { TabUser, TodoItem, TodoList, TodolistService } from 'src/app/service/todolist.service';


type fctFiltre = (item: TodoItem) => boolean;

export interface TodoListPlusPlus extends TodoList, TabUser {
  remeaning: number;
  displayeItem: TodoItem[];
  filter: fctFiltre;
  allDone: boolean;
}
export let num = 0;
@Component({
  selector: 'app-list-id',
  templateUrl: './list-id.component.html',
  styleUrls: ['./list-id.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListIDComponent implements OnInit {
  readonly filterAll: fctFiltre = () => true;
  readonly filterComlet: fctFiltre = (item) => item.isDone;
  readonly filterActiv: fctFiltre = (item) => !item.isDone;
  Tdls !:TodoList;
  cf = new BehaviorSubject<fctFiltre>(this.filterAll);
  private newObs!: Observable<TodoListPlusPlus>;
  id = num;
  urlItemImage = "";
  constructor(private tds: TodolistService, public auth: AngularFireAuth, private root: Router) {
    this.auth.onAuthStateChanged(
      (U) => {
        if (U) {
          this.newObs = combineLatest([this.tds.Obs, this.tds.obstabid, this.cf]).pipe((
            map(([L, tab, f]) => ({
              ...L,
              ...tab,
              remeaning: L.items.reduce((n, item) => !item.isDone ? n + 1 : n, 0),
              displayeItem: L.items.filter(f),
              filter: f,
              allDone: this.isALL(L.items)
            })
            )
          ));
        }
      }
    )

  }
  jsonList= JSON.stringify(this.Tdls);
  ngOnInit(): void {
    this.NewObs;
  }
  imgBool = false;
  get obsItem() {
    return this.tds.Obs;
  }
 
  logout() {
    this.auth.signOut();
  }

  get NewObs() {
    return this.newObs;
  }
  @HostListener('document:keydown.control.z') undo(event: KeyboardEvent) {

  }
 
  isClicked = false;
  addNewList() {
    this.tds.ajouterList();
  }
  
 
  isALL(items: readonly TodoItem[]): boolean {
    let n = 0;
    for (let item of items) {
      if (item.isDone) {
        n++;
      }
    }
    return items.length == n;
  }
  
  setFilter(filtre: fctFiltre) {
    this.cf.next(filtre)
  }
  
  onSelectAll(b: boolean, items: readonly TodoItem[]) {
    this.update({ isDone: b }, ...items);
  }
  
  ajouterLab(...labels: readonly string[]) {
    this.tds.create(...labels);
  }
  
  update(data: Partial<TodoItem>, ...items: readonly TodoItem[]) {
    this.tds.update(data, ...items);
  }
  
  trackById(id: number, item: TodoItem) {
    return item.id;
  }
  isActif = false;
  
  navigateMenu() {
    this.root.navigate(['/todolist'])
  }
  
  istoggleAll = false;
  
  onRemoveAll(listItems: readonly TodoItem[]) {
    let item = [];
    for (let e of listItems) {
      if (e.isDone) {
        item.push(e);
      }
    }
    this.tds.delete(...item);
  }
  
  get countItems(): number {
    let n = 0;
    this.newObs.forEach((tds) => {
      for (let e of tds.items) {
        n++;
      }
    });
    return n;
  }
  
  remove(...items: readonly TodoItem[]) {
    this.tds.delete(...items);
  }
  
  
}
