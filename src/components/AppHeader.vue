<script>
import axios from 'axios';

export default {
	data() {
		return {
			settingsIsOpen: false,
			ebs: false,
			network: false
		}
	},
	methods: {
		isRegistered() {
			if (this.$route.name == 'visitors' || this.$route.name == 'points' || this.$route.name == 'checkpoints' || this.$route.name == 'visits' || this.$route.name == 'ebs')
				return true;
			else
				return false;
		},
		goLogin() {
			this.$router.push({
				name: 'login'
			});
		},
		accountSettings() {
			this.settingsIsOpen = !this.settingsIsOpen;
		},
		async accountExit() {
			this.accountSettings();

			await axios.get('/server/account/exit');

			this.$router.push({
				name: 'business'
			});
		},
		async loadAccount() {
			const response = await axios.get('/server/account/data');

			if(response.data.ok) {
				if(response.data.msg.type == 'ebsbusiness' || response.data.msg.type == 'businessplus') {
					this.ebs = true;
				} else {
					this.ebs = false;
				}

				if(response.data.msg.type == 'neuralbusiness' || response.data.msg.type == 'businessplus') {
					this.network = true;
				} else {
					this.network = false;
				}
			}
		}
	},
	mounted() {
		this.loadAccount();
	}
}
</script>
<template>
	<header class="header" :class="{ 'dark-border': isRegistered() }">
		<router-link to="/" v-if="!isRegistered()">
			<h1 class="title">ACCESSUM</h1>
		</router-link>
		<router-link to="/visitors" v-if="isRegistered()">
			<h1 class="title">ACCESSUM</h1>
		</router-link>
		<button class="button" :class="{ 'd-none': isRegistered() }" @click="goLogin">Войти</button>
		<button class="button" :class="{ 'd-none': !isRegistered() }" @click="accountSettings">Аккаунт</button>
		<div class="settings" :class="{ 'd-none': !settingsIsOpen || !isRegistered() }">
			<router-link to="/edit">
				<div class="settings-text" @click="accountSettings">
					<p>Изменить пароль</p>
				</div>
			</router-link>
			<a href="https://colab.research.google.com/drive/14D9Avl0kkGa5OhzhUNu_4ssLmblGCo7C?usp=sharing" target="_blank" rel="noopener noreferrer" v-if="network">
				<div class="settings-text" @click="accountSettings">
					<p>Нейросеть</p>
				</div>
			</a>
			<router-link to="/ebs" v-if="ebs">
				<div class="settings-text" @click="accountSettings">
					<p>ЕБС</p>
				</div>
			</router-link>
			<div class="settings-text" @click="accountExit">
				<p>Выйти</p>
			</div>
		</div>
	</header>
</template>

<style>
</style>