<script>
import axios from 'axios';

export default {
	data() {
		return {
			checkpoints: [],
			msg: '',
			name: '',
			username: ''
		};
	},
	mounted() {
		this.loadCheckpoints();
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
		async loadCheckpoints(){
			if(this.$route.params.id) {
				const response = await axios.get('/checkpoints/get', {
					params: {
						id: this.$route.params.id
					}
				});
				
				if(response.data.code == 0) {
					this.checkpoints = response.data.msg;
					this.msg = '';
				} else {
					this.msg = response.data.msg;
					this.checkpoints = [];
				}
			}

			this.name = this.$route.params.point;
		},
		async addCheckpoint() {
			if(this.$route.params.id) {
				await axios.get('/checkpoints/add', {
					params: {
						id: this.$route.params.id
					}
				});
				
				this.loadCheckpoints();
			}
		},
		async deleteCheckpoint(id) {
			await axios.get('/checkpoints/delete', {
				params: {
					id: id
				}
			});
			
			this.loadCheckpoints();
		}
	}
}
</script>
<template>
	<div class="buttons-container">
		<div class="switch-box">
			<button class="switch-buttons" @click="goVisitors">Посетители</button>
			<button class="switch-buttons" @click="goPoints">Точки</button>
		</div>
		<button class="button" @click="addCheckpoint">Добавить КПП</button>
	</div>
	<h3 class="subtitle">Список КПП точки {{ name }}</h3>
	<p class="msg">{{ msg }}</p>
	<div class="cards">
		<div class="card flex" v-for="item in checkpoints">
			<img src="@/assets/qrcode.png" class="qr" alt="QR-код">
			<div class="description">
				<h4 class="title">{{ item._id }}</h4>
				<div class="buttons-box">
					<button class="button">Развернуть</button>
					<button class="button">Открыть</button>
					<button class="button delete" @click="deleteCheckpoint(item._id)">Удалить</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style>

</style>