import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PrefItem = ({ iconSource, text, view }) => {

  const navigation = useNavigation();

  return (
    <View style={styles.div_button_pref}>
      <TouchableOpacity style={styles.button_pref} onPress={() => navigation.navigate(view)}>
        <Image style={styles.icon_pref} source={iconSource}/>
        <Text style={styles.text_pref}>{text}</Text>
        <Image style={styles.icon_v2_pref} source={require('../assets/user/SETA.png')}/>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  div_button_pref: {
    width: '100%',
    height: '6%',
    marginTop: 12,
    justifyContent: 'center'
  },

  button_pref: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  icon_pref: {
    marginLeft: 30
  },

  text_pref: {
    fontSize: 16,
    color: '#2D0C57'
  },

  icon_v2_pref: {
    width: 6,
    height: 10,
    marginRight: 30
  },
};

export default PrefItem;