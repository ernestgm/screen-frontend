import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const COLOR_NAME = [
  'White',
  'Black',
  'Red',
  'Blue',
  'Green',
];
const COLOR_VALUE = ['#FFFFFF', '#000000', '#860000', '#010183' , '#017301'];

// ----------------------------------------------------------------------

const marqueeColors = [...Array(5)].map((_, index) => {
  return {
    id: COLOR_VALUE[index],
    name: COLOR_NAME[index],
  };
});

export default marqueeColors;
