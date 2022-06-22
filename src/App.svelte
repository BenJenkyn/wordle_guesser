<script context="module" lang="ts">
	export enum GuessType {
		grey = 'grey',
		yellow = 'yellow',
		green = 'green',
	}
</script>

<script lang="ts">
	import { getWordList } from './lib/getWordList';

	const wordListFilled = 'word-list-filled';
	const maxGuesses = 5;

	let wordList: string[] = [];
	let wordLists: string[][] = [];
	let guessedWords: {
		letter: string;
		guessType: GuessType;
	}[][] = [];
	let isLoading = true;
	getWordList()
		.then((res) => {
			res.forEach((word, idx) => {
				res[idx] = word.toUpperCase();
			});
			wordList = res;
			wordLists = [...wordLists, wordList];
			isLoading = false;
		})
		.catch((error) => {
			console.error(error);
			isLoading = false;
		});
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

	function assignRefs(el: HTMLInputElement) {
		inputRefs.push(el);
	}

	async function onKeyDown(event: KeyboardEvent) {
		inputRefs.forEach((ref, idx) => {
			if (ref === event.currentTarget) {
				if (event.key === 'Backspace') {
					event.preventDefault();
					if (ref.value.length === 0) {
						inputRefs[idx > 0 ? idx - 1 : 0].value = '';
						wordGuess[idx > 0 ? idx - 1 : 0].letter = '';
						inputRefs[idx > 0 ? idx - 1 : 0].focus();
					}
					ref.value = '';
					wordGuess[idx].letter = '';
				} else if (
					event.keyCode >= 65 &&
					event.keyCode <= 90 &&
					event.altKey === false &&
					event.metaKey === false
				) {
					event.preventDefault();
					wordGuess[idx].letter = event.key.toUpperCase();
					ref.value = event.key.toUpperCase();
					wordGuess[idx].letter = event.key.toUpperCase();
					inputRefs[idx < inputRefs.length - 1 ? idx + 1 : idx].focus();
				}
			}
		});
	}

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		let tempWordList = wordList;
		if (guessedWords.length === maxGuesses) {
			return;
		}
		guessedWords = [...guessedWords, structuredClone(wordGuess)];
		wordGuess.forEach((letter, idx) => {
			switch (letter.guessType) {
				case GuessType.grey: {
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
			inputRefs[idx].value = '';
			letter.guessType = GuessType.grey;
		});
		inputRefs[0].focus();
		wordList = tempWordList;
		wordLists = [...wordLists, wordList];
		console.log(wordLists);
	}

	function onUndo() {
		guessedWords = [...guessedWords.slice(0, guessedWords.length - 1)];
		wordLists = [...wordLists.slice(0, wordLists.length - 1)];
		wordList = wordLists[wordLists.length - 1];
	}
</script>

<main>
	<h1>Input Wordle Guess</h1>
	{#if guessedWords.length > 0}
		<div class="guessed-words">
			{#each guessedWords as guessedWord}
				<div class={`guessed-word`}>
					{#each guessedWord as letter}
						<p class={`guess-letter guess-letter-${letter.guessType}`}>
							{letter.letter}
						</p>
					{/each}
				</div>
			{/each}
		</div>
	{/if}
	{#if guessedWords.length === maxGuesses}
		<div style="text-align: center;">
			<p>You've reached the end of your guesses</p>
			<p>Time to make your final decision</p>
		</div>
	{/if}
	<form on:submit={onSubmit}>
		<div class="word-area">
			{#each wordGuess as letter, index}
				<div class="letter-inputs">
					<input
						type="text"
						bind:value={letter.letter}
						maxlength="1"
						bind:this={inputRefs[index]}
						use:assignRefs
						on:keydown={onKeyDown}
						required
						class={`letter-input letter-input-${letter.guessType}`}
					/>
					<div class="radios">
						{#each guessTypes as guess}
							<label class="container">
								<input
									type="radio"
									bind:group={letter.guessType}
									value={guess}
								/>
								<span class={`checkmark checkmark-${guess}`} />
							</label>
						{/each}
					</div>
				</div>
			{/each}
		</div>
		<button class="submit-button">Submit</button>
		{#if wordLists.length > 1}
			<button class="submit-button" type="button" on:click={onUndo}>
				Undo
			</button>
		{/if}
	</form>
	<h2 style="text-align: center;">
		Filtered Word List ({wordList.length} Possible Words)
	</h2>
	<div class={`word-list ${wordList.length > 0 ? wordListFilled : ''}`}>
		{#if isLoading}
			<p>loading...</p>
		{:else if wordList.length === 0}
			<p>NO WORDS AVALIBLE...</p>
		{:else}
			{#each wordList as word}
				<p>{word}</p>
			{/each}
		{/if}
	</div>
</main>

<style>
	h1 {
		text-align: center;
	}

	form {
		text-align: center;
	}

	.letter-input {
		height: 45.2px;
		width: 45.2px;
		font-size: 1rem;
		text-align: center;
		font-weight: bold;
		background-color: black;
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

	.word-area {
		display: flex;
		gap: 5px;
		justify-content: center;
	}

	.radios {
		display: flex;
		flex-direction: column;
		border-width: 1px;
	}

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

	.submit-button {
		align-self: center;
		border-width: 0px;
		background-color: grey;
		color: white;
		height: 2rem;
		width: 10rem;
		margin-top: 1rem;
	}

	.submit-button:hover {
		color: grey;
		background-color: white;
		border-color: grey;
		border-width: 1px;
		cursor: pointer;
	}

	.guessed-words {
		display: grid;
		justify-content: center;
		border-color: var(--dark-border);
		border-width: 2px;
		border-style: solid;
		max-width: 200px;
		margin: auto;
		margin-bottom: 10px;
	}

	.guessed-word {
		display: grid;
		/* flex-direction: row; */
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
	}

	.guess-letter {
		display: flex;
		height: 30px;
		width: 30px;
		justify-content: center;
		align-items: center;
	}

	.guess-letter-grey {
		background-color: var(--dark-grey);
	}
	.guess-letter-yellow {
		background-color: var(--dark-yellow);
	}
	.guess-letter-green {
		background-color: var(--dark-green);
	}

	.word-list {
		margin: auto;
		display: grid;
		max-width: 90%;
		border-color: var(--dark-border);
		border-width: 2px;
		border-style: solid;
		text-align: center;
		margin-top: 1rem;
	}

	.word-list-filled {
		grid-template-columns: repeat(4, 1fr);
	}

	@media only screen and (min-width: 600px) {
		.letter-input {
			height: 62px;
			width: 62px;
		}

		.letter-input {
			font-size: 2rem;
		}

		.container {
			font-size: 1.375em;
		}

		.word-list-filled {
			grid-template-columns: repeat(5, 1fr);
		}

		.word-list p {
			font-size: 1.5em;
		}
	}
</style>
