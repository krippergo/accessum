<script>
import axios from 'axios';

export default {
	data() {
		return {
			login: '',
			password: '',
			verification: '',
			fio: '',
			type: this.$route.params.type,
			username: '',
			errmsg: ''
		}
	},
	methods: {
		async registartion(evt) {
			evt.preventDefault();

			if(
				this.login.length > 0 &&
				this.password.length > 0 &&
				this.verification.length > 0 &&
				this.fio.length > 0 &&
				this.type.length > 0 &&
				this.username.length > 0 &&
				(
					this.type == 'home' ||
					this.type == 'business' ||
					this.type == 'neurobusiness' ||
					this.type == 'ebsbusiness' ||
					this.type == 'businessplus'
				)
			) {
				if(this.password.length >= 8) {
					if(this.password == this.verification) {
						const response = await axios.post('/server/account/registration', {
							login: this.login,
							password: this.password,
							fio: this.fio,
							type: this.type,
							username: this.username
						});

						if(response.data.ok) {
							this.login = '';
							this.password = '';
							this.verification = '';
							this.fio = '';
							this.type = this.$route.params.type;
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
		async authentication() {
			const response = await axios.get('/server/account/authentication');

			if(response.data.ok) {
				this.$router.push({
					name: 'visitors'
				});
			}
		}
	},
	mounted() {
		this.authentication();
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
				<option value="home">Домашний</option>
				<option value="business">Бизнес</option>
				<option value="neurobusiness">Бизнес с нейросетями</option>
				<option value="ebsbusiness">Бизнес с ЕБС</option>
				<option value="businessplus">Бизнес всё включено</option>
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