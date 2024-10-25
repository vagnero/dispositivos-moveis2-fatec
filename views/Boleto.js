import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importando useRoute
import Content from '../components/Content'; // Importando useRoute


const Boleto = ({ route }) => {
    const navigation = useNavigation();
    const { total } = route.params;

    // Obtendo a data atual
    const dataAtual = new Date();

    // Calculando a data de vencimento (72 horas a partir da data atual)
    const dataVencimento = new Date(dataAtual);
    dataVencimento.setHours(dataVencimento.getHours() + 72);

    // Formatando as datas
    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('pt-BR', options).replace(/\//g, '/');
    };

    const gerarNumeroBoleto = () => {
        return Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    };

    const gerarLinhaDigitavel = (numero) => {
        const codigoBanco = '12345'; // Exemplo de código do banco
        const parte1 = numero.substring(0, 5);
        const parte2 = numero.substring(5, 10);
        const parte3 = numero.substring(10, 15);
        const dv = '3'; // Dígito verificador fixo para o exemplo

        return `${codigoBanco}${parte1} ${parte2} ${parte3} ${dv} ${Math.floor(Math.random() * 1000000000)}`;
    };

    const numeroBoleto = gerarNumeroBoleto();
    const linhaDigitavel = gerarLinhaDigitavel(numeroBoleto);

    const boletoData = {
        numero: numeroBoleto,
        dataVencimento: formatDate(dataVencimento),
        valor: `R$ ${total.toFixed(2)}`,
        banco: 'Banco do Brasil',
        linhaDigitavel: linhaDigitavel,
    };

    const handlePrint = () => {
        // Lógica para imprimir ou compartilhar o boleto
        alert('Função de imprimir ainda não implementada!');
    };

    const handleSave = () => {
        // Lógica para imprimir ou compartilhar o boleto
        alert('Função de Salvar ainda não implementada!');
    };

    return (
        <Content>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Boleto Bancário</Text>
                <View style={styles.boletoContainer}>
                    <Text style={styles.label}>Banco:</Text>
                    <Text style={styles.info}>{boletoData.banco}</Text>

                    <Text style={styles.label}>Número do Boleto:</Text>
                    <Text style={styles.info}>{boletoData.numero}</Text>

                    <Text style={styles.label}>Data de Vencimento:</Text>
                    <Text style={styles.info}>{boletoData.dataVencimento}</Text>

                    <Text style={styles.label}>Valor:</Text>
                    <Text style={styles.info}>{boletoData.valor}</Text>

                    <Text style={styles.label}>Linha Digitável:</Text>
                    <Text style={styles.info}>{boletoData.linhaDigitavel}</Text>
                </View>

                <Button title="Imprimir Boleto" onPress={handlePrint} />
                <View style={{ marginTop: 20 }}>
                    <Button title="Salvar Boleto" onPress={handleSave} />
                </View>
                <View style={{ marginTop: 20 }}>
                    <Button title="Avaliar Sistema" onPress={() => {navigation.navigate('AvaliacaoFinal')}} />
                </View>
            </ScrollView>
        </Content>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
    },
    boletoContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    info: {
        fontSize: 16,
        marginBottom: 15,
    },
});

export default Boleto;
