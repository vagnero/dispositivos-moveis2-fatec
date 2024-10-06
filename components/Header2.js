import React, { useState, useEffect, useContext } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import Greeting from './Greeting';
import Pesquisar from './Pesquisar';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
    const { theme, toggleTheme, colors } = useContext(ThemeContext);
    const { currentUser } = useUser();
    const navigation = useNavigation();

    const styles = StyleSheet.create({
        header: {
            width: '100%',
            backgroundColor: colors.background,
            // borderBottomLeftRadius: 10,
            // borderBottomRightRadius: 10,
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
    });

    return (
        <View>
            <LinearGradient
                colors={[colors.bottomHeaderGradient, colors.topHeaderGradient]}
                style={styles.header}
                start={{ x: 0, y: 0 }} // Início do degradê (cima)
                end={{ x: 0, y: 1 }} // Fim do degradê (baixo)
            >
                <View style={styles.div_saudacao_pesquisar}>
                    <View style={{ flexDirection: 'row' }}>                        
                        <Greeting name={''}/>
                        <View style={{ marginLeft: 80, flexDirection: 'row', justifyContent: 'space-between', width: 50 }}>
                            
                        </View>
                        <TouchableOpacity onPress={toggleTheme}>
                            {theme === 'light' ? (
                                <FontAwesome name="moon-o" size={30} style={styles.icon} /> // Ícone da lua
                            ) : (
                                <FontAwesome name="sun-o" size={30} style={styles.icon} /> // Ícone do sol
                            )}
                        </TouchableOpacity>
                    </View>
                    {/* <Pesquisar onSearch={handleSearch} /> */}
                </View>
            </LinearGradient>
        </View>
    );
};

export default Header;


