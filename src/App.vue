<script>
import AppBg from './components/AppBg.vue'
import AppHeader from './components/AppHeader.vue'
import { RouterView } from 'vue-router'

export default {
	methods: {
		isNot() {
			if (
				this.$route.name == 'login' ||
				this.$route.name == 'registration' ||
				this.$route.name == 'edit' ||
				this.$route.name == 'add' ||
				this.$route.name == 'rights'
			)
				return true;
			else
				return false;
		},
		isRegistered() {
			if (this.$route.name == 'visitors' || this.$route.name == 'points' || this.$route.name == 'checkpoints' || this.$route.name == 'visits' || this.$route.name == 'ebs')
				return true;
			else
				return false;
		}
	},
	components: {
		AppHeader,
		AppBg
	}
}
</script>

<template>
	<AppHeader :class="{'d-none': isNot()}"/>
	<div class="container" :class="{'registered': isRegistered()}">
		<RouterView />
	</div>
	<AppBg />
</template>

<style>
</style>
