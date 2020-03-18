import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import Nav from '../components/Nav';
import Scroll from '../components/Scroll'
import CardList from '../components/CardList';
import Searchbox from '../components/Searchbox';

class Home extends React.Component {
	constructor() {
		super()
		this.state = {
			'pets': [],
			'images': [],
			'searchField': '',
			'isPetSelected': false,
			'selectedPetPk': '',
			'likes': [],
			'loggedUser': 1
		}
	}

	componentDidMount() {
		fetch('http://localhost:4412/api/pets')
		.then(response => response.json())
		.then(response => this.setState({pets: response}));

		fetch('http://localhost:4412/api/images')
		.then(response => response.json())
		.then(response => this.setState({images: response}));

		fetch('http://localhost:4412/api/likes/')
		.then(response => response.json())
		.then(response => this.setState({likes: response}));
	}

	onSearchChange = (event) => {
		this.setState({ searchField: event.target.value });
	}

	onPetSelection = (pk) => {
		this.setState({isPetSelected: !this.state.isPetSelected, selectedPetPk: pk, searchField: ''});
	}

	render() {
		const { pets, searchField, images, isPetSelected, selectedPetPk, likes, loggedUser } = this.state;
		const filteredPets = pets.filter(pet => {
			return pet.name.toLowerCase().includes(searchField.toLowerCase()) ||
						pet.type.toLowerCase().includes(searchField.toLowerCase()) ||
						pet.description.toLowerCase().includes(searchField.toLowerCase()) ||
						pet.gender.toLowerCase().match(searchField.toLowerCase());
		})
		return !pets.length ?
			<h1 className="tc">Loading</h1> :
			(
				<div className="tc">
					<Nav />
					{!isPetSelected ?
						<div>
							<Searchbox searchChange={this.onSearchChange}/>
							<Scroll>
								<ErrorBoundary>
									<CardList loggedUser={loggedUser} images={images} pets={filteredPets} onPetSelection={this.onPetSelection} isPetSelected={isPetSelected} selectedPetPk={selectedPetPk} likes={likes}/>
								</ErrorBoundary>
							</Scroll>
						</div> :
						<Scroll>
							<ErrorBoundary>
								<CardList loggedUser={loggedUser} searchChange={this.onSearchChange} images={images} pets={filteredPets} onPetSelection={this.onPetSelection} isPetSelected={isPetSelected} selectedPetPk={selectedPetPk} likes={likes}/>
							</ErrorBoundary>
						</Scroll>
					}
				</div>
			);
	}
}

export default Home;