<script context="module" lang="ts">
	export enum GuessType {
		grey = 'grey',
		yellow = 'yellow',
		green = 'green',
	}
</script>

<script lang="ts">
	import { getWordList } from './lib/getWordList';

	let wordList: string[];
	getWordList()
		.then((res) => {
			res.forEach((word, idx) => {
				res[idx] = word.toUpperCase();
			});
			wordList = res;
		})
		.catch((error) => console.error(error));
	let wordGuess = [
		{
			letter: '',
			guessType: GuessType.grey,
		},
		{
			letter: '',
			guessType: GuessType.grey,
		},
		{
			letter: '',
			guessType: GuessType.grey,
		},
		{
			letter: '',
			guessType: GuessType.grey,
		},
		{
			letter: '',
			guessType: GuessType.grey,
		},
	];

	let guessTypes = [GuessType.grey, GuessType.yellow, GuessType.green];
	let inputRefs: HTMLInputElement[] = [];

	function assignRefs(el) {
		inputRefs.push(el);
	}

	function onKeyDown(event: KeyboardEvent) {
		inputRefs.forEach((ref, idx) => {
			if (ref === event.currentTarget) {
				if (event.key === 'Backspace') {
					event.preventDefault();
					ref.value = '';
					inputRefs[idx > 0 ? idx - 1 : 0].focus();
				} else if (event.keyCode >= 65 && event.keyCode <= 90) {
					event.preventDefault();
					wordGuess[idx].letter = event.key.toUpperCase();
					ref.value = event.key.toUpperCase();
					inputRefs[idx < inputRefs.length ? idx + 1 : idx].focus();
				}
			}
		});
	}

	function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		let tempWordList = wordList;
		wordGuess.forEach((letter, idx) => {
			switch (letter.guessType) {
				case GuessType.grey: {
					debugger;
					tempWordList = tempWordList.filter((word) => {
						if (word.includes(letter.letter)) {
							console.log(letter.letter);
							return false;
						}
						return true;
					});
					break;
				}
				case GuessType.green: {
					tempWordList = tempWordList.filter((word) => {
						if (letter.letter === word[idx]) {
							return true;
						}
						return false;
					});
					break;
				}
				case GuessType.yellow: {
					tempWordList = tempWordList.filter((word) => {
						if (word.includes(letter.letter) && letter.letter !== word[idx]) {
							return true;
						}
						return false;
					});
					break;
				}
			}
			// Resets the form
			letter.letter = '';
			letter.guessType = GuessType.grey;
		});
		wordList = tempWordList;
	}
</script>

<main>
	<h1>Input Wordle Guess</h1>
	<form on:submit={onSubmit}>
		{#each wordGuess as letter, index}
			<input
				type="text"
				bind:value={letter.letter}
				maxlength="1"
				bind:this={inputRefs[index]}
				use:assignRefs
				on:keydown={onKeyDown}
				required
			/>
			{#each guessTypes as guess}
				<input type="radio" bind:group={letter.guessType} value={guess} />
			{/each}
			<p>{letter.guessType}</p>
		{/each}
		<button>Submit</button>
	</form>
	<div>
		<p>{wordList}</p>
	</div>
</main>
