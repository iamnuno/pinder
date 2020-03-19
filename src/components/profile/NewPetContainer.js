import React, { Component } from 'react';
import pet from '../../data/Pets.js';
import { Redirect } from 'react-router-dom';
import client from '../../data/RestClient.js';

import 'tachyons';

class NewPetContainer extends Component {

    constructor(props) {
        super(props)
    }

    state = {
        submitDisabled: true,
        uid: this.props.uid,
    };

    registerPet = (event) => {
        event.preventDefault();

        if (this.state.submitDisabled)
            return;

        client.newPet({
            name: this.name.value,
            birthday: this.date.value,
            gender: (this.male.checked) ? 'male' : 'female',
            description: this.Description.value,
            users_id: this.state.uid,
            type: (this.cat.checked) ? 'cat' : 'dog'
        });
        this.props.container(false);
    }

    cancelView = () => {
        this.props.container(false);
    }

    formHandler = () => {

        if (!this.name.value || !Date.parse(this.date.value) || (!this.dog.checked && !this.cat.checked) || (!this.female.checked && !this.male.checked)) {
            this.setState({
                submitDisabled: true,
            });
        } else {
            this.setState({
                submitDisabled: false,
            });
        }
    }

    render() {

        return (
            <div className="absolute w-100 h-100 left-top bright-gray z-5">
                <div className="bg-light-gray center w-50 pv4 relative mt6-ns br2 flex flex-column ">
                    <h1 className="center">New  Pet </h1>
                    <form className="flex flex-column tc" onSubmit={this.registerPet}>

                        <div className="mt3 w-50 center">
                            <div className="bb">  Name</div>
                            <input ref={(form) => { this.name = form }} className="mt2 w-100 " type="text" onChange={this.formHandler} />
                        </div>
                        <div className="mt3 w-50 center">
                            <div className="bb">  Description</div>
                            <input ref={(form) => { this.Description = form }} className="mt2 w-100 " type="text" onChange={this.formHandler} />
                        </div>
                        <div className="mt3 w-50 center">
                            <div className="bb">Birthday</div>
                            <input ref={(form) => { this.date = form }} className="mt2 w-100" type="date" onChange={this.formHandler} />
                        </div>
                        <div className=" mt3 w-50 center">
                            <div className="bb">Pet</div>
                            <div className="mt2">
                                <input ref={(form) => { this.cat = form }} className="mr1" type="radio" id="cat" name="type" value="cat" onChange={this.formHandler} />
                                <label htmlFor="cat">Cat</label>
                                <input ref={(form) => { this.dog = form }} className="ml3 mr1" type="radio" id="dog" name="type" value="dog" onChange={this.formHandler} />
                                <label htmlFor="dog">Dog</label>
                            </div>
                        </div>
                        <div className=" mt3 w-50 center">
                            <div className="bb">Gender</div>
                            <div className="mt2">
                                <input ref={(form) => { this.male = form }} className="mr1" type="radio" id="male" name="gender" value="male" onChange={this.formHandler} />
                                <label htmlFor="male">Male</label>
                                <input ref={(form) => { this.female = form }} className="ml3 mr1" type="radio" id="female" name="gender" value="female" onChange={this.formHandler} />
                                <label htmlFor="female">Female</label>
                            </div>
                        </div>
                        <div className="pt3">
                            <input className="fr w-20 mr5" type="submit" value="Save" disabled={this.state.submitDisabled} />
                            <button ref={(form) => { this.cancel = form }} onClick={this.cancelView} className="fl w-20 ml5">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default NewPetContainer;