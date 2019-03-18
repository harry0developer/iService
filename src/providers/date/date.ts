import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class DateProvider {

  constructor() {
  }


  getDate(): string {
    return moment().format('YYYY-MM-DD');
  }

  getDateFromNow(date: string): string {
    return moment(date).fromNow();
  }
}
