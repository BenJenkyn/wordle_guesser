<script lang="ts">
	import type { Letter } from '../App.svelte';

	export let letter: Letter;
	export let isStartTyping: boolean;
	export let letterIndex: number;
	export let inputRefs: HTMLInputElement[] = [];
	export let onInput: (e: Event) => Promise<void>;
	export let onKeyDown: (e: KeyboardEvent) => Promise<void>;
	export let assignRefs: (node: HTMLInputElement) => void;
</script>

<input
	type="text"
	bind:value={letter.letter}
	maxlength="1"
	bind:this={inputRefs[letterIndex]}
	use:assignRefs
	on:input={onInput}
	on:keydown={onKeyDown}
	required
	class={`letter-input ${
		isStartTyping ? `letter-input-${letter.guessType}` : ''
	}`}
	aria-label={`letter-input-${letterIndex}`}
/>

<style>
	.letter-input {
		height: 45.2px;
		width: 45.2px;
		font-size: 1rem;
		text-align: center;
		font-weight: bold;
		background-color: var(--dark-grey);
		color: white;
		border-width: 0px;
		border-radius: 0px;
		margin-bottom: 1rem;
	}

	.letter-input-grey {
		background-color: var(--dark-grey);
	}
	.letter-input-yellow {
		background-color: var(--dark-yellow);
	}
	.letter-input-green {
		background-color: var(--dark-green);
	}
	@media only screen and (min-width: 600px) {
		.letter-input {
			height: 62px;
			width: 62px;
		}

		.letter-input {
			font-size: 2rem;
		}
	}
</style>
