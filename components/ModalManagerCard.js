import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import AlertModal from '../components/AlertModal';
import { useUser } from '../context/UserContext';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import CardModal from '../components/CardModal';
import { useFocusEffect } from '@react-navigation/native'; // Importando useRoute
import { ThemeContext } from '../context/ThemeContext';

const ModalManagerCard = ({ modalVisible, setModalVisible, selectedCard, setSelectedCard, onAddCard }) => {
    const [mensagem, setMensagem] = useState('');
    const { currentUser } = useUser();
    const { colors } = useContext(ThemeContext);
    const [cards, setCards] = useState([]);
    const [modalAlertVisible, setModalAlertVisible] = useState(false);
    const [modalCardVisible, setModalCardVisible] = useState(null);

    useFocusEffect(
        useCallback(() => {
            fetchLoadCards();
        }, [fetchLoadCards])
    );

    useEffect(() => {
        if (modalVisible) {
            fetchLoadCards();
        }
    }, [modalVisible]);

    const fetchLoadCards = async () => {
        try {
            const userCardsCollection = collection(db, 'paymentCard'); // Coleção de cartões
            const userCardDocs = await getDocs(userCardsCollection);
            const userCards = [];

            userCardDocs.forEach(doc => {
                if (doc.id.startsWith(`${currentUser.nome}_`)) {
                    userCards.push({ id: doc.id, ...doc.data() }); // Adiciona cartões ao array
                }
            });

            if (userCards.length > 0) {
                setCards(userCards); // Atualiza o estado com todos os cartões
            } else {
                console.log('Nenhum cartão encontrado.');
            }
        } catch (error) {
            console.error('Erro ao buscar cartões:', error);
        }
    };

    const handleDeleteCard = async (id) => {
        try {
            await deleteDoc(doc(db, 'paymentCard', id)); // Deleta o endereço com o id correto
            setMensagem('Cartão excluído com sucesso!'); // Mensagem de sucesso
            setModalAlertVisible(true); // Mostra modal de sucesso
            setCards((prevCards) => prevCards.filter(card => card.id !== id));
            fetchLoadCards(); // Atualiza a lista de endereços
        } catch (error) {
            console.error('Erro ao excluir cartão')
            setMensagem('Não foi possível excluir o Cartão.'); // Mensagem de sucesso
            setModalAlertVisible(true); // Mostra modal de sucesso
        }
    };

    const handleAddCard = () => {
        fetchLoadCards(); // Atualiza a lista de cartões
    };

    const handleCloseModalManagerCard = () => {
        setModalVisible(false)
        onAddCard();
    };

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            marginTop: 20,
            justifyContent: 'center',
        },
        content: {
            width: 350,
            height: 150,
            padding: 20,
            marginTop: 5,
            backgroundColor: '#fff',
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 5,
        },
        contentEndereco: {
            width: 350,
            maxHeight: 150,
            padding: 20,
            marginTop: 5,
            backgroundColor: '#fff',
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 5,
        },
        contentTotal: {
            width: 350,
            maxHeight: 150,
            padding: 20,
            marginTop: 5,
            backgroundColor: '#fff',
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 5,
        },
        contentButtons: {
            width: 350,
            height: '25%',
            padding: 20,
            marginTop: 5,
            backgroundColor: '#fff',
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 5,
        },
        titlePaymentMethod: {
            fontSize: 24,
            textAlign: 'center',
            fontWeight: 'bold',
            marginTop: 20,
            color: colors.secondary,
        },
        title: {
            fontSize: 24,
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'black',
        },
        address: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
            padding: 2,
            paddingLeft: 20,
            borderRadius: 15,
            color: 'white',
            backgroundColor: '#2196F3',
        },
        buttomConfirm: {
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            padding: 10,
            backgroundColor: '#2ecc71',
        },
        textConfirm: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
        },
        closeButton: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 48,
            borderRadius: 5,
            backgroundColor: '#e74c3c',
            marginTop: 10,
        },
        noCardsText: {
            color: 'black',
        },
        confirmCard: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 48,
            borderRadius: 5,
            backgroundColor: '#2196F3',
            marginTop: 10,
        },
        closeButtonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
        },
        loading: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonAddress: {
            marginBottom: 20,
        },
        textButtonAddress: {
            fontSize: 20,
            textAlign: 'center',
        },
        buttonEditar: {
            marginBottom: 10,
        },
        textButtonEditar: {
            textAlign: 'center',
            fontSize: 20,
        },
        modalContainer: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            textAlign: 'center',
            backgroundColor: 'white',
            width: 350,
            borderRadius: 10,
            padding: 20,
            margin: 'auto',
            marginTop: 250,
        },
        deleteButton: {
            width: 100,
            backgroundColor: 'red',
            marginBottom: 20,
            padding: 10,
            borderRadius: 5,
        },
        deleteText: {
            color: 'white',
            textAlign: 'center',
        },
    });

    const renderCardItem = ({ item }) => (
        <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
                onPress={() => {
                    setSelectedCard(item.cardNumber); // Armazena os últimos dígitos
                    setModalVisible(false); // Fecha o modal após a seleção do cartão
                    onAddCard();
                }}
                style={styles.buttonAddress}
            >
                {cards.length > 0 && (<Text style={styles.textButtonAddress}>
                    **** **** **** {item.cardNumber.slice(-4)} {/* Exibe apenas os últimos 4 dígitos */}
                </Text>)}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteCard(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>Deletar</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.modalContainer}>
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {cards.length > 0 ? (
                            <FlatList
                                data={cards}
                                keyExtractor={(item) => item.id}
                                renderItem={renderCardItem}
                            />
                        ) : (
                            <Text style={styles.noCardsText}>Não há cartões cadastrados.</Text>
                        )}
                        <TouchableOpacity onPress={() => { setModalCardVisible(true) }} style={styles.confirmCard}>
                            <Text style={styles.closeButtonText}>Adicionar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(false);
                            onAddCard();
                        }} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <AlertModal
                visible={modalAlertVisible}
                message={mensagem}
                onClose={() => {setModalAlertVisible(false)}}
            />
            <CardModal
                modalVisible={modalCardVisible}
                setModalVisible={setModalCardVisible}
                onAddCard={handleAddCard}
            />
        </View>
    );
};

export default ModalManagerCard;