import React from 'react';
import { View, Text, StyleSheet, Button, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importando useRoute
import Content from '../components/Content'

const PixPayment = ({ route }) => {
    const { total } = route.params;
    const navigation = useNavigation();

    // Exemplo de chave PIX (pode ser um email, telefone ou CPF)
    const chavePix = 'app@email.com'; // Substitua pela chave do seu PIX

    // Gerando o link de pagamento PIX
    const gerarLinkPix = () => {
        const valor = total.toFixed(2).replace('.', ','); // Formatação para o padrão brasileiro
        const descricao = 'Pagamento pelo e-commerce';
        const linkPix = `pix:${chavePix}?amount=${valor}&description=${descricao}`;

        return linkPix;
    };

    const handlePayPix = async () => {
        // Abrindo o link para o aplicativo de pagamento    
        alert('Erro ao abrir o link de pagamento. Verifique se você tem um aplicativo de pagamento instalado.');
    };

    return (
        <Content>
            <View style={styles.container}>
                <Text style={styles.title}>Pagamento via PIX</Text>
                <Text style={styles.info}>Valor a pagar: R$ {total.toFixed(2)}</Text>
                <Text style={styles.info}>Chave PIX: {chavePix}</Text>

                <Button title="Pagar com PIX" onPress={handlePayPix} />
                <View style={{ marginTop: 20 }}>
                    <Button title="Avaliar Sistema" onPress={() => {navigation.navigate('AvaliacaoFinal')}} />
                </View>
            </View>
        </Content>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    info: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default PixPayment;
