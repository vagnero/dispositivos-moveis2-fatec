import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { doc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; // Importa sua configuração do Firebase
import { ThemeContext } from '../context/ThemeContext';
import Content from '../components/Content';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import AlertModal from '../components/AlertModal';

const ManagerAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const { colors } = useContext(ThemeContext);
    const navigation = useNavigation();
    const [visibleAddresses, setVisibleAddresses] = useState({});
    const { currentUser } = useUser() || {};
    const [modalVisible, setModalVisible] = useState(false);
    const [mensagem, setMensagem] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            fetchAddresses();
            return () => { };
        }, [])
    );

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        if (!currentUser) {
            console.log('Usuário não autenticado.');
            return;
        }

        try {
            const addressCollection = collection(db, 'addresses');
            const addressSnapshot = await getDocs(addressCollection);

            // Filtra os endereços para incluir apenas os do currentUser
            const addressList = addressSnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(address => address.id.startsWith(currentUser.nome)); // Filtra pelo nome do usuário

            setAddresses(addressList);
        } catch (error) {
            console.error('Erro ao buscar endereços:', error);
        }
    };

    const handleDeleteAddress = async (recipientName, zipCode) => {
        // Gera o id baseado no nome do usuário e nos dados do endereço
        const id = `${currentUser.nome}-${recipientName}-${zipCode}`;
        console.log('ID para deletar:', id);

        try {
            await deleteDoc(doc(db, 'addresses', id)); // Deleta o endereço com o id correto
            setMensagem('Endereço excluído com sucesso!'); // Mensagem de sucesso
            setModalVisible(true); // Mostra modal de sucesso
            fetchAddresses(); // Atualiza a lista de endereços
        } catch (error) {
            console.error('Erro ao excluir endereço:', error); // Log do erro
            setMensagem('Não foi possível excluir o endereço.'); // Mensagem de sucesso
            setModalVisible(true); // Mostra modal de sucesso
        }
    };

    const toggleVisibility = (addressId) => {
        setVisibleAddresses((prevState) => ({
            ...prevState,
            [addressId]: !prevState[addressId], // Inverte a visibilidade do item
        }));
    };

    const handleCloseModal = () => {
        setMensagem('');
        setModalVisible(false);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: colors.background,
            padding: 20,
        },
        title: {
            fontSize: 25,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20,
            color: colors.textColor,
        },
        text: {
            fontSize: 15,
            fontWeight: 'bold',
            marginBottom: 20,
            color: colors.text,
        },
        addressList: {
            width: '100%',
            borderRadius: 10,
            padding: 10,
            backgroundColor: colors.card,
        },
        textAddress: {
            color: colors.text,
        },
        textButtonAddress: {
            color: 'black',
        },
        buttonAddress: {
            marginVertical: 10,
            padding: 10,
            borderRadius: 5,
            backgroundColor: colors.itemCardBackground,
        },
        detailsContainer: {
            color: colors.text,
        },
        deleteButton: {
            width: 100,
            backgroundColor: 'red',
            marginVertical: 20,
            padding: 10,
            borderRadius: 5,
        },
        deleteText: {
            color: 'white',
            textAlign: 'center',
        },
        newAddress: {
            flexDirection: 'row',
            marginTop: 30
        },
        textNewAddress: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#5B5B5E',
            marginRight: 5
        },
    });

    const renderAddressItem = ({ item }) => (
        <View>
            <TouchableOpacity onPress={() => toggleVisibility(item.id)} style={styles.buttonAddress}>
                <Text style={styles.textButtonAddress}>{item.recipientName}</Text>
            </TouchableOpacity>
            {visibleAddresses[item.id] && (
                <View style={styles.detailsContainer}>
                    <Text style={styles.textAddress} >Rua: {item.street}</Text>
                    <Text style={styles.textAddress} >Bairro: {item.neighborhood}</Text>
                    <Text style={styles.textAddress} >Número: {item.number}</Text>
                    <Text style={styles.textAddress} >Cidade: {item.city}</Text>
                    <Text style={styles.textAddress} >Estado: {item.state}</Text>
                    <Text style={styles.textAddress} >CEP: {item.zipCode}</Text>
                    <Text style={styles.textAddress} >Complemento: {item.complement}</Text>
                    <TouchableOpacity onPress={() => handleDeleteAddress(item.recipientName, item.zipCode)} style={styles.deleteButton}>
                        <Text style={styles.deleteText}>Deletar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <Content>
            <View style={styles.container}>
                <Text style={styles.title}>Gerenciar Endereços</Text>
                <View style={styles.addressList}>
                    <Text style={styles.text}>Endereços Salvos</Text>
                    {addresses.length === 0 ? ( // Verifica se não há endereços
                        <Text>Não há endereços salvos.</Text> // Mensagem informativa
                    ) : (
                        <FlatList
                            data={addresses}
                            keyExtractor={(item) => item.id}
                            renderItem={renderAddressItem} // Passa a função corretamente aqui
                        />
                    )}
                </View>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('AddressRegistrationScreen')} style={styles.newAddress}>
                        <Text style={styles.textNewAddress}>Incluir Novo Endereço</Text>
                    </TouchableOpacity>
                </View>
                <AlertModal
                    visible={modalVisible}
                    message={mensagem}
                    onClose={handleCloseModal}
                />
            </View>
        </Content>
    );
};

export default ManagerAddress;
