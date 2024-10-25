import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import Content from '../components/Content';
import Items from '../components/Items';
import { ThemeContext } from '../context/ThemeContext';

const HistoricoCompra = () => {
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { currentUser } = useUser() || {};
    const { colors } = useContext(ThemeContext);
    const [visibleItems, setVisibleItems] = useState({});

    const fetchPurchaseHistory = async () => {
        try {
            if (!currentUser?.nome) {
                throw new Error("Usuário não encontrado");
            }

            const q = query(
                collection(db, 'purchaseHistory'),
                where('userId', '==', currentUser.nome) // Filtra pelo usuário atual
            );

            const querySnapshot = await getDocs(q);
            const purchases = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPurchaseHistory(purchases);
        } catch (error) {
            console.error('Erro ao buscar histórico de compras:', error);
            Alert.alert('Erro', 'Não foi possível carregar o histórico de compras.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchaseHistory();
    }, []);

    // Função para buscar a imagem do item
    const getItemImage = (itemName) => {
        const item = Items.find((item) => item.itemName === itemName);
        return item ? item.imageSource : null; // Retorna a imagem ou null se não encontrar
    };

    const sortedPurchases = purchaseHistory.sort((a, b) => {
        return b.timestamp.toMillis() - a.timestamp.toMillis(); // Ordena por timestamp decrescente
    });

    const groupedPurchases = purchaseHistory.reduce((acc, purchase) => {
        const dateKey = purchase.timestamp.toDate().toISOString();
        const displayDate = purchase.timestamp.toDate().toLocaleDateString('pt-BR');
        if (!acc[dateKey]) {
            acc[dateKey] = {
                id: dateKey,
                date: displayDate,
                totalAmount: purchase.totalAmount,
                items: purchase.items,
                paymentMethod: purchase.paymentMethod,
                status: purchase.status,
                address: purchase.address,
                visible: false, // Estado para controlar a visibilidade dos itens
            };
        } else {
            acc[dateKey].totalAmount += purchase.totalAmount;
            acc[dateKey].items.push(...purchase.items); // Adiciona os itens ao grupo existente
        }
        return acc;
    }, {});

    // Converte o objeto em um array
    const groupedPurchasesArray = Object.values(groupedPurchases);
    
    const renderItem = ({ item }) => {
        const toggleVisibility = () => {
            setVisibleItems(prevState => ({
                ...prevState,
                [item.id]: !prevState[item.id] // Inverte a visibilidade do item
            }));
        };
        return (
            <View style={styles.purchaseItem}>
                <TouchableOpacity onPress={toggleVisibility}>
                    <Text style={styles.dateText}>
                        Data: {item.date}
                    </Text>
                    <Text style={styles.totalText}>
                        Total: R$ {item.totalAmount.toFixed(2)}
                    </Text>
                </TouchableOpacity>
                {visibleItems[item.id] && (
                    <View>
                        <Text style={styles.totalText}>
                            Forma de Pagamento: {item.paymentMethod}
                        </Text>
                        <Text style={styles.totalText}>
                            Status: {item.status}
                        </Text>
                        <Text style={styles.totalText}>
                            Endereço: {item.address}
                        </Text>
                        <Text style={styles.itemsTitle}>Itens:</Text>
                        {item.items.map((product, index) => {
                            const imageSource = getItemImage(product.itemName); // Busca a imagem usando o nome do item
                            return (
                                <View key={`${item.id}-${product.itemName}-${index}`} style={styles.itemContainer}>
                                    {imageSource && ( // Verifica se a imagem existe
                                        <Image
                                            source={imageSource} // Usa a imagem encontrada
                                            style={styles.productImage}
                                            resizeMode="contain"
                                        />
                                    )}
                                    <View>
                                        <Text style={styles.itemText}>
                                            {product.itemName}
                                        </Text>
                                        <Text style={{ marginTop: 10 }}>
                                            Quantidade: {product.quantity}
                                        </Text>
                                        <Text style={{ marginTop: 10 }}>
                                            {product.itemPrice}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: loading ? '#f5f5f5' : colors.background,
            padding: 16,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 6,
            textAlign: 'center',
            color: colors.textColor,
        },
        purchaseItem: {
            margin: 10,
            padding: 10,
            backgroundColor: colors.itemCardBackground,
            borderRadius: 15,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
        },
        itemContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 5,
        },
        productImage: {
            width: 100,
            height: 100,
            marginLeft: -25,
        },
        dateText: {
            fontSize: 14,
        },
        totalText: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        itemsTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            marginTop: 10,
        },
        itemText: {
            fontSize: 14,
        },
        noPurchaseText: {
            fontSize: 16,
            textAlign: 'center',
            marginTop: 20,
        },
        loading: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    if (loading) {
        return <ActivityIndicator size="large" color="#311753" style={styles.loading} />;
    }

    return (
        <Content>
            <View style={styles.container}>
                <Text style={styles.title}>Histórico de Compras</Text>
                {purchaseHistory.length === 0 ? (
                    <Text style={styles.noPurchaseText}>Nenhuma compra realizada ainda.</Text>
                ) : (
                    <FlatList
                        data={groupedPurchasesArray}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${item.id}-${index}`} // Chave única para cada item
                    />
                )}
            </View>
        </Content>
    );
}

export default HistoricoCompra;