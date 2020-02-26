import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Nav from '../components/Nav';
import Scroll from '../components/Scroll'
import CardList from '../components/CardList';
import Searchbox from '../components/Searchbox';
import { pets } from './pets';

class App extends React.Component {
	constructor() {
		super()
		this.state = {
			'pets': [],
			'searchField': ''
		}
	}

	componentDidMount() {
		this.setState({ pets: pets});
	}

	onSearchChange = (event) => {
		this.setState({ searchField: event.target.value });
	}

	render() {
		const { pets, searchField } = this.state;
		const filteredPets = pets.filter(pet => {
			return pet.name.toLowerCase().includes(searchField.toLowerCase());
		})
		return !pets.length ?
			<h1 className="tc">Loading</h1> :
			(
				<div className="tc">
					<Nav />
					<Searchbox searchChange={this.onSearchChange}/>
					<Scroll>
						<ErrorBoundary>
							<CardList pets={filteredPets} />
						</ErrorBoundary>
					</Scroll>
				</div>
			);
	}
}

export default App;