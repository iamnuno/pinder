import React, {Component} from 'react';

export default class Contact extends Component {

  constructor(props){
    super(props);
    this.state = {
     __html: null
   };
  }

 async componentDidMount() {
  await fetch('http://localhost:4412/contact_us', {method: 'GET',
   headers: {'Content-Type': 'text/html' }})
   .then(res => {
     return res.text();
   })
   .then(data =>{
     this.setState({
           __html: data
         });
     console.log(this.state.__html);
   })
   .catch(error => console.log(error))
   .then(response => console.log('Success:', response));

 }

  render(){

    return (
      <div>
      <div dangerouslySetInnerHTML= {this.state} />

      </div>
    );
  }


}
