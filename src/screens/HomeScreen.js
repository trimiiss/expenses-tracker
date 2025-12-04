import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import Card from '../components/Card';
import TransactionItem from '../components/TransactionItem';
import AddModal from '../components/AddModal';
import ExpenseChart from '../components/ExpenseChart';

export default function HomeScreen() {
  const [transactions, setTransactions] = useState([
    { id: '1', text: 'Salary Deposit', amount: 3000, type: 'income' },
    { id: '2', text: 'Rent Payment', amount: 1200, type: 'expense', category: 'Bills', icon: 'file-text' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);

  // --- NEW: Toast State ---
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    // Hide the toast after 2 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };
  // ------------------------

  const { total, income, expense } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    transactions.forEach(t => {
      const val = parseFloat(t.amount);
      if (t.type === 'income') inc += val;
      else exp += val;
    });
    return { total: inc - exp, income: inc, expense: exp };
  }, [transactions]);

  const chartData = useMemo(() => {
    const colorPalette = ['#e11d48', '#ea580c', '#d97706', '#65a30d', '#0891b2', '#4f46e5'];
    return transactions
      .filter(t => t.type === 'expense')
      .map((t, index) => ({
        name: t.text,
        amount: parseFloat(t.amount),
        color: colorPalette[index % colorPalette.length], 
        legendFontColor: "#7F7F7F",
        legendFontSize: 13
      }));
  }, [transactions]);

  const handleAdd = (data) => {
    const newTransaction = {
      id: Date.now().toString(),
      text: data.text,
      amount: parseFloat(data.amount),
      type: data.type,
      category: data.category, // Save category
      icon: data.icon          // Save icon
    };
    setTransactions(prev => [newTransaction, ...prev]);
    showToast("Transaction Added!"); // Optional: Success message for adding
  };

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    // Trigger the notification
    showToast("Transaction Deleted Successfully");
  };

  const renderListHeader = () => (
    <View style={styles.listHeaderContainer}>
      <ExpenseChart chartData={chartData} />
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tracker</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>${total.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.cardsContainer}>
        <Card title="Income" amount={income} iconName="trending-up" type="income" />
        <Card title="Expense" amount={expense} iconName="trending-down" type="expense" />
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
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

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Feather name="plus" size={32} color="white" />
      </TouchableOpacity>

      <AddModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        onAdd={handleAdd}
      />

      {/* --- NEW: Custom Toast Component --- */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Feather name="check-circle" size={20} color="white" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
      {/* ----------------------------------- */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: '#4f46e5', paddingTop: 60, paddingBottom: 50, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 20 },
  balanceContainer: { alignItems: 'center' },
  balanceLabel: { color: '#a5b4fc', fontSize: 14, marginBottom: 4 },
  balanceValue: { color: 'white', fontSize: 36, fontWeight: 'bold' },
  cardsContainer: { flexDirection: 'row', paddingHorizontal: 18, marginTop: -30 },
  listContainer: { flex: 1, paddingHorizontal: 24, marginTop: 10 },
  listHeaderContainer: { marginBottom: 10, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 16, marginTop: 10 },
  emptyText: { textAlign: 'center', color: '#9ca3af', marginTop: 40 },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#4f46e5', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
  
  // --- NEW: Toast Styles ---
  toastContainer: {
    position: 'absolute',
    bottom: 100, // Show above the FAB
    left: 24,
    right: 24,
    backgroundColor: '#334155',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  }
});