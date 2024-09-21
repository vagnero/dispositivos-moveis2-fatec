import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import Menu from '../components/Menu';
import Pesquisar from '../components/Pesquisar';
import WineItem from '../components/WineItem';

const tintoWines = [
  {
    wineName: 'Tinto Paulo Laureano',
    winePrice: 'R$ 88,00',
    imageSource: require('../assets/home/tinto_paulo_laureano.png'),
    ml: '750ml',
  },
  {
    wineName: 'Tinto Quinta do Noval',
    winePrice: 'R$ 298,00',
    imageSource: require('../assets/home/tinto_quinta_do_noval.png'),
    ml: '750ml',
  },
];

const Tinto = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredWines, setFilteredWines] = useState(tintoWines);

  useEffect(() => {
    const filtered = tintoWines.filter((wine) =>
      wine.wineName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredWines(filtered);
  }, [searchText]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.div_tinto}>
        <Text style={styles.text_tinto}>Tinto</Text>
      </View>

      {/* Barra de pesquisar */}
      <Pesquisar onSearch={handleSearch} />

      {/* Vinhos */}
      <ScrollView vertical showsVerticalScrollIndicator={false}>
        <View style={styles.container_vinhos}>
          {filteredWines.length === 0 ? (
            <Text style={styles.noResultsText}>Nenhum resultado encontrado</Text>
          ) : (
            filteredWines.map((wine, index) => (
              <WineItem
                key={index}
                wineName={wine.wineName}
                imageSource={wine.imageSource}
                price={wine.winePrice}
                ml={wine.ml}
              />
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
    backgroundColor: '#F6F5F5'
  },

  div_tinto: {
    marginBottom: 15
  },

  text_tinto: {
    marginTop: 15,
    fontSize: 34,
    fontWeight: 'bold',
    color: '#2D0C57'
  },

  container_vinhos: {
    marginBottom: 50
  },
  noResultsText: {
    fontSize: 18,
    color: '#2D0C57',
    textAlign: 'center',
    marginTop: 20,
  },
};

export default Tinto;
