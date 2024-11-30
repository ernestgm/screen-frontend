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

// ----------------------------------------------------------------------

const positions = [...Array(5)].map((_, index) => {
  return {
    id: POSITION_NAME[index],
    name: POSITION_VALUE[index],
    icon: POSITION_ICON[index],
  };
});

export default positions;
