import React, { useState } from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';

const Sobre = () => {
  const route = useRoute();
  const { wineName, winePrice, wineSigns, wineDescription, imageSource } = route.params;
  const navigation = useNavigation();
  const { addToCart } = useUser();

  // Estado para controlar a exibição da mensagem de sucesso
  const [cartSuccessMessage, setCartSuccessMessage] = useState('');

  const handleAddToCart = () => {
    // Adiciona o item ao carrinho
    addToCart({ ...route.params, quantity: 1 });

    // Define a mensagem de sucesso
    setCartSuccessMessage('Produto adicionado ao carrinho com sucesso!');

    // Define um temporizador para ocultar a mensagem após alguns segundos
    setTimeout(() => {
      setCartSuccessMessage('');
    }, 2000);
  };

  return (
    <ScrollView>
      <View style={{ backgroundColor: 'white'}}>
        <View style={styles.div_image}>
          <Image source={imageSource} style={styles.image_vinho}/>
        </View>
        <View style={styles.container_informacoes}>
          <Text style={styles.text_informacoes}>{wineName}</Text>
          <View style={styles.div_avaliacoes}>
            <Image source={require('../assets/info/signs.png')} style={styles.image_signs}/>
            <Text style={styles.text_avaliacoes}>{wineSigns}</Text>
            <TouchableOpacity>
              <Text style={styles.button_avaliacoes} onPress={() => navigation.navigate('Avaliacoes')}>
                Ver Avaliações
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.text_preco}>{winePrice}</Text>
          <View>
            <Text style={styles.text_sobre}>Sobre</Text>
            <Text style={styles.text_sobre_2}>{wineDescription}</Text>
          </View>
          <View style={styles.div_buttons}>
            <TouchableOpacity style={styles.button_favorite}>
              <Image source={require('../assets/info/heart.png')}/>
            </TouchableOpacity>
            {/* Adicione um onPress ao botão "ADICIONAR AO CARRINHO" */}
            <TouchableOpacity style={styles.button_carrinho} onPress={handleAddToCart}>
              <Image source={require('../assets/info/shopping-cart.png')}/>
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
  );
};

const styles = {
  div_image: {
    alignItems: 'center'
  },

  image_vinho: {
    width: '100%', 
    height: 320
  },

  container_informacoes: {
    width: '100%', 
    height: '100%', 
    backgroundColor: '#F6F5F5',
    borderRadius: 25
  },

  text_informacoes: {
    width: '90%', 
    fontSize: 30, 
    fontWeight: 'bold', 
    color: '#2D0C57', 
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
    color: '#2D0C57', 
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
    fontSize: 15, 
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

export default Sobre;
