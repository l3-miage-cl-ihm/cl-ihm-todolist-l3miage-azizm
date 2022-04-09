export interface PageTdl{
    countNumberItem(nb : number) : this;
    onFooter(n:number):this

}

class TodoList implements PageTdl{
   
    countNumberItem(nb: number): this {
        cy.get("app-todo-item").should("have.length",nb);
        return this;
    }
    onFooter(n: number): this {
        cy.get('footer').should("have.length",0)
      return this  
    }
}
 export const page = new TodoList(); 