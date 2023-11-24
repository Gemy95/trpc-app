import { registerEnumType } from '@nestjs/graphql';

export enum VEHICLE_TYPES {
  car = 'car',
  cycle = 'cycle',
}

registerEnumType(VEHICLE_TYPES, {
  name: 'VEHICLE_TYPES',
});

export enum VEHICLE_COLORS {
  red = 'red',
  black = 'black',
  white = 'white',
  blue = 'blue',
  yellow = 'yellow',
  brown = 'brown',
  green = 'green',
  gray = 'gray',
}

registerEnumType(VEHICLE_COLORS, {
  name: 'VEHICLE_COLORS',
});
