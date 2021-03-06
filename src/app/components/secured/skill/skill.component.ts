import { Component, OnInit } from '@angular/core';
import * as _ from 'underscore';

import { SkillService } from 'src/app/services/skill.service';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {
  skills: any;
  skill;
  pagedSkills = [];
  pageSize = 10;
  skillsLoading;
  p: number = 1;

  constructor(private _skillService: SkillService) { }

  ngOnInit() {
    this.getSkills();
  }

  getSkills() {
    this.skillsLoading = true
    this._skillService.getAllSkills().subscribe(data => {
      this.skills = data;
      this.pagedSkills = _.take(this.skills, this, this.pageSize);
    },
      null,
      () => { this.skillsLoading = false; });
  }

  deleteSkill(skill) {
    if (confirm("Are you sure you want to disactive skill?")) {
      var index = this.skills.indexOf(skill)
      this._skillService.deleteSkill(skill.skillId)
        .subscribe(null,
          err => {
            alert("Could not delete the skill.");
          });
    }
  }

  select(skill) {
    this.skill = skill;
    this._skillService.getSkill(skill.skillId).subscribe(data => this.skill = data, null);
  }

  onPageChanged(page) {
    var startIndex = (page - 1) * this.pageSize;
    this.pagedSkills = _.take(_.rest(this.skills, startIndex), this.pageSize);
  }

}
