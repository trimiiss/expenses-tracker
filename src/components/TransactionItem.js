import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function TransactionItem({ item, onDelete }) {
  const isIncome = item.type === 'income';
  const displayDate = new Date().toLocaleDateString();

  // Determine which icon to show
  // If it's income, use 'trending-up'. If it's an expense, use the saved icon or a default.
  const iconName = isIncome ? 'trending-up' : (item.icon || 'dollar-sign');

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={[styles.iconBox, isIncome ? styles.bgGreen : styles.bgRed]}>
          <Feather 
            name={iconName} 
            size={20} 
            color={isIncome ? '#16a34a' : '#dc2626'} 
          />
        </View>
        <View>
          <Text style={styles.description}>{item.text}</Text>
          {/* Show Category Name if it exists */}
          <Text style={styles.date}>
            {item.category ? `${item.category} • ` : ''}{displayDate}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.amount, isIncome ? styles.textGreen : styles.textRed]}>
          {isIncome ? '+' : '-'}${Math.abs(item.amount).toLocaleString()}
        </Text>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
          <Feather name="trash-2" size={18} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6' },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { padding: 10, borderRadius: 50 },
  bgGreen: { backgroundColor: '#dcfce7' },
  bgRed: { backgroundColor: '#fee2e2' },
  description: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  date: { fontSize: 12, color: '#9ca3af' },
  rightSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  amount: { fontSize: 16, fontWeight: '700' },
  textGreen: { color: '#16a34a' },
  textRed: { color: '#dc2626' },
  deleteBtn: { padding: 4 }
});