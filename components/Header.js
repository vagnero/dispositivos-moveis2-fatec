import React, { useContext } from 'react';
import { Image, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Greeting from '../components/Greeting';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../context/UserContext';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import NotificationsIconWithBadge from './NotificationsIconWithBadge';
import { useNotifications } from '../context/NotificationContext';

const Header = () => {
    const { colors } = useContext(ThemeContext);
    const { currentUser } = useUser();
    const navigation = useNavigation();
    const route = useRoute();
    const { countUnreadNotifications } = useNotifications();
    const unreadCount = countUnreadNotifications();

    const isHomeScreen = route.name === 'Home';

const titles = {
    Carrinho: 'Carrinho',
    'Perfil do Usuario': 'Meu Perfil',
    'Método de Pagamento': 'Pagamento',
    Login: ' ', // Título vazio para Login
    Cadastrar: ' ',
};

    const currentTitle = titles[route.name] || route.name;

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
            minHeight: 100,
            justifyContent: 'center',
            alignItems: 'center',
        },
        div_saudacao_pesquisar: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '90%',
            justifyContent: 'space-between',
            marginTop: 60,
        },
    title: {
        flex: 1,
        textAlign: 'center',
        //marginRight: 100, // Ajuste este valor para mover o título mais para a direita
        fontSize: 20,
        color: 'white', // Cor branca
    },
     backButton: {
        padding: 10,
        marginRight: 80, // Aumente este valor para aumentar o espaço à direita da seta
    },
    });

    return (
        <View style={styles.content}>
            <LinearGradient
                colors={[colors.bottomHeaderGradient, colors.topHeaderGradient]}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <View style={styles.div_saudacao_pesquisar}>
                    {!isHomeScreen && (
                        <>
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <FontAwesome name="arrow-left" size={24} color={colors.iconColor} />
                            </TouchableOpacity>
                            <Text style={styles.title}>{currentTitle}</Text>
                        </>
                    )}
                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                        {isHomeScreen && (
                            <Greeting name={currentUser ? (currentUser.nick || currentUser.nome) : ""} />
                        )}
                    </View>
                    {isHomeScreen && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                    )}
                </View>
            </LinearGradient>
        </View>
    );
};

export default Header;
