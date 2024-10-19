import React, { useContext, useCallback, useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import Comentario from '../components/Comentario';
import { ThemeContext } from '../context/ThemeContext';
import Content from '../components/Content';
import { db } from '../config/firebaseConfig'; // Certifique-se de que o caminho para o seu arquivo firebase está correto
import { collection, getDocs } from 'firebase/firestore';

const Avaliacoes = () => {
  const { colors } = useContext(ThemeContext);
  const [comments, setComments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [showFullText, setShowFullText] = useState({});
  const [refreshing, setRefreshing] = useState(false); // Controle do refresh
  const [loading, setLoading] = useState(true);
  const [avaliacoes, setAvaliacoes] = useState([

  
    { nome: 'Audrey', rate: 4, data: '25/08/2024', texto: 'Minha experiência com o app foi incrível! A navegação é super intuitiva e rápida, com categorias bem organizadas e sugestões personalizadas. Encontrei facilmente um vinho robusto com notas de frutas vermelhas e toque de especiarias, perfeito para harmonizar com carnes e queijos. O processo de compra foi simples e seguro, e recebi atualizações do pedido em tempo real. Com certeza, voltarei a usar o app para futuras compras!' },
    { nome: 'José Leandro', rate: 4, data: '22/08/2024', texto: 'Fresco e vibrante, com aromas de maçã verde e limão. Perfeito para uma tarde de verão ou para acompanhar pratos leves como saladas e frutos do mar.' },
    { nome: 'Vagner', rate: 4, data: '01/08/2024', texto: 'Um rosé elegante, com sabor suave de morango e um final refrescante. Ideal para um brunch ou para uma tarde relaxante com amigos.' },
    { nome: 'Wesley Paulo', rate: 4, data: '20/06/2024', texto: 'Bolhas finas e persistentes com um sabor refrescante de pêssego e maçã. Uma escolha excelente para celebrações e ocasiões especiais.' },
    { nome: 'Aldo Rosa', rate: 4, data: '20/05/2024', texto: 'Encorpado e complexo, com notas de cereja preta e baunilha. Um vinho sofisticado que envelhece bem e é perfeito para jantares formais.' },
    { nome: 'João', rate: 4, data: '05/05/2024', texto: 'Leve e agradável, com toques de pêra e mel. Bom para aperitivos e pratos de peixe, mas pode faltar um pouco de corpo para quem prefere vinhos mais robustos.' },
    { nome: 'Luis', rate: 4, data: '12/04/2024', texto: 'Um vinho leve e refrescante com notas de framboesa e melancia. Perfeito para um dia quente, mas pode ser um pouco simples para paladares mais exigentes.' },
    { nome: 'Maria', rate: 4, data: '10/02/2024', texto: 'Aromas intensos de ameixa e tabaco, com um paladar rico e bem equilibrado. Excelente para acompanhar pratos de carne e massas com molhos robustos.' },
  ]);

  const formatDate = (date) => {
    if (date instanceof Date) {
      const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if necessary
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return ''; // Return an empty string if not a valid date
  };

  const fetchComments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'comments'));

      const fetchedComments = querySnapshot.docs.map((doc) => {
        const dados = doc.data();
        let data = dados.date;
      if (data && data.toDate) {
        data = data.toDate();
      } else if (!(data instanceof Date)) {
        data = new Date(data);
      }
      return {
        id: doc.id,
        nome: dados.name,
        rate: dados.rating,
        texto: dados.comment,
        data: data // Converte Timestamp para Date
        }
      });

      // Ordena os comentários por data/hora decrescente
      const sortedComments = fetchedComments.sort((a, b) =>
        b.data.getTime() - a.data.getTime()
      );

      setComments(sortedComments); // Atualiza o estado com os comentários 
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    } finally {
      setLoading(false); // Finaliza o carregamento
      setRefreshing(false); // Finaliza o refresh
    }
  };

  // Função chamada ao puxar para baixo
  const onRefresh = useCallback(() => {
    setRefreshing(true); // Inicia o indicador de refresh
    fetchComments().then(() => setRefreshing(false)); // Finaliza o refresh
  }, []);

  useEffect(() => {
    fetchComments();
  }, []);

  const allAvaliacoes = [...comments, ...avaliacoes]

  const loadMoreComments = () => {
    setVisibleCount(prevCount => prevCount + 5);
  };

  const toggleShowFullText = (index) => {
    setShowFullText(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const displayedAvaliacoes = allAvaliacoes.slice(0, visibleCount);

  const styles = {
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: colors.background,
    },
    headerText: {
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.primary,
    },
    link: {
      color: '#007BFF',
      marginBottom: '20%',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    link2: {
      color: '#003BFF',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  };

  return (
    <Content>
      {loading ? ( // Exibe indicador de carregamento inicial
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      ) : (
        <View style={styles.container}>
          <Text style={styles.headerText}>Avaliações</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {displayedAvaliacoes.map((item, index) => (
              <View key={item.id || index}>
                <Comentario
                  nome={item.nome}
                  rate={item.rate}
                  data={formatDate(item.data)}
                  texto={
                    showFullText[index]
                      ? item.texto
                      : item.texto.length > 150
                        ? `${item.texto.substring(0, 150)}...`
                        : item.texto
                  }
                />
                {item.texto.length > 150 && (
                  <TouchableOpacity onPress={() => toggleShowFullText(index)}>
                    <Text style={styles.link2}>
                      {showFullText[index] ? 'Mostrar menos' : 'Mostrar mais'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {visibleCount < allAvaliacoes.length && (
              <TouchableOpacity onPress={loadMoreComments}>
                <Text style={styles.link}>Mostrar mais</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}
    </Content>
  );
};

export default Avaliacoes;
