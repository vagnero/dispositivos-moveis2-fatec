import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'Pedido Confirmado',
      message: 'Seu pedido número 12345 foi enviado. Acompanhe a entrega pelo link:',
      date: '2023-11-23',
      read: false
    },
    {
      id: 2,
      type: 'promotion',
      title: 'Promoção Relâmpago!',
      message: 'Aproveite 50% de desconto em todos os produtos da categoria eletrônicos por 24 horas!',
      date: '2023-11-22',
      read: false
    },
    {
      id: 3,
      type: 'newProduct',
      title: 'Novo Produto Disponível!',
      message: 'O novo smartphone X20 acaba de chegar! Adquira já o seu.',
      image: 'https://suaempresa.com/produtos/x20.jpg',
      date: '2023-11-21',
      read: false
    },
    {
      id: 4,
      type: 'birthday',
      title: 'Parabéns!',
      message: 'Feliz aniversário! Ganhe 10% de desconto em sua próxima compra.',
      date: '2023-11-20',
      read: false
    },
    {
      id: 5,
      type: 'reminder',
      title: 'Avalie sua compra',
      message: 'Ajude-nos a melhorar! Avalie sua última compra e ganhe um cupom de desconto.',
      link: 'https://suaempresa.com/avaliacao',
      date: '2023-11-19',
      read: true
    },
    {
      id: 6,
      type: 'loyalty',
      title: 'Nível de Fidelidade',
      message: 'Parabéns! Você atingiu o nível Ouro e agora tem acesso a benefícios exclusivos.',
      date: '2023-11-18',
      read: true
    },
    {
      id: 7,
      type: 'support',
      title: 'Sua dúvida foi respondida',
      message: 'Enviamos uma resposta para sua pergunta sobre o produto Y. Verifique sua caixa de entrada.',
      date: '2023-11-17',
      read: true
    },
    {
      id: 8,
      type: 'event',
      title: 'Evento Especial',
      message: 'Participe do nosso evento online no dia 25/11! Inscreva-se agora.',
      link: 'https://suaempresa.com/evento',
      date: '2023-11-16',
      read: true
    },
    {
      id: 9,
      type: 'survey',
      title: 'Sua Opinião Importa',
      message: 'Participe da nossa pesquisa e ajude-nos a melhorar nossos serviços.',
      link: 'https://suaempresa.com/pesquisa',
      date: '2023-11-15',
      read: true
    },
    {
      id: 10,
      type: 'referral',
      title: 'Indique um Amigo',
      message: 'Indique um amigo e ganhe um cupom de R$20 para sua próxima compra.',
      link: 'https://suaempresa.com/indicar',
      date: '2023-11-14',
      read: true
    },
  ]);

  const countUnreadNotifications = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  const updateNotifications = (newNotification) => {
    setNotifications(prev => [...prev, newNotification]);
  };

  const markAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      setNotifications,
      countUnreadNotifications,
      updateNotifications,
      markAsRead,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
