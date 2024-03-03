<script>
export default {
    data() {
        return {};
    },
    methods: {
		goVisits(id) {
			this.$router.push({
				path: '/visits/' + id
			});
		}
	}
}
</script>
<template>
	<h3 class="subtitle">Таблица посетителей</h3>
	<div class="table">
		<header class="header">
			<div class="cell two">ФИО</div>
			<div class="cell one">Роль</div>
			<div class="cell three">Точки</div>
			<div class="cell one">Посещения</div>
		</header>
		<div class="row">
			<div class="cell two">Иванов Иван Иванович</div>
			<div class="cell one">Сотрудник</div>
			<div class="cell three">КВАНТОРИУМ63;</div>
			<div class="cell one">
				<button class="button" @click="goVisits('id')">Посмотреть</button>
			</div>
		</div>
		<div class="row">
			<div class="cell two">Петров Пётр Петрович</div>
			<div class="cell one">Посетитель</div>
			<div class="cell three">КВАНТОРИУМ63;</div>
			<div class="cell one">
				<button class="button" @click="goVisits('id')">Посмотреть</button>
			</div>
		</div>
		<div class="row">
			<div class="cell two">Васильев Василий Васильевич</div>
			<div class="cell one">Посетитель</div>
			<div class="cell three">КВАНТОРИУМ63;</div>
			<div class="cell one">
				<button class="button" @click="goVisits('id')">Посмотреть</button>
			</div>
		</div>
	</div>
</template>

<style>

</style>