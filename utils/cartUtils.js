// src/utils/cartUtils.js

export const handleAddToCart = (item, cartItems, setCartItems, setCartSuccessMessage) => {
  item.price = item.winePrice || item.price;
  item.winePrice = item.winePrice || item.price;
  const existingItem = cartItems.find((i) => i.wineName === item.wineName);

  if (existingItem) {
    // Se o vinho já existe, atualiza a quantidade
    const updatedItems = cartItems.map((i) =>
      i.wineName === item.wineName
        ? { ...i, quantity: i.quantity + 1 } // Incrementa a quantidade
        : i
    );
    setCartItems(updatedItems);
    setCartSuccessMessage('Quantidade do produto atualizada no carrinho!');
  } else {
    // Se o vinho não existe, adiciona ao carrinho
    setCartItems([...cartItems, { ...item, quantity: 1 }]);
    setCartSuccessMessage('Produto adicionado ao carrinho com sucesso!');
  }

  // Limpa a mensagem de sucesso após 2 segundos
  setTimeout(() => {
    setCartSuccessMessage('');
  }, 2000);
};
