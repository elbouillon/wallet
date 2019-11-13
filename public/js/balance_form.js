// Generated by CoffeeScript 2.4.1
(function() {
  this.BalanceForm = class BalanceForm {
    constructor() {
      this._handleSumButtonClick = this._handleSumButtonClick.bind(this);
      this.balanceAmountInput = $('#balance-amount');
      if (!this.balanceAmountInput.length) {
        return;
      }
      this.noteArea = $('#balance-note');
      this.sumButton = $('.js-bilances-sum');
      this.sumButton.on('click', this._handleSumButtonClick);
    }

    _handleSumButtonClick(e) {
      var i, item, j, len, len1, number, numbers, parts, sum, text;
      e.preventDefault();
      text = this.noteArea.val();
      parts = text.split(/\+/g);
      numbers = [];
      sum = 0;
      for (i = 0, len = parts.length; i < len; i++) {
        item = parts[i];
        item = item.replace(/\s/, '');
        item = item.replace(',', '.');
        number = Number(item);
        if (number) {
          numbers.push(number);
        }
      }
      if (!numbers.length) {
        return;
      }
      sum = 0;
      for (j = 0, len1 = numbers.length; j < len1; j++) {
        number = numbers[j];
        sum += number;
      }
      sum = Math.round(sum * 100) / 100;
      return this.balanceAmountInput.val(sum).focus();
    }

  };

}).call(this);
