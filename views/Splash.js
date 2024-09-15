import React from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';

const Splash = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Os Melhores Vinhos!</Text>
      <Image
        source={require('../assets/splash.png')} // Coloque a imagem de splash aqui
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  logo: {
    marginTop: 100,
    width: 200,
    height: 250,
    marginBottom: 100,
  },
});

export default Splash;
