import { useState, useEffect} from 'react';
import './App.css';
import SingleCard from './components/SingleCard';

/**
 * The images of the memory cards.
 */
const cardImages = [
	{ "src": "/img/bird.png", matched: false },
  	{ "src": "/img/blue-whale.png", matched: false },
  	{ "src": "/img/chicken.png", matched: false },
  	{ "src": "/img/dog.jpg", matched: false },
  	{ "src": "/img/fish.png", matched: false },
  	{ "src": "/img/fox.png", matched: false },
  	{ "src": "/img/lion.png", matched: false },
  	{ "src": "/img/polar-bear.jpg", matched: false }
]

function App() {
  	const [cards, setCards] = useState([])
  	const [turns, setTurns] = useState(0);
  	const [cardOne, setCardOne] = useState(null);
  	const [cardTwo, setCardTwo] = useState(null);
  	const [disabled, setDisabled] = useState(false);

	/**
	 * Duplicates the cards and shuffles them.
	 * Sets the cards to the new duplicated and shuffled array, chosen cards to null
	 * and the number of turns to 0.
	 */
	const shuffleCards = () => {
      	const shuffledCards = [...cardImages, ...cardImages]
      	.sort(() => Math.random() - 0.5) // neg -> order remains, pos -> switch order
      	.map((card) => ({ ...card, id: Math.random() })) // give every card an id

		setCards(shuffledCards);
	    setCardOne(null);
	    setCardTwo(null);
      	setTurns(0);
  	}

	/**
	 * Checks if the state variable cardOne is set, if it is the chosen card will be set
	 * as card two, else it will be set as card one.
	 * 
	 * @param card The chosen card.
	 */
  	const handleChoice = (card) => {
    	cardOne ? setCardTwo(card) : setCardOne(card);
  	}

	/**
	 * Compares the selected cards cardOne and cardTwo every time one of them is changed.
	 * If the two cards match the property matched will be set to true in both card-objects.
	 * Lastly calls the function resetSelectedCards() to reset the selected cards and increse 
	 * the number of turns.
	 */
	useEffect(() => {
		if(cardOne && cardTwo) {
			setDisabled(true); // Makes sure you cannot click any other cards during the compare.

			if(cardOne.src === cardTwo.src) {
				setCards(prevCards => {
					return prevCards.map(card => {
					if(card.src === cardOne.src) {
						return {...card, matched: true};
					} else {
						return card;
					}
				})
			});
			resetSelectedCards();
			} else {
				// Use of timeout to be able to see the back of two unmatching cards.
				setTimeout(() => resetSelectedCards(), 1000);
			}
		}
	}, [cardOne, cardTwo]);

	/**
	 * Resets the selected cards, increse the number of turns taken, and sets the disabled
	 * state variable to false to enable choosing new cards.
	 */
	const resetSelectedCards = () => {
		setCardOne(null);
		setCardTwo(null);
		setTurns(prevTurns => prevTurns + 1);
		setDisabled(false);
	}

	/**
	 * Start a new game on the initial render.
	 */
	useEffect(() => {
		shuffleCards();
	}, []);

	return (
		<div className="App">
		<h1>Memory game</h1>
		<button onClick={shuffleCards}>New Game</button>
		<p>Turns: {turns}</p>

		<div className="card-grid">
			{cards.map(card => (
			<SingleCard 
				key={card.id} 
				card={card}
				handleChoice={handleChoice}
				flipped={card === cardOne || card === cardTwo || card.matched}
				disabled={disabled}
			/>
			))}
		</div>
		</div>
	);
}

export default App;
