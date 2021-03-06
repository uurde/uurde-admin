import { Component, OnInit } from '@angular/core';
import * as _ from 'underscore';

import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  logs: any;
  log;
  logsLoading;
  logLoading;
  pagedLogs = [];
  pageSize = 10;
  p: number = 1;
  userFilter: any = { actionPath: '' };

  constructor(private _logService: LogService) { }

  ngOnInit() {
    this.getLogs();
  }

  getLogs() {
    this.logsLoading = true
    this._logService.getAllLogs().subscribe(data => {
      this.logs = data;
      this.pagedLogs = _.take(this.logs, this, this.pageSize);
    },
      null,
      () => { this.logsLoading = false; });
  }

  save() {
    if (this.log.id)
      this._logService.updateLog(this.log);
    else
      this._logService.insertLog(this.log);
  }

  deleteLog(log) {
    if (confirm("Are you sure you want to delete " + log.actionPath + "?")) {
      var index = this.logs.indexOf(log)
      this.logs.splice(index, 1);
      this._logService.deleteLog(log.logId)
        .subscribe(null,
          err => {
            alert("Could not delete the log.");
            this.logs.splice(index, 0, log);
          });
    }
  }

  select(log) {
    this.log = log;
    this.logLoading = true;
    this._logService.getLog(log.logId)
      .subscribe(
        data =>
          this.log.comments = data,
        null,
        () => this.logLoading = false
      );
  }
}
