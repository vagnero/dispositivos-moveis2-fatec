import React, { useContext } from 'react';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import Greeting from '../components/Greeting';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../context/UserContext';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import NotificationsIconWithBadge from './NotificationsIconWithBadge';
import { useNotifications } from '../context/NotificationContext';

const Header = () => {
    const { theme, toggleTheme, colors } = useContext(ThemeContext);
    const { currentUser } = useUser();
    const navigation = useNavigation();
    const { countUnreadNotifications } = useNotifications();
    const unreadCount = countUnreadNotifications();

    const styles = StyleSheet.create({
        content: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
        },
        header: {
            width: '100%',
            backgroundColor: colors.background,
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
        <View style={styles.content}>
            <LinearGradient
                colors={[colors.bottomHeaderGradient, colors.topHeaderGradient]}
                style={styles.header}
                start={{ x: 0, y: 0 }} // Início do degradê (cima)
                end={{ x: 0, y: 1 }} // Fim do degradê (baixo)
            >
                <View style={styles.div_saudacao_pesquisar}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '65%' }}>
                            <Greeting name={currentUser ? (currentUser.nick || currentUser.nome) : ""} />
                        </View>
                        <View style={{ marginLeft: 8, flexDirection: 'row', justifyContent: 'space-between', width: 50 }}>
                            <TouchableOpacity onPress={() => navigation.navigate('Favoritos')}>
                                <Image
                                    source={require('../assets/info/heart.png')}
                                    style={{ tintColor: colors.iconColor }}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('Notificacoes')}>
                                <NotificationsIconWithBadge unreadCount={unreadCount} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={toggleTheme}>
                            {theme === 'light' ? (
                                <FontAwesome name="moon-o" size={30} style={styles.icon} /> // Ícone da lua
                            ) : (
                                <FontAwesome name="sun-o" size={30} style={styles.icon} /> // Ícone do sol
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

export default Header;


