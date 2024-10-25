import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { ScrollView, Text, View, Image, Icon, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { FontAwesome } from '@expo/vector-icons';
import { handleAddToCart } from '../utils/cartUtils';
import items from '../components/Items';
import Content from '../components/Content';
import { db } from '../config/firebaseConfig'; // Importe seu arquivo de configuração do Firebase
import { doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
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

      // Remove do Firestore
      await removeFavoriteItem(item.itemName);
    } else {
      // Adiciona aos favoritos
      updatedFavorites = [...favoriteItems, item];

      // Salva no Firestore
      await saveFavoriteItems(updatedFavorites);
    }

    setFavoriteItems(updatedFavorites); // Atualiza o estado
  };

  const removeFavoriteItem = async (itemName) => {
    try {
      const itemDoc = doc(db, 'favoriteItems', `${itemName}_${currentUser.nome}`);
      await deleteDoc(itemDoc);
      console.log(`Produto ${itemName} removido dos favoritos no Firestore.`);
    } catch (error) {
      console.error('Erro ao remover item do Firestore:', error);
    }
  };

  // Verifica se o item já é favorito
  const isItemFavorite = (item) => {
    return favoriteItems.some((favItem) => favItem.itemName === item.itemName);
  };

  const saveFavoriteItems = async (items) => {
    // Verifica se currentUser e currentUser.nome estão definidos
    if (!currentUser || !currentUser.nome) {
      return; // Sai da função se o usuário não estiver definido
    }
  
    try {
      const itemCollection = collection(db, 'favoriteItems');
  
      // Salva cada item como um documento individual
      for (const item of items) {
        const itemData = {
          itemName: item.itemName || '',
          price: item.itemPrice || item.price,
          ml: item.ml || '',
          imageSource: item.imageSource || '',
        };
  
        // Usando o itemName e o userName como chave para evitar duplicatas
        await setDoc(doc(itemCollection, `${item.itemName}_${currentUser.nome}`), itemData);
      }
      console.log('Produtos favoritos salvos no Firestore.');
    } catch (error) {
      console.error('Erro ao salvar items no Firestore:', error);
    }
  };    

  // Carrega os items favoritos
  const loadItems = async () => {
    if (!currentUser || !currentUser.nome) {
      return; // Sai da função se o usuário não estiver definido
    }

    try {
      const itemCollection = collection(db, 'favoriteItems');
      const querySnapshot = await getDocs(itemCollection);

      // Verifica se existem documentos na coleção
      if (querySnapshot.empty) {
        console.log('Nenhum item favorito encontrado no Firestore.');
        setFavoriteItems([]); // Define a lista de items favoritos como vazia
        return; // Sai da função se não houver items
      }

      // Mapeia os documentos carregados para um array de dados
      const loadedItems = querySnapshot.docs
        .map((doc) => ({
          id: doc.id, // Inclui o ID do documento se necessário
          ...doc.data(),
        }))
        .filter((item) => item.id.endsWith(`_${currentUser.nome}`)); // Filtra pelos items do usuário

      // Atualiza o estado com os items carregados
      setFavoriteItems(loadedItems);      
    } catch (error) {
      console.error('Erro ao carregar items do Firestore:', error);
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
      alignItems: 'center'
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
              <View style={{ marginRight: 40, marginTop: 10, marginLeft: 20 }}>
                <TouchableOpacity onPress={() => toggleHeart(route.params)}>
                  <FontAwesome
                    name={isItemFavorite(route.params) ? 'heart' : 'heart-o'}
                    size={32}
                    color='red'
                  />
                </TouchableOpacity>
              </View>

              {/* Adicione um onPress ao botão "ADICIONAR AO CARRINHO" */}
              <TouchableOpacity style={styles.button_carrinho}
                onPress={() => {
                  const item = items.find((w) => w.itemName === itemName);
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
