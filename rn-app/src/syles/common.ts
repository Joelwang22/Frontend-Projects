import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';

export const common = StyleSheet.create({
  rowCenter: {
    flexDirection: 'row',
    alignItems:   'center',
  },

  pill: {
    flexDirection: 'row',
    alignItems:    'center',
    alignSelf:     'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical:   spacing.xs,
    borderRadius:      spacing.md,
    borderWidth:       1,
    borderColor:       colors.gray300,
  },
});