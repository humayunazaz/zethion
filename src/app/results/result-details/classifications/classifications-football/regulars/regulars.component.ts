import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FootballStageResults } from '../classifications-football.model';
import { SubscriptionLike } from 'rxjs';
import { BreakpointObserverService } from 'src/app/shared/_service/breakpoint-observer/breakpoint-observer.service';

@Component({
  selector: 'app-regulars',
  templateUrl: './regulars.component.html',
  styleUrls: ['./regulars.component.scss']
})
export class RegularsComponent implements OnInit, OnDestroy {

  @Input() classificationStageData: FootballStageResults;
  expandedColumns = false;
  showExpander = true;
  private bpSubscription: SubscriptionLike;

  constructor(private bpObserverService: BreakpointObserverService) { }

  ngOnInit() {
    this.bpSubscription = this.bpObserverService.breakPoints$.subscribe(bp => {
      if (bp === 'sm' || bp === 'xs') {
        this.expandedColumns = false;
        this.showExpander = false;
      } else {
        // this.expandedColumns = true;
        this.showExpander = true;
      }
    });

    this.processClassificationData(this.classificationStageData);
  }

  ngOnDestroy() {
    if (this.bpSubscription) {
      this.bpSubscription.unsubscribe();
    }
  }

  toggleExpandedColumns() {
    this.expandedColumns = !this.expandedColumns;
  }

  private processClassificationData(data: FootballStageResults) {
    if (!data) {
      return;
    }

    for (const groupData of data) {
      groupData.group.group = groupData.group.group.split('_').join(' ');
      for (const teamData of groupData.teamStandings) {
        teamData.totalWins = (+teamData.homeWins || 0) + (teamData.awayWins || 0) + (teamData.neutralWins || 0);
        teamData.totalDraws = (+teamData.homeDraws || 0) + (teamData.awayDraws || 0) + (teamData.neutralDraws || 0);
        teamData.totalLosts = (+teamData.homeLosts || 0) + (teamData.awayLosts || 0) + (teamData.neutralLosts || 0);
        teamData.totalHomeGames = (+teamData.homeWins || 0) + (+teamData.homeDraws || 0) + (+teamData.homeLosts || 0);
        teamData.totalAwayGames = (+teamData.awayWins || 0) + (+teamData.awayDraws || 0) + (+teamData.awayLosts || 0);
        teamData.totalGames = teamData.totalWins + teamData.totalDraws + teamData.totalLosts;
        teamData.totalPoints = (+teamData.homePoints || 0) + (teamData.awayPoints || 0) + (teamData.neutralPoints || 0);
        teamData.totalScoredGoals = (+teamData.homeScoredGoals || 0) + (teamData.awayScoredGoals || 0)
          + (teamData.neutralScoredGoals || 0);
        // tslint:disable-next-line: max-line-length
        teamData.totalConcededGoals = (+teamData.homeConcededGoals || 0) + (teamData.awayConcededGoals || 0) + (teamData.neutralConcededGoals || 0);
      }
      groupData.teamStandings.sort((s1, s2) => s2.totalPoints - s1.totalPoints);
    }


    data.sort((g1, g2) => (g1.group.group <= g2.group.group) ? -1 : 1);
  }

}
