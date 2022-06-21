<script lang="ts">
	import { GuessType } from '../App.svelte';
    
    
	export let textValue: string;
	export let inputRef: HTMLInputElement;
	export let onKeyDown: (event: KeyboardEvent) => void;
	export let assignRefs;
	export let guessType: GuessType;
    
	let guessTypes = [GuessType.grey, GuessType.yellow, GuessType.green];

	console.log(guessType);
</script>

<div>
	<input
		type="text"
		bind:value={textValue}
		maxlength="1"
		bind:this={inputRef}
		use:assignRefs
		on:keydown={onKeyDown}
		required
	/>
    {#each guessTypes as guess}
        <input type="radio" bind:group={guessType} value={guess}/>
    {/each}
</div>
