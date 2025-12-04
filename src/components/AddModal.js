import React, { useState } from 'react';
import { 
  Modal, View, Text, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// Predefined categories
const CATEGORIES = [
  { id: 'food', name: 'Food', icon: 'coffee' },
  { id: 'transport', name: 'Transport', icon: 'map-pin' },
  { id: 'shopping', name: 'Shopping', icon: 'shopping-bag' },
  { id: 'bills', name: 'Bills', icon: 'file-text' },
  { id: 'entertainment', name: 'Fun', icon: 'film' },
  { id: 'other', name: 'Other', icon: 'more-horizontal' },
];

export default function AddModal({ visible, onClose, onAdd }) {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('other'); // Default category

  const handleSubmit = () => {
    if (!text || !amount) return;
    
    // Find the selected category object to get the icon
    const selectedCat = CATEGORIES.find(c => c.id === category);

    onAdd({ 
      text, 
      amount, 
      type, 
      category: selectedCat.name, // Save the name
      icon: selectedCat.icon      // Save the icon name
    });

    // Reset form
    setText('');
    setAmount('');
    setType('expense');
    setCategory('other');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>New Transaction</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={24} color="#4b5563" />
            </TouchableOpacity>
          </View>

          {/* Wrap form in ScrollView for smaller screens */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Groceries"
              value={text}
              onChangeText={setText}
            />

            <Text style={styles.label}>Amount ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.label}>Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity 
                style={[styles.typeBtn, type === 'expense' && styles.typeBtnActiveRed]}
                onPress={() => setType('expense')}
              >
                <Text style={[styles.typeText, type === 'expense' && styles.typeTextActiveRed]}>Expense</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.typeBtn, type === 'income' && styles.typeBtnActiveGreen]}
                onPress={() => setType('income')}
              >
                <Text style={[styles.typeText, type === 'income' && styles.typeTextActiveGreen]}>Income</Text>
              </TouchableOpacity>
            </View>

            {/* Only show categories if it is an Expense */}
            {type === 'expense' && (
              <>
                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryContainer}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip, 
                        category === cat.id && styles.categoryChipActive
                      ]}
                      onPress={() => setCategory(cat.id)}
                    >
                      <Feather 
                        name={cat.icon} 
                        size={14} 
                        color={category === cat.id ? 'white' : '#6b7280'} 
                      />
                      <Text style={[
                        styles.categoryText, 
                        category === cat.id && styles.categoryTextActive
                      ]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Add Transaction</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, maxHeight: '85%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  closeBtn: { padding: 4, backgroundColor: '#f3f4f6', borderRadius: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#4b5563', marginBottom: 8 },
  input: { backgroundColor: '#f9fafb', padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  typeContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  typeBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' },
  typeBtnActiveRed: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
  typeBtnActiveGreen: { borderColor: '#22c55e', backgroundColor: '#f0fdf4' },
  typeText: { fontWeight: '600', color: '#9ca3af' },
  typeTextActiveRed: { color: '#ef4444' },
  typeTextActiveGreen: { color: '#22c55e' },
  
  // New Category Styles
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: 'transparent' },
  categoryChipActive: { backgroundColor: '#4f46e5' },
  categoryText: { fontSize: 12, fontWeight: '600', color: '#6b7280', marginLeft: 6 },
  categoryTextActive: { color: 'white' },

  submitBtn: { backgroundColor: '#4f46e5', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});