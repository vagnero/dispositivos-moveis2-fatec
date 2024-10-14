import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { ScrollView, Text, View, Image, Icon, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { FontAwesome } from '@expo/vector-icons';
import { handleAddToCart } from '../utils/cartUtils';
import wines from '../components/Wines';
import Content from '../components/Content';
import { db } from '../config/firebaseConfig'; // Importe seu arquivo de configuração do Firebase
import { doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';

const Sobre = () => {
  const { colors } = useContext(ThemeContext);
  const route = useRoute();
  const { wineName, winePrice, wineSigns, wineDescription, imageSource } = route.params;
  const navigation = useNavigation();
  const { cartItems, setCartItems, setCartSuccessMessage, cartSuccessMessage, currentUser } = useUser();
  const [favoriteWines, setFavoriteWines] = useState([]);

  // Função para alternar o vinho favorito
  const toggleHeart = async (wine) => {
    if (!currentUser || !currentUser.nome) {
      Alert.alert('Para Favoritar é necessário estar logado');
      return; // Sai da função se o usuário não estiver definido
    }
    
    let updatedFavorites;

    if (isWineFavorite(wine)) {
      // Remove dos favoritos
      updatedFavorites = favoriteWines.filter((favWine) => favWine.wineName !== wine.wineName);

      // Remove do Firestore
      await removeFavoriteWine(wine.wineName);
    } else {
      // Adiciona aos favoritos
      updatedFavorites = [...favoriteWines, wine];

      // Salva no Firestore
      await saveFavoriteWines(updatedFavorites);
    }

    setFavoriteWines(updatedFavorites); // Atualiza o estado
  };

  const removeFavoriteWine = async (wineName) => {
    try {
      const wineDoc = doc(db, 'favoriteWines', `${wineName}_${currentUser.nome}`);
      await deleteDoc(wineDoc);
      console.log(`Vinho ${wineName} removido dos favoritos no Firestore.`);
    } catch (error) {
      console.error('Erro ao remover vinho do Firestore:', error);
    }
  };

  // Verifica se o vinho já é favorito
  const isWineFavorite = (wine) => {
    return favoriteWines.some((favWine) => favWine.wineName === wine.wineName);
  };

  const saveFavoriteWines = async (wines) => {
    // Verifica se currentUser e currentUser.nome estão definidos
    if (!currentUser || !currentUser.nome) {
      return; // Sai da função se o usuário não estiver definido
    }
  
    try {
      const wineCollection = collection(db, 'favoriteWines');
  
      // Salva cada vinho como um documento individual
      for (const wine of wines) {
        const wineData = {
          wineName: wine.wineName || '',
          price: wine.winePrice || wine.price,
          ml: wine.ml || '',
          imageSource: wine.imageSource || '',
        };
  
        // Usando o wineName e o userName como chave para evitar duplicatas
        await setDoc(doc(wineCollection, `${wine.wineName}_${currentUser.nome}`), wineData);
      }
      console.log('Vinhos favoritos salvos no Firestore.');
    } catch (error) {
      console.error('Erro ao salvar vinhos no Firestore:', error);
    }
  };    

  // Carrega os vinhos favoritos do SecureStore
  const loadWines = async () => {
    if (!currentUser || !currentUser.nome) {
      return; // Sai da função se o usuário não estiver definido
    }

    try {
      const wineCollection = collection(db, 'favoriteWines');
      const querySnapshot = await getDocs(wineCollection);

      // Verifica se existem documentos na coleção
      if (querySnapshot.empty) {
        console.log('Nenhum vinho favorito encontrado no Firestore.');
        setFavoriteWines([]); // Define a lista de vinhos favoritos como vazia
        return; // Sai da função se não houver vinhos
      }

      // Mapeia os documentos carregados para um array de dados
      const loadedWines = querySnapshot.docs
        .map((doc) => ({
          id: doc.id, // Inclui o ID do documento se necessário
          ...doc.data(),
        }))
        .filter((wine) => wine.id.endsWith(`_${currentUser.nome}`)); // Filtra pelos vinhos do usuário

      // Atualiza o estado com os vinhos carregados
      setFavoriteWines(loadedWines);      
    } catch (error) {
      console.error('Erro ao carregar vinhos do Firestore:', error);
    }
  };

  // Chama a função ao montar o componente
  useEffect(() => {
    loadWines();
  }, []);


  const styles = {
    content: {
      flex: 1,
    },

    div_image: {
      alignItems: 'center'
    },

    image_vinho: {
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
      flexDirection: 'row',
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ flex: 1, marginBottom: 50 }}
      >
        <View style={styles.content}>
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
              <View style={{ marginRight: 40, marginTop: 10, marginLeft: 20 }}>
                <TouchableOpacity onPress={() => toggleHeart(route.params)}>
                  <FontAwesome
                    name={isWineFavorite(route.params) ? 'heart' : 'heart-o'}
                    size={32}
                    color='red'
                  />
                </TouchableOpacity>
              </View>

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
