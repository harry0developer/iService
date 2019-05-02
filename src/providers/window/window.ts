import { Injectable } from '@angular/core';

@Injectable()
export class WindowProvider {

  constructor() {
    console.log('Hello WindowProvider Provider');
  }

  get windowRef() {
    return window
  }

}
