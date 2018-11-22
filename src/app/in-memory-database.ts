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
            new Entry(1, 'Gas de cozinha', 'compra de gas', 'expense', '70,2', '20/11/2018', true, categories[0].id, categories[0]),
            new Entry(2, 'Condomínio', 'Gastos com condomínio', 'expense', '86,2', '10/11/2018', true, categories[0].id, categories[0]),
            new Entry(3, 'Pizzaria', 'Fim de semana com pizza', 'revenue', '20,3', '09/09/2018', false, categories[2].id, categories[2])
        ];

        return { categories, entries };
    }
}
