import { Component, OnInit, ViewChild } from '@angular/core';
import { LocationsService } from '../../services/locations.service';
import { SchedulesService } from '../../services/schedules.service';

import { Location } from '../../models/location.model';
import { Schedule } from '../../models/schedule.model';

import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';
import * as _ from "lodash";

import {GtConfig, GenericTableComponent} from '@angular-generic-table/core';


@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {
  private locations: Location[];
  private weekStartDate: NgbDateStruct = {day: 1, month: 0, year: 2018};
  private selectedFacility: Location = new Location();
  private schedule: Array<Schedule> = [];
  private configObject: GtConfig<any>;;
  private showMessage: boolean = false;

  constructor(private locationService: LocationsService,
    private scheduleService: SchedulesService) { 
    this.getLocations();
    this.setupTable();
    
  }

  ngOnInit() {
  }

  export(table) {
    table.exportCSV();
  }

  setupTable() {
    let that = this;
    this.configObject = {
      settings: [{
        objectKey: 'teammateName',
        sort: 'asc',
        sortOrder: 1,
        columnOrder: 0
      }, {
        objectKey: 'teammateType',
        sort: 'asc',
        sortOrder: 0,
        columnOrder: 1
      }, {
        objectKey: 'monday',
        columnOrder: 2,
        sort: 'asc',
        sortOrder: 0
      }, {
        objectKey: 'tuesday',
        columnOrder: 3,
        sort: 'asc',
        sortOrder: 0
      }, {
        objectKey: 'wednesday',
        columnOrder: 4,
        sort: 'asc',
        sortOrder: 0
      }, {
        objectKey: 'thursday',
        columnOrder: 5,
        sort: 'asc',
        sortOrder: 0
      }, {
        objectKey: 'friday',
        columnOrder: 6,
        sort: 'asc',
        sortOrder: 0
      }, {
        objectKey: 'saturday',
        columnOrder: 7,
        sort: 'asc',
        sortOrder: 0
      }, {
        objectKey: 'sunday',
        columnOrder: 8,
        sort: 'asc',
        sortOrder: 0
      }],
      fields: [{
        name: 'Teammate',
        objectKey: 'teammateName'
      }, {
        name: 'Employee Type',
        objectKey: 'teammateType'
      }, {
        name: 'Monday ' + that.getDateDisplay('monday'),
        objectKey: 'monday',
        classNames: that.checkEmployeeCount('monday')
      },
      {
        name: 'Tuesday ' + that.getDateDisplay('tuesday'),
        objectKey: 'tuesday',
        classNames: that.checkEmployeeCount('tuesday')
      },
      {
        name: 'Wednesday ' + that.getDateDisplay('wednesday'),
        objectKey: 'wednesday',
        classNames: that.checkEmployeeCount('wednesday')
      },
      {
        name: 'Thursday ' + that.getDateDisplay('thursday'),
        objectKey: 'thursday',
        classNames: that.checkEmployeeCount('thursday')
      },
      {
        name: 'Friday ' + that.getDateDisplay('friday'),
        objectKey: 'friday',
        classNames: that.checkEmployeeCount('friday')
      },
      {
        name: 'Saturday ' + that.getDateDisplay('saturday'),
        objectKey: 'saturday',
        classNames: that.checkEmployeeCount('saturday')
      },
      {
        name: 'Sunday ' + that.getDateDisplay('sunday'),
        objectKey: 'sunday',
        classNames: 'ruhRoh'
      }],
      data: that.schedule
    };
  }

  checkEmployeeCount(day) {
    let that = this;
    let count = _.size(_.filter(that.schedule, item => {
      return item.teammateType.toLowerCase() === 'anesthesia' &&
        item[day.toLowerCase()].toLowerCase() !== 'off';
    }));

    if(count <= 1) {
      this.showMessage = true;
    }

    return count > 1 ? '' : 'ruhRoh';
  }

  viewSchedule() {
    let that = this;
    that.showMessage = false;
    that.schedule = [];
    if(this.weekStartDate.day && this.weekStartDate.month && this.weekStartDate.year) {
      let startDate = this.getWeekStartDay();
      let dateString = startDate.month()-1 + '-' + startDate.date() + '-' + startDate.year();
      this.scheduleService.getSchedule(this.selectedFacility.facilityId, startDate)
        .subscribe(data => {
          that.schedule = data['data'] ? data['data'] as Schedule[] : [];
          that.setupTable();
        });
    }
  }

  getDateDisplay(weekday) {
    let startDate = this.getWeekStartDay();

    let dateLookup = {
      'monday': function () {
        return startDate.month()+1 + '/' + startDate.date();
      },
      'tuesday': function () {
        startDate = startDate.add(1, 'days');
        return startDate.month()+1 + '/' + startDate.date();
      },
      'wednesday': function () {
        startDate = startDate.add(2, 'days');
        return startDate.month()+1 + '/' + startDate.date();
      },
      'thursday': function () {
        startDate = startDate.add(3, 'days');
        return startDate.month()+1 + '/' + startDate.date();
      },
      'friday': function () {
        startDate = startDate.add(4, 'days');
        return startDate.month()+1 + '/' + startDate.date();
      },
      'saturday': function () {
        startDate = startDate.add(5, 'days');
        return startDate.month()+1 + '/' + startDate.date();
      },
      'sunday': function () {
        startDate = startDate.add(6, 'days');
        return startDate.month()+1 + '/' + startDate.date();
      }
    };

    return dateLookup[weekday.toLowerCase()]();
  }

  getWeekStartDay() {

    let weekStart = moment([this.weekStartDate.year, this.weekStartDate.month-1, this.weekStartDate.day]);

    while(weekStart.weekday() > 1) {
      weekStart = weekStart.subtract(1, 'days');
    }
    
    return weekStart;
  }

  getRunWording() {
    return this.schedule.length ? 'Refresh' : 'View Schedule';
  }

  getLocations() {
    let that = this;

    this.locationService.getLocations()
      .subscribe(data => {
        that.locations = data['data'] ? data['data'] as Location[] : [];
      });
  }
}
