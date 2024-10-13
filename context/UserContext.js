import React, { createContext, useState, useContext } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartSuccessMessage, setCartSuccessMessage] = useState('');

  const registerUser = async (user) => {
    const newUser = { ...user }; // Cria um novo usuário
  
    try {
      // Cria um documento no Firestore com o ID do usuário baseado no e-mail ou um ID único
      await setDoc(doc(db, 'users', newUser.email), newUser);
      
      // Se quiser, pode manter a lista de usuários em memória
      setUsers([...users, newUser]); // Adiciona o novo usuário à lista      
      console.log('Usuário registrado com sucesso no Firestore.');
    } catch (error) {
      console.error('Erro ao registrar usuário no Firestore:', error);
    }
  };
  

  const findUser = (email, senha) => {
    return users.find(user => user.email === email && user.senha === senha);
  };

  const updateCartItems = (items) => {
    const wineNames = items.map(item => item.wineName);
    console.log('Atualizando itens do Carrinho:', wineNames);
    const updatedItems = items.map((item) => {
      const existingItem = cartItems.find((i) => {
        console.log('iName: ', i.wineName);
        console.log('itemName: ', item.wineName);
        return i.wineName === item.wineName;
      });
      if (existingItem) {
        return { ...existingItem, quantity: item.quantity };
      }
      return item;
    });
    setCartItems(updatedItems);
    // console.log('Atualizado itens do Carrinho:', updatedItems);
  };

  const addToCart = (item) => {
    const existingItem = cartItems.find((i) => i.wineName === item.wineName);
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

  const removeFromCart = (wineName) => {
    setCartItems(cartItems.filter((item) => item.wineName !== wineName));
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
