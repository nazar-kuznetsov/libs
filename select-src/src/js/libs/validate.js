function Validate(settings) {
	this.form = $(settings.form);
	this.inputs = this.form.find('[data-validate]');
	this.form.on('submit', this.submit.bind(this, this.inputs));
	this.send = settings.send || function () { };
	this.ready = settings.ready || function () { };
	this.massageEmpty = settings.massageEmpty || {};
	this.massageError = settings.massageError || {};

	this.inputs.each((index, item) => {
		$(item).on('input change', this.submit.bind(this, $(item)));
	});

	this.regExp = {
		name: /^(\s*[\`\'\"\(\)a-zа-я-іїёє\._-]{2,50})$/i,
		email: /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i,
		tel: /^[\s()+-]*([0-9][\s()+-]*){6,20}$/,
		textarea: /^\s*([\`\'\"\(\)a-zа-я0-9-іїёє\._-]\s*){25,75}$/i,
	};

	// сообщение по умолчанию
	this.massage = {
		empty: {
			name: this.massageEmpty.name || 'Введите имя',
			email: this.massageEmpty.email || 'Ваш почтовый ',
			textarea: this.massageEmpty.textarea || 'textarea не может быть пустым',
			tel: this.massageEmpty.tel || 'tel не может быть пустым',
			checkbox: this.massageEmpty.checkbox || 'Вам нужно соглалистя с условиями',
		},
		error: {
			name: this.massageError.name || 'Имя должно содержать только буквы',
			email: this.massageError.email || 'Пример: Join@.gmnail.com',
			textarea: this.massageError.textarea || 'Мин 25 символов максимум 150',
			tel: this.massageError.tel || 'Введите телефон',
		},
	};

	castomInput(settings.massageEmpty, this.massage.empty);
	castomInput(settings.massageError, this.massage.error);
	castomInput(settings.regExp, this.regExp);

	function castomInput(rule, obj) {
		// добавляем новый текст сообщение или регулярку
		if (rule !== undefined) {
			for (let i in rule) {
				obj[i] = rule[i];
			}
		}
	}

}

Validate.prototype.submit = function (elements) {
	event.preventDefault();
	const error = [];

	for (let i = 0; i < elements.length; i++) {
		const input = elements.eq(i),
			key = input.attr('data-validate'),
			parent = input.parent(),
			value = input.val();

		if (input.attr('type') === 'checkbox' && !input.prop('checked') || // если checkbox проверяем на prop
			input.attr('type') !== 'checkbox' && !this.regExp[key].test(value)) { // если поле проверчем на ругелярках

			error.push({
				input: input,
				parent: parent,
				key: key,
			});

			parent.removeClass('succes');
		} else {
			parent.removeClass('error');
			input.next('.error-massage').html('');
			parent.addClass('succes');
		}
	}


	// показываем ошибки
	if (error.length > 0) {
		//error[0].input.trigger('focus'); // добавляем focus в поле с ошибкой
		for (let i = 0; i < error.length; i++) {
			const input = error[i].input,
				parent = error[i].parent,
				key = error[i].key;

			parent.addClass('error');

			if (!input.next().hasClass('error-massage')) {
				input.after('<p class="error-massage"></p>');
			}

			if (event.type === 'submit' || input.val().length === 0) {
				this.massage.empty[key] !== undefined ? input.next().html(this.massage.empty[key]) : input.next().html(this.massage.error[key]);
			} else {
				this.massage.error[key] !== undefined ? input.next().html(this.massage.error[key]) : input.next().html(this.massage.empty[key]);
			}
		}

		return false;
	}


	// this.ready(this.form);

	// успешно
	if (event.type !== 'submit') return false;
	this.send(this.form);
	this.inputs.parent().removeClass('succes');
	this.form[0].reset();
};
