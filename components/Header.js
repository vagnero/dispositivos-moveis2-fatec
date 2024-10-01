import React, { useState, useEffect, useContext } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import Greeting from '../components/Greeting';
import Pesquisar from '../components/Pesquisar';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../views/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';

const Header = () => {
    const { theme, toggleTheme, colors } = useContext(ThemeContext);
    const [cartSuccessMessage, setCartSuccessMessage] = useState('');
    const { currentUser, cartItems, updateCartItems } = useUser();

    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('theme');
            setTheme(savedTheme || 'dark');
        };
        loadTheme();
    }, []);

    const handleSearch = (text) => {
        setSearchText(text);
    };

    const addToCart = (wine) => {
        console.log('Adding wine to cart:', wine);
        updateCartItems([...cartItems, wine]);
        setCartSuccessMessage('Produto adicionado ao carrinho com sucesso!'); // Definindo a mensagem de sucesso
        setTimeout(() => {
            setCartSuccessMessage(''); // Limpa a mensagem após alguns segundos
        }, 2000);
    };

    const styles = StyleSheet.create({
        header: {
            with: '100%',
            backgroundColor: colors.background,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
        },

        div_saudacao_pesquisar: {
            alignItems: 'center',
            marginTop: 15,
        },

        icon: {
            color: colors.iconColor,
            fontSize: 24, // Tamanho do ícone
            marginLeft: 30,
        },

        successMessage: {
            marginTop: 20,
            fontSize: 14,
            color: 'green',
            fontWeight: 'bold',
        }
    });

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
                            <Image source={require('../assets/info/heart.png')} style={{ tintColor: colors.iconColor }} />
                            <Image source={require('../assets/user/sino.png')} style={{ tintColor: colors.iconColor }} />
                        </View>
                            <TouchableOpacity onPress={toggleTheme}>
                                {theme === 'light' ? (
                                    <FontAwesome name="moon-o" size={30} style={styles.icon} /> // Ícone da lua
                                ) : (
                                    <FontAwesome name="sun-o" size={30} style={styles.icon} /> // Ícone do sol
                                )}
                            </TouchableOpacity>
                    </View>
                    <Pesquisar onSearch={handleSearch} />
                </View>
            </LinearGradient>
        </View>
    );
};

export default Header;


