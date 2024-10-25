import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import Items from './Items';

const ItemCard = ({ item, onPressAddToCart, updateCartItems }) => {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);
  const [soldCount, setSoldCount] = useState(0); // Inicializa como 0
  const [totalQuantity, setTotalQuantity] = useState(0); // Estado para manter a quantidade total

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Referência à coleção de itens no Firestore
        const itemsRef = collection(db, 'items');
        const querySnapshot = await getDocs(itemsRef);

        // Criar um array com os dados dos itens
        const itemsArray = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          itemName: doc.id, // usa o ID do documento como itemName
        }));

        const storedItem = itemsArray.find(i => i.itemName === item.itemName);

        if (storedItem) {
          setSoldCount(storedItem.itemSold);
        } else {
          const matchingItem = Items.find(i => i.itemName === item.itemName);
          setSoldCount(matchingItem ? matchingItem.itemSold || 0 : 0);
        }
      } catch (error) {
        console.error('Erro ao carregar items do Firestore:', error);
      }
    };

    fetchItems();
  }, [item.itemName]);


  const handleAddToCart = () => {
    const newTotalQuantity = totalQuantity + 1; // Incrementa o total
    setTotalQuantity(newTotalQuantity); // Atualiza o estado com o novo total
    // console.log(`Total de itens no carrinho: ${newTotalQuantity}`);
    onPressAddToCart({ ...item, imageSource: item.imageSource, quantity: 1 }, updateCartItems); // Passa 1 como quantidade do item adicionado
  };

  const styles = {
    div_item: {
      width: 150,
      height: 210,
      backgroundColor: colors.itemCardBackground,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginLeft: 15,
      marginRight: 5,
      marginTop: 5,
      marginBottom: 10,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    div_image_text_item: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    div_image_item: {
      width: 50,
      height: 120,
      // width: 40,
      // height: 70,
    },
    div_text_item: {
      width: '90%',
      textAlign: 'center',
      fontSize: 15,
      color: '#2D0C57',
      fontWeight: 'bold',
      marginTop: 10,
      marginHorizontal: 1,
    },
    div_text_button_item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },
    div_text_preco: {
      fontSize: 16,
      color: '#32343E',
      fontWeight: 'bold',
    },
    addButton: {
      marginLeft: 10, // Adicionando margem para separar o botão do preço
    },
  };

  return (
    <View style={styles.div_item}>
      <Text style={styles.div_text_item} onPress={() => navigation.navigate('Sobre', item)}>{item.itemName}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Sobre', item)}>
        <View style={styles.div_image_text_item}>
          <Image source={item.imageSource} style={styles.div_image_item} />
          <View>
            <Text>Vendidos: {soldCount}</Text>
            <Text>Rate: {item.itemSigns}
              <Image source={require('../assets/info/signs.png')}/>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.div_text_button_item}>
        <Text style={styles.div_text_preco}>{item.itemPrice}</Text>
        <TouchableOpacity onPress={handleAddToCart} style={styles.addButton}>
          <Image source={require('../assets/carrinho/plus.png')} style={{ marginBottom: 10 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ItemCard;
