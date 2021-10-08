import { Component, OnInit, Input } from '@angular/core';

import { PlayerDetail } from 'src/app/model/player-detail.model';
import { Player, GroupAsymmetryType, GroupDefense,
  GroupMidfield, GroupAdvancedMidfield, GroupOffense } from './football-onfield.component.models';

@Component({
  selector: 'app-football-onfield',
  templateUrl: './football-onfield.component.html',
  styleUrls: ['./football-onfield.component.scss']
})
export class FootballOnfieldComponent implements OnInit {

  @Input() public playerDetail: PlayerDetail[] = [];

  players: Player[] = [];

  constructor(
  ) { }

  ngOnInit() {
    console.log(this.playerDetail);

    const { homePlayers, awayPlayers } = this.getTeamPlayers();
    console.log('homePlayers', homePlayers);
    console.log('awayPlayers', awayPlayers);

    this.assignPlayerPositions(homePlayers, true);
    this.assignPlayerPositions(awayPlayers, false);

    this.players = this.players.filter(p => p.positionClass !== undefined);
  }

  private getTeamPlayers() {
    const homePlayers: Player[] = [];
    const awayPlayers: Player[] = [];

    for (const playerDetail of this.playerDetail) {
      if (!this.isFirstTeam(playerDetail)) {
        continue;
      }

      const isAwayPlayer = this.isAway(playerDetail);

      const player: Player = {
        name: this.getCompactName(playerDetail.firstName, playerDetail.lastName),
        position: playerDetail.role,
        positionClass: undefined,
        imageClass: (isAwayPlayer ? 'player-image-away' : 'player-image-home'),
        nameClass: (isAwayPlayer ? 'away-player-name' : 'home-player-name')
      };
      const destTeam = isAwayPlayer ? awayPlayers : homePlayers;
      destTeam.push(player);
      this.players.push(player);
    }

    return { homePlayers, awayPlayers };
  }

  private isAway(playerDetail: PlayerDetail) {
    return playerDetail.teamLocation === 'AWAY';
  }

  private isFirstTeam(playerDetail: PlayerDetail) {
    return playerDetail.startingTeam === 'FIRST_TEAM';
  }

  private getCompactName(firstName: string, lastName: string): string {
    const lnSplit = lastName.split(' ');
    const length = lnSplit.length;

    let ln = '';
    if (lnSplit.length > 1) {
      for(let i = 0; i < length - 1; ++i) {
        ln += (lnSplit[i].charAt(0) + '.');
      }
    }
    ln += lnSplit[length - 1];

    return firstName.charAt(0) + '.' + ln;
  }



