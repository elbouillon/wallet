// Generated by CoffeeScript 2.4.1
(function() {
  var BalanceChart, BalanceDiff, Confirm, EntryForm, ExpenseChart, HighchartsConfig, TagEntriesChart, Tags;

  Confirm = class Confirm {
    constructor() {
      var $items;
      this._handleClick = this._handleClick.bind(this);
      $items = $('[data-confirm]');
      $items.on('click', this._handleClick);
    }

    _handleClick(e) {
      var $item, message;
      $item = $(e.currentTarget);
      message = $item.data('confirm');
      if (message && !confirm(message)) {
        return e.preventDefault();
      }
    }

  };

  HighchartsConfig = class HighchartsConfig {
    constructor() {
      Highcharts.setOptions({
        credits: {
          enabled: false
        },
        lang: {
          contextButtonTitle: 'Kontextové menu',
          decimalPoint: ',',
          downloadCSV: 'Stáhnout CSV',
          downloadJPEG: 'Stáhnout JPEG',
          downloadPDF: 'Stáhnout PDF',
          downloadPNG: 'Stáhnout PNG',
          downloadSVG: 'Stáhnout SVG',
          downloadXLS: 'Stáhnout XLS',
          invalidDate: void 0,
          loading: 'Načítám…',
          months: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'],
          noData: 'Žádná data k zobrazení',
          numericSymbolMagnitude: 1000,
          numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'],
          openInCloud: 'Otevřít v Highcharts Cloud',
          printChart: 'Tisknout',
          rangeSelectorFrom: 'Od',
          rangeSelectorTo: 'Do',
          rangeSelectorZoom: 'Zoom',
          resetZoom: 'Vyresetovat zoom',
          resetZoomTitle: 'Vyresetovat zoom na 1:1',
          shortMonths: ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Spr', 'Zář', 'Říj', 'Lis', 'Pro'],
          shortWeekdays: void 0,
          thousandsSep: ' ',
          weekdays: ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota']
        }
      });
    }

  };

  EntryForm = class EntryForm {
    constructor() {
      this._handleExpenseButtonClick = this._handleExpenseButtonClick.bind(this);
      this._handleIncomeButtonClick = this._handleIncomeButtonClick.bind(this);
      this._handleAmountInput = this._handleAmountInput.bind(this);
      this._handleCopyAccountedOn = this._handleCopyAccountedOn.bind(this);
      this._handleTagCombinationClick = this._handleTagCombinationClick.bind(this);
      this.expenseButton = $('.js-expense');
      if (!this.expenseButton.length) {
        return;
      }
      this.incomeButton = $('.js-income');
      this.amount = $('.js-amount');
      this.accountedOnInput = $('#entry-accounted_on');
      this.dateInput = $('#entry-date');
      this.copyAccountedOn = $('.js-copy-accounted-on');
      this.tagCombinations = $('.js-tag-combination');
      this.expenseButton.on('click', this._handleExpenseButtonClick);
      this.incomeButton.on('click', this._handleIncomeButtonClick);
      this.amount.on('input', this._handleAmountInput);
      this.copyAccountedOn.on('click', this._handleCopyAccountedOn);
      this.tagCombinations.on('click', this._handleTagCombinationClick);
      this.select = $('.js-selectize').selectize();
    }

    _handleExpenseButtonClick() {
      var value;
      value = Number(this.amount.val());
      if (value > 0) {
        this.amount.val(-value);
      }
      this.amount.data('type', 'expense').focus();
      this.expenseButton.addClass('btn-danger active').removeClass('btn-default');
      return this.incomeButton.removeClass('btn-success active').addClass('btn-default');
    }

    _handleIncomeButtonClick() {
      var value;
      value = Number(this.amount.val());
      if (value < 0) {
        this.amount.val(-value);
      }
      this.amount.data('type', 'income').focus();
      this.incomeButton.addClass('btn-success active').removeClass('btn-default');
      return this.expenseButton.removeClass('btn-danger active').addClass('btn-default');
    }

    _handleAmountInput() {
      var number, value;
      value = this.amount.val();
      if (value === '') {
        return;
      }
      number = Number(value);
      if ((this.amount.data('type') === 'expense' && number > 0) || (this.amount.data('type') === 'income' && number < 0)) {
        return this.amount.val(-value);
      }
    }

    _handleCopyAccountedOn(e) {
      e.preventDefault();
      return this.dateInput.val(this.accountedOnInput.val()).focus();
    }

    _handleTagCombinationClick(e) {
      var $link, tagIds;
      e.preventDefault();
      $link = $(e.currentTarget);
      tagIds = $link.find('[data-tag-id]').map(function(_, tag) {
        return $(tag).data('tag-id');
      }).toArray();
      return this.select[0].selectize.setValue(tagIds);
    }

  };

  Tags = class Tags {
    constructor() {
      var $tags, tagsHtml;
      $tags = $('.js-tags');
      if (!$tags.length) {
        return;
      }
      tagsHtml = $tags.html();
      $tags.sortable({
        axis: 'y',
        containment: 'parent',
        handle: '.js-sortable-handle',
        tolerance: 'pointer',
        update: function() {
          var changes;
          changes = {};
          $tags.find('li').each(function(i) {
            var $tag, newPosition, oldPosition;
            newPosition = i + 1;
            $tag = $(this);
            oldPosition = $tag.data('position');
            if (newPosition === oldPosition) {
              return;
            }
            $tag.attr('data-position', newPosition);
            return changes[$tag.data('id')] = newPosition;
          });
          if ($.isEmptyObject(changes)) {
            return;
          }
          return $.ajax($tags.data('path'), {
            method: 'POST',
            data: {
              positions: changes
            },
            error: function() {
              return $tags.html(tagsHtml);
            },
            success: function() {
              return tagsHtml = $tags.html();
            }
          });
        }
      });
    }

  };

  ExpenseChart = class ExpenseChart {
    constructor() {
      this.element = $('#chart');
      if (!this.element.length) {
        return;
      }
      this.init();
    }

    init() {
      return $.getJSON(this.element.data('url'), (data) => {
        var options;
        data = data.map(function(item) {
          return {
            name: item.name,
            data: [Number(item.sum)]
          };
        });
        options = {
          title: null,
          chart: {
            type: 'column'
          },
          xAxis: {
            categories: ['Výdaje']
          },
          yAxis: {
            title: null
          },
          tooltip: {
            valueSuffix: ' Kč'
          },
          // plotOptions:
          //   series:
          //     animation: 500
          series: data
        };
        return Highcharts.chart(this.element.attr('id'), options);
      });
    }

  };

  BalanceDiff = class BalanceDiff {
    constructor() {
      this._handleClick = this._handleClick.bind(this);
      this.elements = $('.js-balance-diff');
      if (!this.elements.length) {
        return;
      }
      this.diff = $('#balance-diff');
      this.items = [];
      this.elements.on('click', this._handleClick);
    }

    _handleClick(e) {
      var $input, amount, date, item;
      $input = $(e.currentTarget);
      if (!$input.is(':checked')) {
        this._removeItem($input);
        return;
      }
      date = Date.parse($input.data('date'));
      amount = Number($input.val());
      item = {
        input: $input,
        amount: amount,
        date: date
      };
      this._addItem(item);
      return this._calculate();
    }

    _addItem(item) {
      var i, j, len, ref;
      switch (this.items.length) {
        case 0:
          return this.items.push(item);
        case 1:
          if (item.date > this.items[0].date) {
            return this.items.unshift(item);
          } else {
            return this.items.push(item);
          }
          break;
        default:
          ref = this.items;
          for (j = 0, len = ref.length; j < len; j++) {
            i = ref[j];
            i.input.prop('checked', false);
          }
          this.items = [];
          return this.items.push(item);
      }
    }

    _removeItem($input) {
      var item, j, len, ref;
      ref = this.items;
      for (j = 0, len = ref.length; j < len; j++) {
        item = ref[j];
        item.input.prop('checked', false);
      }
      this.items = [];
      return $input.trigger('click');
    }

    _calculate() {
      var diff, parts, textDiff;
      if (this.items.length < 2) {
        this.diff.text('');
        return;
      }
      diff = this.items[0].amount - this.items[1].amount;
      parts = parseFloat(diff).toFixed(2).split('.');
      parts[0] = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1 ');
      textDiff = `${parts.join(',')} Kč`;
      if (diff >= 0) {
        textDiff = `+${textDiff}`;
      }
      return this.diff.text(textDiff);
    }

  };

  BalanceChart = class BalanceChart {
    constructor() {
      this.element = $('#balances-chart');
      if (!this.element.length) {
        return;
      }
      this.init();
    }

    init() {
      return $.getJSON(this.element.data('url'), (data) => {
        var date, expenses, incomes, item, j, len, options, series, total;
        series = {
          total: {
            name: 'Celkem',
            showInNavigator: true,
            color: '#7cb5ec',
            lineWidth: 4,
            type: 'line',
            index: 3,
            marker: {
              lineWidth: 4,
              radius: 6,
              lineColor: '#7cb5ec',
              fillColor: 'white'
            },
            data: []
          },
          incomes: {
            name: 'Příjmy',
            showInNavigator: false,
            color: '#108A00',
            type: 'column',
            index: 1,
            data: []
          },
          expenses: {
            name: 'Výdaje',
            showInNavigator: false,
            color: '#C73C35',
            type: 'column',
            index: 2,
            data: []
          }
        };
        for (j = 0, len = data.length; j < len; j++) {
          item = data[j];
          date = Date.parse(item.date);
          total = Number(item.total);
          incomes = Number(item.incomes);
          expenses = Number(item.expenses);
          series.total.data.push([date, total]);
          series.incomes.data.push([date, incomes]);
          series.expenses.data.push([date, expenses]);
        }
        options = {
          type: 'line',
          series: [series.total, series.incomes, series.expenses],
          // plotOptions:
          //   series:
          //     animation: 500
          rangeSelector: {
            buttons: [
              {
                type: 'year',
                count: 1,
                text: 'Rok'
              },
              {
                type: 'all',
                text: 'Vše'
              }
            ],
            selected: 0,
            inputBoxWidth: 100,
            inputDateFormat: '%B %Y',
            inputEditDateFormat: '%d. %m. %Y'
          },
          credits: {
            enabled: false
          }
        };
        return Highcharts.stockChart(this.element.attr('id'), options);
      });
    }

  };

  TagEntriesChart = class TagEntriesChart {
    constructor() {
      this.element = $('#tag-entries-chart');
      if (!this.element.length) {
        return;
      }
      this.init();
    }

    init() {
      return $.getJSON(this.element.data('url'), (data) => {
        var date, expenses, incomes, item, j, len, options, series;
        series = {
          incomes: {
            name: 'Příjmy',
            showInNavigator: true,
            color: '#108A00',
            lineWidth: 4,
            type: 'line',
            index: 1,
            marker: {
              lineWidth: 4,
              radius: 6,
              lineColor: '#7cb5ec',
              fillColor: 'white'
            },
            data: []
          },
          expenses: {
            name: 'Výdaje',
            showInNavigator: true,
            color: '#C73C35',
            lineWidth: 4,
            type: 'line',
            index: 2,
            marker: {
              lineWidth: 4,
              radius: 6,
              lineColor: '#7cb5ec',
              fillColor: 'white'
            },
            data: []
          }
        };
        for (j = 0, len = data.length; j < len; j++) {
          item = data[j];
          date = Date.parse(item.date);
          incomes = Number(item.incomes);
          expenses = Number(item.expenses);
          series.incomes.data.push([date, incomes]);
          series.expenses.data.push([date, expenses]);
        }
        options = {
          type: 'line',
          series: [series.incomes, series.expenses],
          // plotOptions:
          //   series:
          //     animation: 500
          rangeSelector: {
            buttons: [
              {
                type: 'year',
                count: 1,
                text: 'Rok'
              },
              {
                type: 'all',
                text: 'Vše'
              }
            ],
            selected: 1,
            inputBoxWidth: 100,
            inputDateFormat: '%B %Y',
            inputEditDateFormat: '%d. %m. %Y'
          },
          credits: {
            enabled: false
          }
        };
        return Highcharts.stockChart(this.element.attr('id'), options);
      });
    }

  };

  $(function() {
    new Confirm;
    new HighchartsConfig;
    new EntryForm;
    new Tags;
    new ExpenseChart;
    new BalanceDiff;
    new BalanceChart;
    return new TagEntriesChart;
  });

}).call(this);
