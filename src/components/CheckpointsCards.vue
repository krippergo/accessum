<script>
export default {
    data() {
        return {};
    },
    methods: {
	}
}
</script>
<template>
	<h3 class="subtitle">Список КПП КВАНТОРИУМ63</h3>
	<div class="cards">
		<div class="card flex">
			<img src="@/assets/qrcode.png" class="qr" alt="QR-код">
			<div class="description">
				<div>
					<h4 class="title">№1</h4>
					<p class="text">Логин точки: point login</p>
					<p class="text">Пароль точки: point password</p>
				</div>
				<div class="buttons-box">
					<button class="button" @click="goCheckpoints">Удалить</button>
					<button class="button" @click="goCheckpoints">Открыть</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style>

</style>