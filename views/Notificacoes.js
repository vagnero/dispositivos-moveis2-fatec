import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Content from '../components/Content';
import { ThemeContext } from '../context/ThemeContext';
import { SwipeRow, SwipeListView } from 'react-native-swipe-list-view';
import { useNotifications } from '../context/NotificationContext';
import { format } from 'date-fns';

const Notificacoes = () => {
    const { colors } = useContext(ThemeContext);
    const { notifications, setNotifications, countUnreadNotifications, markAsRead } = useNotifications();
    const [isModalVisible, setModalVisible] = useState(false); // Controle do modal
    const [selectedNotification, setSelectedNotification] = useState(null);
    // const [notifications, setNotifications] = useState([
    //     {
    //         id: 1,
    //         type: 'order',
    //         title: 'Pedido Confirmado',
    //         message: 'Seu pedido número 12345 foi enviado. Acompanhe a entrega pelo link:',
    //         date: '2023-11-23',
    //         read: false
    //     },
    //     {
    //         id: 2,
    //         type: 'promotion',
    //         title: 'Promoção Relâmpago!',
    //         message: 'Aproveite 50% de desconto em todos os produtos da categoria eletrônicos por 24 horas!',
    //         date: '2023-11-22',
    //         read: false
    //     },
    //     {
    //         id: 3,
    //         type: 'newProduct',
    //         title: 'Novo Produto Disponível!',
    //         message: 'O novo smartphone X20 acaba de chegar! Adquira já o seu.',
    //         image: 'https://suaempresa.com/produtos/x20.jpg',
    //         date: '2023-11-21',
    //         read: false
    //     },
    //     {
    //         id: 4,
    //         type: 'birthday',
    //         title: 'Parabéns!',
    //         message: 'Feliz aniversário! Ganhe 10% de desconto em sua próxima compra.',
    //         date: '2023-11-20',
    //         read: false
    //     },
    //     {
    //         id: 5,
    //         type: 'reminder',
    //         title: 'Avalie sua compra',
    //         message: 'Ajude-nos a melhorar! Avalie sua última compra e ganhe um cupom de desconto.',
    //         link: 'https://suaempresa.com/avaliacao',
    //         date: '2023-11-19',
    //         read: true
    //     },
    //     {
    //         id: 6,
    //         type: 'loyalty',
    //         title: 'Nível de Fidelidade',
    //         message: 'Parabéns! Você atingiu o nível Ouro e agora tem acesso a benefícios exclusivos.',
    //         date: '2023-11-18',
    //         read: true
    //     },
    //     {
    //         id: 7,
    //         type: 'support',
    //         title: 'Sua dúvida foi respondida',
    //         message: 'Enviamos uma resposta para sua pergunta sobre o produto Y. Verifique sua caixa de entrada.',
    //         date: '2023-11-17',
    //         read: true
    //     },
    //     {
    //         id: 8,
    //         type: 'event',
    //         title: 'Evento Especial',
    //         message: 'Participe do nosso evento online no dia 25/11! Inscreva-se agora.',
    //         link: 'https://suaempresa.com/evento',
    //         date: '2023-11-16',
    //         read: true
    //     },
    //     {
    //         id: 9,
    //         type: 'survey',
    //         title: 'Sua Opinião Importa',
    //         message: 'Participe da nossa pesquisa e ajude-nos a melhorar nossos serviços.',
    //         link: 'https://suaempresa.com/pesquisa',
    //         date: '2023-11-15',
    //         read: true
    //     },
    //     {
    //         id: 10,
    //         type: 'referral',
    //         title: 'Indique um Amigo',
    //         message: 'Indique um amigo e ganhe um cupom de R$20 para sua próxima compra.',
    //         link: 'https://suaempresa.com/indicar',
    //         date: '2023-11-14',
    //         read: true
    //     },
    // ]);

    const currentDate = new Date();

    const handleOpenModal = (notification) => {
        handleMarkAsRead(notification.id); // Marca como lida
        setSelectedNotification(notification); // Define a notificação selecionada
        setModalVisible(true); // Abre o modal
    };

    const handleCloseModal = () => {
        setModalVisible(false); // Fecha o modal
        setSelectedNotification(null); // Reseta a notificação
    };

    const handleDelete = (id) => {
        const updatedNotifications = notifications.filter((item) => item.id !== id);
        setNotifications(updatedNotifications);
    };

    const handleMarkAsRead = (id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        );
    };

    const renderItem = ({ item }) => (
        <SwipeRow rightOpenValue={-75}>
            {/* Ações de exclusão */}
            <View style={styles.rowBack}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                >
                    <Text style={styles.deleteText}>Excluir</Text>
                </TouchableOpacity>
            </View>

            {/* Conteúdo principal */}
            <TouchableOpacity
                style={[
                    styles.notificationItem,
                    item.read ? styles.read : styles.unread, // Aplicação correta dos estilos
                ]}
                onPress={() => handleOpenModal(item)}
            >
                <View style={styles.iconContainer}>{getIcon(item.type)}</View>
                <View style={styles.content}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.message}>{item.message}</Text>
                    <Text style={styles.date}>{format(currentDate, 'dd/MM/yyyy')}</Text>
                </View>
                <TouchableOpacity onPress={() => handleMarkAsRead(item.id)}>
                    <MaterialIcons name={item.read ? "done" : "mark-as-unread"} size={24} color="green" />
                </TouchableOpacity>
            </TouchableOpacity>
        </SwipeRow>
    );


    const getIcon = (type) => {
        switch (type) {
            case 'order':
                return <MaterialIcons name="shopping-cart" size={24} color="green" />;
            case 'promotion':
                return <Ionicons name="gift" size={24} color="orange" />;
            case 'newProduct':
                return <MaterialIcons name="new-releases" size={24} color="blue" />;
            case 'birthday':
                return <MaterialIcons name="cake" size={24} color="#f44336" />;
            case 'reminder':
                return <MaterialIcons name="alarm" size={24} color="gray" />;
            case 'loyalty':
                return <MaterialIcons name="star" size={24} color="gold" />;
            case 'support':
                return <MaterialIcons name="help" size={24} color="#2196F3" />;
            case 'event':
                return <MaterialIcons name="event" size={24} color="#9C27B0" />;
            case 'survey':
                return <MaterialIcons name="question-answer" size={24} color="#FFEB3B" />;
            case 'referral':
                return <MaterialIcons name="share" size={24} color="#4CAF50" />;
            default:
                return <MaterialIcons name="notifications" size={24} color="gray" />;
        }
    };

    const renderModalContent = () => {
        if (!selectedNotification) return null;

        return (
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
                <Text style={styles.modalMessage}>{selectedNotification.message}</Text>
                {selectedNotification.link && (
                    <TouchableOpacity onPress={handleCloseModal} style={styles.buttonModal} >
                        <Text style={styles.textButtonModal} >Abrir Link</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleCloseModal} style={styles.buttonModal} >
                    <Text style={styles.textButtonModal} >Fechar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 10,
        },
        rowBack: {
            alignItems: 'center',
            backgroundColor: colors.background,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingRight: 15,
            borderRadius: 10,
            marginBottom: 10,
        },
        notificationItem: {
            flexDirection: 'row',
            padding: 10,
            marginVertical: 5,
            borderRadius: 8,
            backgroundColor: '#fff',
            elevation: 2,
        },
        unread: {
            backgroundColor: colors.itemCardBackground, // Mais escura para lidas
        },
        read: {
            backgroundColor: '#f0f0f0', // Mais clara para não lidas
        },
        deleteButton: {
            backgroundColor: '#ff3b30',
            padding: 10,
            marginRight: -10,
            borderRadius: 5,
        },
        deleteText: {
            color: 'white',
            fontWeight: 'bold',
        },
        iconContainer: {
            marginRight: 10,
        },
        content: {
            flex: 1,
        },
        title: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        message: {
            fontSize: 14,
            color: '#666',
        },
        date: {
            fontSize: 12,
            color: '#999',
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            width: '80%',
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 10,
            alignItems: 'center',
        },
        modalTitle: {
            fontWeight: 'bold',
            fontSize: 18,
            marginBottom: 10,
        },
        modalMessage: {
            fontSize: 16,
            marginBottom: 20,
        },
        buttonModal: {
            backgroundColor: 'blue',
            padding: 5,
            borderRadius: 5,
            marginBottom: 20,
        },
        textButtonModal: {
            color: 'white',
        },
    });

    return (
        <Content>
            <View style={styles.container}>                
                <SwipeListView
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
                <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={handleCloseModal}
                >
                    <View style={styles.modalContainer}>
                        {renderModalContent()}
                    </View>
                </Modal>
            </View>
        </Content>
    );
};

export default Notificacoes;
