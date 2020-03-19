import React, { Component } from 'react';
import 'tachyons';

class Footer extends Component {

    render() {
        return ( <
            div >
            <
            footer className = "bottom--0 white" >
            <
            small className = "f6 db tc" > ©2020 < b className = "ttu" > Pinder < /b>., All Rights Reserved</small >
            <
            /footer> <
            /div>
        );
    }
}

export default Footer;