import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import Menu from '../components/Menu';
import Header from '../components/Header';

const Content = ({ children }) => {
    const { colors } = useContext(ThemeContext);

    const styles = StyleSheet.create({
        body: {
            flex: 1,
            textAlign: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
        },
    });

    return (
        <View style={styles.body}>
            <Header />
            {children}
            <Menu />
        </View>
    );
};

export default Content;


