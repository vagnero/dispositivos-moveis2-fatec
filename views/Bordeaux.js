import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import Menu from '../components/Menu';
import Pesquisar from '../components/Pesquisar';
import WineItem from '../components/WineItem';

const bordeauxWines = [
  {
    wineName: 'Les Légends Bordeaux Rouge',
    winePrice: 'R$ 260,00',
    wineSigns: '4.5',
    wineDescription: 'Descrição do vinho 1...',
    imageSource: require('../assets/bordeaux/vinho1.png'),
  },
  {
    wineName: 'Cazauvielho Bordeaux',
    winePrice: 'R$ 109,00',
    wineSigns: '5.0',
    wineDescription: 'Descrição do vinho 2...',
    imageSource: require('../assets/bordeaux/vinho2.png'),
  },
  {
    wineName: 'Château Pitron Bordeaux',
    winePrice: 'R$ 155',
    wineSigns: '4.3',
    wineDescription: 'Descrição do vinho 3...',
    imageSource: require('../assets/bordeaux/vinho3.png'),
  },
  {
    wineName: 'Château Margaux Bordeaux',
    winePrice: 'R$ 2200',
    wineSigns: '4.0',
    wineDescription: 'Descrição do vinho 4...',
    imageSource: require('../assets/bordeaux/vinho4.png'),
  },
];

const Bordeaux = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredWines, setFilteredWines] = useState(bordeauxWines);

  useEffect(() => {
    const filtered = bordeauxWines.filter((wine) => 
      wine.wineName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredWines(filtered);
  }, [searchText]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.div_bordeaux}>
        <Text style={styles.text_bordeaux}>Bordeaux</Text>
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
                imageSource={wine.imageSource}
                wineName={wine.wineName}
                price={wine.winePrice}
                ml="750ml"
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
    backgroundColor: '#F6F5F5',
  },
  div_bordeaux: {
    marginBottom: 15,
  },
  text_bordeaux: {
    marginTop: 15,
    fontSize: 34,
    fontWeight: 'bold',
    color: '#2D0C57',
  },
  container_vinhos: {
    marginBottom: 50,
  },
  noResultsText: {
    fontSize: 18,
    color: '#2D0C57',
    textAlign: 'center',
    marginTop: 20,
  },
};

export default Bordeaux;
