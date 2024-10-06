import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const Content = ({ children }) => {
    const { colors } = useContext(ThemeContext);

    const styles = StyleSheet.create({
        body: {
            flex: 1,
            height: '100%',
            backgroundColor: colors.background,
        },
        icons: {
            flexDirection: 'row',
        },

        icon: {
            color: colors.iconColor,
            fontSize: 24, // Tamanho do ícone
        },
    });

    return (
        <View style={styles.body}>
            {children}
        </View>
    );
};

export default Content;


