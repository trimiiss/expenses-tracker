import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// We use Feather for icons as it is commonly included in Expo projects
import { Feather } from '@expo/vector-icons';

export default function Card({ title, amount, iconName, type }) {
  const isIncome = type === 'income';
  
  // Dynamic styles based on type
  const bgStyle = isIncome ? styles.bgGreen : styles.bgRed;
  const textStyle = isIncome ? styles.textGreen : styles.textRed;
  const iconColor = isIncome ? '#22c55e' : '#ef4444'; // green-500 : red-500

  return (
    <View style={[styles.card, bgStyle]}>
      <View style={styles.iconContainer}>
        <Feather name={iconName} size={24} color={iconColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.amount, textStyle]}>
        ${Math.abs(amount).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 2,
  },
  bgGreen: { backgroundColor: '#f0fdf4' }, // green-50
  bgRed: { backgroundColor: '#fef2f2' },   // red-50
  iconContainer: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 50,
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    color: '#6b7280', // gray-500
    fontWeight: '600',
    marginBottom: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textGreen: { color: '#22c55e' },
  textRed: { color: '#ef4444' },
});