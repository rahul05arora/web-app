import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { API_BASE_URL } from './config';

type DashboardProps = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  status: 'approved' | 'declined';
  date: string;
}

export default function DashboardScreen({ route }: DashboardProps) {
  const { token } = route.params; // Destructure your token out of the route navigation layer
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` } // Send JWT down the wire safely
      });
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color="#2b6cb0" /></View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchTransactions(); }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.merchant}>{item.merchant}</Text>
              <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <Text style={item.status === 'approved' ? styles.approved : styles.declined}>
              ${item.amount.toFixed(2)}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc', paddingHorizontal: 16 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 8, marginVertical: 8, elevation: 2 },
  merchant: { fontSize: 16, fontWeight: 'bold', color: '#2d3748' },
  date: { fontSize: 12, color: '#718096', marginTop: 4 },
  approved: { color: '#38a169', fontWeight: 'bold', fontSize: 16 },
  declined: { color: '#e53e3e', fontWeight: 'bold', fontSize: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7fafc' }
});