import { Text, View, Image, TouchableOpacity } from 'react-native';

const ItemCarrinho = ({ wineName, price, imageSource, quantity, removeFromCart, updateCartItems, cartItems, calculateTotal }) => {

  const handleAddQuantity = () => {
  console.log('Adicionando quantidade para:', wineName);
  updateCartItems(cartItems.map((item) => {
    if (item.wineName === wineName) {
      const newQuantity = item.quantity + 1;
      console.log(`Nova quantidade ${wineName}: ${newQuantity}`);
      return { ...item, quantity: newQuantity };
    }
    return item;
  }));
  calculateTotal(); // Recalcula o total
};

const handleRemoveQuantity = () => {
  if (quantity > 1) {
    console.log('Removendo quantidade:', wineName);
    updateCartItems(cartItems.map((item) => {
      if (item.wineName === wineName) {
        const newQuantity = item.quantity - 1;
        console.log(`Nova quantidade ${wineName}: ${newQuantity}`);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
    calculateTotal(); // Recalcula o total
  }
};


  const handleRemoveFromCart = () => {
    console.log('Removendo item do carrinho:', wineName);
    removeFromCart(wineName);
    calculateTotal(); // Recalcula o total
  };

  return (
    <View style={styles.div_vinho}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.div_winename_x}>
          <Text style={styles.text_winename}>{wineName}</Text>
          <TouchableOpacity onPress={handleRemoveFromCart}>
            <Image source={require('../assets/carrinho/x.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.div_price_buttons}>
          <Text style={styles.text_price}>{price}</Text>
          <View style={styles.div_buttons}>
            <TouchableOpacity onPress={handleRemoveQuantity}>
              <Image source={require('../assets/carrinho/menos.png')} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity onPress={handleAddQuantity}>
              <Image source={require('../assets/carrinho/plus.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = {
  div_vinho: {
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 10
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  div_winename_x: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  text_winename: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000'
  },
  icon: {
    width: 20,
    height: 21
  },
  div_price_buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  text_price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#311753'
  },
  div_buttons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  }
};

export default ItemCarrinho;
