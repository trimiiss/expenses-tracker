import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function ExpenseChart({ chartData }) {
  if (!chartData || chartData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Add expenses to view the spending chart!</Text>
      </View>
    );
  }

  // The PieChart component requires color definitions and a name/amount
  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View style={styles.chartWrapper}>
      <Text style={styles.chartTitle}>Spending Breakdown</Text>
      <PieChart
        data={chartData}
        width={screenWidth - 48} // Screen width minus padding
        height={220}
        chartConfig={chartConfig}
        accessor={"amount"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[10, 0]}
        absolute
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrapper: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  emptyContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    marginBottom: 20,
  },
  emptyText: {
    color: '#9ca3af',
    textAlign: 'center',
  }
});