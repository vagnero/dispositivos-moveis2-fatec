import React, { useContext } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Content from '../components/Content'; // Certifique-se de que Content não está limitando o layout
import { ThemeContext } from '../context/ThemeContext';

const Notificacoes = () => {
    const { colors } = useContext(ThemeContext);

    const styles = StyleSheet.create({
        container: {
            marginTop: 20,
            marginBottom: 20,
            flex: 1, // Garante que o container ocupe toda a altura disponível
        },
        content: {
            padding: 10, // Adiciona um espaçamento ao conteúdo
        },
        card: {
            width: '100%', // Faz com que os cards ocupem toda a largura
            marginBottom: 10,
            backgroundColor: colors.wineCardBackground,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20, // Espaçamento dentro do card
        },
        msg: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.textColor,
            textAlign: 'center',
        },
    });

    return (
        <Content>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}
                    style={{ flex: 1, marginBottom: 50 }}>
                    {Array.from({ length: 20 }).map((_, index) => (
                        <TouchableOpacity key={index} style={styles.card}>
                            <Text style={styles.msg}>Cupom de Desconto {index + 1}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </Content>
    );
};

export default Notificacoes;
