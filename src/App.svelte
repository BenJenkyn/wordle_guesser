<script context="module" lang="ts">
	export enum GuessType {
		grey = 'grey',
		yellow = 'yellow',
		green = 'green',
	}

	export type Letter = {
		letter: string;
		guessType: GuessType;
	};
</script>

<script lang="ts">
	import { getWordList, getAllPossibleAnswersList } from './lib/getWordList';
	import ConfirmModal from './Components/ConfirmModal.svelte';
	import ColorRadios from './Components/ColorRadios.svelte';
	import InputBox from './Components/InputBox.svelte';

	let showModal = false;

	const wordListFilled = 'word-list-filled';
	const maxGuesses = 5;
	const wordLength = 5;

	let isStartTyping = false;

	let answersList: string[] = [];
	let answersLists: string[][] = [];

	let allPossibleAnswersList: string[] = [];

	let guessedWords: Letter[][] = [];

	let isLoadingAnswers = true;
	let isLoadingAllAnswersList = true;
	let isInvalidWord = false;

	getWordList()
		.then((res) => {
			res.forEach((word, idx) => {
				res[idx] = word.toUpperCase();
			});
			answersList = res;
			answersLists = [...answersLists, answersList];
			isLoadingAnswers = false;
		})
		.catch((error) => {
			console.error(error);
			isLoadingAnswers = false;
		});

	getAllPossibleAnswersList()
		.then((res) => {
			res.forEach((word, idx) => {
				res[idx] = word.toUpperCase();
			});
			allPossibleAnswersList = res;
			isLoadingAllAnswersList = false;
		})
		.catch((error) => {
			console.error(error);
			isLoadingAllAnswersList = false;
		});

	let wordGuess: Letter[] = Array.from({ length: wordLength }, () => ({
		letter: '',
		guessType: GuessType.grey,
	}));

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
				}
			}
		});
		isStartTyping = true;
	}

	async function onInput(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		const idx = inputRefs.findIndex((ref) => ref === target);

		if (idx > -1) {
			const value = target.value.toUpperCase();
			wordGuess[idx].letter = value;
			target.value = value;

			if (value.length === 1 && idx < inputRefs.length - 1) {
				setTimeout(() => {
					inputRefs[idx + 1].focus();
				}, 0);
			}
		}
		isStartTyping = true;
	}

	function onSubmit(event: SubmitEvent) {
		isInvalidWord = false;
		event.preventDefault();
		let tempWordList = answersList;
		if (guessedWords.length === maxGuesses) {
			return;
		}
		const guessedWordString = wordGuess.reduce((acc, currWord) => {
			return (acc = `${acc}${currWord.letter}`);
		}, '');
		if (
			!allPossibleAnswersList.includes(guessedWordString) &&
			!answersLists[0].includes(guessedWordString)
		) {
			isInvalidWord = true;
			return;
		}

		guessedWords = [...guessedWords, JSON.parse(JSON.stringify(wordGuess))];
		wordGuess.forEach((letter, idx) => {
			const hasDifferentGuessType = guessedWords[guessedWords.length - 1].some(
				(l) => {
					return l.letter === letter.letter && l.guessType !== letter.guessType;
				}
			);
			switch (letter.guessType) {
				case GuessType.grey: {
					if (!hasDifferentGuessType) {
						tempWordList = tempWordList.filter((word) => {
							if (word.includes(letter.letter)) {
								console.log(letter.letter);
								return false;
							}
							return true;
						});
					}
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
		answersList = tempWordList;
		answersLists = [...answersLists, answersList];
		console.log(answersLists);
		isStartTyping = false;
	}

	function onUndo() {
		if (guessedWords.length > 0) {
			const lastGuessedWord = guessedWords[guessedWords.length - 1];
			wordGuess = [...lastGuessedWord];
			isStartTyping = true;
		}
		guessedWords = [...guessedWords.slice(0, guessedWords.length - 1)];
		answersLists = [...answersLists.slice(0, answersLists.length - 1)];
		answersList = answersLists[answersLists.length - 1];
	}

	function onClear() {
		showModal = true;
	}

	function onClearConfirmed() {
		guessedWords = [];
		answersLists = [answersLists[0]];
		answersList = answersLists[0];
		showModal = false;
	}
</script>

<main>
	<h1>Wordle Assist</h1>
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
			{/each}
		</div>
		{#if isInvalidWord}
			<p>Not in word list</p>
		{/if}
		<button class="submit-button">Submit</button>
		{#if answersLists.length > 1}
			<button class="submit-button" type="button" on:click={onUndo}>
				Undo
			</button>
			<button class="submit-button" type="button" on:click={onClear}>
				Clear
			</button>
			{#if answersLists.length > 1 && showModal}
				<ConfirmModal
					on:confirm={onClearConfirmed}
					on:cancel={() => (showModal = false)}
				/>
			{/if}
		{/if}
	</form>
	{#if answersLists.length > 1}
		<h2 style="text-align: center;">
			Filtered Word List ({answersList.length} Possible Words)
		</h2>
	{/if}
	<div
		class={`word-list ${
			answersList.length > 0 && answersLists.length > 1 ? wordListFilled : ''
		}`}
	>
		{#if isLoadingAnswers}
			<p>loading...</p>
		{:else if answersList.length === 0}
			<p>NO WORDS AVALIBLE...</p>
		{:else if answersLists.length === 1}
			<h2>How To Use</h2>
			<p>
				Have Wordle open in another screen and make a guess. Then input your
				Wordle guess into the input box provided and select the corresponding
				colours to narrow down the list of possible word of the day answers. A
				list of possible words will appear in this box once you hit submit.
			</p>
		{:else}
			{#each answersList as word}
				<p>{word}</p>
			{/each}
		{/if}
	</div>
</main>

<style>
	main {
		padding: 1rem;
	}
	h1 {
		text-align: center;
	}

	form {
		text-align: center;
	}

	.word-area {
		display: flex;
		gap: 5px;
		justify-content: center;
	}

	.submit-button {
		align-self: center;
		border-width: 0px;
		background-color: var(--dark-grey);
		color: white;
		height: 2rem;
		width: 10rem;
		margin-top: 1rem;
	}

	.submit-button:hover {
		color: var(--dark-grey);
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
		width: 90%;
		max-width: 1280px;
		border-color: var(--dark-border);
		border-width: 2px;
		border-style: solid;
		text-align: center;
		margin-top: 1rem;
		padding: 0 1rem;
	}

	.word-list-filled {
		grid-template-columns: repeat(4, 1fr);
	}

	@media only screen and (min-width: 600px) {
		.letter-input {
			height: 62px;
			width: 62px;
		}

		.word-list-filled {
			grid-template-columns: repeat(5, 1fr);
		}

		.word-list p {
			font-size: 1.5em;
		}
	}
</style>