  private assignPlayerPositions(team: Player[], home = true) {

    const { defense, midfield, advancedMidfield, offense } = this.getPlayerGroups(team);
    const prefix = home ? 'h_' : 'a_';

    console.log(prefix);
    console.log(defense, midfield, advancedMidfield, offense);

    //
    // Goalkeeper
    //

    if (defense.gc) {
      defense.gc.positionClass = prefix + 'gk';
    }

    //
    // Defense
    //

    const swCount = defense.sw_c.length;
    const dfCount = defense.cb_df_c.length;
    const sbCount = defense.sb.length;

    // Compute asymmetry
    if (sbCount === 1) {
      if (defense.sb_r) {
        defense.asymmetry = GroupAsymmetryType.RIGHT;
      } else if (defense.sb_l) {
        defense.asymmetry = GroupAsymmetryType.LEFT;
      }
    }

    // Sweepers
    const swAsymmetryReversed = (dfCount === 1 || dfCount === 2);
    switch (swCount) {
      case 1: {
        if (defense.asymmetry === GroupAsymmetryType.RIGHT) {
          if (swAsymmetryReversed) {
            defense.sw_c[0].positionClass = prefix + 'sw-c-1';
          } else {
            defense.sw_c[0].positionClass = prefix + 'sw-c-3';
          }
        } else if (defense.asymmetry === GroupAsymmetryType.LEFT) {
          if (swAsymmetryReversed) {
            defense.sw_c[0].positionClass = prefix + 'sw-c-3';
          } else {
            defense.sw_c[0].positionClass = prefix + 'sw-c-1';
          }
        } else if (dfCount === 1) {
          // Start sweepers on left by default
          defense.sw_c[0].positionClass = prefix + 'sw-c-3';
        } else {
          // Put lone sweeper in default center position
          defense.sw_c[0].positionClass = prefix + 'sw-c-2';
        }
      }
        break;
      case 2:
        defense.sw_c[0].positionClass = prefix + 'sw-c-1';
        defense.sw_c[1].positionClass = prefix + 'sw-c-3';
        break;
    }

    // Defenders
    switch (dfCount) {
      case 1:
        // Respect group's asymmetry
        if (defense.asymmetry === GroupAsymmetryType.RIGHT) {
          defense.cb_df_c[0].positionClass = prefix + 'df-c-4';
        } else if (defense.asymmetry === GroupAsymmetryType.LEFT) {
          defense.cb_df_c[0].positionClass = prefix + 'df-c-2';
          // If no asymmetry put loner in middle
        } else {
          if (swCount === 1) {
            // Sweepers always start on the left side if no asymmetry
            defense.cb_df_c[0].positionClass = prefix + 'df-c-2';
            // Update group's asymmetry for next group
            defense.asymmetry = GroupAsymmetryType.RIGHT;
          } else {
            defense.cb_df_c[0].positionClass = prefix + 'df-c-3';
          }
        }
        break;
      case 2:
        // Respect group's asymmetry
        if (defense.asymmetry === GroupAsymmetryType.RIGHT) {
          defense.cb_df_c[0].positionClass = prefix + 'df-c-3';
          defense.cb_df_c[1].positionClass = prefix + 'df-c-5';
        } else if (defense.asymmetry === GroupAsymmetryType.LEFT) {
          defense.cb_df_c[0].positionClass = prefix + 'df-c-3';
          defense.cb_df_c[1].positionClass = prefix + 'df-c-1';
          // If no asymmetry put in normal positions
        } else {
          defense.cb_df_c[0].positionClass = prefix + 'df-c-1';
          defense.cb_df_c[1].positionClass = prefix + 'df-c-5';
        }
        break;
      case 3:
        defense.cb_df_c[0].positionClass = prefix + 'df-c-1';
        defense.cb_df_c[1].positionClass = prefix + 'df-c-3';
        defense.cb_df_c[2].positionClass = prefix + 'df-c-5';
        break;
    }
    if (defense.sb_r) {
      defense.sb_r.positionClass = prefix + 'sb-r';
    }
    if (defense.sb_l) {
      defense.sb_l.positionClass = prefix + 'sb-l';
    }

    //
    // Midfield
    //

    const dmfCount = midfield.dmf_c.length;
    const mfCount = midfield.mf_c.length;
    const mfSideCount = midfield.mf_sides.length;

    // Compute asymmetry
    if (mfSideCount === 1) {
      if (midfield.mf_r) {
        midfield.asymmetry = GroupAsymmetryType.RIGHT;
      } else if (midfield.mf_l) {
        midfield.asymmetry = GroupAsymmetryType.LEFT;
      }
    }

    // Defensive Midfields
    // const dmfAsymmetryReversed = (mfCount === 1 || mfCount === 2);
    switch (dmfCount) {
      case 1: {
        if (midfield.asymmetry === GroupAsymmetryType.RIGHT) {
          if (mfCount === 1) {
            // dmf is alone with 2 players in front => place in the middle
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-3';
          } else if (mfCount === 2) {
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-2';
          } else {
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-4';
          }
        } else if (midfield.asymmetry === GroupAsymmetryType.LEFT) {
          if (mfCount === 1) {
            // dmf is alone with 2 players in front => place in the middle
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-3';
          } else if (mfCount === 2) {
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-4';
          } else {
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-2';
          }
        } else if (mfCount === 1) {
          if (defense.asymmetry === GroupAsymmetryType.RIGHT) {
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-4';
          } else if (defense.asymmetry === GroupAsymmetryType.LEFT) {
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-2';
          } else {
            // Start dmfs on left by default
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-4';
          }
        } else {
          // Put lone dmf in default center position
          midfield.dmf_c[0].positionClass = prefix + 'dmf-c-3';
        }

      }
        break;
      case 2:
        // Respect group's asymmetry
        if (mfCount === 0) {
          if (midfield.asymmetry === GroupAsymmetryType.RIGHT) {
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-3';
            midfield.dmf_c[1].positionClass = prefix + 'dmf-c-5';
          } else if (midfield.asymmetry === GroupAsymmetryType.LEFT) {
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-3';
            midfield.dmf_c[1].positionClass = prefix + 'dmf-c-1';
            // If no asymmetry put in normal positions
          } else {
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-2';
            midfield.dmf_c[1].positionClass = prefix + 'dmf-c-4';
          }
        } else {
          midfield.dmf_c[0].positionClass = prefix + 'dmf-c-2';
          midfield.dmf_c[1].positionClass = prefix + 'dmf-c-4';
        }

        break;
      case 3:
        midfield.dmf_c[0].positionClass = prefix + 'dmf-c-1';
        midfield.dmf_c[1].positionClass = prefix + 'dmf-c-3';
        midfield.dmf_c[2].positionClass = prefix + 'dmf-c-5';
        break;
    }

    // Midfields
    switch (mfCount) {
      case 1:
        // Respect group's asymmetry
        if (midfield.asymmetry === GroupAsymmetryType.RIGHT) {
          midfield.mf_c[0].positionClass = prefix + 'mf-c-5';
        } else if (midfield.asymmetry === GroupAsymmetryType.LEFT) {
          midfield.mf_c[0].positionClass = prefix + 'mf-c-1';
          // If no asymmetry put loner in middle
        } else {
          if (dmfCount === 1) {
            if (defense.asymmetry === GroupAsymmetryType.RIGHT) {
              midfield.mf_c[0].positionClass = prefix + 'mf-c-1';
            } else if (defense.asymmetry === GroupAsymmetryType.LEFT) {
              midfield.mf_c[0].positionClass = prefix + 'mf-c-5';
            } else {
              // dmfs start on left side by default
              midfield.mf_c[0].positionClass = prefix + 'mf-c-2';
              // Update group's asymmetry for next group
              midfield.asymmetry = GroupAsymmetryType.RIGHT;
            }
          } else {
            midfield.mf_c[0].positionClass = prefix + 'mf-c-3';
          }
        }
        break;
      case 2:
        // Respect group's asymmetry
        if (midfield.asymmetry === GroupAsymmetryType.RIGHT) {
          midfield.mf_c[0].positionClass = prefix + 'mf-c-3';
          midfield.mf_c[1].positionClass = prefix + 'mf-c-5';
        } else if (midfield.asymmetry === GroupAsymmetryType.LEFT) {
          midfield.mf_c[0].positionClass = prefix + 'mf-c-3';
          midfield.mf_c[1].positionClass = prefix + 'mf-c-1';
          // If no asymmetry put in normal positions
        } else {
          midfield.mf_c[0].positionClass = prefix + 'mf-c-1';
          midfield.mf_c[1].positionClass = prefix + 'mf-c-5';
        }
        break;
      case 3:
        if (midfield.asymmetry === GroupAsymmetryType.RIGHT) {
          midfield.mf_c[0].positionClass = prefix + 'mf-c-2';
          midfield.mf_c[1].positionClass = prefix + 'mf-c-3';
          midfield.mf_c[2].positionClass = prefix + 'mf-c-5';
        } else if (midfield.asymmetry === GroupAsymmetryType.LEFT) {
          midfield.mf_c[0].positionClass = prefix + 'mf-c-1';
          midfield.mf_c[1].positionClass = prefix + 'mf-c-3';
          midfield.mf_c[2].positionClass = prefix + 'mf-c-4';
          // If both mf sides are present => use inner positions
        } else if (mfSideCount > 0) {
          midfield.mf_c[0].positionClass = prefix + 'mf-c-2';
          midfield.mf_c[1].positionClass = prefix + 'mf-c-3';
          midfield.mf_c[2].positionClass = prefix + 'mf-c-4';
          // If no asymmetry put in normal positions
        } else {
          midfield.mf_c[0].positionClass = prefix + 'mf-c-1';
          midfield.mf_c[1].positionClass = prefix + 'mf-c-3';
          midfield.mf_c[2].positionClass = prefix + 'mf-c-5';
        }
        break;
    }

    // Midfield sides
    if (midfield.mf_r) {
      midfield.mf_r.positionClass = prefix + 'mf-r';
    }
    if (midfield.mf_l) {
      midfield.mf_l.positionClass = prefix + 'mf-l';
    }

    //
    // Advanced Midfield
    //

    const amfCount = advancedMidfield.amf_c.length;
    const wfCount = advancedMidfield.wf.length;

    // Compute asymmetry
    if (wfCount === 1) {
      if (advancedMidfield.wf_r) {
        advancedMidfield.asymmetry = GroupAsymmetryType.RIGHT;
      } else if (advancedMidfield.wf_l) {
        advancedMidfield.asymmetry = GroupAsymmetryType.LEFT;
      }
    }

    switch (amfCount) {
      case 1: {
        if (advancedMidfield.asymmetry === GroupAsymmetryType.RIGHT) {
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-4';
        } else if (advancedMidfield.asymmetry === GroupAsymmetryType.LEFT) {
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-2';
        } else {
          // Put lone amf in default center position
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-3';
        }

      }
        break;
      case 2:
        // Respect group's asymmetry
        if (advancedMidfield.asymmetry === GroupAsymmetryType.RIGHT) {
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-3';
          advancedMidfield.amf_c[1].positionClass = prefix + 'amf-c-5';
        } else if (advancedMidfield.asymmetry === GroupAsymmetryType.LEFT) {
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-3';
          advancedMidfield.amf_c[1].positionClass = prefix + 'amf-c-1';
          // If no asymmetry put in normal positions
        } else {
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-2';
          advancedMidfield.amf_c[1].positionClass = prefix + 'amf-c-4';
        }
        break;
      case 3:
        if (advancedMidfield.asymmetry === GroupAsymmetryType.RIGHT) {
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-2';
          advancedMidfield.amf_c[1].positionClass = prefix + 'amf-c-3';
          advancedMidfield.amf_c[2].positionClass = prefix + 'amf-c-5';
        } else if (advancedMidfield.asymmetry === GroupAsymmetryType.LEFT) {
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-1';
          advancedMidfield.amf_c[1].positionClass = prefix + 'amf-c-3';
          advancedMidfield.amf_c[2].positionClass = prefix + 'amf-c-4';
          // If both wfs are present => use inner positions
        } else if (wfCount > 0) {
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-2';
          advancedMidfield.amf_c[1].positionClass = prefix + 'amf-c-3';
          advancedMidfield.amf_c[2].positionClass = prefix + 'amf-c-4';
          // If no asymmetry put in normal positions
        } else {
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-1';
          advancedMidfield.amf_c[1].positionClass = prefix + 'amf-c-3';
          advancedMidfield.amf_c[2].positionClass = prefix + 'amf-c-5';
        }
        break;
    }
    // Wing Forwards
    if (advancedMidfield.wf_r) {
      advancedMidfield.wf_r.positionClass = prefix + 'wf-r';
    }
    if (advancedMidfield.wf_l) {
      advancedMidfield.wf_l.positionClass = prefix + 'wf-l';
    }

    //
    // Offense
    //

    const fwCount = offense.fw_c.length;
    const st_cfCount = offense.st_cf_c.length;

    switch (fwCount) {
      case 1:
        if (st_cfCount === 1) {
          if (advancedMidfield.asymmetry === GroupAsymmetryType.RIGHT) {
            offense.fw_c[0].positionClass = prefix + 'fw-c-3';
          } else if (advancedMidfield.asymmetry === GroupAsymmetryType.LEFT) {
            offense.fw_c[0].positionClass = prefix + 'fw-c-1';
          } else {
            // Start on right side by default
            offense.fw_c[0].positionClass = prefix + 'fw-c-3';
          }
        } else {
          offense.fw_c[0].positionClass = prefix + 'fw-c-2';
        }
        break;
      case 2:
        offense.fw_c[0].positionClass = prefix + 'fw-c-1';
        offense.fw_c[1].positionClass = prefix + 'fw-c-3';
        break;
      case 3:
        offense.fw_c[0].positionClass = prefix + 'fw-c-1';
        offense.fw_c[1].positionClass = prefix + 'fw-c-2';
        offense.fw_c[2].positionClass = prefix + 'fw-c-3';
        break;
    }

    // Center Forwards / Strikers
    switch (st_cfCount) {
      case 1:
        if (fwCount === 1) {
          if (advancedMidfield.asymmetry === GroupAsymmetryType.RIGHT) {
            offense.st_cf_c[0].positionClass = prefix + 'st-c-1';
          } else if (advancedMidfield.asymmetry === GroupAsymmetryType.LEFT) {
            offense.st_cf_c[0].positionClass = prefix + 'st-c-3';
          } else {
            // Forwards start on the left side if no asymmetry of previous group
            offense.st_cf_c[0].positionClass = prefix + 'st-c-1';
          }
        } else {
          offense.st_cf_c[0].positionClass = prefix + 'st-c-2';
        }
        break;
      case 2:
        offense.st_cf_c[0].positionClass = prefix + 'st-c-1';
        offense.st_cf_c[1].positionClass = prefix + 'st-c-3';
        break;
      case 3:
        offense.st_cf_c[0].positionClass = prefix + 'st-c-1';
        offense.st_cf_c[1].positionClass = prefix + 'st-c-2';
        offense.st_cf_c[2].positionClass = prefix + 'st-c-3';
        break;
    }
  }

