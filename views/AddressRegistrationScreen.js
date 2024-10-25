import React, { useState, useContext } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; // Importa sua configuração do Firebase
import Content from '../components/Content';
import { ThemeContext } from '../context/ThemeContext';
import { TouchableOpacity } from 'react-native';
import { useUser } from '../context/UserContext';
import AlertModal from '../components/AlertModal';
import { useNavigation } from '@react-navigation/native';

const AddressRegistrationScreen = () => {
    const [recipientName, setRecipientName] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const { colors } = useContext(ThemeContext);
    const { currentUser } = useUser() || {};
    const [modalVisible, setModalVisible] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const navigation = useNavigation();

    const handleSaveAddress = async () => {
        if (!recipientName || !street || !number || !neighborhood || !city || !state || !zipCode) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        const newAddress = {
            recipientName,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
            zipCode,
        };

        try {
            // Chama a função para registrar o endereço no Firestore
            await registerAddress(newAddress);
            setMensagem('Endereço registrado com sucesso!'); // Mensagem de sucesso
            setModalVisible(true); // Mostra modal de sucesso
            // Limpa os campos após salvar
            setRecipientName('');
            setStreet('');
            setNumber('');
            setComplement('');
            setNeighborhood('');
            setCity('');
            setState('');
            setZipCode('');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível registrar o endereço.');
        }
    };

    const registerAddress = async (address) => {
        const newAddress = { ...address }; // Cria um novo endereço

        try {
            // Cria um documento no Firestore com um ID único baseado no nome do destinatário e no CEP
            const addressId = `${currentUser.nome}-${newAddress.recipientName}-${newAddress.zipCode}`;
            await setDoc(doc(db, 'addresses', addressId), newAddress);

            console.log('Endereço registrado com sucesso no Firestore.');
        } catch (error) {
            console.error('Erro ao registrar endereço no Firestore:', error);
        }
    };
// Buscador de CEP
    const fetchAddressData = async (cep) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (data.erro) {
                Alert.alert('Erro', 'CEP não encontrado.');
                return;
            }

            // Preenche os campos do formulário com os dados retornados
            setStreet(data.logradouro);
            setNeighborhood(data.bairro);
            setCity(data.localidade);
            setState(data.uf);
        } catch (error) {
            console.error('Erro ao buscar dados do endereço:', error);
            Alert.alert('Erro', 'Não foi possível buscar os dados do endereço.');
        }
    };

    const handleZipCodeChange = (value) => {
        setZipCode(value);
        if (value.length === 8) { // Verifica se o CEP tem 8 caracteres
            fetchAddressData(value);
        }
    };

    const handleCloseModal = () => {
        setMensagem('');
        setModalVisible(false);
        navigation.navigate('ManagerAddress');
    };

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            height: '100%',
            alignItems: 'center',
            backgroundColor: colors.background,
        },
        title: {
            fontSize: 25,
            fontWeight: 'bold',
            textAlign: 'center',
            marginLeft: 33,
            marginBottom: 10,
            color: colors.textColor,
        },
        inputContainer: {
            width: "80%",
            marginBottom: 10
        },
        label: {
            marginBottom: 5,
            fontSize: 14,
            color: colors.textColor,
        },
        textInput: {
            width: "100%",
            height: 50,
            backgroundColor: "white",
            borderRadius: 10,
            borderColor: "#D9D0E3",
            borderWidth: 1,
            paddingLeft: 10
        },
        button: {
            width: 240,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.button,
            borderRadius: 30,
            marginTop: 10,
            marginBottom: 20,
          },
    });

    return (
        <Content>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                style={{ flex: 1, marginBottom: 50 }}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Registrar um endereço</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nome do Destinatário</Text>
                        <TextInput
                            placeholder="Ex: Casa, Trabalho, etc..."
                            value={recipientName}
                            onChangeText={setRecipientName}
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>CEP</Text>
                        <TextInput
                            placeholder="CEP"
                            value={zipCode}
                            onChangeText={handleZipCodeChange}
                            keyboardType="numeric"
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Rua</Text>
                        <TextInput
                            placeholder="Rua"
                            value={street}
                            onChangeText={setStreet}
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Número</Text>
                        <TextInput
                            placeholder="Número"
                            value={number}
                            onChangeText={setNumber}
                            keyboardType="numeric"
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Complemento</Text>
                        <TextInput
                            placeholder="Complemento"
                            value={complement}
                            onChangeText={setComplement}
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Bairro</Text>
                        <TextInput
                            placeholder="Bairro"
                            value={neighborhood}
                            onChangeText={setNeighborhood}
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Cidade</Text>
                        <TextInput
                            placeholder="Cidade"
                            value={city}
                            onChangeText={setCity}
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Estado</Text>
                        <TextInput
                            placeholder="Estado"
                            value={state}
                            onChangeText={setState}
                            style={styles.textInput}
                        />
                    </View>
                    <TouchableOpacity onPress={handleSaveAddress} style={styles.button} >
                        <Text>Salvar Endereço</Text>
                    </TouchableOpacity>
                </View>
                <AlertModal
                    visible={modalVisible}
                    message={mensagem}
                    onClose={handleCloseModal}
                />
            </ScrollView>
        </Content>
    );
};

export default AddressRegistrationScreen;
