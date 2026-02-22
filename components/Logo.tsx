import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  light?: boolean;
}

export function Logo({ size = 'medium', showText = true, light = false }: LogoProps) {
  const logoSize = size === 'small' ? 36 : size === 'large' ? 80 : 48;
  const fontSize = size === 'small' ? 16 : size === 'large' ? 28 : 20;

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/new-morning-logo.jpeg')}
        style={[styles.logo, { width: logoSize, height: logoSize, borderRadius: logoSize / 2 }]}
        resizeMode="cover"
      />
      {showText && (
        <Text style={[styles.text, { fontSize, color: light ? '#FFF' : '#FF6B35' }]}>
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
  },
  logo: {
    backgroundColor: '#FFF',
  },
  text: {
    fontWeight: '800',
    marginLeft: 10,
  },
});
