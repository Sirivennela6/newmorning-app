import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  light?: boolean;
  vertical?: boolean; // 👈 NEW: stack logo + text
}

export function Logo({
  size = 'medium',
  showText = true,
  light = false,
  vertical = false,
}: LogoProps) {
  const logoSize =
    size === 'small' ? 36 : size === 'large' ? 90 : 50;

  const fontSize =
    size === 'small' ? 16 : size === 'large' ? 30 : 20;

  return (
    <View
      style={[
        styles.container,
        vertical && styles.verticalContainer,
      ]}
    >
      <Image
        source={require('../assets/images/new-morning-logo.png')}
        style={[
          styles.logo,
          {
            width: logoSize,
            height: logoSize,
            borderRadius: logoSize / 2,
          },
        ]}
        resizeMode="cover"
      />

      {showText && (
        <Text
          style={[
            styles.text,
            {
              fontSize,
              color: light ? '#FFF' : '#FF6B35',
            },
            vertical && styles.verticalText,
          ]}
        >
          New Morning
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // 👈 ensures centering
  },

  verticalContainer: {
    flexDirection: 'column',
  },

  logo: {
    backgroundColor: '#FFF',
  },

  text: {
    fontWeight: '900',
    marginLeft: 10,
    letterSpacing: 0.5,
  },

  verticalText: {
    marginLeft: 0,
    marginTop: 10,
  },
});