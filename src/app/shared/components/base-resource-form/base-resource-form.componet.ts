import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessagens: string[] = null;
  submittingForm = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData) => T
  ) {
      this.route = this.injector.get(ActivatedRoute);
      this.router = this.injector.get(Router);
      this.formBuilder = this.injector.get(FormBuilder);
   }

  ngOnInit() {

    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == 'new') {
      this.createResource();
    } else {
      this.updateResource();
    }
  }

  // Private Méthods
  protected setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  protected loadResource() {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(+params.get('id')))
      )
      .subscribe(
        (resource) => {
          this.resource = resource;
          this.resourceForm.patchValue(resource); // seta os valores para os campos;
        },
        (error) => alert('Ocorreu Erro no servidor, tente mais tarde.')
      );
    }
  }

  protected setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = this.createPageTitle();
    } else {
      this.pageTitle = this.editionPageTitle();
      }
    }

    protected createPageTitle(): string {
        return 'Novo';
    }

    protected editionPageTitle(): string {
        return 'Editando';
    }

    protected createResource() {
      const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

      this.resourceService.create(resource)
         .subscribe(
           resour => this.actionsForSucess(resour),
           error => this.actionsForErros(error)
      );
    }

    protected updateResource() {
      const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

      this.resourceService.update(resource).subscribe(
        resour => this.actionsForSucess(resour),
        error => this.actionsForErros(error)
      );
    }

    protected actionsForSucess(resource: T) {
       toastr.success('Solicitação Processada com sucesso!');

       const baseComponentPath: string = this.route.snapshot.parent.url[0].path;

      // redireciona depois recarrega a categoria recem criada para edição.
      this.router.navigateByUrl(baseComponentPath, {skipLocationChange: true}).then(
        () => this.router.navigate([baseComponentPath, resource.id, 'edit'])
      );
    }

    protected actionsForErros(error) {
      toastr.error('ocorreu um erro ao processar a sua solicitação!');
      this.submittingForm = false;

      if (error.status == 422) {
        this.serverErrorMessagens = JSON.parse(error._body).errors;
      } else {
        this.serverErrorMessagens = ['Falha na comunicação com o servidor!'];
      }
    }

    protected abstract buildResourceForm(): void;
  }
