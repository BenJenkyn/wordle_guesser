<script>
	export let letter;
	export let isStartTyping;
	export let inputRefs;
	export let onInput;
	export let onKeyDown;
	export let assignRefs;
	export let index;
	export let guessTypes;

  import InputBox from './InputBox.svelte';
  import ColorRadios from './ColorRadios.svelte';
</script>

<div class="letter-inputs">
	<InputBox
		{letter}
		{isStartTyping}
		{inputRefs}
		{onInput}
		{onKeyDown}
		{assignRefs}
		letterIndex={index}
	/>
	<ColorRadios
		{guessTypes}
		bind:letter
		bind:isStartTyping
		letterIndex={index}
	/>
</div>
