<script>
import axios from 'axios';
import VisitorsTable from '@/components/VisitorsTable.vue';
import VisitsTable from '@/components/VisitsTable.vue';
import PointsCards from '@/components/PointsCards.vue';
import CheckpointsCards from '@/components/CheckpointsCards.vue';

export default {
	data() {
		return {
			username: 'Загрузка...'
		};
	},
	components: {
		VisitorsTable,
		VisitsTable,
		PointsCards,
		CheckpointsCards
	},
	methods: {
		async authentication() {
			const response = await axios.get('/server/account/authentication');

			if(!response.data.ok) {
				this.$router.push({
					name: 'business'
				});
			}
		},
		async loadAccount() {
			const response = await axios.get('/server/account/data');

			if(response.data.ok) {
				this.username = response.data.msg.username;
			}
		}
	},
	mounted() {
		this.authentication();
		this.loadAccount();
	}
}
</script>
<template>
	<main class="personal">
		<h2 class="title">{{ username }}</h2>
		<VisitorsTable v-if="$route.name == 'visitors'" />
		<VisitsTable v-if="$route.name == 'visits'" />
		<PointsCards v-if="$route.name == 'points'" />
		<CheckpointsCards v-if="$route.name == 'checkpoints'" />
	</main>
</template>

<style>

</style>