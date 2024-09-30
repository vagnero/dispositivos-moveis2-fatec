import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../Themes/dark';

const Body = ({ children }) => {
    return (
        <View style={styles.body}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20
      },
});

export default Body;


