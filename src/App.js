import React, { Component } from 'react';
import update from 'immutability-helper';

import logo from './logo.svg';
import './App.css';

import { PlayerData, SungkaData } from "./data/index.js"
import Pit from "./components/pit.js"

class App extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
            data: SungkaData,
            playerData: PlayerData,
            player: "A"
        };
    }

    togglePlayerTurn = ()=>{
        const player = this.state.player === "A" ? "B" : "A";
        this.setState({ player }, () =>{
            const test = this.state.player;
            
            console.log("new player turn: ", test);
            alert("new player turn: ", test);
        });

      
    }

    emptyPit = (pit) => {
        let data = this.state.data;
        const skip = this.state.playerData[this.state.player]['skip'];

        const activePit = data[pit];
        const totalStones = activePit['stones']; // 7
        let next = activePit['nextPit'];       // 2
        activePit['stones'] = 0;
        

        //Empty pit
        this.setState({
            data: update(data, { [pit] : { $set: activePit } })
        });

        for(var i = 0; i < totalStones + 1; i++){
            console.log("i: ", i);

            let fillPit = next === skip ? data[next]['nextPit'] : next;

           
            let updateStones = data[fillPit]['stones'] += 1 ;  


            console.log("UPDATE PIT: ", fillPit);
            //Empty pit
            this.setState({
                data: update(this.state.data, { [fillPit]: {
                    'stones': { $set: updateStones }
                }})
            });
      
            next = data[fillPit]['nextPit'];

            if(i === totalStones - 1){ 
                return this.checkPit(data[fillPit], fillPit);  
            }
        }
    }

    checkPit = (data, pit) => {
        console.log("stones in pit: ", data.stones);
        
        if(data.home){
            console.log("landed on home. User continues play.")
            
            return false 
        }

        //If pit is not empty, continue turn
        if(data.stones > 1 ){
            this.emptyPit(pit);
        }else{
            this.checkOppositePit(pit);
        }
    }

    checkOppositePit = (pit) => {
        let data = this.state.data;
        let oppositePit = data[pit]['opposite'];
        let oppositePitStones = data[oppositePit]['stones'];

        //If opposite pit is not empty, consume all stones
        if (oppositePitStones){
            let player = this.state.player;
            let homePit = this.state.playerData[player]['home'];

            let oppositePit = this.state.data[pit]['opposite'];

            let addStones = parseInt(this.state.data[pit]['stones']) + parseInt(this.state.data[oppositePit]['stones']);
            let homeStones = parseInt(this.state.data[homePit]['stones']) + addStones;

            console.log("opposite: ", oppositePit);
            console.log(addStones);

            console.log(homeStones);
            // Add all stones to Players Home
            // players home ++ data[pit][stones] + oppositePitStones;
            this.setState({
                data: update(this.state.data, {
                    [ pit ]: {
                        'stones': { $set: 0 }
                    },
                    [ oppositePit ]:{
                        'stones': { $set: 0 }
                    },
                    [ homePit ]:{
                        'stones': { $set: homeStones }
                    },
                })
            });
        }

        this.togglePlayerTurn(); 
    }

    render() {
        const data = this.state.data;
        return (
            <div className="App">
 
                { data.map((data, index) =>
                    <Pit key={index} data={ data } activePlayer={ this.state.player } onClick={() => { this.emptyPit(index)} }/>
                )}
                
            </div>
        );
    }
}

export default App;
