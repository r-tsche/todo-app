import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  get(key: string): any {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : item;
  }

  set(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  delete(key: string): void {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }
}
