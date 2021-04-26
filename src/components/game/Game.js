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

// Custom Hooks


const Game = () => {

    // Define states
    const [currHP, setCurrHP] = useState(100);

    // Functions
    const decreaseHP = () => {
        setCurrHP(currHP - 1)
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
    
    return(
        <div>
            <section class="statusbar">
                Statusbar
                <div>x:{x} y:{y}</div>
                <section class="healthbar">
                    <div>{currHP}</div>
                    <button onClick={decreaseHP}>Decrese HP</button> 
                </section>
            </section>

            <section class="board">
                {/* Board */}
                <section class="grid">
                    <Grid></Grid>
                    <Wave numberOfMinions = {3}></Wave>
                    {/* Towers */}
                    <div style={{position : 'relative', left: '0px', top : '384px'}}><Tower></Tower></div>
                    <div style={{position : 'relative', left: '64px', top : '384px'}}><Tower></Tower></div>
                    <div style={{position : 'relative', left: '128px', top : '384px'}}><Tower></Tower></div>
                    <div style={{position : 'relative', left: '640px', top : '0px'}}><Tower></Tower></div>
                    
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