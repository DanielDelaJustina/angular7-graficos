import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataBase implements InMemoryDbService {
    createDb() {
        const categorias = [
            {id: 1, name: 'Moradia', description: 'Pagamento de contas da casa'},
            {id: 2, name: 'Saúde', description: 'Plano de saúde'},
            {id: 3, name: 'Lazer', description: 'Cinema, parques, praia, etc'},
            {id: 4, name: 'Salário', description: 'Recebimento de salário'},
            {id: 5, name: 'Freelas', description: 'Trabalhos com freelancer'}
        ];

        return {categorias};
    }
}
