import { TodoItem } from './todo-item.model';

export interface TodoList {
  id: string;
  title: string;
  items: TodoItem[];
}
