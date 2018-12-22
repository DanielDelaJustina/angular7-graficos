import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Category } from '../../categories/shared/category.model';
import { Entry } from '../../entries/shared/entry.model';
import { EntryService } from '../../entries/shared/entry.service';
import { CategoryService } from '../../categories/shared/category.service';
import currencyFormatter from 'currency-formatter';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  expenseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;

  expenseChartData: any;
  revenueChartData: any;

  chartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  categories: Category[] = [];
  entries: Entry[] = [];

  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;

  constructor(private entryService: EntryService, private categoryService: CategoryService ) {  }

  ngOnInit() {
    this.categoryService.getAll()
    .subscribe(categories => this.categories = categories);
  }

  generateReports() {
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if (!year || !month) {
      alert('Você precisa selecionar o mês e o ano.');
    } else {
      this.entryService.getByMonthAndYear(month, year).subscribe(
        this.setValues.bind(this)
      );
    }
  }

  private setValues(entries: Entry[]) {
    this.entries = entries;
    this.calculateBalance();
    this.setChartData();
  }

  private calculateBalance() {
    let expenseTotal = 0;
    let revenueTotal = 0;

    this.entries.forEach(entry => {
        if (entry.type == 'revenue') {
          revenueTotal += currencyFormatter.unformat(entry.amount , {code: 'BRL'});
        } else {
          expenseTotal += currencyFormatter.unformat(entry.amount , {code: 'BRL'});
        }
      }
    );

    this.expenseTotal = currencyFormatter.format(expenseTotal, {code: 'BRL'});
    this.revenueTotal = currencyFormatter.format(revenueTotal, {code: 'BRL'});
    this.balance = currencyFormatter.format(revenueTotal - expenseTotal , {code: 'BRL'});
  }

  private setChartData() {
    this.revenueChartData = this.getChartData('revenue', 'Gráfico de Receitas', '#9CCC65');
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Despesas', '#e03131');
  }

  private getChartData(entryType: string, title: string, color: string ) {
    const chartData = [];

    this.categories.forEach(
      category => {
        const filteredEntries = this.entries.filter(
          entry => (entry.categoryId == category.id) && (entry.type == entryType)
        );

        if (filteredEntries.length > 0) {
          const totalAmount = filteredEntries.reduce(
            (total, entry) => total + currencyFormatter.unformat(entry.amount, {code: 'BRL'}), 0
          );

          chartData.push({
            categoryName: category.name,
            totalAmount: totalAmount
          });
        }
      });

      return {
        labels: chartData.map(item => item.categoryName),
        datasets: [{
          label: title,
          backgroundColor: color,
          data: chartData.map(item => item.totalAmount)
        }]
      };
  }
}
