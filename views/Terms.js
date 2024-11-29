import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Terms = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Termos de Serviços</Text>
        <Text style={styles.headerSubtitle}>
          Última atualização em nov 2024
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Termos de Serviço</Text>
        <Text style={styles.paragraph}>
          Ao utilizar o aplicativo, você concorda com nossos *Termos e
          Condições*. O app oferece uma plataforma para a compra e entrega de
          vinhos selecionados, exclusivamente para maiores de 18 anos. As
          compras estão sujeitas à disponibilidade e conformidade com as leis
          locais de comercialização de bebidas alcoólicas.
        </Text>

        <Text style={styles.sectionTitle}>Política de Privacidade</Text>
        <Text style={styles.paragraph}>
          Nós levamos sua privacidade a sério. Coletamos informações pessoais,
          como nome, endereço e dados de pagamento, para processar pedidos e
          garantir uma entrega eficiente. Seus dados são armazenados de forma
          segura e nunca serão compartilhados com terceiros, exceto quando
          necessário para cumprir a lei ou processar transações. O uso do app
          implica o consentimento para a coleta e uso das informações descritas
          nesta política. Você pode solicitar a exclusão ou alteração de seus
          dados a qualquer momento.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.denyButton]}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Negar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => navigation.navigate('Cadastrar')}>
          <Text style={styles.buttonText}>Aceitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1B22',
  },
  header: {
    padding: 16,
    backgroundColor: '#1C1B22',
  },
  backButton: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 16,
  },
  paragraph: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  denyButton: {
    backgroundColor: '#2B2730',
  },
  acceptButton: {
    backgroundColor: '#8338EC',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Terms;
