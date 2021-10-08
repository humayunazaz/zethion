export class Player {
  name: string;
  position: string;
  positionClass: string;
  imageClass: string;
  nameClass: string;
}

export enum GroupType {
  'DEFENSE',
  'MIDFIELD',
  'ADVANCED_MIDFIELD',
  'OFFENSE'
}

export enum GroupAsymmetryType {
  'NONE',
  'LEFT',
  'RIGHT'
}

export class Group {
  name: GroupType;
  players: Player[] = [];
  asymmetry = GroupAsymmetryType.NONE;
}

export class GroupDefense extends Group {
  name = GroupType.DEFENSE;
  gc: Player;
  sw_c: Player[] = [];
  cb_df_c: Player[] = [];
  sb: Player[] = [];
  sb_r: Player;
  sb_l: Player;
}
export class GroupMidfield extends Group {
  name = GroupType.MIDFIELD;
  dmf_c: Player[] = [];
  mf_c: Player[] = [];
  mf_sides: Player[] = [];
  mf_r: Player;
  mf_l: Player;
}
export class GroupAdvancedMidfield extends Group {
  name = GroupType.ADVANCED_MIDFIELD;
  amf_c: Player[] = [];
  wf: Player[] = [];
  wf_r: Player;
  wf_l: Player;
}
export class GroupOffense extends Group {
  name = GroupType.OFFENSE;
  fw_c: Player[] = [];
  st_cf_c: Player[] = [];
}
