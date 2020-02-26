import React from 'react';
import Card from './Card';

function CardList({ pets }) {
	return (
		<div>
			{
				pets.map((pet, i) => {
					return <Card key={pets[i].id} img={pets[i].img} name={pets[i].name} description={pets[i].description}/>
				})
			}
		</div>
	);
}

export default CardList;