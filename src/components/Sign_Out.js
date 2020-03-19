import React, { Component } from 'react';
import { getToken, removeUserSession } from './Common';


class SignOut extends Component {
    constructor(props){
        super(props);
    }
    componentDidMount(){
        if(getToken()){
            removeUserSession();
            setTimeout(()=>{
            this.props.history.push('/sign_in');
            window.location.reload();
            }, 1500);
        }
    }

    render(){
        return(

            <div>

                <h2 class="center tc light-purple">Logging Out.....</h2>
                <h4 class="center tc light-purple">Bye Bye!</h4>
            </div>
        )
    }
}

export default SignOut;
