import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class DateProvider {

  constructor() {
  }


  getDate(): number {
    return moment.now();
  }

  getDateFromNow(date: string): string {
    return moment(date).fromNow();
  }
}
