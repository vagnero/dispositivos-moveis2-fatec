import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import {View, TextInput, Image, TouchableOpacity } from 'react-native';

const Pesquisar = ({ onSearch }) => {
  const { colors } = useContext(ThemeContext);
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    onSearch(searchText);
  };

  const styles = {
    div_pesquisar: {
      width: 320,
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
    textinput_pesquisar: {
      flex: 1, 
      paddingVertical: 5,
      color: colors.search,
    }
  };

 return (
    <View style={styles.div_pesquisar}>
      <TouchableOpacity onPress={handleSearch}>
        <Image source={require('../assets/info/search.png')} style={styles.image_pesquisar} />
      </TouchableOpacity>
      <TextInput
        style={styles.textinput_pesquisar}
        placeholder="Pesquisar"
        placeholderTextColor= {colors.search}
        onChangeText={setSearchText}
        value={searchText}
      />
    </View>
  );
};

export default Pesquisar;