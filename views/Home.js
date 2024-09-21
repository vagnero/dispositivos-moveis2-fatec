import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Menu from '../components/Menu';
import Pesquisar from '../components/Pesquisar';
import Greeting from '../components/Greeting';
import WineCard from '../components/WineCard';
import { useUser } from './UserContext';

const wines = [
  {
    wineName: 'Les Légends Bordeaux Rouge',
    // wineCategory: 'Bordeaux Tinto',
    winePrice: 'R$ 260,00',
    wineSigns: '4.5',
    wineDescription: 'Um vinho equilibrado e robusto, com notas de frutas vermelhas.',
    imageSource: require('../assets/home/vinho1.png'),
  },
  {
    wineName: 'Cazauvielho Bordeaux',
    // wineCategory: 'Bordeaux Tinto',
    winePrice: 'R$ 109,00',
    wineSigns: '5.0',
    wineDescription: 'Vinho jovem e frutado, ideal para refeições leves.',
    imageSource: require('../assets/home/vinho2.png'),
  },
  {
    wineName: 'Château Pitron Bordeaux',
    // wineCategory: 'Bordeaux Tinto',
    winePrice: 'R$ 155,00',
    wineSigns: '4.3',
    wineDescription: 'Corpo médio com taninos macios e um final suave.',
    imageSource: require('../assets/home/vinho3.png'),
  },
  {
    wineName: 'Château Margaux Bordeaux',
    // wineCategory: 'Bordeaux Tinto',
    winePrice: 'R$ 2200,00',
    wineSigns: '4.0',
    wineDescription: 'Vinho icônico, de complexidade impressionante e notas florais.',
    imageSource: require('../assets/home/vinho4.png'),
  },
  {
    wineName: 'Borgonha Blanc',
    // wineCategory: 'Borgonha Branco',
    winePrice: 'R$ 328,00',
    wineSigns: '5.0',
    wineDescription: 'Elegante e refrescante, com toques de frutas cítricas.',
    imageSource: require('../assets/home/borgonha_blanc.png'),
  },
  {
    wineName: 'Borgonha Chablis',
    // wineCategory: 'Borgonha Branco',
    winePrice: 'R$ 540,00',
    wineSigns: '4.8',
    wineDescription: 'Mineralidade marcante e acidez vibrante, perfeito para frutos do mar.',
    imageSource: require('../assets/home/borgonha_chablis.png'),
  },
  {
    wineName: 'Tinto Paulo Laureano',
    // wineCategory: 'Tinto Português',
    winePrice: 'R$ 88,00',
    wineSigns: '5.0',
    wineDescription: 'Vinho português com notas de ameixa e especiarias, fácil de beber.',
    imageSource: require('../assets/home/tinto_paulo_laureano.png'),
  },
  {
    wineName: 'Tinto Quinta do Noval',
    // wineCategory: 'Tinto Português',
    winePrice: 'R$ 298,00',
    wineSigns: '4.6',
    wineDescription: 'Complexo e encorpado, com taninos robustos e um final longo.',
    imageSource: require('../assets/home/tinto_quinta_do_noval.png'),
  },
  {
    wineName: 'Zentas Chardonnay',
    // wineCategory: 'Chardonnay',
    winePrice: 'R$ 65,00',
    wineSigns: '5.0',
    wineDescription: 'Leve e frutado, com notas de pêssego e um toque amanteigado.',
    imageSource: require('../assets/home/pasta_zentas_chardonnay.png'),
  },
  {
    wineName: 'Villa Antinori Rosso',
    // wineCategory: 'Rosso Italiano',
    winePrice: 'R$ 270,00',
    wineSigns: '4.9',
    wineDescription: 'Vinho italiano rico, com notas de frutas maduras e um final suave.',
    imageSource: require('../assets/home/villa_antinori_rosso.png'),
  }
];


const Home = () => {
  const [isPressedButton1, setIsPressedButton1] = useState(false);
  const [isPressedButton2, setIsPressedButton2] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const { currentUser, cartItems, updateCartItems } = useUser();
  const [filteredWines, setFilteredWines] = useState(wines);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [cartSuccessMessage, setCartSuccessMessage] = useState('');

  console.log('Cart items:', cartItems);

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

  const addToCart = (wine) => {
    console.log('Adding wine to cart:', wine);
    updateCartItems([...cartItems, wine]);
    setCartSuccessMessage('Produto adicionado ao carrinho com sucesso!'); // Definindo a mensagem de sucesso
    setTimeout(() => {
      setCartSuccessMessage(''); // Limpa a mensagem após alguns segundos
    }, 2000);
  };
  const navigation = useNavigation();

  return (
    
    <View style={styles.container}>
     {cartSuccessMessage && (
        <Text style={styles.successMessage}>{cartSuccessMessage}</Text>
      )}
      <View style={styles.div_saudacao_pesquisar}>
        {currentUser && <Greeting name={currentUser.nome} />}
        <Pesquisar onSearch={handleSearch} />
      </View>

      {/* Filtro */}
      <View style={styles.div_categorias}>
        <Text style={styles.text_categorias}>Categorias</Text>
      </View>

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
              <Image
                source={require('../assets/home/Bordeaux.png')}
                style={styles.image_bordeaux}
              />
              <Text style={styles.text_categorias_v2}>Bordeaux</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePressButton2}
            style={[
              styles.button_categorias,
              isPressedButton2 && styles.buttonPressed,
            ]}>
            <View style={styles.div_categorias_image_text}>
              <Image
                source={require('../assets/home/Borgonha.png')}
                style={styles.image_borgonha}
              />
              <Text style={styles.text_categorias_v2}>Borgonha</Text>
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

      {/* Mosaico de vinhos */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.div_mosaico_vinhos}>
          {filteredWines.length === 0 ? (
            <Text style={styles.noResultsText}>
              Nenhum resultado encontrado
            </Text>
          ) : (
            filteredWines.map((wine, index) => (
              <WineCard key={index} wine={wine} onPressAddToCart={addToCart} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Menu */}
      <Menu />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F6F5F5',
  },

  div_saudacao_pesquisar: {
    alignItems: 'center',
    marginTop: 15,
  },

  div_categorias: {
    marginBottom: 15,
  },

  text_categorias: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D0C57',
    marginLeft: 10,
  },

  div_categorias_opcoes: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },

  button_categorias: {
    width: 130,
    height: 60,
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 25,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#A37BF8',
  },

  div_categorias_image_text: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  text_categorias_v2: {
    color: '#32343E',
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
    marginTop: 20,
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold'
  },
};

export default Home;
