import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = () => {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [shoppingItems, setShoppingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the current user's unique ID
  const userId = auth().currentUser.uid;
  // Create a reference to the user's specific expenses collection
  const userExpensesRef = firestore()
    .collection('users')
    .doc(userId)
    .collection('expenses');

  useEffect(() => {
    // Set up a real-time listener to fetch data
    const subscriber = userExpensesRef.onSnapshot(querySnapshot => {
      const items = [];
      querySnapshot.forEach(documentSnapshot => {
        items.push({
          ...documentSnapshot.data(),
          id: documentSnapshot.id,
        });
      });
      setShoppingItems(items);
      setLoading(false);
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [userId]);

  const handleFormEvent = async () => {
    if (!itemName || !price) {
      Alert.alert('Missing Input', 'Please enter both item name and price.');
      return;
    }

    try {
      await userExpensesRef.add({
        title: itemName,
        cost: parseFloat(price),
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setItemName('');
      setPrice('');
    } catch (error) {
      console.error('Error adding item: ', error);
      Alert.alert('Error', 'Could not add the item.');
    }
  };

  const deleteExpense = id => {
    userExpensesRef.doc(id).delete();
  };

  const clearAll = () => {
    Alert.alert('Confirm', 'Are you sure you want to remove all expenses?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const batch = firestore().batch();
          shoppingItems.forEach(item => {
            const docRef = userExpensesRef.doc(item.id);
            batch.delete(docRef);
          });
          batch.commit();
        },
      },
    ]);
  };

  const handleSignOut = () => {
    auth().signOut();
  };

  const renderItems = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onLongPress={() => deleteExpense(item.id)}
    >
      <Text style={styles.itemText}>
        {item.title} - ₹{item.cost}
      </Text>
    </TouchableOpacity>
  );

  const total = shoppingItems.reduce((sum, exp) => sum + exp.cost, 0);

  const chartData = shoppingItems.map((item, index) => ({
    name: item.title || `Item ${index + 1}`,
    population: Number(item.cost) || 0,
    color: `hsl(${index * 50}, 70%, 50%)`,
    legendFontColor: '#333',
    legendFontSize: 12,
  }));

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading Expenses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Expense Tracker</Text>
        <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Item Name"
          placeholderTextColor="gray"
          value={itemName}
          onChangeText={setItemName}
        />
        <TextInput
          style={styles.input}
          placeholder="Item price"
          placeholderTextColor="gray"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <Pressable style={styles.formBtn} onPress={handleFormEvent}>
          <Text style={styles.formText}>Add</Text>
        </Pressable>

        <Pressable
          style={[styles.formBtn, { backgroundColor: 'red' }]}
          onPress={clearAll}
        >
          <Text style={styles.formText}>Clear All</Text>
        </Pressable>
      </View>

      <FlatList
        data={shoppingItems}
        keyExtractor={item => item.id}
        renderItem={renderItems}
        ListFooterComponent={
          <View style={{ marginTop: 15, paddingBottom: 30 }}>
            <Text style={styles.result}>
              Total Amount : ₹{total.toFixed(2)}
            </Text>

            {shoppingItems.length > 0 && (
              <PieChart
                data={chartData}
                width={Dimensions.get('window').width - 20}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            )}
          </View>
        }
      />
    </View>
  );
};

export default HomeScreen;

// Use the same styles from your original code, with a few additions
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 8,
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  signOutBtn: {
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  signOutText: {
    color: 'black',
    fontWeight: 'bold',
  },
  form: {
    gap: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    color: 'black',
    padding: 8,
  },
  formBtn: {
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 8,
  },
  formText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  result: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  item: {
    backgroundColor: 'pink',
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});
