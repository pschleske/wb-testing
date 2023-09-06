import { jest } from '@jest/globals';

// jest.unstable_mockModule('../src/words.js', () => {
//     return {
//         getWord: jest.fn(() => 'APPLE'),
//         isWord: jest.fn(() => true)
//     }
// });
const mockIsWord = jest.fn(() => true);
jest.unstable_mockModule('../src/words.js', () => {
    return {
        getWord: jest.fn(() => 'APPLE'),
        isWord: mockIsWord,
    }
});

const { Wordle, buildLetter } = await import('../src/wordle.js');

describe('testing shouldEndGame function', () => {
    test('returns true if latest guess is correct', () => {
        const wordle = new Wordle();
        wordle.appendGuess('APPLE');
        expect(wordle.shouldEndGame()).toBe(true)
    });

    test('returns true if there are no more guesses', () => {
        const wordle = new Wordle(1);
        wordle.appendGuess('GUESS')
        expect(wordle.shouldEndGame()).toBe(true)
    });

    test('returns false if no guess has been made', () => {
        const wordle = new Wordle();
        expect(wordle.shouldEndGame()).toBe(false)
    });

    test('returns false if no more guesses and word has not been guessed', () => {
        const wordle = new Wordle();
        wordle.appendGuess('GUESS')
        expect(wordle.shouldEndGame()).toBe(false)
    });
})

describe('testing isSolved function', () => {
    test('returns true if latest guess is correct', () => {
        const wordle = new Wordle();
        wordle.appendGuess('APPLE')
        expect(wordle.isSolved()).toBe(true)
    });

    test('returns false if latest guess is not correct', () => {
        const wordle = new Wordle();
        wordle.appendGuess('GUESS')
        expect(wordle.isSolved()).toBe(false)
    });
});

describe('testing appendGuess', () => {
    test('throws an error if no more guesses are allowed', () => {
        const wordle = new Wordle(1);
        wordle.appendGuess('GUESS');
        expect(() => wordle.appendGuess('GUESS')).toThrow();
    });

    test('throws error if guess is not of length 5', () => {
        const wordle = new Wordle();
        expect(() => wordle.appendGuess('LONG GUESS')).toThrow();
    });

    test('throws error if guess is not a word', () => {
        const wordle = new Wordle();
        mockIsWord.mockReturnValueOnce(false)
        expect(() => wordle.appendGuess('GUESS')).toThrow()
    });

    test('appends result of buildWord to guesses array', () => {
        const wordle = new Wordle();
        wordle.appendGuess('GUESS')
        expect(wordle.guesses[0]).toEqual(wordle.buildGuessFromWord('GUESS'))
    });

    test('increments the current guesses', () => {
        const wordle = new Wordle();
        wordle.appendGuess('GUESS');
        expect(wordle.currGuess).toBe(1)
    })
})

describe('testing buildGuessFromWord functions', () => {
    test('sets the status of correct letter to CORRECT', () => {
        const wordle = new Wordle();
        const guess = wordle.buildGuessFromWord('A____')
        expect(guess[0].status).toBe('CORRECT')
    });

    test('sets status of a present letter to PRESENT', () => {
        const wordle = new Wordle();
        const guess = wordle.buildGuessFromWord('E____')
        expect(guess[0].status).toBe('PRESENT')
    });

    test('sets the status of an absent letter to ABSENT', () => {
        const wordle = new Wordle();
        const guess = wordle.buildGuessFromWord('Z____')
        expect(guess[0].status).toBe('ABSENT')
    });

});

describe('Testing Wordle constructor', () => {
    test('maxGuesses sets 6 w/o argument', () => {
        const wordle = new Wordle();
        expect(wordle.maxGuesses).toBe(6);
    });

    test('maxGuesses to the arguemnt passed', () => {
        const wordle = new Wordle(10);
        expect(wordle.maxGuesses).toBe(10);
    });

    test('guesses for array length of maxguesses', () => {
        const wordle = new Wordle();
        expect(wordle.guesses.length).toBe(6)
    });

    test('does it set currGuess to 0', () => {
        const wordle = new Wordle();
        expect(wordle.currGuess).toBe(0)
    });

    test('does it set the word from getWord ', () => {
        const wordle = new Wordle();
        expect(wordle.word).toBe('APPLE');
    });
});

describe('Testing the buildLetter function', () => {
    test('Returns a letter object', () => {
        const letter = buildLetter('A', 'PRESENT');
        expect(letter).toEqual({ letter: 'A', status: 'PRESENT' })
    })
})



