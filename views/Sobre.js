import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useUser, addToCart } from '../context/UserContext';
import { FontAwesome } from '@expo/vector-icons';
import { handleAddToCart } from '../utils/cartUtils';
import wines from '../components/Wines';
import Content from '../components/Content';

const Sobre = () => {
  const { colors } = useContext(ThemeContext);
  const route = useRoute();
  const { wineName, winePrice, wineSigns, wineDescription, imageSource } = route.params;
  const navigation = useNavigation();
  const { currentUser, cartItems, updateCartItems, setCartItems, setCartSuccessMessage, cartSuccessMessage } = useUser();
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const toggleHeart = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  const styles = {
    div_image: {
      alignItems: 'center'
    },

    image_vinho: {
      width: 300,
      height: 300
    },

    container_informacoes: {
      width: '100%',
      height: '100%',
      // backgroundColor: '#F6F5F5',
      borderRadius: 25
    },

    text_informacoes: {
      width: '90%',
      fontSize: 30,
      fontWeight: 'bold',
      color: colors.textColor,
      marginLeft: '7%',
      marginTop: '5%',
      marginBottom: '3%'
    },

    div_avaliacoes: {
      flexDirection: 'row',
      alignItems: 'center'
    },

    image_signs: {
      marginLeft: '7%',
      marginRight: '1%'
    },

    text_avaliacoes: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#111719',
      marginRight: '5%'
    },

    button_avaliacoes: {
      fontSize: 15,
      textDecorationLine: 'underline',
      color: '#6C30EB'
    },

    text_preco: {
      fontSize: 30,
      fontWeight: 'bold',
      marginLeft: '7%',
      color: colors.textColor,
      marginBottom: '3%'
    },

    text_sobre: {
      marginLeft: '7%',
      marginBottom: '3%',
      fontSize: 22,
      fontWeight: 'bold',
      color: '#2D0C57'
    },

    text_sobre_2: {
      marginLeft: '7%',
      width: '90%',
      fontSize: 16,
      color: '#9586A8'
    },

    div_buttons: {
      marginTop: '5%',
      marginLeft: '7%',
      flexDirection: 'row'
    },

    button_favorite: {
      width: 78,
      height: 56,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#D9D0E3',
      borderRadius: 10,
      marginBottom: '10%',
      marginRight: '4%',
      alignItems: 'center',
      justifyContent: 'center'
    },

    button_carrinho: {
      width: 230,
      height: 56,
      backgroundColor: '#6C30EB',
      borderWidth: 1,
      borderColor: '#D9D0E3',
      borderRadius: 10,
      marginBottom: '10%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },

    text_button_carrinho: {
      fontSize: 14,
      color: '#FFFFFF',
      fontWeight: 'bold',
      marginLeft: 5
    },

    button_carrinho: {
      width: 230,
      height: 56,
      backgroundColor: '#6C30EB',
      borderWidth: 1,
      borderColor: '#D9D0E3',
      borderRadius: 10,
      marginBottom: '10%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },

    successMessageContainer: {
      position: 'absolute',
      bottom: 100, // Posição vertical ajustada para baixo
      alignSelf: 'center',
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 10,
    },

    successMessage: {
      color: 'white',
      fontWeight: 'bold',
    },
  };

  return (
    <Content>
      <ScrollView>
        <View>
          <View style={styles.div_image}>
            <Image source={imageSource} style={styles.image_vinho} />
          </View>
          <View style={styles.container_informacoes}>
            <Text style={styles.text_informacoes}>{wineName}</Text>
            <View style={styles.div_avaliacoes}>
              <Image source={require('../assets/info/signs.png')} style={styles.image_signs} />
              <Text style={styles.text_avaliacoes}>{wineSigns}</Text>
              <TouchableOpacity>
                <Text style={styles.button_avaliacoes} onPress={() => navigation.navigate('Avaliacoes')}>
                  Ver Avaliações
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.text_preco}>{winePrice}</Text>
            <View>
              <Text style={styles.text_sobre}>Descrição</Text>
              <Text style={styles.text_sobre_2}>{wineDescription}</Text>
            </View>
            <View style={styles.div_buttons}>
              <TouchableOpacity style={styles.button_favorite} onPress={toggleHeart}>
                <FontAwesome name={isHeartFilled ? "heart" : "heart-o"} size={30} style={{ color: 'red' }} />
              </TouchableOpacity>
              {/* Adicione um onPress ao botão "ADICIONAR AO CARRINHO" */}
              <TouchableOpacity style={styles.button_carrinho}
                onPress={() => {
                  const wine = wines.find((w) => w.wineName === wineName);
                  handleAddToCart(wine, cartItems, setCartItems, setCartSuccessMessage)
                }} // Usando a função externa
              >
                <Image source={require('../assets/info/shopping-cart.png')} />
                <Text style={styles.text_button_carrinho}>ADICIONAR AO CARRINHO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Exibe a mensagem de sucesso se houver */}
        {cartSuccessMessage !== '' && (
          <View style={styles.successMessageContainer}>
            <Text style={styles.successMessage}>{cartSuccessMessage}</Text>
          </View>
        )}
      </ScrollView>
    </Content>
  );
};

export default Sobre;
