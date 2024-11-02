import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { ScrollView, Text, View, Image, Icon, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { FontAwesome } from '@expo/vector-icons';
import { handleAddToCart } from '../utils/cartUtils';
import Items from '../components/Items';
import Content from '../components/Content';
import dbContext from '../context/dbContext';
import AlertModal from '../components/AlertModal';

const Sobre = () => {
  const { colors } = useContext(ThemeContext);
  const route = useRoute();
  const { itemName, itemPrice, itemSigns, itemDescription, imageSource } = route.params;
  const navigation = useNavigation();
  const { cartItems, setCartItems, setCartSuccessMessage, cartSuccessMessage, currentUser } = useUser();
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [modalAlertVisible, setModalAlertVisible] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Função para alternar o item favorito
  const toggleHeart = async (item) => {
    if (!currentUser || !currentUser.nome) {
      setMensagem('Para Favoritar é necessário estar logado')
      setModalAlertVisible(true);
      return; // Sai da função se o usuário não estiver definido
    }
    
    let updatedFavorites;    

    if (isItemFavorite(item)) {
      // Remove dos favoritos
      updatedFavorites = favoriteItems.filter((favItem) => favItem.itemName !== item.itemName);

      // Remove do dbContext
      removeFavoriteItem(item.itemName);
    } else {
      // Adiciona aos favoritos
      updatedFavorites = [...favoriteItems, item];

      // Salva no dbContext
      saveFavoriteItems(updatedFavorites);
    }

    setFavoriteItems(updatedFavorites); // Atualiza o estado
  };

  const removeFavoriteItem = (itemName) => {
    try {
      // Define o ID único do item
      const itemId = `${itemName}_${currentUser.nome}`;
  
      // Remove o item do dbContext
      dbContext.removeItem('favoriteItems', itemId);
  
      // Atualiza o estado
      setFavoriteItems((prevFavorites) => 
        prevFavorites.filter((favItem) => favItem.itemName !== itemName)
      );
  
      console.log(`Item ${itemName} removido dos favoritos.`);
    } catch (error) {
      console.error('Erro ao remover item dos favoritos:', error);
    }
  };  

  // Verifica se o item já é favorito
  const isItemFavorite = (item) => {
    return favoriteItems.some((favItem) => favItem.itemName === item.itemName);
  };

  const saveFavoriteItems = (items) => {
    if (!currentUser || !currentUser.nome) {
      return; // Sai da função se o usuário não estiver definido
    }
  
    try {
      items.forEach((item) => {
        const favoriteItem = {
          itemName: item.itemName, // Apenas o itemName é salvo
          id: `${item.itemName}_${currentUser.nome}`, // Usando itemName e nome do usuário como chave
        };
  
        // Adiciona o item ao dbContext
        dbContext.addItem('favoriteItems', favoriteItem);
      });
  
      // Atualiza o estado com todos os itens favoritos (apenas com itemName)
      setFavoriteItems((prevFavorites) => [
        ...prevFavorites,
        ...items.map((item) => ({
          itemName: item.itemName,
          id: `${item.itemName}_${currentUser.nome}`,
        })),
      ]);
  
      console.log('Itens favoritos salvos.');
    } catch (error) {
      console.error('Erro ao salvar itens favoritos:', error);
    }
  };      

  // Carrega os items favoritos
  const loadItems = () => {
    if (!currentUser || !currentUser.nome) {
      return; // Sai da função se o usuário não estiver definido
    }
  
    try {
      const allFavoriteItems = dbContext.getAll('favoriteItems'); // Acesse todos os itens favoritos do dbContext
  
      // Filtra pelos itens do usuário
      const loadedItems = allFavoriteItems.filter((item) => 
        item.id.endsWith(`_${currentUser.nome}`)
      );
  
      // Mapeia os itens carregados para incluir todos os atributos
      const detailedItems = loadedItems.map((favItem) => {
        const originalItem = Items.find((item) => item.itemName === favItem.itemName);
        return {
          ...favItem,
          ...originalItem, // Adiciona os atributos do item original
        };
      });
  
      // Atualiza o estado com os itens carregados
      setFavoriteItems(detailedItems);
    } catch (error) {
      console.error('Erro ao carregar itens favoritos:', error);
    }
  };
  
  // Chama a função ao montar o componente
  useEffect(() => {
    loadItems();
  }, []);

  const styles = {
    content: {
      flex: 1,
    },
    div_image: {
      alignItems: 'center',
      marginTop: 90,
    },
    image_item: {
      width: 250,
      height: 250
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
    },
    text_sobre: {
      marginLeft: '7%',
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
      flexDirection: 'row',
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
      top: '15%',
      left: 0,
      right: 0,
      transform: [{ translateY: -20 }], // Ajusta a posição vertical
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
    },
    successMessage: {
      width: '90%',
      fontSize: 15,
      color: 'white',
      padding: 10,
      borderRadius: 10,
      backgroundColor: 'rgba(0, 128, 0, 0.8)',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  };

  return (
    <Content>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{  }}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.div_image}>
            <Image source={imageSource} style={styles.image_item} />
          </View>
          <View style={styles.container_informacoes}>
            <Text style={styles.text_informacoes}>{itemName}</Text>
            <View style={styles.div_avaliacoes}>
              <Image source={require('../assets/info/signs.png')} style={styles.image_signs} />
              <Text style={styles.text_avaliacoes}>{itemSigns}</Text>
              <TouchableOpacity>
                <Text style={styles.button_avaliacoes} onPress={() => navigation.navigate('Avaliacoes')}>
                  Ver Avaliações
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.text_preco}>{itemPrice}</Text>
            <View>
              <Text style={styles.text_sobre}>Descrição</Text>
              <Text style={styles.text_sobre_2}>{itemDescription}</Text>
            </View>
            <View style={styles.div_buttons}>
             

              {/* Adicione um onPress ao botão "ADICIONAR AO CARRINHO" */}
              <TouchableOpacity style={styles.button_carrinho}
                onPress={() => {
                  const item = Items.find((w) => w.itemName === itemName);
                  handleAddToCart(item, cartItems, setCartItems, setCartSuccessMessage)
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
      <AlertModal
        visible={modalAlertVisible}
        message={mensagem}
        onClose={() => {setModalAlertVisible(false)}}
      />
    </Content>
  );
};

export default Sobre;
