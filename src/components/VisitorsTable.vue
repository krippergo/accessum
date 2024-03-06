<script>
import axios from 'axios';

export default {
	data() {
		return {
			username: '',
			opened: true,
			text: ''
		};
	},
	methods: {
		goVisitors() {
			this.$router.push({
				name: 'visitors'
			});
		},
		goPoints() {
			this.$router.push({
				name: 'points'
			});
		},
		async rights() {
			await axios.put('/server/account/opened');

			this.loadAccount();
		},
		async loadAccount() {
			const response = await axios.get('/server/account/data');

			if(response.data.ok) {
				this.username = response.data.msg.username;
				this.opened = response.data.msg.opened;

				if(this.opened)
					this.text = 'Только правообладателям';
				else
					this.text = 'Вход всем'
			}
		}
	},
	mounted() {
		this.loadAccount();
	}
}
</script>
<template>
	<div class="buttons-container">
		<div class="switch-box">
			<button class="switch-buttons active" @click="goVisitors">Посетители</button>
			<button class="switch-buttons" @click="goPoints">Точки</button>
		</div>
		<button class="button" @click="rights" v-if="$route.name == 'visitors'">{{ text }}</button>
	</div>
	<h3 class="subtitle">Таблица посетителей</h3>
	<div class="table">
		<header class="header">
			<div class="cell two">ФИО</div>
			<div class="cell one">Роль</div>
			<div class="cell three">Точки</div>
			<div class="cell one">Права</div>
		</header>
		<div class="row">
			<div class="cell two">Иванов Иван Иванович</div>
			<div class="cell one">Правообладатель</div>
			<div class="cell three">КВАНТОРИУМ63;</div>
			<div class="cell one">
				<button class="button delete">Забрать</button>
			</div>
		</div>
	</div>
</template>

<style>

</style>