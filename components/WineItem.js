import { View, Text, Image, TouchableOpacity } from 'react-native';

const WineItem = ({ imageSource, wineName, price, ml }) => {

  return (
    <View style={styles.div_vinho}>
      <Image source={imageSource} style={styles.image_vinho}/>
      <View style={styles.div_infos}>
        <Text style={styles.text_vinho}>{wineName}</Text>
        <View style={styles.div_preco_tamanho}>
          <Text style={styles.text_preco}>{price}</Text>
          <Text style={styles.text_tamanho}>{ml}</Text>
        </View>
        <View style={styles.div_buttons}>
          <TouchableOpacity style={styles.button_favorite}>
            <Image source={require('../assets/bordeaux/heart.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button_carrinho}>
            <Image source={require('../assets/bordeaux/shopping-cart-v2.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = {
  div_vinho: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: '5%'
  },

  image_vinho: {
    width: '30%',
    height: '100%',
    borderRadius: 10
  },

  div_infos: {
    width: '100%',
    marginLeft: '5%'
  },
  
  text_vinho: {
    fontSize: 17, 
    color: '#2D0C57', 
    fontWeight: 'bold', 
    width: '40%'
  },

  div_preco_tamanho: {
    flex: 1, 
    flexDirection: 'row', 
    marginTop: '2%'
  },

  text_preco: {
    fontSize: 20, 
    color: '#2D0C57'
  },

  text_tamanho: {
    fontSize: 14, 
    color: '#9586A8', 
    marginLeft: '5%'
  },

  div_buttons: {
    flexDirection: 'row'
  },

  button_favorite: {
    width: 70, 
    height: 40, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#D9D0E3', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  
  button_carrinho: {
    width: 70, 
    height: 40, 
    backgroundColor: '#6C30EB', 
    marginLeft: '1%', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
};

export default WineItem;