<script>
import axios from 'axios';

export default {
	data() {
		return {
			login: '',
			password: '',
			verification: '',
			fio: '',
			type: '',
			username: '',
			errmsg: ''
		}
	},
	methods: {
		async registartion(evt) {
			evt.preventDefault();

			if(this.login.length > 0 && this.password.length > 0 && this.verification.length > 0 && this.fio.length > 0 && this.type.length > 0 && this.username.length > 0) {
				if(this.password.length >= 8) {
					if(this.password == this.verification) {
						const response = await axios.post('/account/registration', {
							login: this.login,
							password: this.password,
							fio: this.fio,
							type: this.type,
							username: this.username
						});

						if(response.data.code == 0) {
							this.login = '';
							this.password = '';
							this.verification = '';
							this.fio = '';
							this.type = '';
							this.username = '';

							this.$router.push({
								name: 'visitors'
							});
						} else {
							this.errmsg = response.data.msg;
						}
					} else {
						this.errmsg = 'Пароли не совпадают'
					}
				} else {
					this.errmsg = 'Пароль должен быть не короче 8 символов'
				}
			} else {
				this.errmsg = 'Заполните все поля!'
			}
		},
		async isAuthorized() {
			const response = await axios.get('/account/authorized');

			if(response.data.code == 0) {
				this.$router.push({
					name: 'visitors'
				});
			}
		}
	},
	beforeMount() {
		this.isAuthorized();
	}
}
</script>

<template>
	<form @submit="registartion">
		<router-link to="/">
			<p class="text">&lt; назад</p>
		</router-link>
		<h2 class="form-title">Регистрация</h2>
		<div class="block">
			<p>Логин:</p>
			<input type="text" class="input" v-model="login">
		</div>
		<div class="block">
			<p>Пароль:</p>
			<input type="password" class="input" v-model="password">
		</div>
		<div class="block">
			<p>Подтвердите пароль:</p>
			<input type="password" class="input" v-model="verification">
		</div>
		<div class="block">
			<p>ФИО:</p>
			<input type="text" class="input" v-model="fio">
		</div>
		<div class="block">
			<p>Тип аккаунта</p>
			<select class="input select" v-model="type">
				<option v-for="item in [
					{ value: 'home', text: 'Домашний'},
					{ value: 'business', text: 'Бизнес'},
					{ value: 'neurobusiness', text: 'Бизнес с нейросетями'},
					{ value: 'ebsbusiness', text: 'Бизнес с ЕБС'},
					{ value: 'businesplus', text: 'Бизнес всё включено'}
				]" :value="item.value">
					{{ item.text }}
				</option>
			</select>
		</div>
		<div class="block">
			<p>Username/название компании:</p>
			<input type="text" class="input" v-model="username">
		</div>
		<p class="error">{{ errmsg }}</p>
		<button class="button">Зарегистрироваться</button>
		<div class="text-container">
			<router-link to="/login">
				<p class="text">Войти</p>
			</router-link>
		</div>
	</form>
</template>

<style>
</style>