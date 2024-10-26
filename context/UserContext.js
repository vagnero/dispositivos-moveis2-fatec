import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite/legacy';
import * as Crypto from 'expo-crypto';


// Abre ou cria o banco de dados
const db = SQLite.openDatabase('users.db');

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartSuccessMessage, setCartSuccessMessage] = useState('');

  useEffect(() => {
    // Cria a tabela de usuários ao inicializar
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, nome TEXT, senha TEXT);'
      );
    });
  }, []);

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
      newUser.senha = await hashPassword(newUser.senha); // Cria o hash da senha

      // Insere o novo usuário no SQLite
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO users (email, nome, senha) VALUES (?, ?, ?);',
          [newUser.email, newUser.nome, newUser.senha],
          () => {
            setUsers([...users, newUser]); // Atualiza a lista de usuários
            console.log('Usuário registrado com sucesso no SQLite.');
          },
          (tx, error) => {
            console.error('Erro ao registrar usuário no SQLite:', error);
          }
        );
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
    }
  };

  const findUser = async (email, senha) => {
    const hashPassword = async (password) => {
      return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password,
        { encoding: Crypto.CryptoEncoding.HEX }
      );
    };

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM users WHERE email = ?;',
          [email],
          async (tx, results) => {
            if (results.rows.length > 0) {
              const userData = results.rows.item(0);
              const hashedInputPassword = await hashPassword(senha);

              // Compara o hash gerado com o hash armazenado
              if (hashedInputPassword === userData.senha) {
                resolve(userData); // Retorna os dados do usuário se a senha estiver correta
              } else {
                resolve(null); // Senha incorreta
              }
            } else {
              resolve(null); // Usuário não encontrado
            }
          },
          (tx, error) => {
            reject(error);
          }
        );
      });
    });
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
      updateCartItems();
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
