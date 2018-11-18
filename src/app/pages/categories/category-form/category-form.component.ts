import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessagens: string[] = null;
  submittingForm = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  // Private Méthods
  private setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category); // seta os valores para os campos;
        },
        (error) => alert('Ocorreu Erro no servidor, tente mais tarde.')
      );
    }
  }

  private setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Nova Categoria';
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando Categoria: ' + categoryName;
      }
    }

    private createCategory() {
      const category: Category = Object.assign(new Category(), this.categoryForm.value);
      this.categoryService.create(category).subscribe(
        categor => this.actionsForSucess(categor),
        error => this.actionsForErros(error)
      );
    }

    private updateCategory() {
      const category: Category = Object.assign(new Category(), this.categoryForm.value);
      this.categoryService.update(category).subscribe(
        categor => this.actionsForSucess(categor),
        error => this.actionsForErros(error)
      );
    }

    private actionsForSucess(category: Category) {
       toastr.success('Solicitação Processada com sucesso!');

      // redireciona depois recarrega a categoria recem criada para edição.
      this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
        () => this.router.navigate(['categories', category.id, 'edit'])
      );
      this.router.navigateByUrl('categories');
    }

    private actionsForErros(error) {
      toastr.error('ocorreu um erro ao processar a sua solicitação!');
      this.submittingForm = false;

      if (error.status === 422) {
        this.serverErrorMessagens = JSON.parse(error._body).errors;
      } else {
        this.serverErrorMessagens = ['Falha na comunicação com o servidor!'];
      }
    }

  }
