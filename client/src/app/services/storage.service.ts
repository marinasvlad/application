import { Injectable, OnInit } from '@angular/core';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class StorageService implements OnInit {

  constructor() { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  getUserDto(): IUser | null {
    const userDtoString = localStorage.getItem('UserDto');
    return userDtoString ? JSON.parse(userDtoString) : null;
  }

  clearUserDto(): void {
    localStorage.removeItem('UserDto');
  }  
}
