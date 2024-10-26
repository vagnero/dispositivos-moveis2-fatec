import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Text, View, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Content from '../components/Content';

const Categorias = () => {
  const { colors } = useContext(ThemeContext);
  const navigation = useNavigation();

  const styles = {
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background
    },
    div_categorias: {
      marginBottom: 15
    },
    text_categorias: {
      marginTop: 15,
      fontSize: 34,
      fontWeight: 'bold',
      color: colors.textColor,
    },
    div_mosaico_items: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 50
    },
    div_item: {
      width: 150,
      height: 215,
      backgroundColor: colors.itemCardBackground,
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderRadius: 10,
      marginBottom: 20
    },
    div_image_text_item: {
      alignItems: 'center'
    },
    div_image_item: {
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
      color: colors.secondary,
      marginTop: 5
    }
  };

  return (
    <Content>
      <View style={styles.container}>
        {/* Categoria */}
        <View style={styles.div_categorias}>
          <Text style={styles.text_categorias}>Categorias</Text>
        </View>
        {/* Mosaico */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.div_mosaico_items}>
            <View style={styles.div_item}>
              <TouchableOpacity onPress={() => navigation.navigate('Branco')}>
                <View style={styles.div_image_text_item}>
                  <Image source={require('../assets/categorias/branco.jpg')} style={styles.div_image_item} />
                  <Text style={styles.div_text_subtitle}>Branco</Text>
                  <Text style={styles.div_text_count}>(4)</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Card Borgonha (Duplicado) */}
            <View style={styles.div_item}>
              <TouchableOpacity onPress={() => navigation.navigate('Rose')}>
                <View style={styles.div_image_text_item}>
                  <Image source={require('../assets/categorias/rose.jpg')} style={styles.div_image_item} />
                  <Text style={styles.div_text_subtitle}>Rosé</Text>
                  <Text style={styles.div_text_count}>(2)</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Card Tinto (Duplicado) */}
            <View style={styles.div_item}>
              <TouchableOpacity onPress={() => navigation.navigate('Tinto')}>
                <View style={styles.div_image_text_item}>
                  <Image source={require('../assets/categorias/tinto.png')} style={styles.div_image_item} />
                  <Text style={styles.div_text_subtitle}>Tinto</Text>
                  <Text style={styles.div_text_count}>(2)</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Card Pasta (Adicionado) */}
            <View style={styles.div_item}>
              <TouchableOpacity onPress={() => navigation.navigate('Espumante')}>
                <View style={styles.div_image_text_item}>
                  <Image source={require('../assets/categorias/espumante.png')} style={styles.div_image_item} />
                  <Text style={styles.div_text_subtitle}>Espumante</Text>
                  <Text style={styles.div_text_count}>(2)</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Content>
  );
};

export default Categorias;
