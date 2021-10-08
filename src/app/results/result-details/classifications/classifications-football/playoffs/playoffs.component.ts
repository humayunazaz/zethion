import { Component, OnInit, Input } from '@angular/core';
import { FootballStageResults, FootballGroupStageResults } from '../classifications-football.model';
import { KnockoutGroupResults, KnockoutMatchup } from './playoffs.component.model';
import { AppConstants } from 'src/app/app-constants';


@Component({
  selector: 'app-playoffs',
  templateUrl: './playoffs.component.html',
  styleUrls: ['./playoffs.component.scss']
})
export class PlayoffsComponent implements OnInit {

  @Input() private knockoutStageData: FootballStageResults;
  results: KnockoutGroupResults[] = [];
  readonly ASSETS_URL_LOGO_TEAMS = `${AppConstants.ASSETS_URL_LOGO_TEAMS}/FOOTBALL`;

  constructor() { }

  ngOnInit() {
    this.processKnockoutData(this.knockoutStageData);
    this.normalizeKnockoutResults(this.results);
    this.postProcessResults(this.results);
  }

  processKnockoutData(data: FootballStageResults) {
    if (!data) {
      return;
    }

    for (const groupData of data) {
      // Sort in ascending order of position
      groupData.teamStandings.sort((s1, s2) => s1.position - s2.position);

      const groupResults = new KnockoutGroupResults();
      groupData.group.group = groupData.group.group.split('_').join(' ');
      groupResults.group = groupData.group;
      let matchup: KnockoutMatchup;

      for (const teamData of groupData.teamStandings) {
        if (!matchup || teamData.position !== matchup.position) {
          if (matchup) {
            groupResults.results.push(matchup);
          }
          matchup = new KnockoutMatchup();
          matchup.position = teamData.position;
          if (groupResults.maxPosition < teamData.position) {
            groupResults.maxPosition = teamData.position;
          }
        }
        matchup.addResult(teamData);
      }
      if (matchup) {
        groupResults.results.push(matchup);
      }
      this.results.push(groupResults);
    }

    // Sort in ascending order of group max position
    this.results.sort((r1, r2) => r1.maxPosition - r2.maxPosition);
    console.log(this.results);

  }

  normalizeKnockoutResults(results: KnockoutGroupResults[]) {
    if (!results) {
      return;
    }

    const groupCount = results.length;
    // skip last group
    for (let groupIndex = groupCount - 2; groupIndex >= 0; --groupIndex) {
      let nextGroupMatchupIndex = 0;

      const group = results[groupIndex];
      const nextGroup = results[groupIndex + 1];
      const nextGroupMatchupCount = nextGroup.results ? nextGroup.results.length : 0;

      for (let matchupIndex = 0; matchupIndex < group.results.length; ++matchupIndex) {
        const matchup = group.results[matchupIndex];
        while (!this.isNextRoundMatchup(matchup, nextGroup.results[nextGroupMatchupIndex])) {
          group.results.splice(matchupIndex, 0, new KnockoutMatchup());
          ++matchupIndex;
          group.results.splice(matchupIndex, 0, new KnockoutMatchup());
          ++matchupIndex;
          ++nextGroupMatchupIndex;
          if (nextGroupMatchupIndex >= nextGroupMatchupCount - 1) {
            break;
          }
        }

        if (nextGroupMatchupIndex <= nextGroupMatchupCount - 1) {
          if (!this.isNextRoundMatchup(group.results[matchupIndex + 1], nextGroup.results[nextGroupMatchupIndex])) {
            group.results.splice(matchupIndex + 1, 0, new KnockoutMatchup());
          } else {
            group.results[matchupIndex + 1].isBottom = true;
          }
          ++matchupIndex;
          ++nextGroupMatchupIndex;
        }
        if (nextGroupMatchupIndex > nextGroupMatchupCount - 1) {
          break;
        }

      }
    }

  }

  private postProcessResults(results: KnockoutGroupResults[]) {

    const groupCount = results.length;
    // skip first group
    for (let groupIndex = 1; groupIndex < groupCount; ++groupIndex) {

      const group = results[groupIndex];
      const previousGroup = results[groupIndex - 1];

      for (const matchup of group.results) {
        matchup.results.sort((r1, r2) => {
          if (r1.round === 'RETURN') {
            return 1;
          } else {
            return -1;
          }
        });
        const teamIds: number[] = [];

        if (matchup.team1) {
          teamIds.push(matchup.team1.id);
        }
        if (matchup.team2) {
          teamIds.push(matchup.team2.id);
        }
        matchup.hasLeft = false;
        let matchCount = 0;
        for (const ma of previousGroup.results) {
          if (ma.team1 && teamIds.includes(ma.team1.id)) {
            matchup.hasLeft = true;
            // ma.team1.qualified = true;
          } else if (ma.team2 && teamIds.includes(ma.team2.id)) {
            matchup.hasLeft = true;
            // ma.team2.qualified = true;
          }
          if (matchup.hasLeft) {
            ++matchCount;
            if (matchCount === 2) {
              break;
            }
          }
        }

        // matchup.hasLeft = !!previousGroup.results.find(r => {
        //   return (r.team1 && teamIds.includes(r.team1.id)) ||
        //     (r.team2 && teamIds.includes(r.team2.id));
        // });
      }
    }

  }

  private isNextRoundMatchup(matchup: KnockoutMatchup, nextRoundMatchup: KnockoutMatchup) {
    if (!matchup || !nextRoundMatchup) {
      return false;
    }

    return (matchup.team1 && this.matchupContainsTeam(nextRoundMatchup, matchup.team1.id)) ||
      (matchup.team2 && this.matchupContainsTeam(nextRoundMatchup, matchup.team2.id));
  }

  private matchupContainsTeam(matchup: KnockoutMatchup, teamId: number) {
    return (matchup.team1 && matchup.team1.id === teamId) || (matchup.team2 && matchup.team2.id === teamId);
  }

  getTopMargin(groupIndex: number, matchupIndex: number): number {
    const topMargin = (Math.pow(2, groupIndex + 1) - 2) * (1 + (matchupIndex === 0 ? 0 : 1));
    return topMargin;
  }

  getConnectorTop(groupIndex: number, matchupIndex: number, isBottom: boolean): number {
    let top = 0;
    let matchupIdx = 0;
    while (matchupIdx <= matchupIndex) {
      top += (this.getTopMargin(groupIndex, matchupIdx) + 4);
      ++matchupIdx;
    }
    top += 2; // For header margin
    top -= 1;

    if (isBottom) {
      top -= this.getConnectorHeight(groupIndex, matchupIndex);
    }

    // console.log(`[${groupIndex}, ${matchupIndex}, ${top}]`);
    return top;
  }
  getConnectorHeight(groupIndex: number, matchupIndex: number): number {
    const height = Math.pow(2, groupIndex + 1);
    return height;
  }
  getConnectorHeightStr(groupIndex: number, matchupIndex: number): string {
    const height = Math.pow(2, groupIndex + 1);
    return `calc(${this.getConnectorHeight(groupIndex, matchupIndex)}rem + 1px)`;
  }

  isLastGroup(groupIndex: number) {
    return groupIndex >= (this.results ? this.results.length - 1 : 0);
  }

  teamLogoMissing(event) {
    // console.log(event.target.src);
    event.target.src = AppConstants.MISSING_TEAM_LOGO_URL;
  }

}
