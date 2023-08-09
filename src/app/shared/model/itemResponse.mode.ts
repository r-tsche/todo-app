import { TodoItem } from './todo-item.model';

export interface ItemResponse {
  title: string;
  items: TodoItem[];
}
