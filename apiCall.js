const getWord = async resource => {
    const response = await fetch(resource);

    if (response.status !== 200) {
        throw new Error('cannot fetch word');
    }

    // picking random word from defined range
    const randomWord = Math.floor(Math.random() * (2287 - 1) + 1);
    const word = await response.json();
    return word[randomWord];
}