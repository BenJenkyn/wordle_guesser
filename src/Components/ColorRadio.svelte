<script>
	export let guess;
	export let letter;
	export let isStartTyping;
	export let letterIndex;
</script>

<label
	class="container"
	aria-label={`letter-${letterIndex}-color-selector-${guess}`}
>
	<input
		type="radio"
		bind:group={letter.guessType}
		value={guess}
		on:click={() => {
			isStartTyping = true;
		}}
	/>
	<span class={`checkmark checkmark-${guess}`} />
</label>

<style>
	.container {
		display: block;
		position: relative;
		padding-left: 35px;
		margin-top: 0.1rem;
		cursor: pointer;
		font-size: 1em;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.container input {
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}

	.checkmark {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
	}
	.checkmark-grey {
		background-color: var(--dark-grey);
	}
	.checkmark-yellow {
		background-color: var(--dark-yellow);
	}
	.checkmark-green {
		background-color: var(--dark-green);
	}

	.container:hover input ~ .checkmark-grey {
		background-color: #565758;
	}
	.container:hover input ~ .checkmark-yellow {
		background-color: #c9b458;
	}
	.container:hover input ~ .checkmark-green {
		background-color: #6aaa64;
	}
	@media only screen and (min-width: 600px) {
		.container {
			font-size: 1.375em;
		}
	}
</style>
