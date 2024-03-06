<script>
export default {
	data() {
		return {}
	},
	methods: {
		goRegistration(type) {
			this.$router.push({
				name: 'registration',
				params: {
					type: type
				}
			});
		}
	}
}
</script>
<template>
	<div class="tarifs">
		<h2 class="tarifs-title">Тарифы</h2>
		<div class="businesess">
			<div class="card">
				<img src="@/assets/home.png" alt="" class="image">
				<h3 class="title card-title">Домашний</h3>
				<button class="button" @click="goRegistration('home')">Подключить</button>
			</div>
			<div class="card">
				<img src="@/assets/business.png" alt="" class="image">
				<h3 class="title card-title">Бизнес</h3>
				<button class="button" @click="goRegistration('business')">Подключить</button>
			</div>
			<div class="card">
				<img src="@/assets/neurobusiness.png" alt="" class="image">
				<h3 class="title card-title">Бизнес c нейросетями</h3>
				<button class="button" @click="goRegistration('neurobusiness')">Подключить</button>
			</div>
			<div class="card">
				<img src="@/assets/ebsbusiness.png" alt="" class="image">
				<h3 class="title card-title">Бизнес с ЕБС</h3>
				<button class="button" @click="goRegistration('ebsbusiness')">Подключить</button>
			</div>
			<div class="card">
				<img src="@/assets/businessplus.png" alt="" class="image">
				<h3 class="title card-title">Бизнес всё включено</h3>
				<button class="button" @click="goRegistration('businessplus')">Подключить</button>
			</div>
		</div>
	</div>
</template>

<style>
</style>