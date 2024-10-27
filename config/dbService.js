// src/dbService.js

import * as SQLite from 'expo-sqlite'; // Use 'react-native-sqlite-storage' se não estiver usando Expo

const db = SQLite.openDatabase('app.db');

// Função para inicializar o banco de dados e criar uma tabela genérica
export const initializeDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT);',
      [],
      () => console.log('Tabela items criada com sucesso'),
      (tx, error) => console.error('Erro ao criar tabela:', error)
    );
  });
};

// Função para buscar todos os itens
export const getDocs = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM items;',
      [],
      (_, { rows }) => {
        callback(null, rows._array);
      },
      (tx, error) => {
        callback(error);
      }
    );
  });
};

// Função para buscar um item pelo ID
export const getDoc = (id, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM items WHERE id = ?;',
      [id],
      (_, { rows }) => {
        if (rows.length > 0) {
          callback(null, rows.item(0));
        } else {
          callback(new Error('Item não encontrado'));
        }
      },
      (tx, error) => {
        callback(error);
      }
    );
  });
};

// Função para adicionar um novo item
export const addDoc = (data, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO items (name, description) VALUES (?, ?);',
      [data.name, data.description],
      (_, result) => {
        callback(null, result);
      },
      (tx, error) => {
        callback(error);
      }
    );
  });
};

// Função para atualizar um item existente
export const setDoc = (id, data, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE items SET name = ?, description = ? WHERE id = ?;',
      [data.name, data.description, id],
      (_, result) => {
        callback(null, result);
      },
      (tx, error) => {
        callback(error);
      }
    );
  });
};

// Função para deletar um item
export const deleteDoc = (id, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM items WHERE id = ?;',
      [id],
      (_, result) => {
        callback(null, result);
      },
      (tx, error) => {
        callback(error);
      }
    );
  });
};
