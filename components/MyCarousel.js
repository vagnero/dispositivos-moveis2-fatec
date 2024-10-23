import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

const MyCarousel = ({ navigation }) => {
  const data = [
    { label: 'Mais Vendidos', handler: handlePressButton3 },
    { label: 'Melhores Preços', handler: handlePressButton1 },
    { label: 'Melhor Avaliados', handler: handlePressButton2 },
    { label: 'Por Categorias', handler: () => navigation.navigate('Categorias') },
  ];

  const handlePressButton3 = () => {
    // Lógica para o botão "Mais Vendidos"
    console.log('Mais Vendidos pressionado');
  };

  const handlePressButton1 = () => {
    // Lógica para o botão "Melhores Preços"
    console.log('Melhores Preços pressionado');
  };

  const handlePressButton2 = () => {
    // Lógica para o botão "Melhor Avaliados"
    console.log('Melhor Avaliados pressionado');
  };

  const renderItem = (item) => (
    <TouchableOpacity
      onPress={item.handler}
      style={styles.button_categorias}>
      <View style={styles.div_categorias_image_text}>
        <Text style={styles.text_categorias_v2}>{item.label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Swiper
        loop={true}
        showsButtons={false} // Para esconder os botões de navegação
        autoplay={false} // Para ativar a rotação automática
      >
        {data.map((item, index) => (
          <View key={index} style={styles.slide}>
            {renderItem(item)}
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200, // Ajuste conforme necessário
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_categorias: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    margin: 5,
  },
  div_categorias_image_text: {
    alignItems: 'center',
  },
  text_categorias_v2: {
    fontSize: 16,
    color: '#000',
  },
});

export default MyCarousel;
