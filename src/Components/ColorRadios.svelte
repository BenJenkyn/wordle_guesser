<script>
	export let guessTypes;
	export let letter;
	export let isStartTyping;
	export let letterIndex;

	import ColorRadio from './ColorRadio.svelte';
</script>

<div class="radios">
	{#each guessTypes as guess}
		<ColorRadio {guess} bind:letter bind:isStartTyping {letterIndex} />
	{/each}
</div>

<style>
	.radios {
		display: flex;
		flex-direction: column;
		border-width: 1px;
	}
</style>
