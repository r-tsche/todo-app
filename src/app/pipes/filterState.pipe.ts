import { Pipe, PipeTransform } from '@angular/core';
import { TodoItem } from '../shared/model/todo-item.model';

@Pipe({
  name: 'filterState',
  pure: false,
})
export class FilterStatePipe implements PipeTransform {
  transform(items: TodoItem[], state: string): TodoItem[] {
    if (!items) return [];
    if (!state) return items;

    switch (state) {
      case 'active':
        return items.filter((item) => item.completed === false);
      case 'completed':
        return items.filter((item) => item.completed === true);
      default:
        return items;
    }
  }
}
