import React, { createContext, useState, useContext } from 'react';
import dbContext from '../context/dbContext';
import * as Crypto from 'expo-crypto';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartSuccessMessage, setCartSuccessMessage] = useState('');

  const registerUser = async (user) => {
    const newUser = { ...user }; // Cria um novo usuário

    const hashPassword = async (password) => {
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password,
        { encoding: Crypto.CryptoEncoding.HEX }
      );
      return hashedPassword;
    };

    try {
      newUser.senha = await hashPassword(newUser.senha); // Criptografa a senha
      // Salva o novo usuário no dbContext
      dbContext.addItem('users', newUser);
      
      // Atualiza a lista de usuários em memória
      setUsers([...users, newUser]);
      console.log('Usuário registrado com sucesso no banco de dados.');
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
    }
  };

  const findUser = async (email, senha) => {
    const userData = dbContext.getById('users', email); // Busca o usuário pelo e-mail

    const hashPassword = async (password) => {
      return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password,
        { encoding: Crypto.CryptoEncoding.HEX }
      );
    };

    if (userData) {
      let hashedInputPassword;
      if (userData.nome === 'Dev') {
        hashedInputPassword = senha;
      } else {
        hashedInputPassword = await hashPassword(senha);
      }

      // Compara o hash gerado com o hash armazenado
      if (hashedInputPassword === userData.senha) {
        return userData; // Retorna os dados do usuário se a senha estiver correta
      }
    }
    return null; // Retorna null se não encontrar o usuário ou se a senha estiver incorreta
  };

  const updateCartItems = (items) => {
    const itemNames = items.map(item => item.itemName);
    const updatedItems = items.map((item) => {
      const existingItem = cartItems.find((i) => {
        return i.itemName === item.itemName;
      });
      if (existingItem) {
        return { ...existingItem, quantity: item.quantity };
      }
      return item;
    });
    setCartItems(updatedItems);
  };

  const addToCart = (item) => {
    const existingItem = cartItems.find((i) => i.itemName === item.itemName);
    if (existingItem) {
      updateCartItems()
    } else {
      setCartItems([...cartItems, item]);
      setCartSuccessMessage('Produto adicionado ao carrinho com sucesso!');
      setTimeout(() => {
        setCartSuccessMessage('');
      }, 2000);
    }
  };

  const removeFromCart = (itemName) => {
    setCartItems(cartItems.filter((item) => item.itemName !== itemName));
    setCartSuccessMessage('Produto removido com sucesso!');
    setTimeout(() => {
      setCartSuccessMessage('');
    }, 2000);
  };

  return (
    <UserContext.Provider value={{
      users,
      currentUser,
      setCurrentUser,
      registerUser,
      findUser,
      cartItems,
      setCartItems,
      cartSuccessMessage,
      setCartSuccessMessage,
      addToCart,
      removeFromCart,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
