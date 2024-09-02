import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Menu = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.div_menu}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image source={require('../assets/home/grid.png')}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Carrinho')}>
        <Image source={require('../assets/home/shopping-cart.png')}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('User')}>
        <Image source={require('../assets/home/user.png')}/>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  div_menu: {
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: '#F6F5F5',
    borderWidth: 1,
    borderColor: '#D9D0E3'
  }
}

export default Menu;