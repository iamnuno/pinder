import React, { Component } from 'react';
import '../../css/index.css';
import 'tachyons';

class CommentContainer extends Component {

    render() {
        let cards = [];

        if (this.props.pet) {
            const comments = this.props.pet.comments;

            for (let i = 0; i < comments.length; i++) {
                cards.push(
                    <div className="br2 pa2 ma3 bg-blue white">
                        <div>User: {comments[i].name}</div>
                        <div>Comment: {comments[i].comment} </div>
                    </div>
                )
            }
        }
        return (
            <div className="mt3 pt2 pv2 mv4 br2 center w-50 container-color">
            <div className="b pl3">Comments:</div>
                {cards}
            </div>
        );
    }
}

export default CommentContainer;
