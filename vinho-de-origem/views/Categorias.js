import { Text, View, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Menu from '../components/Menu';

const Categorias = () => {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Categoria */}
      <View style={styles.div_categorias}>
        <Text style={styles.text_categorias}>Categorias</Text>
      </View>

      {/* Mosaico */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.div_mosaico_vinhos}>
          {/* Card Bordeaux */}
          <View style={styles.div_vinho}>
            <TouchableOpacity onPress={() => navigation.navigate('Bordeaux')}>
              <View style={styles.div_image_text_vinho}>
                <Image source={require('../assets/categorias/bordeaux-QUADRADO.png')} style={styles.div_image_vinho}/>
                <Text style={styles.div_text_subtitle}>Bordeaux</Text>
                <Text style={styles.div_text_count}>(4)</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Card Borgonha (Duplicado) */}
          <View style={styles.div_vinho}>
            <TouchableOpacity onPress={() => navigation.navigate('Borgonha')}>
              <View style={styles.div_image_text_vinho}>
                <Image source={require('../assets/categorias/borgonha-QUADRADO.png')} style={styles.div_image_vinho}/>
                <Text style={styles.div_text_subtitle}>Borgonha</Text>
                <Text style={styles.div_text_count}>(2)</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Card Tinto (Duplicado) */}
          <View style={styles.div_vinho}>
            <TouchableOpacity onPress={() => navigation.navigate('Tinto')}>
              <View style={styles.div_image_text_vinho }>
                <Image source={require('../assets/categorias/tinto-QUADRADO.png')} style={styles.div_image_vinho}/>
                <Text style={styles.div_text_subtitle}>Tinto</Text>
                <Text style={styles.div_text_count}>(2)</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Card Pasta (Adicionado) */}
          <View style={styles.div_vinho}>
            <TouchableOpacity onPress={() => navigation.navigate('Pasta')}>
              <View style={styles.div_image_text_vinho}>
                <Image source={require('../assets/categorias/pasta-QUADRADO.png')} style={styles.div_image_vinho}/>
                <Text style={styles.div_text_subtitle}>Pasta</Text>
                <Text style={styles.div_text_count}>(2)</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Menu */}
      <Menu/>

    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F6F5F5'
  },

  div_pesquisar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D9D0E3',
    borderRadius: 27,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF'
  },

  image_pesquisar: {
    width: 20,
    height: 20,
    marginRight: 10
  },

  textinput_pesquisar: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 15 : 10,
    color: '#9586A8'
  },

  div_categorias: {
    marginBottom: 15
  },

  text_categorias: {
    marginTop: 15,
    fontSize: 34,
    fontWeight: 'bold',
    color: '#2D0C57'
  },

  div_mosaico_vinhos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 50
  },

  div_vinho: {
    width: 150,
    height: 215, 
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 10,
    marginBottom: 20
  },

  div_image_text_vinho: {
    alignItems: 'center'
  },

  div_image_vinho: {
    width: 150,
    height: 140,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginBottom: 5,
    alignItems: 'flex-start'
  },

  div_text_subtitle: {
    fontSize: 15,
    color: '#2D0C57',
    fontWeight: 'bold',
    marginTop: 10
  },

  div_text_count: {
    fontSize: 12,
    color: '#9586A8',
    marginTop: 5
  }
};

export default Categorias;
