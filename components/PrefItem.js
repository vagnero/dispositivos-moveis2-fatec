import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const PrefItem = ({ iconSource, text, view, onPressThemeToggle, theme }) => {
  const navigation = useNavigation();
  
  const handlePress = () => {
    if (text === 'Tema') {
      onPressThemeToggle(); // Alterna o tema
    } else {
      navigation.navigate(view);
    }
  };

  return (
    <View style={styles.div_button_pref}>
      <TouchableOpacity style={styles.button_pref} onPress={handlePress}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
          {iconSource}
          <Text style={styles.text_pref}>{text}</Text>
        </View>
        
        {/* Verifica se o item é "Tema" e exibe a barra, caso contrário exibe a seta */}
        {text === 'Tema' ? (
          <TouchableOpacity onPress={onPressThemeToggle} style={styles.themeBarContainer}>
            <View style={[styles.themeBar, theme === 'light' ? styles.themeLight : styles.themeDark]} />
          </TouchableOpacity>
        ) : (
          <Image style={styles.icon_v2_pref} source={require('../assets/user/SETA.png')} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  div_button_pref: {
    width: '100%',
    height: 50,
    marginTop: 12,
    justifyContent: 'center',
  },
  button_pref: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text_pref: {
    fontSize: 16,
    color: '#2D0C57',
    marginLeft: 20,
  },
  icon_v2_pref: {
    width: 6,
    height: 10,
    textAlign: 'right',
    marginRight: 30,
  },
  themeBarContainer: {
    width: 50,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D3D3D3', // Cor da barra "vazia"
    marginHorizontal: 10,
  },
  themeBar: {
    height: '100%',
    borderRadius: 5,
  },
  themeLight: {
    width: '30%', // Proporção da barra "preenchida" no tema claro
    backgroundColor: '#8A2BE2', // Cor roxa para o preenchimento no tema claro
  },
  themeDark: {
    width: '70%', // Proporção da barra "preenchida" no tema escuro
    backgroundColor: '#8A2BE2', // Cor roxa para o preenchimento no tema escuro
  },
};

export default PrefItem;
