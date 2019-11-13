// Generated by CoffeeScript 2.4.1
(function() {
  this.EntryForm = class EntryForm {
    constructor() {
      this._handleExpenseButtonClick = this._handleExpenseButtonClick.bind(this);
      this._handleIncomeButtonClick = this._handleIncomeButtonClick.bind(this);
      this._handleAmountInput = this._handleAmountInput.bind(this);
      this._handleCopyDateClick = this._handleCopyDateClick.bind(this);
      this._handleTodayDateClick = this._handleTodayDateClick.bind(this);
      this._handleTagCombinationClick = this._handleTagCombinationClick.bind(this);
      this.expenseButton = $('.js-expense');
      if (!this.expenseButton.length) {
        return;
      }
      this.incomeButton = $('.js-income');
      this.amount = $('.js-amount');
      this.accountedOnInput = $('#entry-accounted_on');
      this.dateInput = $('#entry-date');
      this.copyDate = $('.js-copy-date');
      this.todayDate = $('.js-today-date');
      this.tagCombinations = $('.js-tag-combination');
      this.expenseButton.on('click', this._handleExpenseButtonClick);
      this.incomeButton.on('click', this._handleIncomeButtonClick);
      this.amount.on('input', this._handleAmountInput);
      this.copyDate.on('click', this._handleCopyDateClick);
      this.todayDate.on('click', this._handleTodayDateClick);
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

    _handleCopyDateClick() {
      var date;
      date = this.dateInput.val();
      if (!date) {
        this.dateInput.focus();
        return;
      }
      return this.accountedOnInput.val(date).focus();
    }

    _handleTodayDateClick() {
      var today;
      today = new Date;
      today = today.toISOString().substr(0, 10);
      this.dateInput.val(today);
      return this.accountedOnInput.val(today).focus();
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

}).call(this);
