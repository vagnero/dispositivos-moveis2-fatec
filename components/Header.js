import React, { useState, useEffect } from 'react';
import { Text, Image, View, StyleSheet } from 'react-native';
import colors from '../Themes/dark';
import Greeting from '../components/Greeting';
import Pesquisar from '../components/Pesquisar';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../views/UserContext';

const Header = () => {
    const [cartSuccessMessage, setCartSuccessMessage] = useState('');
    const { currentUser, cartItems, updateCartItems } = useUser();

    const handleSearch = (text) => {
        setSearchText(text);
      };

    return (
        <View>
            <LinearGradient
                colors={[colors.bottomHeaderGradient, colors.topHeaderGradient]}
                style={styles.header}
                start={{ x: 0, y: 0 }} // Início do degradê (cima)
                end={{ x: 0, y: 1 }} // Fim do degradê (baixo)
            >

                {cartSuccessMessage && (
                    <Text style={styles.successMessage}>{cartSuccessMessage}</Text>
                )}
                <View style={styles.div_saudacao_pesquisar}>
                    <View style={{ flexDirection: 'row' }}>
                        {currentUser && <Greeting name={currentUser.nome} />}
                        <View style={{ marginLeft: 80, flexDirection: 'row', justifyContent: 'space-between', width: 50 }}>
                            <Image source={require('../assets/info/heart.png')} style={{ tintColor: '#fff' }} />
                            <Image source={require('../assets/user/sino.png')} style={{ tintColor: '#fff' }} />
                        </View>
                    </View>
                    <Pesquisar onSearch={handleSearch} />
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        with: '100%',
        backgroundColor: '#BA22FB',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },

    div_saudacao_pesquisar: {
        alignItems: 'center',
        marginTop: 15,
    },

    successMessage: {
        marginTop: 20,
        fontSize: 14,
        color: 'green',
        fontWeight: 'bold',
      }
});

export default Header;


