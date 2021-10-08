
export class TCPlayer {
  name: string;
  position: string;
  positionClass: string;
}

export enum TCGroupType {
  'DEFENSE',
  'MIDFIELD',
  'ADVANCED_MIDFIELD',
  'OFFENSE'
}

export enum TCGroupAsymmetryType {
  'NONE',
  'LEFT',
  'RIGHT'
}

export class TCGroup {
  name: TCGroupType;
  players: TCPlayer[] = [];
  asymmetry = TCGroupAsymmetryType.NONE;
}

export class TCGroupDefense extends TCGroup {
  name = TCGroupType.DEFENSE;
  gc: TCPlayer;
  sw_c: TCPlayer[] = [];
  cb_df_c: TCPlayer[] = [];
  sb: TCPlayer[] = [];
  sb_r: TCPlayer;
  sb_l: TCPlayer;
}
export class TCGroupMidfield extends TCGroup {
  name = TCGroupType.MIDFIELD;
  dmf_c: TCPlayer[] = [];
  mf_c: TCPlayer[] = [];
  mf_sides: TCPlayer[] = [];
  mf_r: TCPlayer;
  mf_l: TCPlayer;
}
export class TCGroupAdvancedMidfield extends TCGroup {
  name = TCGroupType.ADVANCED_MIDFIELD;
  amf_c: TCPlayer[] = [];
  wf: TCPlayer[] = [];
  wf_r: TCPlayer;
  wf_l: TCPlayer;
}
export class TCGroupOffense extends TCGroup {
  name = TCGroupType.OFFENSE;
  fw_c: TCPlayer[] = [];
  st_cf_c: TCPlayer[] = [];
}
