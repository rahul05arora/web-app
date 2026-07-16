import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  SafeAreaView, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  status: 'approved' | 'declined';
  date: string;
}

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch transaction feed from our local Node.js API
  const fetchTransactions = async () => {
    try {
      // NOTE FOR WINDOWS EMULATOR: Use 'http://10.0.2.2:5000/api/transactions'
      // If testing on a physical phone via Expo Go, use your local machine's IP address (e.g. 'http://192.168.x.x:5000/api/transactions')
      const response = await fetch('http://localhost:5000/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Network Fetch Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        {/* ActivityIndicator is the native loading spinner */}
        <ActivityIndicator size="large" color="#2b6cb0" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Moneris Payments</Text>
      
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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

// StyleSheet.create compiles your styles into native native-side optimization passes.
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f7fafc', 
    paddingHorizontal: 16 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginVertical: 16, 
    color: '#1a365d' 
  },
  card: { 
    flexDirection: 'row', // Align content horizontally (default is column on native)
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 16, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    marginVertical: 8, 
    // Elevation handles shadow styling on Android devices
    elevation: 2 
  },
  merchant: { 
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#2d3748'
  },
  date: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4
  },
  approved: { 
    color: '#38a169', 
    fontWeight: 'bold',
    fontSize: 16
  },
  declined: { 
    color: '#e53e3e', 
    fontWeight: 'bold',
    fontSize: 16
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f7fafc'
  }
});