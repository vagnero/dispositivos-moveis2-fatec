import React, { useRef, useState, useContext } from 'react';
import { View, Text, Dimensions, StyleSheet, Platform, ScrollView } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { ThemeContext } from '../context/ThemeContext';
import Items from '../components/Items';
import ItemCard from '../components/ItemCard';

const MyCarousel = ({ handleAddToCart }) => {
  const { colors } = useContext(ThemeContext);
  const isCarousel = useRef(null);
  const [index, setIndex] = useState(0);

  // Obter todas as categorias únicas
  const uniqueCategories = [...new Set(Items.map(item => item.numberCategory))];

  const filteredItems = uniqueCategories.map(category =>
    Items.filter(item => item.numberCategory === category)
  );

  const styles = StyleSheet.create({
    itemContainer: {
      backgroundColor: '#ccc',
      borderRadius: 10,
      padding: 20,
      margin: 10,
    },
    textCategory: {
      textAlign: 'center',
      fontSize: 30,
      color: colors.textColor,
    },
    div_item: {
      width: 150,
      height: 210,
      backgroundColor: colors.itemCardBackground,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
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
  });

  const renderItem = ({ item }) => (
    <View>
      {filteredItems.length === 0 ? (
        <Text>Nenhum resultado encontrado</Text>
      ) : (
        <View key={index}>
          <ItemCard key={index} item={item} onPressAddToCart={handleAddToCart} />
        </View>
      )}
    </View>
  );

  const { width } = Dimensions.get('window');

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredItems.map((items, index) => (
          <View key={index}>
            <Text style={styles.textCategory}>{items[0]?.itemCategory}</Text>
            <Carousel
              data={items}
              renderItem={renderItem}
              layout="default"
              ref={isCarousel}
              sliderWidth={width}
              itemWidth={width * 0.45}
              onSnapToItem={(index) => setIndex(index)}
              loop={true}
            />
          </View>
        ))}
      </ScrollView>
    </View >
  );
};

export default MyCarousel;
