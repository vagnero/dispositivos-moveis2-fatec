import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Content from '../components/Content';
import { ThemeContext } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import CustomCheckBox from '../components/CustomCheckBox';
import { useNavigation } from '@react-navigation/native';

const Payment = () => {
  const [isBoleto, setIsBoleto] = useState(false);
  const [isCard, setIsCard] = useState(false);
  const [isPix, setIsPix] = useState(false);
  const { colors } = useContext(ThemeContext);
  const { currentUser, setCurrentUser } = useUser();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: colors.textColor,
    },
    choosePayment: {
      justifyContent: 'center',
      marginTop: 200,
    },
  });

  return (
    <Content>
      <View style={styles.container}>
        <Text style={styles.title}>Escolha a forma de pagamento</Text>
        <View style={styles.choosePayment}>

          <CustomCheckBox
            label="Boleto"
            value={isBoleto}
            onChange={(newValue) => setIsBoleto(newValue)}
          />

          <CustomCheckBox
            label="Cartão de Crédito"
            value={isCard}
            onChange={(newValue) => setIsCard(newValue)}
          />
          <CustomCheckBox
            label="Pix"
            value={isPix}
            onChange={(newValue) => setIsPix(newValue)}
          />
        </View>
      </View>
    </Content>
  );
};

export default Payment;
