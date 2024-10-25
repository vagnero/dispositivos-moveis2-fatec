import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Text, BackHandler, View, TouchableOpacity, ScrollView, Image, Platform, StyleSheet, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Content from '../components/Content';
import MyCarousel from '../components/MyCarousel';
import ItemCard from '../components/ItemCard';
import { useUser } from '../context/UserContext';
import Items from '../components/Items';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const Home = () => {
  const { colors } = useContext(ThemeContext);
  const [isPressedButton1, setIsPressedButton1] = useState(false);
  const [isPressedButton2, setIsPressedButton2] = useState(false);
  const [isPressedButton3, setIsPressedButton3] = useState(false);
  const [items, setItems] = useState([]); // Estado para os items
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const { cartItems, setCartItems, setCartSuccessMessage, cartSuccessMessage } = useUser();
  const [selectedCategories] = useState([]);
  const [isSortedByPrice, setIsSortedByPrice] = useState(false);
  const [isSortedByRating, setIsSortedByRating] = useState(false);
  const [isSortedBySold, setIsSortedBySold] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Se o texto de pesquisa estiver vazio, mostra todos os items
    if (searchText === '') {
      setFilteredItems(items);
    } else {
      // Caso contrário, filtra os items com base no texto de pesquisa
      const filtered = items.filter((item) =>
        item.itemName.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedCategories.length === 0 ||
          selectedCategories.some((category) => item.itemName.includes(category)))
      );
      setFilteredItems(filtered);
    }
  }, [searchText, selectedCategories, items]); // Adicionando items como dependência

  useFocusEffect(
    React.useCallback(() => {
      setIsPressedButton1(false);
      setIsPressedButton2(false)
      setIsPressedButton3(false);

      const loadItems = async () => {
        try {
          // Carrega os items estáticos do JSON
          const loadedItems = Items;

          // Busca os dados do Firestore
          const itemsCollection = collection(db, 'items'); // Corrigido
          const snapshot = await getDocs(itemsCollection); // Uso do getDocs

          const firestoreItems = snapshot.docs.map(doc => ({
            itemName: doc.data().itemName,
            itemSold: doc.data().itemSold,
            // Inclua outros campos que precisar
          }));

          // Mescla os dados do Firestore com os itens estáticos
          const mergedItems = loadedItems.map(itemData => {
            const firestoreItem = firestoreItems.find(stored => stored.itemName === itemData.itemName);
            return {
              ...itemData, // Mantém todas as propriedades de itemData
              ...(firestoreItem || {}), // Mescla as propriedades do Firestore se existir
            };
          });

          // Atualiza os estados com os items mesclados
          setItems(mergedItems);
          setFilteredItems(mergedItems); // Atualiza a lista filtrada com os items mesclados

        } catch (e) {
          console.error('Erro ao carregar os items:', e);
          // Fallback para Items caso haja erro
          setItems(Items);
          setFilteredItems(Items);
        }
      };

      loadItems(); // Chama a função para carregar e mesclar os items

      // Retorno opcional para limpar ou desativar algo quando a tela perde o foco
      return () => { };
    }, [])
  );

  // Impede de voltar uma tela anterior a Home
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true; // Retorne true para indicar que o evento foi tratado
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );

  // Ordena por preço
  const handlePressButton1 = () => {
    setIsPressedButton1(!isPressedButton1);
    if (!isSortedByPrice) {
      const sortedItems = [...items].sort((a, b) => {
        const priceA = parseFloat(a.itemPrice.replace('R$ ', '').replace(',', '.'));
        const priceB = parseFloat(b.itemPrice.replace('R$ ', '').replace(',', '.'));

        return priceA - priceB; // Ordena do menor para o maior
      });

      setFilteredItems(sortedItems); // Atualiza a lista filtrada
    } else {
      setFilteredItems(items); // Retorna à lista original
    }

    setIsSortedByPrice(!isSortedByPrice); // Alterna o estado do botão
    setIsSortedByRating(false);
    setIsSortedBySold(false);
    setIsPressedButton2(false);
    setIsPressedButton3(false);
  };

  // Ordena por rating
  const handlePressButton2 = () => {
    setIsPressedButton2(!isPressedButton2);
    if (!isSortedByRating) {
      const sortedItems = [...items].sort((a, b) => {
        const ratingA = parseFloat(a.itemSigns);
        const ratingB = parseFloat(b.itemSigns);
        return ratingB - ratingA; // Ordena do maior para o menor
      });

      setFilteredItems(sortedItems); // Atualiza a lista filtrada
    } else {
      setFilteredItems(items); // Retorna à lista original
    }

    setIsSortedByRating(!isSortedByRating); // Alterna o estado do botão
    setIsSortedByPrice(false);
    setIsSortedBySold(false);
    setIsPressedButton1(false);
    setIsPressedButton3(false);
  };

  // Ordena por quantidade vendido
  const handlePressButton3 = () => {
    setIsPressedButton3(!isPressedButton3);

    if (!isSortedBySold) {
      // Ordenar por quantidade vendida
      const sortedItemsBySold = [...items].sort((a, b) => {
        const soldA = parseInt(a.itemSold, 10); // Certifica-se de que é um número
        const soldB = parseInt(b.itemSold, 10); // Certifica-se de que é um número
        return soldB - soldA; // Ordena do maior para o menor
      });

      setFilteredItems(sortedItemsBySold); // Atualiza a lista filtrada
    } else {
      setFilteredItems(items); // Retorna à lista original
    }

    setIsSortedBySold(!isSortedBySold);
    // Reseta os outros botões    
    setIsSortedByPrice(false);
    setIsSortedByRating(false);
    setIsPressedButton1(false);
    setIsPressedButton2(false);
  };

  // Ordena por quantidade vendido
  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleAddToCart = (item) => {
    const existingItem = cartItems.find((i) => i.itemName === item.itemName);
    if (existingItem) {
      // Se o item já existe, atualiza a quantidade
      const updatedItems = cartItems.map((i) =>
        i.itemName === item.itemName
          ? { ...i, quantity: i.quantity + 1 } // Incrementa a quantidade
          : i
      );
      setCartItems(updatedItems);
      setCartSuccessMessage('Quantidade do produto atualizada no carrinho!');
      setTimeout(() => {
        setCartSuccessMessage('');
      }, 2000);
    } else {
      // Se o item não existe, adiciona ao carrinho
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
      padding: 5,
    },
    div_pesquisar: {
      width: 320,
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      margin: 'auto',
      marginBottom: 10,
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
    div_mosaico_items: {
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
      <View style={styles.container}>
        {/* Filtro */}
        <View style={styles.div_pesquisar} >
          <TouchableOpacity >
            <Image source={require('../assets/info/search.png')} style={styles.image_pesquisar} />
          </TouchableOpacity>
          <TextInput
            placeholder="Pesquise por items..."
            placeholderTextColor={colors.search}
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
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
            {/* <TouchableOpacity
              onPress={() => navigation.navigate('Categorias')}
              style={styles.button_categorias}>
              <View style={styles.div_categorias_image_text}>
                <Text style={styles.text_categorias_v2}>Por Categorias</Text>
              </View>
            </TouchableOpacity> */}
          </ScrollView>
        </View>
        {cartSuccessMessage && (
          <View style={styles.successMessageContainer}>
            <Text style={styles.successMessage}>{cartSuccessMessage}</Text>
          </View>
        )}

        {!isPressedButton1 && !isPressedButton2 && !isPressedButton3 && searchText === '' ? (
          <MyCarousel handleAddToCart={handleAddToCart} />
        ) : (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.div_mosaico_items}>
              {filteredItems.length === 0 ? (
                <Text>Nenhum resultado encontrado</Text>
              ) : (
                filteredItems.map((item, index) => (
                  <ItemCard key={index} item={item} onPressAddToCart={handleAddToCart} />
                ))
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </Content>
  );
};

export default Home;
