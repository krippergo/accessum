<script>
export default {
	data() {
		return {
			
		}
	},
	methods: {
		isNot() {
			if (
				this.$route.name == 'login' ||
				this.$route.name == 'registration' ||
				this.$route.name == 'edit' ||
				this.$route.name == 'add' ||
				this.$route.name == 'rights' ||
				this.$route.name == 'home'
			)
				return true;
			else
				return false;
		},
		isRegistered() {
			if (this.$route.name == 'visitors' || this.$route.name == 'points' || this.$route.name == 'checkpoints' || this.$route.name == 'visits')
				return true;
			else
				return false;
		}
	},
}
</script>
<template>
	<div class="background" :class="{'not-full': isRegistered()}">
		<img src="@/assets/business.png" class="background-image" :class="{'d-none': isNot()}">
		<img src="@/assets/home.png" class="background-image" v-if="$route.name == 'home'">
		<div class="gradient" :class="{'d-none': !isNot()}"></div>
	</div>
</template>

<style>
</style>