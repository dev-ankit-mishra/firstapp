import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [shoppingItems, setShoppingItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await AsyncStorage.getItem('shoppingItems');
        if (data) {
          setShoppingItems(JSON.parse(data));
        }
      } catch (err) {
        console.log(err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('shoppingItems', JSON.stringify(shoppingItems));
  }, [shoppingItems]);

  const handleFormEvent = () => {
    if (!itemName || !price) {
      Alert.alert('Missing Input', 'Please enter both item name and price.');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      title: itemName,
      cost: parseFloat(price),
    };

    setShoppingItems([...shoppingItems, newItem]);
    setItemName('');
    setPrice('');
  };

  const deleteExpense = id => {
    setShoppingItems(shoppingItems.filter(item => item.id !== id));
  };

  const clearAll = () => {
    Alert.alert('Confirm', 'Are you sure you want to remove all expenses?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setShoppingItems([]),
      },
    ]);
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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Expense Calculator</Text>
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

        {/* New Clear All button */}
        <Pressable
          style={[styles.formBtn, { backgroundColor: 'red' }]}
          onPress={clearAll}
        >
          <Text style={styles.formText}>Clear All</Text>
        </Pressable>

        <FlatList
          data={shoppingItems}
          keyExtractor={item => item.id}
          renderItem={renderItems}
        />
      </View>
      <Text style={styles.result}>Total Amount : ₹{total}</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    marginBottom: 8,
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
  },
  item: {
    backgroundColor: 'pink',
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
  },
  itemText: {
    fontSize: 16,
  },
});
