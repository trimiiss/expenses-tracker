import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// Imports from your other files
import Card from '../components/Card';
import TransactionItem from '../components/TransactionItem';
import AddModal from '../components/AddModal';

export default function HomeScreen() {
  // Use a mock array for initial state
  const [transactions, setTransactions] = useState([
    { id: '1', text: 'Salary Deposit', amount: 3000, type: 'income' },
    { id: '2', text: 'Rent Payment', amount: 1200, type: 'expense' },
    { id: '3', text: 'Coffee', amount: 5.50, type: 'expense' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);

  // 1. Calculations
  const { total, income, expense } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    transactions.forEach(t => {
      const val = parseFloat(t.amount);
      if (t.type === 'income') inc += val;
      else exp += val;
    });
    return {
      total: inc - exp,
      income: inc,
      expense: exp
    };
  }, [transactions]);

  // 2. Actions
  const handleAdd = (data) => {
    const newTransaction = {
      id: Date.now().toString(), // Use timestamp for unique ID
      text: data.text,
      amount: parseFloat(data.amount),
      type: data.type,
    };

    // Add new transaction to the beginning of the list (newest first)
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDelete = (id) => {
    // Filter out the transaction with the matching ID
    setTransactions(prev => prev.filter(t => t.id !== id));
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tracker</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>${total.toLocaleString()}</Text>
        </View>
      </View>

      {/* Cards Section (Overlapping) */}
      <View style={styles.cardsContainer}>
        <Card title="Income" amount={income} iconName="trending-up" type="income" />
        <Card title="Expense" amount={expense} iconName="trending-down" type="expense" />
      </View>

      {/* List Section */}
      <View style={styles.listContainer}>
        <Text style={styles.listHeader}>Recent Transactions</Text>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TransactionItem item={item} onDelete={handleDelete} />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No transactions yet</Text>
          }
        />
      </View>

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={32} color="white" />
      </TouchableOpacity>

      <AddModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        onAdd={handleAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#4f46e5',
    paddingTop: 60,
    paddingBottom: 50, // Extra padding for overlap
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#a5b4fc',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceValue: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginTop: -30, // Negative margin to overlap
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4f46e5',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
