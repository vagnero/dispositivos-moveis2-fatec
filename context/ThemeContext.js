// ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Temas from '../components/Temas'; // Ajuste o caminho conforme necessário
import Header from '../components/Header';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('theme');
            setTheme(savedTheme || 'dark');
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        await AsyncStorage.setItem('theme', newTheme);
    };

    const colors = theme === 'light' ? Temas.light : Temas.dark;
    const statusBarColor = theme === 'light' ? '#2D0C57' : '#BA22FB';
    const barStyle = 'light';

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            <StatusBar backgroundColor={statusBarColor} barStyle={barStyle} />
            {/* <Header /> */}
            {children}
        </ThemeContext.Provider>
    );
};
