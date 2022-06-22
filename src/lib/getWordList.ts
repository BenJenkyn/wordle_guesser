export const getWordList = async () => {
    const response = await fetch('wordle-answers-alphabetical.txt')
    const wordleText = await response.text();
    const wordList = wordleText.split('\n');
    return wordList;
} 

export const getAllPossibleAnswersList = async () => {
    const response = await fetch('wordle-nyt-allowed-guesses.txt');
    const wordleText = await response.text();
    const wordlList = wordleText.split('\n');
    return wordlList;
}