import { Pipe, PipeTransform } from '@angular/core';
import { TodoItem } from '../shared/model/todo-item.model';

@Pipe({
  name: 'filterItem',
  pure: false,
})
export class FilterItemPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter((item) => {
      for (const key in item) {
        if (
          item.hasOwnProperty(key) &&
          item[key] !== null &&
          item[key] !== undefined &&
          typeof item[key] === 'string'
        ) {
          if (item[key].toLowerCase().includes(searchText)) {
            return true;
          }
        }
      }
      return false;
    });
  }
}
