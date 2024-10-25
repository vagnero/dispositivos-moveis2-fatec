import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import AlertModal from '../components/AlertModal';
import { useUser } from '../context/UserContext';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
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

    const styles = StyleSheet.create({
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
        buttonAddress: {
            marginBottom: 20,
        },
        textButtonAddress: {
            fontSize: 20,
            textAlign: 'center',
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