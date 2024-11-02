import React, { useState, useContext } from 'react';
import { ScrollView, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import HeaderUnlogged from '../components/HeaderUnlogged';
import MenuUnlogged from '../components/MenuUnlogged';
import { ThemeContext } from '../context/ThemeContext';
import AlertModal from '../components/AlertModal';
import dbContext from '../context/dbContext';
import Content from '../components/Content';


const Cadastrar = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nick, setNick] = useState('');
  const [mensagemErro, setMensagemErro] = useState(''); // Estado para armazenar a mensagem de erro
  const [mensagemSucesso, setMensagemSucesso] = useState(''); // Estado para armazenar a mensagem de sucesso
  const [mensagemModal, setMensagemModal] = useState('');
  const navigation = useNavigation();
  const { registerUser } = useUser();
  const { colors } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);

  const formatValue = (value) => {
    return value.toLowerCase()
      .replace(/( de | da | do | das | dos )/g, (match) => match.toLowerCase())
      .replace(/\b(?!de |da |do |das |dos )\w/g, (char) => char.toUpperCase())
      .replace(/(à|á|â|ã|ä|å|æ|ç|è|é|ê|ë|ì|í|î|ï|ñ|ò|ó|ô|õ|ö|ø|ù|ú|û|ü|ý|ÿ)\w/g, (match) => match.toLowerCase());
  };

const handleChangeNome = (nome) => {
  // Permite letras (incluindo acentuadas), números e espaços
  if (/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\s]*$/.test(nome)) {
    setNome(nome); // Atualiza o estado nome diretamente
  }
};

const handleChangeEmail = (text) => {
  // Atualiza o estado do email diretamente com o texto inserido
  setEmail(text);
};



  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expressão regular para validar email    

    if (nome.length < 3) {
      setMensagemErro('O nome deve ter no mínimo 3 letras.');
      return;
    }

    if (dbContext.doesNomeExist(nome)) {
      handleOpenModal(nome)
      return;
    }    

    if (!emailRegex.test(email)) {
      setMensagemErro('Por favor, insira um email válido.');
      return;
    }

    if (dbContext.doesEmailExist(email)) {
      handleOpenModal(email)
      return;
    }
    
    // Verificar se os campos estão vazios após remover espaços em branco
    if (!nome || !email || !senha) {
      setMensagemErro('Por favor, preencha todos os campos.');
      return;
    }

    if (senha.length < 6) {
      setMensagemErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    // Se todas as validações passarem, realiza o cadastro
    registerUser({ nome, email, senha, nick });
    setMensagemErro('');
    setMensagemSucesso('Cadastro realizado com sucesso!');

    // Redireciona para a tela de login após 2 segundos
    setTimeout(() => {
      navigation.navigate('Login');
      setNome('');
      setEmail('');
      setSenha('');
      setMensagemSucesso('');
    }, 2000);
  };

  const handleOpenModal = (item) => {
    if (item === nome) {
      setMensagemModal('Este nome já está em uso. Por favor, escolha outro.')
    } else if (item === email) {
      setMensagemModal('Este email já está em uso. Por favor, escolha outro.')
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const styles = {
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.background,
    },
    headerText: {
      fontSize: 35,
      fontWeight: 'bold',
      //textAlign: 'center',
      marginTop: 20,
      marginLeft: 20,
      color: colors.textColor,
    },
    inputContainer: {
      width: "80%",
      marginBottom: 30
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
      marginTop: 10
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold'
    },
    buttonLogin: {
      flexDirection: 'row',
      marginTop: 30
    },
    textLogin1: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#5B5B5E',
      marginRight: 5
    },
    textLogin2: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.textColor,
    },
subTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A8A8A8', // Um cinza mais claro
    marginTop: 5, // Diminui a distância entre o header e o subtítulo
    textAlign: 'center', // Centraliza o subtítulo
          marginBottom: 50,

},
    mensagemErro: {
      position: 'absolute',
      top: -50,
      left: 0,
      right: 0,
      fontSize: 16,
      color: 'red',
      textAlign: 'center',
      fontWeight: 'bold',
      padding: 20,
      zIndex: 999
    },
    mensagemSucesso: {
      position: 'absolute',
      top: -50,
      left: 0,
      right: 0,
      fontSize: 16,
      color: 'green',
      textAlign: 'center',
      fontWeight: 'bold',
      padding: 20,
      zIndex: 999
    },
  };

  return (
    <Content>
              <ScrollView>

    <View style={styles.container}>
      <HeaderUnlogged />
      <Text style={styles.headerText}>Cadastro</Text>
      <Text style={styles.subTitulo}>Leva apenas um minuto para criar sua conta</Text>
      <View style={{ justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        {mensagemErro !== '' && ( // Renderiza a mensagem de erro apenas se houver uma mensagem
          <Text style={styles.mensagemErro}>{mensagemErro}</Text>
        )}
        {mensagemSucesso !== '' && ( // Renderiza a mensagem de sucesso apenas se houver uma mensagem
          <Text style={styles.mensagemSucesso}>{mensagemSucesso}</Text>
        )}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.textInput}
            value={nome}
            onChangeText={handleChangeNome}
          />
        </View>
     <View style={styles.inputContainer}>
  <Text style={styles.label}>E-mail</Text>
  <TextInput
    style={styles.textInput}
    onChangeText={handleChangeEmail} // Use a função atualizada
    value={email} // O valor deve ser o estado atual
  />
</View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => setSenha(text)}
            value={senha}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.buttonLogin}>
          <Text style={styles.textLogin1}>Já tem uma conta?</Text>
          <Text style={styles.textLogin2}>Login</Text>
        </TouchableOpacity>
      </View>
      <AlertModal
        visible={modalVisible}
        message={mensagemModal}
        onClose={handleCloseModal}
      />
    </View>
                </ScrollView>

    </Content>
  );
}

export default Cadastrar;
