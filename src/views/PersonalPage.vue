<script>
import axios from 'axios';
import VisitorsTable from '@/components/VisitorsTable.vue';
import VisitsTable from '@/components/VisitsTable.vue';
import PointsCards from '@/components/PointsCards.vue';
import CheckpointsCards from '@/components/CheckpointsCards.vue';

export default {
	data() {
		return {};
	},
	components: {
		VisitorsTable,
		VisitsTable,
		PointsCards,
		CheckpointsCards
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
		goRights() {
			this.$router.push({
				name: 'rights'
			});
		},
		goAdd() {
			this.$router.push({
				name: 'add'
			});
		},
		async isAuthorized() {
			const response = await axios.get('/account/authorized');

			if(response.data.code != 0) {
				this.$router.push({
					name: 'business'
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
	<main class="personal">
		<h2 class="title">КВАНТОРИУМ</h2>
		<div class="buttons-container">
			<div class="switch-box">
				<button class="switch-buttons" :class="{ 'active': $route.name == 'visitors' }"@click="goVisitors">Посетители</button>
				<button class="switch-buttons" :class="{ 'active': $route.name == 'points' }" @click="goPoints">Точки</button>
			</div>
			<div class="buttons-box" v-if="$route.name == 'visitors'">
				<button class="button">Только сотрудникам</button>
				<button class="button" @click="goRights">Выдать права</button>
			</div>
			<button class="button" @click="goAdd" v-if="$route.name == 'points'">Добавить точку</button>
			<button class="button" v-if="$route.name == 'checkpoints'">Добавить КПП</button>
		</div>
		<VisitorsTable v-if="$route.name == 'visitors'" />
		<VisitsTable v-if="$route.name == 'visits'" />
		<PointsCards v-if="$route.name == 'points'" />
		<CheckpointsCards v-if="$route.name == 'checkpoints'" />
	</main>
</template>

<style>

</style>