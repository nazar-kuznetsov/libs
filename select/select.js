function Select(settings) {
  this.select = $(settings.select);
  this.option = this.select.children();

  this.select.hide();

  // create node element
  this.container = $('<div class="select-container"></div>');
  this.header = $('<div>header</div>');
  this.dropdown = $('<div class="select-dropdown"></div>');

  this.ul = $('<ul></ul>');

  for (var i = 0; i < this.option.length; i++) {
    this.ul.append($(`<li class=${this.option.eq(i).attr('class')}>${this.option.eq(i).text()}</li>`));
  }

  // startOption
  var curentOption = this.select.find('option:selected');
  this.header.text(curentOption.text()).addClass(curentOption.attr('class') + ' option-top');

  this.dropdown.hide();

  // settings for search
  if (settings.search || false) {
    this.massage = settings.massage || 'Совпадений не найдено!';
    this.noFound = $(`<div class="select-no-found hide">${this.massage}</div>`);
    this.searchBox = $('<div class="search-box"></div>');
    this.input = $('<input class="search-select" type="text" placeholder="Поиск">');
    this.searchBox.append(this.input);
    this.dropdown.append(this.searchBox);
    this.dropdown.append(this.noFound);
    this.input.on('input', this.search.bind(this));
  }

  this.dropdown.append(this.ul);
  this.container.append(this.header);
  this.container.append(this.dropdown);
  this.select.parent().append(this.container);

  // events

  this.ul.children().on('click', this.selected.bind(this));
  this.header.on('click', this.open.bind(this));

  $(document).on('keyup', (e) => {
    if (e.keyCode === 27) this.close();
  });
}
// поиск
Select.prototype.search = function (event) {
  let val = $(event.currentTarget).val();
  let regExp = new RegExp(val, 'i');
  let matchCount = 0;

  this.ul.children().each((i, item) => {
    let li = $(item);
    if (!regExp.test(li.text())) {
      li.addClass('hide');
      matchCount += 1;
    } else {
      li.removeClass('hide');
      this.noFound.addClass('hide');
      matchCount -= 1;
    }

    // совпадение не найдено
    if (matchCount === this.option.length - 1) {
      this.noFound.removeClass('hide');
    }

  });
};

Select.prototype.selected = function (event) {
  var option = $(event.target);

  this.header.text(option.text());
  var regExp = new RegExp(option.text(), 'i');

  this.option.each((i, item) => {
    let $this = $(item);
    if (regExp.test($this.val())) {
      $this.prop('selected', true);
      this.header.attr('class', $this.attr('class') + ' option-top');
    }
  });

  this.close();
};

Select.prototype.open = function (e) {
  this.container.toggleClass('open');
  this.dropdown.slideToggle(300);
};

Select.prototype.close = function () {
  this.dropdown.slideUp(300);
  this.container.removeClass('open');
};