  private getPlayerGroups(team: Player[]) {

    const defense = new GroupDefense();
    const midfield = new GroupMidfield();
    const advancedMidfield = new GroupAdvancedMidfield();
    const offense = new GroupOffense();

    for (const player of team) {
      switch (player.position) {
        // Defense
        case 'GK':
          defense.gc = player;
          defense.players.push(player);
          break;
        case 'SW-C':
          defense.sw_c.push(player);
          defense.players.push(player);
          break;
        case 'CB-C':
        case 'DF-C':
          defense.cb_df_c.push(player);
          defense.players.push(player);
          break;
        case 'SB-R':
          defense.sb_r = player;
          defense.sb.push(player);
          defense.players.push(player);
          break;
        case 'SB-L':
          defense.sb_l = player;
          defense.sb.push(player);
          defense.players.push(player);
          break;
        // Midfield
        case 'DMF-C':
          midfield.dmf_c.push(player);
          midfield.players.push(player);
          break;
        case 'MF-C':
          midfield.mf_c.push(player);
          midfield.players.push(player);
          break;
        case 'MF-R':
          midfield.mf_r = player;
          midfield.mf_sides.push(player);
          midfield.players.push(player);
          break;
        case 'MF-L':
          midfield.mf_l = player;
          midfield.mf_sides.push(player);
          midfield.players.push(player);
          break;
        // Advanced Midfield
        case 'AMF-C':
          advancedMidfield.amf_c.push(player);
          midfield.players.push(player);
          break;
        case 'WF-R':
          advancedMidfield.wf_r = player;
          advancedMidfield.wf.push(player);
          advancedMidfield.players.push(player);
          break;
        case 'WF-L':
          advancedMidfield.wf_l = player;
          advancedMidfield.wf.push(player);
          advancedMidfield.players.push(player);
          break;
        // Offense
        case 'FW-C':
          offense.fw_c.push(player);
          offense.players.push(player);
          break;
        case 'ST-C':
        case 'CF-C':
          offense.st_cf_c.push(player);
          offense.players.push(player);
          break;
        default:
          throw new Error(`Unknown position ${player.position} passed to assignPlayerPositions`);
      }
    }

    return {
      defense,
      midfield,
      advancedMidfield,
      offense
    };
  }


}
