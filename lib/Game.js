const inquirer = require('inquirer');
const { choices } = require('yargs');
const Enemy = require ('./Enemy')
const Player = require('./Player')


function Game() {
    this.roundNumnber = 0
    this.isPlayerTurn = false
    this.enemies = []
    this.currentEnemy
    this.player

    Game.prototype.initializeGame = function(){
        enemies = [
        this.enemies.push(new Enemy('goblin', 'sword')),
        this.enemies.push(new Enemy('orc', 'baseball bat')),
        this.enemies.push(new Enemy('skeleton', 'axe'))
    ]
        this.currentEnemy = this.enemies[0]
    }
    inquirer
    .prompt({
        type: 'text',
        name: 'name',
        message: 'what is your name'
    })
    .then (({name}) =>{
        this.player = new Player(name)
        this.startNewBattle();
    })

    Game.prototype.startNewBattle = function(){
        if(this.player.agility > this.currentEnemy.agility){
            this.isPlayerTurn = true;
        } else {
            this.isPlayerTurn = false;
        }
        console.log('stats are')
        console.table(this.player.getStats())
        console.log(this.currentEnemy.getDescription());

        this.battle()
    }

    Game.prototype.battle = function(){
        if (this.isPlayerTurn){
            inquirer
            .prompt({
                type: 'list',
                name: 'action',
                message: 'What would you like to do',
                choices: ['Attack', 'Use potion']
            })
            .then(({action})=>{
                if (action === 'Use potion'){
                    if (!this.player.getInventory()){
                        console.log("you don't have any potions")
                        return this.checkEndOfBattle();
                    }
                    inquirer
                    .prompt({
                        type: 'list',
                        name: 'action',
                        message: 'which potion would you like to use',
                        choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                    })
                    .then(({action})=>{
                        const potionDetails = action.split(': ');
                        this.player.usePotion(potionDetails[0]-1);
                        console.log(`You used a ${potionDetails[1]} potion`)
                        this.checkEndOfBattle();
                    })
                } else {
                    const damage = this.player.getAttackValue();
                    this.currentEnemy.reduceHealth(damage)

                    console.log(`you attacke the ${this.currentEnemy.name}`)
                    console.log(this.currentEnemy.getHealth());
                    this.checkEndOfBattle();
                }
            })
        } else {
            const damage = this.currentEnemy.getAttackValue();
            this.player.reduceHealth(damage)

            console.log(`you were attacked by ${this.currentEnemy.name}`)
            console.log(this.player.getHealth())
            this.checkEndOfBattle();
        }
    }

    Game.prototype.checkEndOfBattle = function(){
        if (this.player.isAlive() && this.currentEnemy.isAlive()){
            this.isPlayerTurn = !this.isPlayerTurn
            this.battle()
        } else if(this.player.isAlive() && !this.currentEnemy.isAlive()){
            console.log(`you defeated the ${this.currentEnemy.name}`)
            this.player.addPotion(this.currentEnemy.potion)
            console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion`)

            this.roundNumnber++;

            if (this.roundNumnber < this.enemies.length){
                this.currentEnemy = this.enemies[this.roundNumnber]
                this.startNewBattle()
            } else {
                console.log('you win')
            }
        } else {
            console.log('you have been defeated')
        }
    }
}

module.exports = Game;