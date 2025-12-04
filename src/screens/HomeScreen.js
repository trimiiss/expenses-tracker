import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, 
  Alert, ScrollView // <--- Added Alert and ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import Card from '../components/Card';
import TransactionItem from '../components/TransactionItem';
import AddModal from '../components/AddModal';
import ExpenseChart from '../components/ExpenseChart';

// Define categories for the filter (Matching the ones in AddModal)
const FILTER_CATEGORIES = [
  { id: 'All', name: 'All', icon: 'list' },
  { id: 'Food', name: 'Food', icon: 'coffee' },
  { id: 'Transport', name: 'Transport', icon: 'map-pin' },
  { id: 'Shopping', name: 'Shopping', icon: 'shopping-bag' },
  { id: 'Bills', name: 'Bills', icon: 'file-text' },
  { id: 'Fun', name: 'Fun', icon: 'film' },
  { id: 'Other', name: 'Other', icon: 'more-horizontal' },
];

export default function HomeScreen() {
  const [transactions, setTransactions] = useState([
    { id: '1', text: 'Salary Deposit', amount: 3000, type: 'income', category: 'Other', icon: 'dollar-sign' },
    { id: '2', text: 'Rent Payment', amount: 1200, type: 'expense', category: 'Bills', icon: 'file-text' },
    { id: '3', text: 'Coffee', amount: 5.50, type: 'expense', category: 'Food', icon: 'coffee' },
  ]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  // --- NEW: Filter State ---
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 1. Calculations (Always based on ALL transactions for the balance cards)
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

  // 2. Chart Data (Based on ALL transactions)
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

  // --- NEW: Filter Logic ---
  const filteredTransactions = useMemo(() => {
    if (selectedCategory === 'All') {
      return transactions;
    }
    // Filter by the category name saved in the transaction
    return transactions.filter(t => t.category === selectedCategory);
  }, [transactions, selectedCategory]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleAdd = (data) => {
    const newTransaction = {
      id: Date.now().toString(),
      text: data.text,
      amount: parseFloat(data.amount),
      type: data.type,
      category: data.category || 'Other',
      icon: data.icon || 'dollar-sign'
    };
    setTransactions(prev => [newTransaction, ...prev]);
    showToast("Transaction Added!");
  };

  // --- NEW: Confirm Delete Logic ---
  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to remove this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => handleDelete(id), // Only delete if they press this
          style: "destructive" 
        }
      ]
    );
  };

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast("Transaction Deleted Successfully");
  };

  // Render Header (Now includes the Filter Bar)
  const renderListHeader = () => (
    <View style={styles.listHeaderContainer}>
      <ExpenseChart chartData={chartData} />
      
      <Text style={styles.sectionTitle}>Recent Transactions</Text>

      {/* --- NEW: Filter Bar UI --- */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {FILTER_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.filterChip, 
              selectedCategory === cat.id && styles.filterChipActive
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text style={[
              styles.filterText,
              selectedCategory === cat.id && styles.filterTextActive
            ]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
          data={filteredTransactions} // <--- Pass FILTERED data here
          keyExtractor={item => item.id}
          ListHeaderComponent={renderListHeader} 
          renderItem={({ item }) => (
            // Pass confirmDelete instead of handleDelete
            <TransactionItem item={item} onDelete={confirmDelete} /> 
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {selectedCategory === 'All' ? 'No transactions yet' : `No ${selectedCategory} transactions`}
            </Text>
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

      {toastMessage && (
        <View style={styles.toastContainer}>
          <Feather name="check-circle" size={20} color="white" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
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
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 12, marginTop: 10 }, // Adjusted margin
  emptyText: { textAlign: 'center', color: '#9ca3af', marginTop: 40 },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#4f46e5', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
  
  // Toast Styles
  toastContainer: { position: 'absolute', bottom: 100, left: 24, right: 24, backgroundColor: '#334155', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, elevation: 5 },
  toastText: { color: 'white', fontWeight: '600', fontSize: 14 },

  // --- NEW: Filter Styles ---
  filterContainer: {
    paddingBottom: 16,
    gap: 10, // Adds space between chips
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#4f46e5', // Indigo background when active
    borderColor: '#4f46e5',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#ffffff', // White text when active
  }
});