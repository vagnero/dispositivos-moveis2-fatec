import { Text, View, TextInput, TouchableOpacity } from 'react-native';

const RedefinirSenha = () => {

  return (
    <View style={styles.div_container}>
      <Text style={styles.text_title}>Redefinir Senha</Text>
      <Text style={styles.text_subtitle}>Digite seu e-mail para receber instruções
  sobre como redefini-lo</Text>

      <Text style={styles.text_email}>E-mail</Text>
      <TextInput style={styles.textinput_email}/>

      <TouchableOpacity style={styles.button_senha}>
        <Text style={styles.text_senha}>ENVIAR NOVA SENHA</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  div_container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#F6F5F5'
  },

  text_title: {
    marginTop: 50,
    fontSize: 35,
    fontWeight: 'bold',
    color: '#2D0C57',
  },

  text_subtitle: {
    width: '80%',
    marginTop: 25,
    fontSize: 14,
    color: '#6C7584',
    textAlign: 'center'
  },

  text_email: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 16,
    color: '#9796A1',
    textAlign: 'start'
  },

  textinput_email: {
    width: '85%',
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#D9D0E3",
    borderWidth: 1, 
    paddingLeft: 10
  },

  button_senha: {
    width: 240,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D0C57',
    borderRadius: 30,
    marginTop: 50
  },

  text_senha: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
};

export default RedefinirSenha;