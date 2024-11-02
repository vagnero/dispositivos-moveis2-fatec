import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import dbContext from '../context/dbContext';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import AlertModal from '../components/AlertModal';

const ItemCard = ({ item, onPressAddToCart, onToggleFavorite }) => {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);
  const [soldCount, setSoldCount] = useState(0);
  const [modalAlertVisible, setModalAlertVisible] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const { currentUser } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsArray = dbContext.data.items;
        const storedItem = itemsArray.find(i => i.itemName === item.itemName);
        setSoldCount(storedItem ? storedItem.itemSold : 0);
      } catch (error) {
        console.error('Erro ao carregar items do Firestore:', error);
      }
    };

    const checkIfFavorite = async () => {
      if (!currentUser || !currentUser.nome) return;

      const itemId = `${item.itemName}_${currentUser.nome}`;
      const favoriteItems = dbContext.getAll('favoriteItems');
      const isFav = favoriteItems.some(fav => fav.id === itemId);
      setIsFavorite(isFav);
    };

    fetchItems();
    checkIfFavorite();
  }, [item.itemName, currentUser]);

  const toggleHeart = async () => {
    if (!currentUser || !currentUser.nome) {
      setMensagem('Para favoritar é necessário estar logado');
      setModalAlertVisible(true);
      return;
    }

    if (isFavorite) {
      await removeFavoriteItem(item.itemName);
      setIsFavorite(false); // Atualiza o estado local
    } else {
      await saveFavoriteItem(item);
      setIsFavorite(true); // Atualiza o estado local
    }

    onToggleFavorite(item); // Chama a função para atualizar a lista de favoritos no componente pai
  };

  const saveFavoriteItem = async (item) => {
    if (!currentUser || !currentUser.nome) return;

    const favoriteItem = {
      itemName: item.itemName,
      id: `${item.itemName}_${currentUser.nome}`,
    };

    try {
      await dbContext.addItem('favoriteItems', favoriteItem);
      console.log('Item favorito salvo:', favoriteItem);
    } catch (error) {
      console.error('Erro ao salvar item favorito:', error);
    }
  };

  const removeFavoriteItem = async (itemName) => {
    if (!currentUser || !currentUser.nome) return;

    try {
      const itemId = `${itemName}_${currentUser.nome}`;
      await dbContext.removeItem('favoriteItems', itemId);
      console.log('Item removido dos favoritos:', itemName);
    } catch (error) {
      console.error('Erro ao remover item favorito:', error);
    }
  };

  const handleAddToCart = () => {
    onPressAddToCart({ ...item, imageSource: item.imageSource, quantity: 1 });
  };

  const styles = {
    div_item: {
      width: 150,
      height: 210,
      backgroundColor: colors.itemCardBackground,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginLeft: 15,
      marginRight: 5,
      marginTop: 5,
      marginBottom: 10,
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
    div_image_text_item: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    div_image_item: {
      width: 50,
      height: 120,
      marginRight: 10,
    },
    div_text_item: {
      width: '90%',
      textAlign: 'center',
      fontSize: 15,
      color: '#2D0C57',
      fontWeight: 'bold',
      marginTop: 10,
      marginHorizontal: 1,
    },
    div_text_button_item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },
    div_text_preco: {
      fontSize: 16,
      color: '#32343E',
      fontWeight: 'bold',
    },
    addButton: {
      marginLeft: 10,
    },
  };
return (
  <View style={styles.div_item}>
    <Text style={styles.div_text_item} onPress={() => navigation.navigate('Sobre', item)}>
      {item.itemName}
    </Text>
    <TouchableOpacity onPress={() => navigation.navigate('Sobre', item)}>
      <View style={styles.div_image_text_item}>
        <Image source={item.imageSource} style={styles.div_image_item} />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ marginBottom: 5, marginRight: 12, }}>Nota: {item.itemSigns}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={toggleHeart}>
              <FontAwesome
                name={isFavorite ? 'heart' : 'heart-o'}
                size={20}
                color="red"
              />
            </TouchableOpacity>
            <Image 
              source={require('../assets/info/signs.png')}               
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
    <View style={styles.div_text_button_item}>
      <Text style={styles.div_text_preco}>{item.itemPrice}</Text>
      <TouchableOpacity onPress={handleAddToCart} style={styles.addButton}>
        <Image source={require('../assets/carrinho/plus.png')} style={{ marginBottom: 10 }} />
      </TouchableOpacity>
    </View>
    <AlertModal
      visible={modalAlertVisible}
      message={mensagem}
      onClose={() => setModalAlertVisible(false)}
    />
  </View>
);
}

export default ItemCard;
