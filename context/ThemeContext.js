// ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Temas from '../components/Temas'; // Ajuste o caminho conforme necessário

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await SecureStore.getItemAsync('theme'); 
                setTheme(savedTheme || 'dark');
            } catch (error) {

            }
        };
        loadTheme();
    }, []);
    
    const toggleTheme = async () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        try {            
            await SecureStore.setItemAsync('theme', newTheme); // Usando SecureStore
        } catch (error) {
            
        }
    };

    const colors = theme === 'light' ? Temas.light : Temas.dark;
    const statusBarColor = theme === 'light' ? '#2D0C57' : '#BA22FB';
    const barStyle = 'light';

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            <StatusBar backgroundColor={statusBarColor} barStyle={barStyle} />
            {children}
        </ThemeContext.Provider>
    );
};
