import React, { Component } from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
class Pit extends Component {
    render() {
        const { data, activePlayer } = this.props
        const team = data.team;
        const active = team == activePlayer ? "active" : "not";
        const home = data.home ? "home" : "";


        const stones = [];
        for(var i = 0; i < data.stones; i++) {
            stones.push(
                <ReactCSSTransitionGroup transitionName="example"
                         transitionAppear={true}
                         transitionAppearTimeout={1000}
                         transitionLeaveTimeout={500}
                         transitionEnterTimeout={500}
                         key={i + "stone"}>
                    <span className="stone">o</span>
                </ReactCSSTransitionGroup>);
        }

        const displayStone = home ? "" : stones;

        return (
            <div className={ "pit " + home + " " + team + " " + active} > 
                { displayStone }
                <a onClick={ this.props.onClick }> EMPTY: ({data.stones})</a>
            </div>
        );
    }
}

export default Pit;
