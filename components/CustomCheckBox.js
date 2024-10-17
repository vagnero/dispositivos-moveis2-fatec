import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomCheckBox = ({ label, value, onChange }) => {

  const styles = StyleSheet.create({
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: '#000',
      marginRight: 8,
    },
    checked: {
      backgroundColor: '#4CAF50',
    },
    label: {
      fontSize: 18,
    },
  });

  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => onChange(!value)}
    >
      <View style={[styles.checkbox, value && styles.checked]} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CustomCheckBox;
