import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

function NotificationsIconWithBadge({ unreadCount }) {
    const { colors } = useContext(ThemeContext);

    return (
        <View>
            <Image source={require('../assets/user/sino.png')} style={{ tintColor: colors.iconColor }} />
            {unreadCount > 0 && (
                <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>
                        {unreadCount}
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

export default NotificationsIconWithBadge;
