import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import Items from './Items';

const ItemList = () => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={item.imageSource} style={styles.image} resizeMode="contain" />
      <Text style={styles.itemName}>{item.itemName}</Text>
      <Text style={styles.itemCategory}>{item.itemCategory}</Text>
      <Text style={styles.itemPrice}>{item.itemPrice}</Text>
      <Text style={styles.itemSigns}>Avaliação: {item.itemSigns}</Text>
      <Text style={styles.itemDescription}>{item.itemDescription}</Text>
      <Text style={styles.itemSold}>Vendido: {item.itemSold} unidades</Text>
    </View>
  );

  return (
    <FlatList
      data={Items}
      renderItem={renderItem}
      keyExtractor={(item) => item.itemName} // Chave única para cada item
    />
  );
};

const styles = StyleSheet.create({
  item: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: '100%',
    height: 200,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemCategory: {
    fontSize: 16,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    color: '#28a745',
  },
  itemSigns: {
    fontSize: 14,
    color: '#f39c12',
  },
  itemDescription: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  itemSold: {
    fontSize: 14,
    color: '#666',
  },
});

export default ItemList;
