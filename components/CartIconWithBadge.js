import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUser } from '../context/UserContext'; // ajuste o caminho conforme necessário
import { FontAwesome } from 'react-native-vector-icons';
import { useRoute } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';

function CartIconWithBadge() {
    const { cartItems } = useUser();
    const cartItemCount = cartItems.length;
    const route = useRoute();
    const { colors } = useContext(ThemeContext);

    const getIconColor = (routeName) => {
        return route.name === routeName ? 'blue' : colors.iconColor; // Troque 'blue' pela cor desejada para a rota ativa
    };

    return (
        <View>
            <FontAwesome name="shopping-cart" size={24} color={getIconColor('Carrinho')} />
            {cartItemCount > 0 && (
                <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>
                        {cartItemCount}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    badgeContainer: {
        position: 'absolute',
        right: -6,
        top: -7,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 15,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default CartIconWithBadge;
