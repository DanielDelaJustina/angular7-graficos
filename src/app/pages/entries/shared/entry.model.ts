import { Category } from '../../categories/shared/category.model';

export class Entry {
    constructor(
        public id?: number,
        public name?: String,
        public description?: String,
        public type?: String,
        public amount?: String,
        public date?: String,
        public paid?: boolean,
        public categoryId?: number,
        public category?: Category
    ) { }

    static types = {
        expense: 'Desepesa',
        renevue: 'Receita'
    };
    
    // get paidText(): string {
    //    return this.paid ? 'Pago' : 'Pendente';
    // }
}
