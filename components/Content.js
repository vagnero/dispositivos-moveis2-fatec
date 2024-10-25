import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import Menu from '../components/Menu';
import Header from '../components/Header';

const Content = ({ children }) => {
    const { colors } = useContext(ThemeContext);

    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            flex: 1,
        },
        body: {
            flex: 1,
            marginTop: 50, // Altura do header
            marginBottom: 40, // Altura do menu
        },
        header: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
        },
        menu: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />
            </View>
            <View style={styles.body}>
                {children}
            </View>
            <View style={styles.menu}>
                <Menu />
            </View>
        </View>
    );
};

export default Content;


