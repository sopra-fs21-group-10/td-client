// General imports
import React, { useState, useCallback } from 'react';
import "./styles/StyledGame.css";

// Componenets
import Grid from "./Grid";
import Minion from "./Minion";
import Wave from "./Wave";
import Tower from "./Tower";
import TowerPlacer from "./TowerPlacer"
import Path from "./Path"
import Square from './Square';
import Tile from './Tile';
import TowerTile from './TowerTile';
import {api, handleError} from "../../helpers/api";
import User from "../shared/models/User";
import async from "async";
import Crawler from "./Crawler";
import Walker from "./Walker"

// Custom Hooks

const Game = () => {

    // Define states
    const [currHP, setCurrHP] = useState(100);

    // Functions
    const decreaseHP = () => {
        setCurrHP(currHP - 1)
    }

    async function quitGame() {
        try {
            const requestBody = JSON.stringify({
                gameId: localStorage.getItem('gameId'),
                token: localStorage.getItem('token')
            });
            const response = await api.patch(`/games/quits/${localStorage.getItem('gameId')}/${localStorage.getItem('token')}`, requestBody);

            // Remove game ID from local storage.
            localStorage.removeItem('gameId');

            // quit successfully worked --> navigate to the route /game in the GameRouter
            this.props.history.push(`/main`);
        } catch (error) {
            alert(`Something went wrong quitting the game: \n${handleError(error)}`);
        }
    }

    // Resolution
    // 1366px x 768px
    var win = window;
    var doc = document;
    var docElem = doc.documentElement;
    var body = doc.getElementsByTagName('body')[0];
    var x = win.innerWidth || docElem.clientWidth || body.clientWidth;
    var y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
    //alert(x + ' × ' + y);
    console.log('current resolution : ' + x + ' × ' + y)
    
    const spawn = () => {
        //return <Minion></Minion>
    }
    
    return(
        <div>
            <section class="statusbar">
                Statusbar
                <div>x:{x} y:{y}</div>
                <section class="healthbar">
                    <div>{currHP}</div>
                    <button onClick={decreaseHP}>Decrease HP</button>
                    <button onClick={() => { quitGame(); } }>Quit game</button>
                    <button onClick={spawn()}>Spawn Minions</button>
                </section>
            </section>

            <section class="board">
                {/* Board */}
                <section class="grid">
                    {/* Render the Grid*/}
                    <Grid></Grid>

                    {/* Towers */}
                    <div style={{position : 'relative', left: '0px', top : '384px'}}><Tower></Tower></div>
                    <div style={{position : 'relative', left: '64px', top : '384px'}}><Tower></Tower></div>
                    <div style={{position : 'relative', left: '128px', top : '384px'}}><Tower></Tower></div>
                    <div style={{position : 'relative', left: '640px', top : '0px'}}><Tower></Tower></div>


                    {/* Path*/}
                    {/* 6 Down */}
                    <div style={{position : 'relative', left: '64px', top : '0px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '64px', top : '64px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '64px', top : '128px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '64px', top : '192px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '64px', top : '256px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '64px', top : '320px'}}><Path></Path></div>

                    {/* 9 Right */}
                    <div style={{position : 'relative', left: '64px', top : '320px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '128px', top : '320px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '192px', top : '320px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '256px', top : '320px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '320px', top : '320px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '384px', top : '320px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '448px', top : '320px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '512px', top : '320px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '576px', top : '320px'}}><Path></Path></div>

                    {/* 6 Down */}
                    <div style={{position : 'relative', left: '576px', top : '384px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '576px', top : '448px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '576px', top : '512px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '576px', top : '576px'}}><Path></Path></div>


                    {/* Spawn Wave*/}
                    <Wave></Wave>

                    {/* Experimental*/}
                    {/* <TowerTile background={"url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png')"} color={"green"} width={"64px"} height={"64px"} left={"640px"} top={"448px"}></TowerTile> */}
                </section>
            </section>

            <section class="shop">
                Shop
                {/* Towers */}
                <Tile background={"url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png')"} color={"red"} width={"64px"} height={"64px"} left={"62px"} top={"50px"}></Tile>
                <Tile background={"url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png')"} color={"yellow"} width={"64px"} height={"64px"} left={"190px"} top={"50px"}></Tile>
                <Tile background={"url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png')"} color={"blue"} width={"64px"} height={"64px"} left={"62px"} top={"250px"}></Tile>
                <Tile background={"url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png')"} color={"orange"} width={"64px"} height={"64px"} left={"190px"} top={"250px"}></Tile>
                <Tile background={"url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/110.png')"} color={"black"} width={"64px"} height={"64px"} left={"62px"} top={"450px"}></Tile>
                <Tile background={"url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/78.png')"} color={"pink"} width={"64px"} height={"64px"} left={"190px"} top={"450px"}></Tile>
            </section>
         </div>
    )
}
export default Game;