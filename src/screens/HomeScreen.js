import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// Imports
import Card from '../components/Card';
import TransactionItem from '../components/TransactionItem';
import AddModal from '../components/AddModal';
import ExpenseChart from '../components/ExpenseChart'; // <--- Import the chart

export default function HomeScreen() {
  const [transactions, setTransactions] = useState([
    { id: '1', text: 'Salary Deposit', amount: 3000, type: 'income' },
    { id: '2', text: 'Rent Payment', amount: 1200, type: 'expense' },
    { id: '3', text: 'Coffee', amount: 5.50, type: 'expense' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);

  // 1. Calculations for Totals
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

  // 2. Calculations for Chart Data
  const chartData = useMemo(() => {
    // A palette of colors to cycle through for the pie chart slices
    const colorPalette = ['#e11d48', '#ea580c', '#d97706', '#65a30d', '#0891b2', '#4f46e5'];

    return transactions
      .filter(t => t.type === 'expense')
      .map((t, index) => ({
        name: t.text,
        amount: parseFloat(t.amount),
        // Cycle through the color palette based on index
        color: colorPalette[index % colorPalette.length], 
        legendFontColor: "#7F7F7F",
        legendFontSize: 13
      }));
  }, [transactions]);

  // 3. Actions
  const handleAdd = (data) => {
    const newTransaction = {
      id: Date.now().toString(),
      text: data.text,
      amount: parseFloat(data.amount),
      type: data.type,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // 4. Render Header Component (To make the Chart scrollable with the list)
  const renderListHeader = () => (
    <View style={styles.listHeaderContainer}>
      {/* Pass the prepared data to the chart */}
      <ExpenseChart chartData={chartData} />
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Fixed Top Header Section */}
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

      {/* List Section containing the Chart */}
      <View style={styles.listContainer}>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          // The chart is now part of the scrollable area
          ListHeaderComponent={renderListHeader} 
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
    paddingBottom: 50,
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
    marginTop: -30,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 10, // Reduced top margin slightly
  },
  listHeaderContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  sectionTitle: { // Renamed from listHeader to avoid confusion
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    marginTop: 10,
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