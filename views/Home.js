import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Content from '../components/Content';
import WineCard from '../components/WineCard';
import { useUser } from '../context/UserContext';
import winesData from '../components/Wines';
import * as SecureStore from 'expo-secure-store';

const Home = () => {
  const { colors } = useContext(ThemeContext);
  const [isPressedButton1, setIsPressedButton1] = useState(false);
  const [isPressedButton2, setIsPressedButton2] = useState(false);
  const [isPressedButton3, setIsPressedButton3] = useState(false);
  const [wines, setWines] = useState([]); // Estado para os vinhos
  const [searchText, setSearchText] = useState('');
  const [filteredWines, setFilteredWines] = useState(wines);
  const { cartItems, setCartItems, setCartSuccessMessage, cartSuccessMessage } = useUser();
  const [selectedCategories] = useState([]);
  const [isSortedByPrice, setIsSortedByPrice] = useState(false);
  const [isSortedByRating, setIsSortedByRating] = useState(false);
  const [isSortedBySold, setIsSortedBySold] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Se o texto de pesquisa estiver vazio, mostra todos os vinhos
    if (searchText === '') {
      setFilteredWines(wines);
    } else {
      // Caso contrário, filtra os vinhos com base no texto de pesquisa
      const filtered = wines.filter((wine) =>
        wine.wineName.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedCategories.length === 0 ||
          selectedCategories.some((category) => wine.wineName.includes(category)))
      );
      setFilteredWines(filtered);
    }
  }, [searchText, selectedCategories, wines]); // Adicionando wines como dependência

  useFocusEffect(
    React.useCallback(() => {
      setIsPressedButton1(false);
      setIsPressedButton2(false);
      setIsPressedButton3(false);
      const loadWines = async () => {
        try {
          // Carrega os valores do SecureStore (wineName, wineSigns e wineSold)
          const jsonValue = await SecureStore.getItemAsync('wines');
          const loadedWines = jsonValue != null ? JSON.parse(jsonValue) : [];

          // Agora vamos mesclar com winesData (que tem os outros atributos)
          const mergedWines = winesData.map(wineDataItem => {
            // Procura se este wineDataItem existe no SecureStore carregado
            const storedWine = loadedWines.find(stored => stored.wineName === wineDataItem.wineName);

            // Se encontrar no SecureStore, substitui wineName, wineSigns, e wineSold
            return storedWine
              ? { ...wineDataItem, ...storedWine } // Mescla dados de winesData com o que veio do storage
              : wineDataItem; // Caso contrário, mantém o dado original de winesData
          });

          // Atualiza os estados com os vinhos mesclados
          setWines(mergedWines);
          setFilteredWines(mergedWines); // Atualiza a lista filtrada com os vinhos mesclados

        } catch (e) {
          console.error('Erro ao carregar os vinhos:', e);
          // Fallback para winesData caso haja erro
          setWines(winesData);
          setFilteredWines(winesData);
        }
      };

      loadWines(); // Chama a função para carregar e mesclar os vinhos

      // Retorno opcional para limpar ou desativar algo quando a tela perde o foco
      return () => { };
    }, [])
  );

  const handlePressButton1 = () => {
    setIsPressedButton1(!isPressedButton1);
    if (!isSortedByPrice) {
      const sortedWines = [...wines].sort((a, b) => {
        const priceA = parseFloat(a.winePrice.replace('R$ ', '').replace(',', '.'));
        const priceB = parseFloat(b.winePrice.replace('R$ ', '').replace(',', '.'));

        return priceA - priceB; // Ordena do menor para o maior
      });

      setFilteredWines(sortedWines); // Atualiza a lista filtrada
    } else {
      setFilteredWines(wines); // Retorna à lista original
    }

    setIsSortedByPrice(!isSortedByPrice); // Alterna o estado do botão
    setIsSortedByRating(false);
    setIsSortedBySold(false);
    setIsPressedButton2(false);
    setIsPressedButton3(false);
  };

  const handlePressButton2 = () => {
    setIsPressedButton2(!isPressedButton2);
    if (!isSortedByRating) {
      const sortedWines = [...wines].sort((a, b) => {
        const ratingA = parseFloat(a.wineSigns);
        const ratingB = parseFloat(b.wineSigns);
        return ratingB - ratingA; // Ordena do maior para o menor
      });

      setFilteredWines(sortedWines); // Atualiza a lista filtrada
    } else {
      setFilteredWines(wines); // Retorna à lista original
    }

    setIsSortedByRating(!isSortedByRating); // Alterna o estado do botão
    setIsSortedByPrice(false);
    setIsSortedBySold(false);
    setIsPressedButton1(false);
    setIsPressedButton3(false);
  };

  const handlePressButton3 = () => {
    setIsPressedButton3(!isPressedButton3);

    if (!isSortedBySold) {
      // Ordenar por quantidade vendida
      const sortedWinesBySold = [...wines].sort((a, b) => {
        const soldA = parseInt(a.wineSold, 10); // Certifica-se de que é um número
        const soldB = parseInt(b.wineSold, 10); // Certifica-se de que é um número
        return soldB - soldA; // Ordena do maior para o menor
      });

      setFilteredWines(sortedWinesBySold); // Atualiza a lista filtrada
    } else {
      setFilteredWines(wines); // Retorna à lista original
    }

    setIsSortedBySold(!isSortedBySold);
    // Reseta os outros botões    
    setIsSortedByPrice(false);
    setIsSortedByRating(false);
    setIsPressedButton1(false);
    setIsPressedButton2(false);
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleAddToCart = (item) => {
    const existingItem = cartItems.find((i) => i.wineName === item.wineName);
    if (existingItem) {
      // Se o vinho já existe, atualiza a quantidade
      const updatedItems = cartItems.map((i) =>
        i.wineName === item.wineName
          ? { ...i, quantity: i.quantity + 1 } // Incrementa a quantidade
          : i
      );
      setCartItems(updatedItems);
      setCartSuccessMessage('Quantidade do produto atualizada no carrinho!');
      setTimeout(() => {
        setCartSuccessMessage('');
      }, 2000);
    } else {
      // Se o vinho não existe, adiciona ao carrinho
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
      setCartSuccessMessage('Produto adicionado ao carrinho com sucesso!');
      setTimeout(() => {
        setCartSuccessMessage('');
      }, 2000);
    }
  };

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      flex: 1,
      padding: 10,
    },

    div_pesquisar: {
      width: 320,
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      margin: 'auto',
      marginTop: 10,
      borderWidth: 1,
      borderColor: colors.search,
      borderRadius: 15,
      backgroundColor: 'transparent',
    },

    image_pesquisar: {
      width: 20,
      height: 20,
      tintColor: colors.search,
      marginHorizontal: 15,
    },

    div_categorias: {
      marginBottom: 15,
    },

    text_categorias: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textColor,
      marginLeft: 10,
    },

    div_categorias_opcoes: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
    },

    button_categorias: {
      width: 150,
      height: 40,
      marginLeft: 10,
      marginBottom: 5,
      borderRadius: 35,
      backgroundColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
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

    buttonPressed: {
      backgroundColor: colors.buttonPressed,
    },

    textButtonPressed: {
      color: colors.secondary,
    },

    div_categorias_image_text: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    text_categorias_v2: {
      color: colors.textColor,
      fontWeight: 'bold',
      marginLeft: 5,
    },

    image_todos: {
      width: 52,
      height: 46,
    },

    image_bordeaux: {
      width: 49,
      height: 46,
    },

    image_borgonha: {
      width: 46,
      height: 46,
    },

    div_mosaico_vinhos: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 50,
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
  });

  return (
    <Content >
      <View style={styles.div_pesquisar} >
        <TouchableOpacity >
          <Image source={require('../assets/home/search.png')} style={styles.image_pesquisar} />
        </TouchableOpacity>
        <TextInput
          placeholder="Pesquise por vinhos..."
          placeholderTextColor={colors.search}
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.container}>
        {/* Filtro */}
        <View style={styles.div_categorias_opcoes}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 5 }}>

            <TouchableOpacity
              onPress={handlePressButton3}
              style={[
                styles.button_categorias,
                isPressedButton3 && styles.buttonPressed,
              ]}>
              <View style={styles.div_categorias_image_text}>
                <Text style={[styles.text_categorias_v2, isPressedButton3 && styles.textButtonPressed]}>Mais Vendidos</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePressButton1}
              style={[
                styles.button_categorias,
                isPressedButton1 && styles.buttonPressed,
              ]}>
              <View style={styles.div_categorias_image_text}>
                <Text style={[styles.text_categorias_v2, isPressedButton1 && styles.textButtonPressed]}>Melhores Preços</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePressButton2}
              style={[
                styles.button_categorias,
                isPressedButton2 && styles.buttonPressed,
              ]}>
              <View style={styles.div_categorias_image_text}>
                <Text style={[styles.text_categorias_v2, isPressedButton2 && styles.textButtonPressed]}>Melhor Avaliados</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Categorias')}
              style={styles.button_categorias}>
              <View style={styles.div_categorias_image_text}>
                <Text style={styles.text_categorias_v2}>Por Categorias</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {cartSuccessMessage && (
          <View style={styles.successMessageContainer}>
            <Text style={styles.successMessage}>{cartSuccessMessage}</Text>
          </View>
        )}

        {/* Mosaico de vinhos */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.div_mosaico_vinhos}>
            {filteredWines.length === 0 ? (
              <Text style={styles.noResultsText}>Nenhum resultado encontrado</Text>
            ) : (
              filteredWines.map((wine, index) => (
                <WineCard key={index} wine={wine} onPressAddToCart={handleAddToCart} />
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </Content>
  );
};

export default Home;
