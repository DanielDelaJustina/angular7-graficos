import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Category } from './pages/categories/shared/category.model';
import { Entry } from './pages/entries/shared/entry.model';

export class InMemoryDataBase implements InMemoryDbService {
    createDb() {
        const categories: Category[] = [
            {id: 1, name: 'Moradia', description: 'Pagamento de contas da casa'},
            {id: 2, name: 'Saúde', description: 'Plano de saúde'},
            {id: 3, name: 'Lazer', description: 'Cinema, parques, praia, etc'},
            {id: 4, name: 'Salário', description: 'Recebimento de salário'},
            {id: 5, name: 'Freelas', description: 'Trabalhos com freelancer'}
        ];

        const entries: Entry[] = [
            {id: 1, name: 'Gás de cozinha', categoryId: categories[0].id , category: categories[0],
            paid: true, date: '14/10/2018', amount: '70,5', type: 'expense', description: 'Pagamento de gás do mês' } as Entry,
            {id: 2, name: 'Condomínio', categoryId: categories[0].id , category: categories[0],
            paid: true, date: '20/11/2018', amount: '150,3', type: 'expense', description: 'Gastos com condomínio' } as Entry,
            {id: 3, name: 'Pizzaria', categoryId: categories[2].id , category: categories[2],
            paid: true, date: '10/11/2018', amount: '10,2', type: 'revenue', description: 'Pizza de final de semana' } as Entry
        ];

        return { categories, entries };
    }
}
