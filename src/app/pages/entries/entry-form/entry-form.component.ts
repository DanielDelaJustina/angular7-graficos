import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessagens: string[] = null;
  submittingForm = false;
  entry: Entry = new Entry();

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
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

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private loadEntry() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      )
      .subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry); // seta os valores para os campos;
        },
        (error) => alert('Ocorreu Erro no servidor, tente mais tarde.')
      );
    }
  }

  private setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Novo Lançamento';
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = 'Editando Lançamento: ' + entryName;
      }
    }

    private createEntry() {
      const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
      this.entryService.create(entry).subscribe(
        entr => this.actionsForSucess(entry),
        error => this.actionsForErros(error)
      );
    }

    private updateEntry() {
      const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
      this.entryService.update(entry).subscribe(
        entr => this.actionsForSucess(entry),
        error => this.actionsForErros(error)
      );
    }

    private actionsForSucess(entry: Entry) {
       toastr.success('Solicitação Processada com sucesso!');

      // redireciona depois recarrega a categoria recem criada para edição.
      this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
        () => this.router.navigate(['entries', entry.id, 'edit'])
      );
      this.router.navigateByUrl('entries');
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
