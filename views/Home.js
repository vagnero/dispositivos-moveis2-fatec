import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Menu from '../components/Menu';
import Header from '../components/Header';
import Content from '../components/Content';
import WineCard from '../components/WineCard';
import { useUser, addToCart } from '../context/UserContext';
import wines from '../components/Wines';

const Home = () => {
  const { colors } = useContext(ThemeContext);
  // const [cartSuccessMessage, setCartSuccessMessage] = useState('');
  const [isPressedButton1, setIsPressedButton1] = useState(false);
  const [isPressedButton2, setIsPressedButton2] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filteredWines, setFilteredWines] = useState(wines);
  const { currentUser, cartItems, updateCartItems, setCartItems, setCartSuccessMessage, cartSuccessMessage} = useUser();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigation = useNavigation();

  // console.log('Cart items:', cartItems);

  useEffect(() => {
    const filtered = wines.filter((wine) => {
      return (
        wine.wineName.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedCategories.length === 0 ||
          selectedCategories.some((category) => wine.wineName.includes(category)))
      );
    });
    setFilteredWines(filtered);
  }, [searchText, selectedCategories]);

  const handlePressButton1 = () => {
    const newCategories = selectedCategories.includes('Bordeaux')
      ? selectedCategories.filter((category) => category !== 'Bordeaux')
      : [...selectedCategories, 'Bordeaux'];
    setSelectedCategories(newCategories);
    setIsPressedButton1(!isPressedButton1);
  };

  const handlePressButton2 = () => {
    const newCategories = selectedCategories.includes('Borgonha')
      ? selectedCategories.filter((category) => category !== 'Borgonha')
      : [...selectedCategories, 'Borgonha'];
    setSelectedCategories(newCategories);
    setIsPressedButton2(!isPressedButton2);
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
      flex: 1,
      padding: 20,
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
      height: 60,
      marginTop: 5,
      marginLeft: 10,
      marginBottom: 25,
      borderRadius: 15,
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
      backgroundColor: colors.wineCardBackground, 
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
      justifyContent: 'space-between',
      marginBottom: 50,
    },
    successMessage: {
      // marginTop: 5,
      fontSize: 14,
      color: 'green',
      fontWeight: 'bold'
    },
  });  

  return (
    <Content >
      <Header />
      <View style={styles.container}>
        {/* Filtro */}
        <View style={styles.div_categorias_opcoes}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 5 }}>
            <TouchableOpacity
              onPress={handlePressButton1}
              style={[
                styles.button_categorias,
                isPressedButton1 && styles.buttonPressed,
              ]}>
              <View style={styles.div_categorias_image_text}>
                {/* <Image
                  source={require('../assets/home/Bordeaux.png')}
                  style={styles.image_bordeaux}
                /> */}
                
                
                <Text style={[styles.text_categorias_v2, isPressedButton1 && styles.textButtonPressed ]}>Melhor Avaliados</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePressButton2}
              style={[
                styles.button_categorias,
                isPressedButton2 && styles.buttonPressed,
              ]}>
              <View style={styles.div_categorias_image_text}>
                {/* <Image
                  source={require('../assets/home/Borgonha.png')}
                  style={styles.image_borgonha}
                /> */}
                <Text style={[styles.text_categorias_v2, isPressedButton2 && styles.textButtonPressed ]}>Melhores Preços</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Categorias')}
              style={styles.button_categorias}>
              <View style={styles.div_categorias_image_text}>
                <Text style={styles.text_categorias_v2}>Veja Tudo</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={styles.div_categorias}>
          <Text style={styles.text_categorias}>Mais Vendidos</Text>
        </View>
        {cartSuccessMessage && (
          <Text style={styles.successMessage}>{cartSuccessMessage}</Text>
        )}

        {/* Mosaico de vinhos */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.div_mosaico_vinhos}>
            {filteredWines.length === 0 ? (
              <Text style={styles.noResultsText}>
                Nenhum resultado encontrado
              </Text>
            ) : (
              filteredWines.map((wine, index) => (
                <WineCard key={index} wine={wine} onPressAddToCart={handleAddToCart} />
              ))
            )}
          </View>
        </ScrollView>

        {/* Menu */}
        <Menu />
      </View>
    </Content>
  );
};

export default Home;
