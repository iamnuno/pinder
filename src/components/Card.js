import React from 'react';
import './Card.css';

function Card({ img, name, description }) {
	return (
			<article className="bg-washed-green dib br3 ma2 pa4-ns mv3 ba b--black-10 shadow-3 bg-animate hover-bg-light-green">
			  <div className="tc">
			    <img src={img} className="br-100 h4 w4 dib ba b--near-white pa1" alt="This is an avatar" />
			    <h1 className="f4 mb2 dark-grey">{name}</h1>
			    <h2 className="f6 fw4 dark-grey mt0">{description}</h2>
			  </div>
			</article>
	);
}

export default Card;