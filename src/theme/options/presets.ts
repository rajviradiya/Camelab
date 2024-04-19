import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

type PresetType = 'default' | 'purple';

export function createPresets(preset: PresetType) {
  const primaryColor = getPrimary(preset);

  const theme = {
    palette: {
      primary: primaryColor,
    },
    customShadows: {
      primary: `0 8px 16px 0 ${alpha(`${primaryColor?.main}`, 0.24)}`,
    },
  };

  return {
    ...theme,
  };
}

// ----------------------------------------------------------------------

const purple = {
  lighter: '#EBD6FD',
  light: '#B985F4',
  main: '#7635dc',
  dark: '#431A9E',
  darker: '#200A69',
  contrastText: '#FFFFFF',
};

export const presetOptions = [
  { name: 'default', value: purple.main },
  { name: 'purple', value: purple.main },
];

export function getPrimary(preset: PresetType) {
  return {
    default: purple,
    purple,
  }[preset];
}
