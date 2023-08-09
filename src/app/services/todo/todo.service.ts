import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoItem } from '../../shared/model/todo-item.model';
import { TodoList } from '../../shared/model/todo-list.model';
import { environment } from 'src/environments/environment';
import { ItemResponse } from 'src/app/shared/model/itemResponse.mode';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private url = environment.base_url;

  constructor(private http: HttpClient) {}

  getAllLists(): Observable<TodoList[]> {
    return this.http.get<TodoList[]>(`${this.url}/todoList`);
  }

  addTodoList(list: TodoList): Observable<string> {
    return this.http.post<string>(`${this.url}/todoList`, list);
  }

  deleteTodoList(listId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/todoList/${listId}`);
  }

  getTodoItems(itemId: string): Observable<ItemResponse> {
    return this.http.get<ItemResponse>(`${this.url}/todoList/${itemId}`);
  }

  addTodoItem(listId: string, item: TodoItem): Observable<TodoItem> {
    return this.http.post<TodoItem>(`${this.url}/todoList/${listId}`, item);
  }

  updateTodoItem(listId: string, item: TodoItem): Observable<TodoItem> {
    return this.http.put<TodoItem>(`${this.url}/todoList/${listId}`, item);
  }

  deleteTodoItem(listId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/todoList/${listId}/${id}`);
  }
}
