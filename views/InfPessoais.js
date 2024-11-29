import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useUser } from '../context/UserContext';
import dbContext from '../context/dbContext';
import { ThemeContext } from '../context/ThemeContext';


const InfPessoais = () => {
  const { currentUser, setCurrentUser } = useUser();
  const [nickname, setNickname] = useState('');
  const { colors } = useContext(ThemeContext);

  useEffect(() => {
    // Sincroniza o nickname local com o contexto global ao montar o componente
    if (currentUser?.nick) {
      setNickname(currentUser.nick);
    }
  }, [currentUser]);

 const handleSaveNickname = async () => {
  if (!nickname) {
    Alert.alert('Erro', 'O apelido não pode ser vazio.');
    return;
  }

  try {
    // Atualiza o apelido no banco de dados
    await dbContext.updateItem('users', currentUser.email, { nick: nickname }, { merge: true });
    console.log('Apelido atualizado no banco com sucesso.');

    // Atualiza o contexto global
    setCurrentUser((prev) => ({ ...prev, nick: nickname }));
    console.log('Contexto global atualizado.');

    // Exibe mensagem de sucesso
    Alert.alert('Sucesso', 'Apelido alterado com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar o apelido:', error);
    Alert.alert('Erro', 'Ocorreu um erro ao salvar o apelido.');
  }
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
            width: "80%",
            height: 50,
            backgroundColor: "white",
            borderRadius: 10,
            borderColor: "#D9D0E3",
            borderWidth: 1,
            paddingLeft: 10,
            marginTop: 20
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
          inputReadOnly: {
       width: "80%",
            height: 50,
            backgroundColor: '#F0F0F0',
            borderRadius: 10,
            borderColor: "#D9D0E3",
            borderWidth: 1,
            paddingLeft: 10,
            color: '#A9A9A9', // Cor de texto para parecer desabilitado
            marginTop: 20

    },
    });

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Informações Pessoais</Text>
      {/* Campo Nome do Usuário */}
      <TextInput
        style={styles.inputReadOnly}
        value={currentUser?.nome || 'Nome não disponível'}
        editable={false} // Somente leitura
      />
      {/* Campo Email */}
      <TextInput
        style={styles.inputReadOnly}
        value={currentUser?.email || 'Email não disponível'}
        editable={false} // Somente leitura
      />
      {/* Campo Nickname */}
      <TextInput
        style={styles.textInput}
        placeholder="Digite o novo apelido"
        value={nickname}
        onChangeText={setNickname}
      />
      <TouchableOpacity style={styles.button} onPress={handleSaveNickname}>
        <Text>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InfPessoais;
