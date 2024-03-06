<script>
import axios from 'axios';

export default {
	data() {
		return {
			pointsOwner: [],
			pointsAvailable: [],
			msg: ''
		};
	},
	methods: {
		goAdd() {
			this.$router.push({
				name: 'add'
			});
		},
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
		goVisits() {
			this.$router.push({
				name: 'visits'
			});
		},
		goCheckpoints(id, point) {
			this.$router.push({
				name: 'checkpoints', 
				params: {
					id: id,
					point: point
				}
			});
		},
		async loadPoints() {
			const response = await axios.get('/server/points/data');

			if(response.data.ok) {
				this.pointsOwner = response.data.msg.owner;
				this.pointsAvailable = response.data.msg.available;
				this.msg = '';
			} else {
				this.msg = response.data.msg;
				this.pointsOwner = [];
				this.pointsAvailable = [];
			}
		},
		async deletePoint(point_id) {
			await axios.delete('/server/points/delete', {
				params: {
					id: point_id
				}
			});

			this.loadPoints();
		}
	},
	mounted() {
		this.loadPoints();
	}
}
</script>
<template>
	<div class="buttons-container">
		<div class="switch-box">
			<button class="switch-buttons" @click="goVisitors">Посетители</button>
			<button class="switch-buttons active"  @click="goPoints">Точки</button>
		</div>
		<button class="button" @click="goAdd" v-if="$route.name == 'points'">Добавить точку</button>
	</div>
	<h3 class="subtitle">Список точек</h3>
	<p class="msg">{{ msg }}</p>
	<div class="cards">
		<div class="card" v-for="item in pointsOwner">
			<h4 class="title">{{ item.name }}</h4>
			<p class="text">Владелец</p>
			<div class="buttons-box">
				<button class="button" @click="goVisits">Посещения</button>
				<button class="button" @click="goCheckpoints(item._id, item.name)">КПП</button>
				<button class="button delete" @click="deletePoint(item._id)">Удалить</button>
			</div>
		</div>
		<div class="card" v-for="item in pointsAvailable">
			<h4 class="title">{{ item.name }}</h4>
			<p class="text">Правообладатель</p>
			<div class="buttons-box">
				<button class="button" @click="goVisits">Посещения</button>
				<button class="button" @click="goCheckpoints(item._id, item.name)">КПП</button>
			</div>
		</div>
	</div>
</template>

<style>

</style>