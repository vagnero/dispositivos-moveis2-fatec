import {View, TextInput, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const Pesquisar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    onSearch(searchText);
  };

 return (
    <View style={styles.div_pesquisar}>
      <TouchableOpacity onPress={handleSearch}>
        <Image source={require('../assets/home/search.png')} style={styles.image_pesquisar} />
      </TouchableOpacity>
      <TextInput
        style={styles.textinput_pesquisar}
        placeholder="Pesquisar"
        placeholderTextColor="#fff"
        onChangeText={setSearchText}
        value={searchText}
      />
    </View>
  );
};

const styles = {
  div_pesquisar: {
    width: 320,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 15,
    backgroundColor: 'transparent',
  },

  image_pesquisar: {
    width: 20, 
    height: 20,
    tintColor: '#fff',
    marginHorizontal: 15,
  },

  textinput_pesquisar: {
    flex: 1, 
    paddingVertical: 10,
    color: '#fff',
  }
};

export default Pesquisar;