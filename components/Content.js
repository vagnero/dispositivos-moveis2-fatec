import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../Themes/dark';

const Content = ({ children }) => {
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
      },
});

export default Content;


