import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, BorderRadius } from '@/constants/theme';

export interface SocialButtonProps {
  title?: string;
  type?: string;
  onPress: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  title,
  type,
  onPress,
  icon,
  style,
}) => {
  const displayTitle = title || (type === 'google' ? 'Continuer avec Google' : type === 'apple' ? 'Continuer avec Apple' : 'Continuer');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.button, style]}
    >
      {icon}
      <Text style={styles.text}>{displayTitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    height: 50,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.neutral.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 15,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.primary100,
  },
});

export default SocialButton;
