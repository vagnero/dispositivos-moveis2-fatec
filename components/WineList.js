import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import Wines from './Wines';

const WineList = () => {
  const renderItem = ({ item }) => (
    <View style={styles.wineItem}>
      <Image source={item.imageSource} style={styles.image} resizeMode="contain" />
      <Text style={styles.wineName}>{item.wineName}</Text>
      <Text style={styles.wineCategory}>{item.wineCategory}</Text>
      <Text style={styles.winePrice}>{item.winePrice}</Text>
      <Text style={styles.wineSigns}>Avaliação: {item.wineSigns}</Text>
      <Text style={styles.wineDescription}>{item.wineDescription}</Text>
      <Text style={styles.wineSold}>Vendido: {item.wineSold} unidades</Text>
    </View>
  );

  return (
    <FlatList
      data={Wines}
      renderItem={renderItem}
      keyExtractor={(item) => item.wineName} // Chave única para cada item
    />
  );
};

const styles = StyleSheet.create({
  wineItem: {
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
  wineName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  wineCategory: {
    fontSize: 16,
    color: '#666',
  },
  winePrice: {
    fontSize: 16,
    color: '#28a745',
  },
  wineSigns: {
    fontSize: 14,
    color: '#f39c12',
  },
  wineDescription: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  wineSold: {
    fontSize: 14,
    color: '#666',
  },
});

export default WineList;
