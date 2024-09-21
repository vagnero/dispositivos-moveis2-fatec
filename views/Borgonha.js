import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import Menu from '../components/Menu';
import Pesquisar from '../components/Pesquisar';
import WineItem from '../components/WineItem';

const borgonhaWines = [
  {
    wineName: 'Borgonha Blanc',
    winePrice: 'R$ 328,00',
    imageSource: require('../assets/home/borgonha_blanc.png'),
    ml: '750ml',
  },
  {
    wineName: 'Borgonha Chablis',
    winePrice: 'R$ 540,00',
    imageSource: require('../assets/home/borgonha_chablis.png'),
    ml: '750ml',
  },
];

const Borgonha = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredWines, setFilteredWines] = useState(borgonhaWines);

  useEffect(() => {
    const filtered = borgonhaWines.filter((wine) =>
      wine.wineName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredWines(filtered);
  }, [searchText]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.div_borgonha}>
        <Text style={styles.text_borgonha}>Borgonha</Text>
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

  div_borgonha: {
    marginBottom: 15
  },

  text_borgonha: {
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

export default Borgonha;
