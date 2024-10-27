// dbContext.js
class DbContext {
    constructor() {
        this.data = {
            addresses: [],
            comments: [],
            favoriteItems: [],
            items: [],
            paymentCards: [],
            paymentMethods: [],
            purchaseHistory: [],
            users: []
        };
    }

    // Função para adicionar um item
    addItem(collection, item) {
        this.data[collection].push(item);
    }

    // Função para buscar todos os itens
    getAll(collection) {
        return this.data[collection];
    }

    // Função para buscar um item pelo id
    getById(collection, id) {
        // Busca item por id, que pode ser o email no caso de usuários
        return this.data[collection].find(item => {
            // Verifica se é a coleção de usuários
            if (collection === 'users') {
                return item.email === id; // Busca pelo email
            }
            // Para outras coleções, você pode definir como procurar pelo id
            return item.id === id; // Aqui assume-se que outros itens têm um campo `id`
        });
    }

    doesNomeExist(nome) {
        return this.data.users.some(user => user.nome === nome);
    }

    // Novo método para verificar se o email existe
    doesEmailExist(email) {
        return this.data.users.some(user => user.email === email);
    }

    // Função para atualizar um item com merge
    updateItem(collection, id, updatedItem, options = {}) {
        const index = this.data[collection].findIndex(item => item.id === id);
        if (index !== -1) {
            if (options.merge) {
                this.data[collection][index] = {
                    ...this.data[collection][index],
                    ...updatedItem
                };
            } else {
                this.data[collection][index] = updatedItem;
            }
        }
    }

    // Função para remover um item
    removeItem(collection, id) {
        this.data[collection] = this.data[collection].filter(item => item.id !== id);
    }
}

const dbContext = new DbContext();
export default dbContext;
