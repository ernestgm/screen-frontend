// ----------------------------------------------------------------------

const POSITION_NAME = [
  'Top Left',
  'Top Center',
  'Top Right',
  'Center Left',
  'Center Center',
  'Center Right',
  'Bottom Left',
  'Bottom Center',
  'Bottom Right',
];
const POSITION_VALUE = [
  'tl',
  'tc',
  'tr',
  'cl' ,
  'cc',
  'cr',
  'bl',
  'bc',
  'br',
];

const POSITION_ICON = [
  'tabler:align-box-left-top',
  'tabler:align-box-center-top',
  'tabler:align-box-right-top',
  'tabler:align-box-left-middle' ,
  'tabler:align-box-center-middle',
  'icon-park-outline:alignment-right-center',
  'tabler:align-box-left-bottom',
  'tabler:align-box-center-bottom',
  'tabler:align-box-right-bottom',
];

// ----------------------------------------------------------------------

const positions = [...Array(9)].map((_, index) => ({
    id: POSITION_VALUE[index],
    name: POSITION_NAME[index],
    icon: POSITION_ICON[index],
  }));

export default positions;
