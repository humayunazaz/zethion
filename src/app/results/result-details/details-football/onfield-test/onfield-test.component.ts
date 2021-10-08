import { AfterViewInit, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';

import {
  TCPlayer, TCGroupDefense, TCGroupMidfield, TCGroupAdvancedMidfield,
  TCGroupOffense, TCGroupAsymmetryType
} from './onfield-test-component.model';
import { count } from 'rxjs/operators';
import {
  FacebookService,
  FBVideoComponent,
  InitParams,
  LoginOptions,
  LoginResponse,
  UIParams,
  UIResponse
} from "ngx-facebook";
import { ApiMethod } from "ngx-facebook/providers/facebook";
import { GoogleAnalyticsService } from "ngx-google-analytics";
import { StorageService } from '../../../../shared/_service/storage/storage.service';


@Component({
  selector: 'app-onfield-test',
  templateUrl: './onfield-test.component.html',
  styleUrls: ['./onfield-test.component.scss'],
  styles: [
    '.container { max-width: 700px; background: #f7f7f7; margin: 50px auto; padding: 30px; border-radius: 15px; }',
    'h2 { margin-bottom: 20px; }',
    'h4 { margin-top: 40px; margin-bottom: 10px; }'
  ]
})
export class OnfieldTestComponent implements OnInit, AfterViewInit {

  @ViewChild(FBVideoComponent) video: FBVideoComponent;

  positions = [
    'AMF-C', 'CB-C', 'CF-C', 'DF-C', 'DMF-C', 'FW-C', 'GK', 'MF-C',
    'MF-L', 'MF-R', 'SB-L', 'SB-R', 'ST-C', 'SW-C', 'WF-L', 'WF-R'
  ];
  onFieldPositions = [];

  displayGrid = false;
  displayZones = false;
  displayPlayerPositions = true;
  displayPlayers = false;

  players: TCPlayer[] = [];

  @ViewChildren('twitter') twitter;

  constructor(
    private fb: FacebookService,
    private $gaService: GoogleAnalyticsService,
    public storageService: StorageService
  ) {
    const initParams: InitParams = {
      appId: '249701322788476',
      xfbml: true,
      version: 'v8.0'
    };

    fb.init(initParams);
  }


  ngOnInit() {
    this.$gaService.pageView('/teste', 'Teste de Title');

  }

  ngAfterViewInit() {
    // console.log('🚀 ~ file: onfield-test.component.ts ~ line 75 ~ OnfieldTestComponent ~ this.twitter.changes.subscribe ~ this.twitter', this.twitter);
    console.log('🚀 ~ file: onfield-test.component.ts ~ line 74 ~ OnfieldTestComponent ~ window', this.twitter, window['twttr']);
    if (window['twttr']) {
      console.log('🚀 ~ file: onfield-test.component.ts ~ line 74 ~ OnfieldTestComponent ~ window', window['twttr']);
      window['twttr'].events.bind('click', function (e) {
        // Send GA event
        console.log('works', e);
      });
    }
    console.log('🚀 ~ file: onfield-test.component.ts ~ line 80 ~ OnfieldTestComponent ~', window['FB']);
    window['FB'].Event.subscribe('edge.create', function(response) {
      console.log('I CLICKED IT');
     });
  }

  onUserInputName() {
    this.$gaService.event('enter_name', 'user_register_form', 'Name');
  }

  onUserInputEmail() {
    this.$gaService.event('enter_email', 'user_register_form', 'Email');
  }

  onSubmit() {
    this.$gaService.event('submit', 'user_register_form', 'Enviar');
  }

  drop(event) {
    const position = event.item.element.nativeElement.innerText;
    console.log('Position added:', position);
    this.addPosition(position);
  }

  getGridLabel(i: number, j: number): string {
    if (
      (i === 1 && j === 1) ||
      (i === 1 && j === 22) ||
      (i === 42 && j === 1) ||
      (i === 42 && j === 22)
    ) {
      return;
    }
    if (i === 1 || i === 42) {
      return '' + (j - 1);
    } else if (j === 1 || j === 22) {
      return '' + (i - 1);
    }
  }

  private addPosition(position: string) {
    try {
      if (this.players.length >= 11) {
        throw new Error(`Can't add player, 11 on the field already`);
      } else if (!this.validatePosition(position)) {
        throw new Error(`All positions ${position} have already been filled`);
      }

      this.players.push({
        name: position,
        position,
        positionClass: undefined
      });

      this.assignPlayerPositions();

      console.log(this.players);

    } catch (err) {
      alert(err);
    }
  }

  private validatePosition(position: string): boolean {

    const countExisting = this.countExistingPositions(position);
    switch (position) {
      case 'GK':
        return countExisting === 0;
      case 'SW-C':
        return countExisting < 2;
      case 'CB-C':
        return (countExisting + this.countExistingPositions('DF-C')) < 3;
      case 'DF-C':
        return (countExisting + this.countExistingPositions('CB-C')) < 3;
      case 'SB-R':
      case 'SB-L':
        return countExisting === 0;
      case 'DMF-C':
        return countExisting < 3;
      case 'MF-C':
        return countExisting < 3;
      case 'MF-R':
      case 'MF-L':
        return countExisting === 0;
      case 'AMF-C':
        return countExisting < 3;
      case 'WF-R':
      case 'WF-L':
        return countExisting === 0;
      case 'FW-C':
        return countExisting < 3;
      case 'ST-C':
        return (countExisting + this.countExistingPositions('CF-C')) < 3;
      case 'CF-C':
        return (countExisting + this.countExistingPositions('ST-C')) < 3;

    }
    console.log(`Unmatched position ${position}`);
    return false;
  }

  private countExistingPositions(position: string) {
    return this.players.filter(p => p.position === position).length;
  }

  private assignPlayerPositions(home = true) {

    const { defense, midfield, advancedMidfield, offense } = this.getPlayerGroups();
    const prefix = home ? 'h_' : 'a_';

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
        defense.asymmetry = TCGroupAsymmetryType.RIGHT;
      } else if (defense.sb_l) {
        defense.asymmetry = TCGroupAsymmetryType.LEFT;
      }
    }

    // Sweepers
    const swAsymmetryReversed = (dfCount === 1 || dfCount === 2);
    switch (swCount) {
      case 1: {
        if (defense.asymmetry === TCGroupAsymmetryType.RIGHT) {
          if (swAsymmetryReversed) {
            defense.sw_c[0].positionClass = prefix + 'sw-c-1';
          } else {
            defense.sw_c[0].positionClass = prefix + 'sw-c-3';
          }
        } else if (defense.asymmetry === TCGroupAsymmetryType.LEFT) {
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
        if (defense.asymmetry === TCGroupAsymmetryType.RIGHT) {
          defense.cb_df_c[0].positionClass = prefix + 'df-c-4';
        } else if (defense.asymmetry === TCGroupAsymmetryType.LEFT) {
          defense.cb_df_c[0].positionClass = prefix + 'df-c-2';
          // If no asymmetry put loner in middle
        } else {
          if (swCount === 1) {
            // Sweepers always start on the left side if no asymmetry
            defense.cb_df_c[0].positionClass = prefix + 'df-c-2';
            // Update group's asymmetry for next group
            defense.asymmetry = TCGroupAsymmetryType.RIGHT;
          } else {
            defense.cb_df_c[0].positionClass = prefix + 'df-c-3';
          }
        }
        break;
      case 2:
        // Respect group's asymmetry
        if (defense.asymmetry === TCGroupAsymmetryType.RIGHT) {
          defense.cb_df_c[0].positionClass = prefix + 'df-c-3';
          defense.cb_df_c[1].positionClass = prefix + 'df-c-5';
        } else if (defense.asymmetry === TCGroupAsymmetryType.LEFT) {
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
        midfield.asymmetry = TCGroupAsymmetryType.RIGHT;
      } else if (midfield.mf_l) {
        midfield.asymmetry = TCGroupAsymmetryType.LEFT;
      }
    }

    // Defensive Midfields
    // const dmfAsymmetryReversed = (mfCount === 1 || mfCount === 2);
    switch (dmfCount) {
      case 1: {
        if (midfield.asymmetry === TCGroupAsymmetryType.RIGHT) {
          if (mfCount === 1) {
            // dmf is alone with 2 players in front => place in the middle
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-3';
          } else if (mfCount === 2) {
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-2';
          } else {
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-4';
          }
        } else if (midfield.asymmetry === TCGroupAsymmetryType.LEFT) {
          if (mfCount === 1) {
            // dmf is alone with 2 players in front => place in the middle
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-3';
          } else if (mfCount === 2) {
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-4';
          } else {
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-2';
          }
        } else if (mfCount === 1) {
          if (defense.asymmetry === TCGroupAsymmetryType.RIGHT) {
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-4';
          } else if (defense.asymmetry === TCGroupAsymmetryType.LEFT) {
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
          if (midfield.asymmetry === TCGroupAsymmetryType.RIGHT) {
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-3';
            midfield.dmf_c[1].positionClass = prefix + 'dmf-c-5';
          } else if (midfield.asymmetry === TCGroupAsymmetryType.LEFT) {
            midfield.dmf_c[0].positionClass = prefix + 'dmf-c-3';
            midfield.dmf_c[1].positionClass = prefix + 'dmf-c-1';
            // If no asymmetry put in normal positions
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
        if (midfield.asymmetry === TCGroupAsymmetryType.RIGHT) {
          midfield.mf_c[0].positionClass = prefix + 'mf-c-5';
        } else if (midfield.asymmetry === TCGroupAsymmetryType.LEFT) {
          midfield.mf_c[0].positionClass = prefix + 'mf-c-1';
          // If no asymmetry put loner in middle
        } else {
          if (dmfCount === 1) {
            if (defense.asymmetry === TCGroupAsymmetryType.RIGHT) {
              midfield.mf_c[0].positionClass = prefix + 'mf-c-1';
            } else if (defense.asymmetry === TCGroupAsymmetryType.LEFT) {
              midfield.mf_c[0].positionClass = prefix + 'mf-c-5';
            } else {
              // dmfs start on left side by default
              midfield.mf_c[0].positionClass = prefix + 'mf-c-2';
              // Update group's asymmetry for next group
              midfield.asymmetry = TCGroupAsymmetryType.RIGHT;
            }
          } else {
            midfield.mf_c[0].positionClass = prefix + 'mf-c-3';
          }
        }
        break;
      case 2:
        // Respect group's asymmetry
        if (midfield.asymmetry === TCGroupAsymmetryType.RIGHT) {
          midfield.mf_c[0].positionClass = prefix + 'mf-c-3';
          midfield.mf_c[1].positionClass = prefix + 'mf-c-5';
        } else if (midfield.asymmetry === TCGroupAsymmetryType.LEFT) {
          midfield.mf_c[0].positionClass = prefix + 'mf-c-3';
          midfield.mf_c[1].positionClass = prefix + 'mf-c-1';
          // If no asymmetry put in normal positions
        } else {
          midfield.mf_c[0].positionClass = prefix + 'mf-c-1';
          midfield.mf_c[1].positionClass = prefix + 'mf-c-5';
        }
        break;
      case 3:
        if (midfield.asymmetry === TCGroupAsymmetryType.RIGHT) {
          midfield.mf_c[0].positionClass = prefix + 'mf-c-2';
          midfield.mf_c[1].positionClass = prefix + 'mf-c-3';
          midfield.mf_c[2].positionClass = prefix + 'mf-c-5';
        } else if (midfield.asymmetry === TCGroupAsymmetryType.LEFT) {
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
        advancedMidfield.asymmetry = TCGroupAsymmetryType.RIGHT;
      } else if (advancedMidfield.wf_l) {
        advancedMidfield.asymmetry = TCGroupAsymmetryType.LEFT;
      }
    }

    switch (amfCount) {
      case 1: {
        if (advancedMidfield.asymmetry === TCGroupAsymmetryType.RIGHT) {
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-4';
        } else if (advancedMidfield.asymmetry === TCGroupAsymmetryType.LEFT) {
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-2';
        } else {
          // Put lone amf in default center position
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-3';
        }

      }
        break;
      case 2:
        // Respect group's asymmetry
        if (advancedMidfield.asymmetry === TCGroupAsymmetryType.RIGHT) {
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-3';
          advancedMidfield.amf_c[1].positionClass = prefix + 'amf-c-5';
        } else if (advancedMidfield.asymmetry === TCGroupAsymmetryType.LEFT) {
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-3';
          advancedMidfield.amf_c[1].positionClass = prefix + 'amf-c-1';
          // If no asymmetry put in normal positions
        } else {
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-2';
          advancedMidfield.amf_c[1].positionClass = prefix + 'amf-c-4';
        }
        break;
      case 3:
        if (advancedMidfield.asymmetry === TCGroupAsymmetryType.RIGHT) {
          advancedMidfield.amf_c[0].positionClass = prefix + 'amf-c-2';
          advancedMidfield.amf_c[1].positionClass = prefix + 'amf-c-3';
          advancedMidfield.amf_c[2].positionClass = prefix + 'amf-c-5';
        } else if (advancedMidfield.asymmetry === TCGroupAsymmetryType.LEFT) {
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
          if (advancedMidfield.asymmetry === TCGroupAsymmetryType.RIGHT) {
            offense.fw_c[0].positionClass = prefix + 'fw-c-3';
          } else if (advancedMidfield.asymmetry === TCGroupAsymmetryType.LEFT) {
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
          if (advancedMidfield.asymmetry === TCGroupAsymmetryType.RIGHT) {
            offense.st_cf_c[0].positionClass = prefix + 'st-c-1';
          } else if (advancedMidfield.asymmetry === TCGroupAsymmetryType.LEFT) {
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

  private getPlayerGroups() {

    const defense = new TCGroupDefense();
    const midfield = new TCGroupMidfield();
    const advancedMidfield = new TCGroupAdvancedMidfield();
    const offense = new TCGroupOffense();

    for (const player of this.players) {
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

  playerClicked(player: TCPlayer) {
    // alert(`Player ${player.position} clicked`);
    this.players.splice(this.players.findIndex(p => p.position === player.position), 1);
    this.assignPlayerPositions();
  }


  onUserLogin() {
    this.$gaService.pageView('/teste', 'Teste de Title', undefined, {
      user_id: 'my-user-id'
    });
  }



  // facebook




  /**
   * Login with minimal permissions. This allows you to see their public profile only.
   */
  login() {
    this.fb.login()
      .then((res: LoginResponse) => {
        console.log('Logged in', res);
      })
      .catch(this.handleError);
  }

  openLink() {
    window.open("https://twitter.com/SoumyanilDas9");
  }

  /**
   * Login with additional permissions/options
   */
  loginWithOptions() {

    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      scope: 'public_profile,user_friends,email,pages_show_list'
    };

    this.fb.login(loginOptions)
      .then((res: LoginResponse) => {
        console.log('Logged in', res);
      })
      .catch(this.handleError);

  }

  getLoginStatus() {
    this.fb.getLoginStatus()
      .then(console.log.bind(console))
      .catch(console.error.bind(console));
  }


  /**
   * Get the user's profile
   */
  getProfile() {
    this.fb.api('/me')
      .then((res: any) => {
        console.log('Got the users profile', res);
      })
      .catch(this.handleError);
  }


  /**
   * Get the users friends
   */
  getFriends() {
    this.fb.api('/me/friends')
      .then((res: any) => {
        console.log('Got the users friends', res);
      })
      .catch(this.handleError);
  }


  /**
   * Show the share dialog
   */
  share() {

    const options: UIParams = {
      method: 'share',
      href: 'https://github.com/zyramedia/ng2-facebook-sdk'
    };

    this.fb.ui(options)
      .then((res: UIResponse) => {
        console.log('Got the users profile', res);
      })
      .catch(this.handleError);

  }


  playVideo() {
    this.video.play();
  }

  onVideoEvent(ev) {
    console.log('Video event fired: ' + ev);
  }

  pauseVideo() {
    this.video.pause();
  }



  /**
   * This is a convenience method for the sake of this example project.
   * Do not use this in production, it's better to handle errors separately.
   * @param error
   */
  private handleError(error) {
    console.error('Error processing action', error);
  }

  public test() {
    // first id is the page id, second is the post id
    this.fb.api('/118088166562977_130699995301794', 'get', function (response) {
      console.log("test content post fb");
      console.log(response);
    });
  }

}

