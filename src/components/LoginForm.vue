<script>
import axios from 'axios';

export default {
	data() {
		return {
			login: '',
			password: '',
			errmsg: ''
		}
	},
	methods: {
		async authorization(evt) {
			evt.preventDefault();

			if(this.login.length > 0 && this.password.length > 0) {
				const response = await axios.post('/account/authorization', {
					login: this.login,
					password: this.password
				});

				if(response.data.code == 0) {
					this.login = '';
					this.password = '';

					this.$router.push({
						name: 'visitors'
					});
				} else {
					this.errmsg = response.data.msg;
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
	<form @submit="authorization">
		<router-link to="/">
			<p class="text">&lt; назад</p>
		</router-link>
		<h2 class="form-title">Вход</h2>
		<div class="block">
			<p>Логин:</p>
			<input type="text" class="input" v-model="login">
		</div>
		<div class="block">
			<p>Пароль:</p>
			<input type="password" class="input" v-model="password">
		</div>
		<p class="error">{{ errmsg }}</p>
		<button class="button">Войти</button>
		<div class="text-container">
			<router-link to="/registration">
				<p class="text">Зарегистрироваться</p>
			</router-link>
		</div>
	</form>
</template>

<style>
</style>