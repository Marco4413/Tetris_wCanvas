
/*
Copyright (c) 2020 [hds536jhmk](https://github.com/hds536jhmk/Tetris_wCanvas)

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

import { wCanvas, formatString, Font, Color } from "./wCanvas/wcanvas.js";

function defaultSettings() {
    /* SETTINGS START */
    return {
        shadow_color: "#d3d3d3",
        show_tetromino_shadow: true,

        locked_tetromino_color: "#d3d3d3",
    
        world_border_color: "#ffffff",
        shape_border_color: "#000000",
        text_color: "#ffffff",
        background_color: "#000000",
    
        display_next: 4
    }
    /* SETTINGS END */
}

let settings = defaultSettings();

const KEY_BINDINGS = {
    "rotate"            : [ "w", "ArrowUp"    ],
    "move_left"         : [ "a", "ArrowLeft"  ],
    "move_down"         : [ "s", "ArrowDown"  ],
    "move_right"        : [ "d", "ArrowRight" ],
    "drop_down"         : [ " "               ],
    "hold_tetromino"    : [      "Shift"      ],
    "toggle_settings"   : [ "h"               ],
    "toggle_infos"      : [ "i"               ],
    "toggle_controller" : [ "c"               ],
    "game_pause"        : [ "p"               ]
};

const FONT = new Font("Arial", 12);

const TC = { // TC: Tetrominoes' Colors
    "I":    "cyan",
    "J":    "blue",
    "L":  "orange",
    "O":  "yellow",
    "S":   "green",
    "T": "magenta",
    "Z":     "red"
};

const GAME_HORIZONTAL_MARGIN = 0.5; // This is a percentage (50% means that the game is centered on the screen)
const PADDING = 10;
const CELL_SIZE = 16;

const SCALE_HEIGHT = 970;
const SCALE = 2.5;

const POOL_SIZE = 10;

const SCORES = [
    40, 100, 300, 1200
];


const EMPTY_CELL = " ";
const SHAPES = 7;

const KEY_TRANSLATIONS = {
    " ": "SpaceBar"
}

/**
 * Prettifies a key binding (Used to show key bindings to the user in a readable/pretty way)
 * @param {String} action - The action from KEY_BINDINGS to prettify
 * @returns {String} The prettified action
 */
function prettyKeyBinding(action) {
    /** @type {String[]} */
    const keyBindings = KEY_BINDINGS[action].slice().map(s => KEY_TRANSLATIONS[s] === undefined ? (s.length > 1 ? s : s.toUpperCase()) : KEY_TRANSLATIONS[s]);
    const prettyAction = action.split("_").map(s => s.substr(0, 1).toUpperCase() + s.substr(1)).join(" ");

    return `${prettyAction} : ${keyBindings.join(", ").replace(/^(.*),(.*)$/g, "$1 or $2")}`;
}

/**
 * Returns a new shape from the specified ID
 * @param {Number} shapeID - The ID of the Shape to generate
 * @returns {Shapes}
 */
function genShape(shapeID) {
    switch (shapeID) {
        case 0:
            return [
                [[EMPTY_CELL, EMPTY_CELL, TC.I],
                 [EMPTY_CELL, EMPTY_CELL, TC.I],
                 [EMPTY_CELL, EMPTY_CELL, TC.I],
                 [EMPTY_CELL, EMPTY_CELL, TC.I]],
                 
                [[EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
                 [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
                 [      TC.I,       TC.I,       TC.I,       TC.I]],
                 
                [[EMPTY_CELL, TC.I],
                 [EMPTY_CELL, TC.I],
                 [EMPTY_CELL, TC.I],
                 [EMPTY_CELL, TC.I]],

                [[EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
                 [      TC.I,       TC.I,       TC.I,       TC.I]]
            ];
        case 1:
            return [
                [[EMPTY_CELL, TC.J],
                 [EMPTY_CELL, TC.J],
                 [      TC.J, TC.J]],

                [[TC.J, EMPTY_CELL, EMPTY_CELL],
                 [TC.J,       TC.J,       TC.J]],

                [[EMPTY_CELL, TC.J,       TC.J],
                 [EMPTY_CELL, TC.J, EMPTY_CELL],
                 [EMPTY_CELL, TC.J, EMPTY_CELL]],

                [[EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
                 [      TC.J,       TC.J,       TC.J],
                 [EMPTY_CELL, EMPTY_CELL,       TC.J]]
            ];
        case 2:
            return [
                [[EMPTY_CELL, TC.L, EMPTY_CELL],
                 [EMPTY_CELL, TC.L, EMPTY_CELL],
                 [EMPTY_CELL, TC.L,       TC.L]],
                 
                [[EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
                 [      TC.L,       TC.L,       TC.L],
                 [      TC.L, EMPTY_CELL, EMPTY_CELL]],

                [[      TC.L, TC.L],
                 [EMPTY_CELL, TC.L],
                 [EMPTY_CELL, TC.L]],
                
                [[EMPTY_CELL, EMPTY_CELL, TC.L],
                 [      TC.L,       TC.L, TC.L]],


            ];
        case 3:
            return [
                [[TC.O, TC.O],
                 [TC.O, TC.O]]
            ];
        case 4:
            return [
                [[EMPTY_CELL,       TC.S, EMPTY_CELL],
                 [EMPTY_CELL,       TC.S,       TC.S],
                 [EMPTY_CELL, EMPTY_CELL,       TC.S]],

                [[EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
                 [EMPTY_CELL,       TC.S,       TC.S],
                 [      TC.S,       TC.S, EMPTY_CELL]],
                
                [[      TC.S, EMPTY_CELL],
                 [      TC.S,       TC.S],
                 [EMPTY_CELL,       TC.S]],

                [[EMPTY_CELL,    TC.S,       TC.S],
                 [      TC.S,    TC.S, EMPTY_CELL]]
            ];
        case 5:
            return [
                [[EMPTY_CELL, TC.T, EMPTY_CELL],
                 [      TC.T, TC.T,       TC.T]],

                [[EMPTY_CELL, TC.T, EMPTY_CELL],
                 [EMPTY_CELL, TC.T,       TC.T],
                 [EMPTY_CELL, TC.T, EMPTY_CELL]],

                [[EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
                 [      TC.T,       TC.T,       TC.T],
                 [EMPTY_CELL,       TC.T, EMPTY_CELL]],

                [[EMPTY_CELL, TC.T],
                 [      TC.T, TC.T],
                 [EMPTY_CELL, TC.T]]
            ];
        case 6:
            return [
                [[EMPTY_CELL, EMPTY_CELL,       TC.Z],
                 [EMPTY_CELL,       TC.Z,       TC.Z],
                 [EMPTY_CELL,       TC.Z, EMPTY_CELL]],

                [[EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
                 [      TC.Z,       TC.Z, EMPTY_CELL],
                 [EMPTY_CELL,       TC.Z,       TC.Z]],
                
                [[EMPTY_CELL,       TC.Z],
                 [      TC.Z,       TC.Z],
                 [      TC.Z, EMPTY_CELL]],
 
                [[      TC.Z, TC.Z, EMPTY_CELL],
                 [EMPTY_CELL, TC.Z,       TC.Z]]
            ];
    }
}

let getRandomShape;
{
    const pool = [];

    function refillPool() {
        for (let i = pool.length; i < SHAPES; i++) {
            pool[i] = i;
        }
    }

    /**
     * Generates a random shape
     * @function
     * @returns {Shape} The shape that was generated
     */
    getRandomShape = () => {
        if (pool.length <= 0) {
            refillPool();
        }

        const poolIndex = Math.floor(Math.random() * pool.length);
        const shape = genShape(pool[poolIndex]);
        pool.splice(poolIndex, 1);
        return shape;
    }
}

/**
 * Draws the specified shape at the specified x and y
 * @param {wCanvas} canvas - The canvas to draw on
 * @param {Number} x - The x pos
 * @param {Number} y - The y pos
 * @param {Shape} shape - The shape to draw
 * @param {String} [color] - The color with which the Tetromino should be drawn
 */
function drawShape(canvas, x, y, shape, color) {
    if (shape !== undefined) {
        for (let relY = 0; relY < shape.length; relY++) {
            const row = shape[relY];
            for (let relX = 0; relX < row.length; relX++) {
                const cellColor = row[relX];
                if (cellColor === EMPTY_CELL) {
                    continue;
                }

                canvas.fill(new Color(color === undefined ? cellColor : color));
                canvas.rect(
                    x + relX * CELL_SIZE, y + relY * CELL_SIZE,
                    CELL_SIZE, CELL_SIZE
                );
            }
        }
    }
}

/**
 * @typedef {Array<Array<Number>>} Shape
 */

/**
 * @typedef {Array<Shape>} Shapes
 */

/**
 * @typedef {{x: Number, y: Number}} Point
 */

class Tetromino {
    /**
     * @param {Shapes} shapes - The shapes that the tetromino can have
     * @param {Point} pos - The pos of the tetromino
     * @param {Game} game - The game the tetromino is in
     */
    constructor(shapes, pos, game) {
        this.shapeIndex = 0;
        this.shapes = shapes;
        this.pos = pos;
        this.game = game;
    }

    /**
     * Updates the tetromino
     * @returns {Boolean} If it couldn't move down
     */
    update() {
        return !this.moveY(1);
    }

    /**
     * Calculates the distance between itself and a collision that's underneath it and returns it
     * @returns {Number} The distance between itself and a collision that's underneath it
     */
    castDown() {
        for (let y = this.pos.y; y < this.game.height; y++) {
            if (!this.game.tetrominoFits(this, undefined, y)) {
                return y - this.pos.y - 1;
            }
        }
    }

    /**
     * Draws the tetromino
     * @param {wCanvas} canvas - The canvas to draw the tetromino on
     */
    draw(canvas) {
        drawShape(canvas, this.game.pos.x + this.pos.x * CELL_SIZE, this.game.pos.y + this.pos.y * CELL_SIZE, this.getCurrentShape());
    }

    /**
     * Draws Tetromino's shadow showing where it's dropping
     * @param {wCanvas} canvas - The canvas to draw the shadow on
     */
    drawShadow(canvas) {
        const shape = this.getCurrentShape();
        drawShape(
            canvas,
            this.game.pos.x + this.pos.x * CELL_SIZE,
            this.game.pos.y + (this.pos.y + this.castDown()) * CELL_SIZE,
            shape,
            settings.shadow_color
        );
    }

    /**
     * Goes back to the previous shape
     * @returns {Boolean} If it was able to change shape
     */
    previousShape() {
        if (this.game._paused) { return false; }

        const oldIndex = this.shapeIndex;
        if (--this.shapeIndex < 0) {
            this.shapeIndex = this.shapes.length - 1;
        }

        if (this.game.tetrominoFits(this)) {
            return true;
        }

        this.shapeIndex = oldIndex;
        return false;
    }

    /**
     * Goes forward to the next shape
     * @returns {Boolean} If it was able to change shape
     */
    nextShape() {
        if (this.game._paused) { return false; }

        const oldIndex = this.shapeIndex;
        if (++this.shapeIndex >= this.shapes.length) {
            this.shapeIndex = 0;
        }

        if (this.game.tetrominoFits(this)) {
            return true;
        }

        this.shapeIndex = oldIndex;
        return false;
    }

    /**
     * Returns the shape that is being used by the tetromino
     * @returns {Shape} The current shape of the tetromino
     */
    getCurrentShape() {
        return this.shapes[this.shapeIndex];
    }

    /**
     * Moves the tetromino on the X axis
     * @param {Number} ammount - How many cells the tetromino should move
     * @returns {Boolean} Whether or not it could move into the specified pos
     */
    moveX(ammount) {
        if (this.game._paused) { return false; }

        if (this.game.tetrominoFits(this, this.pos.x + ammount)) {
            this.pos.x += ammount;
            return true;
        }

        return false;
    }

    /**
     * Moves the tetromino on the Y axis
     * @param {Number} ammount - How many cells the tetromino should move
     * @returns {Boolean} Whether or not it could move into the specified pos
     */
    moveY(ammount) {
        if (this.game._paused) { return false; }

        if (this.game.tetrominoFits(this, undefined, this.pos.y + ammount)) {
            this.pos.y += ammount;
            return true;
        }
        
        return false;
    }
}

class Game {
    /**
     * Contains all pre-generated tetrominoes
     * @type {Array<Tetromino>}
     */
    tetrominoesPool;

    /**
     * Currently updated tetromino
     * @type {Tetromino}
     */
    currentTetromino;

    /**
     * Currently held tetromino
     * @type {Tetromino}
     */
    heldTetromino;

    /**
     * Whether or not the held piece can be swapped
     * @type {Boolean}
     */
    canSwapHeld;

    /**
     * The world of the game
     * @type {Array<Array<Number>>}
     */
    world;

    /**
     * @param {Point} pos - The origin of the game
     * @param {Number} w - The width of the game
     * @param {Number} h - The height of the game
     */
    constructor(pos, w, h) {
        this.highscore = 0;
        this.score = 0;
        this.totalTime = 0;
        this.resumeTime = Date.now();
        
        this.pos = pos;
        this.width = w;
        this.height = h;

        this.tetrominoesPool = [];

        this._paused = false;

        this.clearWorld();
    }

    togglePause() {
        this._paused = !this._paused;
        if (this._paused)
            this.totalTime += Date.now() - this.resumeTime;
        else this.resumeTime = Date.now();
    }

    isPaused() {
        return this._paused;
    }

    /**
     * Clears game's world
     */
    clearWorld() {
        this.world = [];
        for (let y = 0; y < this.height; y++) {
            this.world[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.world[y][x] = EMPTY_CELL;
            }
        }
    }

    /**
     * Sets a world's cell to the specified color
     * @param {Number} x - The x pos in the world
     * @param {Number} y - The y pos in the world
     * @param {String} cellColor - The new cell color
     */
    setWorldCell(x, y, cellColor) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false;
        }

        this.world[y][x] = cellColor;
        return true;
    }

    /**
     * Returns the color of a world's cell
     * @param {Number} x - The x pos in the world
     * @param {Number} y - The y pos in the world
     * @returns {String} The cell Color
     */
    getWorldCell(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return "OUTOFBOUNDS";
        }

        return this.world[y][x];
    }

    /**
     * Picks a new tetromino from the pool
     * @returns {Tetromino} The new current tetromino
     */
    nextTetromino() {
        if (this._paused) { return; }
        
        this.canSwapHeld = true;
        this.currentTetromino = this.tetrominoesPool.shift();
        return this.currentTetromino;
    }

    /**
     * Adds the tetromino to the game's world
     * @param {Tetromino} tetromino - The tetromino to solidify
     */
    solidifyTetromino(tetromino) {
        if (this._paused) { return; }

        const shape = tetromino.getCurrentShape();
        for (let relY = 0; relY < shape.length; relY++) {
            const row = shape[relY];
            for (let relX = 0; relX < row.length; relX++) {
                const cellColor = row[relX];
                if (cellColor === EMPTY_CELL) {
                    continue;
                }

                this.setWorldCell(tetromino.pos.x + relX, tetromino.pos.y + relY, cellColor);
            }
        }
    }

    /**
     * Calculates the pos at which a Tetromino should spawn
     * @param {Shape} - The shape of the tetromino
     * @returns {Point} The pos at which a Tetromino should spawn
     */
    getTetrominoSpawnPos(shape) {
        const shapeWidth = shape[0].length;
        return { "x": Math.floor((this.width - shapeWidth) / 2), "y": 0 };
    }

    /**
     * Adds a new tetromino to the pool by using a shape
     * @param {Shape} shape - The shape of the new tetromino
     * @returns {Tetromino} The newly added tetromino
     */
    addTetrominoToPool(shape) {
        if (shape.length <= 0) {
            return;
        }

        const newTetromino = new Tetromino(shape, this.getTetrominoSpawnPos(shape), this);
        this.tetrominoesPool.push(newTetromino);

        return newTetromino;
    }

    /**
     * Checks if the specified tetromino can stay in its current position
     * @param {Tetromino} tetromino - The tetromino to check for
     * @param {Number} x - Uses this value as the x pos of the tetromino (if `undefined` it will use tetromino's pos)
     * @param {Number} y - Uses this value as the y pos of the tetromino (if `undefined` it will use tetromino's pos)
     * @returns {Boolean} Whether or not the tetromino can stay
     */
    tetrominoFits(tetromino, x, y) {
        x = x === undefined ? tetromino.pos.x : x;
        y = y === undefined ? tetromino.pos.y : y;

        const shape = tetromino.getCurrentShape();
        for (let relY = 0; relY < shape.length; relY++) {
            const row = shape[relY];
            for (let relX = 0; relX < row.length; relX++) {
                const cellColor = row[relX];
                if (cellColor === EMPTY_CELL) {
                    continue;
                }

                if (this.getWorldCell(x + relX, y + relY) !== EMPTY_CELL) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Tries to hold the current Tetromino
     * @returns {Boolean} Whether or not a Tetromino was held
     */
    holdTetromino() {
        if (this._paused || !this.canSwapHeld) {
            return false;
        }

        const previousHeld = this.heldTetromino;
        this.heldTetromino = this.currentTetromino;

        if (previousHeld === undefined) {
            this.nextTetromino();
            this.addTetrominoToPool(getRandomShape());
        } else {
            previousHeld.pos = this.getTetrominoSpawnPos(previousHeld.getCurrentShape());
            this.currentTetromino = previousHeld;
        }

        this.canSwapHeld = false;

        return true;
    }

    /**
     * Updates the game
     * @returns {Boolean} Whether or not the game was restarted
     */
    update() {
        if (this._paused || this.currentTetromino === undefined) {
            return false;
        }

        if (this.currentTetromino.update()) {
            this.solidifyTetromino(this.currentTetromino);

            let clearedRows = 0;
            const shape = this.currentTetromino.getCurrentShape();
            for (let relY = 0; relY < shape.length; relY++) {
                const y = this.currentTetromino.pos.y + relY;

                const row = this.world[y];
                if (!row.includes(" ")) {
                    this.world.splice(y, 1);
                    this.world.unshift([]);
                    for (let x = 0; x < this.width; x++) {
                        this.world[0][x] = EMPTY_CELL;
                    }
                    clearedRows++;
                }
            }

            if (clearedRows > 0) {
                this.score += SCORES[Math.min(SCORES.length, clearedRows) - 1];
            }

            
            this.addTetrominoToPool(
                getRandomShape()
            );
            
            const newTetromino = this.nextTetromino();
            if (!this.tetrominoFits(newTetromino)) {
                this.highscore = Math.max(this.highscore, this.score);
                this.clearWorld();
                this.heldTetromino = undefined;
                this.canSwapHeld = true;
                this.score = 0;
                this.totalTime = 0;
                this.resumeTime = Date.now();
                return true;
            }
        }

        return false;
    }

    /**
     * Draws the whole game
     * @param {wCanvas} canvas - The canvas to draw the game on
     */
    drawAll(canvas) {
        this.drawWorld(canvas);
        this.drawCurrentTetromino(canvas);
        this.drawHeldTetromino(canvas);
        this.drawPool(canvas);
        this.drawScores(canvas);
        this.drawTime(canvas);
    }

    /**
     * Draws the game's world
     * @param {wCanvas} canvas - The canvas to draw the game's world on
     */
    drawWorld(canvas) {

        canvas.stroke(new Color(settings.world_border_color));
        canvas.line(this.pos.x, this.pos.y, this.pos.x, this.pos.y + this.height * CELL_SIZE);
        canvas.line(this.pos.x + this.width * CELL_SIZE, this.pos.y, this.pos.x + this.width * CELL_SIZE, this.pos.y + this.height * CELL_SIZE);
        canvas.line(this.pos.x, this.pos.y + this.height * CELL_SIZE, this.pos.x + this.width * CELL_SIZE, this.pos.y + this.height * CELL_SIZE);    

        canvas.stroke(new Color(settings.shape_border_color));
        for (let relY = 0; relY < this.world.length; relY++) {
            const row = this.world[relY];
            for (let relX = 0; relX < row.length; relX++) {
                const cellColor = row[relX];
                if (cellColor === EMPTY_CELL) {
                    continue;
                }

                canvas.fill(new Color(cellColor));
                canvas.rect(
                    this.pos.x + relX * CELL_SIZE, this.pos.y + relY * CELL_SIZE,
                    CELL_SIZE, CELL_SIZE
                );
            }
        }
    }

    /**
     * Draws the game's current tetromino
     * @param {wCanvas} canvas - The canvas to draw the game's current tetromino on
     */
    drawCurrentTetromino(canvas) {
        canvas.stroke(new Color(settings.shape_border_color));
        
        if (settings.show_tetromino_shadow) {
            this.currentTetromino.drawShadow(canvas);
        }
        this.currentTetromino.draw(canvas);
    }

    /**
     * Draws the game's held tetromino
     * @param {wCanvas} canvas - The canvas to draw the game's held tetromino on
     */
    drawHeldTetromino(canvas) {
        if (this.heldTetromino === undefined) {
            return;
        }

        canvas.stroke(new Color(settings.shape_border_color));
        const shape = this.heldTetromino.getCurrentShape();
        drawShape(
            canvas,
            this.pos.x - shape[0].length * CELL_SIZE - PADDING, this.pos.y,
            shape, this.canSwapHeld ? undefined : settings.locked_tetromino_color
        );
    }

    /**
     * Draws the game's tetrominoes' pool
     * @param {wCanvas} canvas - The canvas to draw the game's pool on
     */
    drawPool(canvas) {
        canvas.stroke(new Color(settings.shape_border_color));

        const relX = this.width * CELL_SIZE + PADDING;
        let currentY = 0;

        const shapesToShow = Math.min(this.tetrominoesPool.length, settings.display_next);
        for (let i = 0; i < shapesToShow; i++) {
            const shape = this.tetrominoesPool[i].getCurrentShape();
            const shapeHeight = shape.length * CELL_SIZE;
            drawShape(canvas, this.pos.x + relX, this.pos.y + currentY, shape);
            currentY += shapeHeight + PADDING;
        }
    }

    /**
     * Draws the game's scores
     * @param {wCanvas} canvas - The canvas to draw the game's scores on
     */
    drawScores(canvas) {
        const playAreaHeight = this.height * CELL_SIZE + PADDING;
        canvas.fill(new Color(settings.text_color));
        canvas.text(formatString("Score: {0}", this.score), this.pos.x, this.pos.y + playAreaHeight + FONT.fontSize, { "noStroke": true });
        canvas.text(formatString("Highscore: {0}", this.highscore), this.pos.x, this.pos.y + playAreaHeight + PADDING + 2 * FONT.fontSize, { "noStroke": true });
    }

    /**
     * Draws the game's time
     * @param {wCanvas} canvas - The canvas to draw the game's time on
     */
    drawTime(canvas) {
        const scoreAreaHeight = this.height * CELL_SIZE + PADDING + FONT.fontSize;
        const playAreaWidth = this.width * CELL_SIZE;
        canvas.fill(new Color(settings.text_color));

        let elapsedTime = this.totalTime + (this._paused ? 0 : Date.now() - this.resumeTime);
        canvas.text(formatString(
            "Time: {0}s", (elapsedTime / 1e3).toFixed(2)
        ), this.pos.x + playAreaWidth, this.pos.y + scoreAreaHeight + FONT.fontSize, {
            "noStroke": true,
            "alignment": {
                "horizontal": "right"
            }
        });
    }
}

const GAME = new Game({"x": PADDING, "y": PADDING}, 10, 20);
window.GAME = GAME;

/**
 * Set's canvas defaults
 * @param {wCanvas} canvas - The canvas where the default options should be set in
 */
function injectDefaults(canvas) {
    const currentScale = window.innerHeight / SCALE_HEIGHT * SCALE;

    canvas.textFont(FONT);
    canvas.strokeWeight(1);
    canvas.stroke(new Color(settings.world_border_color));
    canvas.scale(currentScale);

    GAME.pos.x = (canvas.element.width / currentScale - GAME.width * CELL_SIZE) * GAME_HORIZONTAL_MARGIN;
}

/**
 * Syncs settings and all the elements that store them with the saved ones
 */
function syncSettings() {
    /** @type {HTMLDivElement} */
    const settingsPanel = document.getElementById("settingsPanel");
    Object.keys(settings).forEach(
        key => {
            const savedSetting = localStorage.getItem("settings_" + key);
            if (savedSetting !== null) {
                switch (typeof settings[key]) {
                    case "string":
                        settings[key] = savedSetting;
                        break;
                    case "number":
                        settings[key] = Number(savedSetting);
                        break;
                    case "boolean":
                        settings[key] = savedSetting === "true";
                        break;
                }
            }

            if (settingsPanel !== null) {
                /** @type {HTMLInputElement} */
                const element = settingsPanel.querySelector("#" + key);
                if (element !== null) {
                    switch (element.type) {
                        case "color":
                            element.value = settings[key];
                            break;
                        case "checkbox":
                            element.checked = settings[key];
                            break;
                        case "number":
                            element.value = settings[key];
                    }
                }
            }
        }
    );
}

/**
 * Applies settings based on the given element's id and value
 * @param {HTMLInputElement} settingElement - The element that has the new settings
 */
window.applySetting = function (settingElement) {
    if (settings[settingElement.id] === undefined) {
        return;
    }

    let valueToSave;

    switch (settingElement.type) {
        case "color":
            valueToSave = settingElement.value;
            settings[settingElement.id] = settingElement.value;
            break;
        case "checkbox":
            valueToSave = settingElement.checked ? "true" : "false";
            settings[settingElement.id] = settingElement.checked;
            break;
        case "number":
            valueToSave = String(settingElement.valueAsNumber);
            settings[settingElement.id] = settingElement.valueAsNumber;
            break;
    }

    console.log(formatString("Setting \"{0}\" changed to \"{1}\"", settingElement.id, valueToSave));

    try {
        localStorage.setItem("settings_" + settingElement.id, valueToSave);
        console.log("Setting saved succesfully!");
    } catch (err) {
        console.log("Setting couldn't be saved.");
        console.log(err);
    }
    
}

/**
 * Resets settings to the default values
 */
window.resetSettings = function () {
    settings = defaultSettings();
    Object.keys(settings).forEach(
        key => {
            localStorage.removeItem("settings_" + key);
        }
    );
    syncSettings();
}

/**
 * Sets up the game
 * @param {wCanvas} canvas
 */
function setup(canvas) {
    for (let i = 0; i < POOL_SIZE; i++) {
        GAME.addTetrominoToPool(
            getRandomShape()
        );
    }

    GAME.nextTetromino();

    injectDefaults(canvas);

    canvas.startLoop();
}

/**
 * Updates the game
 */
function update() {
    if (GAME.update()) {
        try {
            localStorage.setItem("highscore", String(GAME.highscore));
        } catch (err) {
            console.log("Couldn't save highscore.");
            console.log(err);
        }
    }
}

/**
 * Draws the game
 * @param {wCanvas} canvas
 * @param {Number} deltaTime
 */
function draw(canvas, deltaTime) {
    canvas.background(new Color(settings.background_color));

    if (GAME.isPaused()) {
        GAME.drawScores(canvas);
        GAME.drawTime(canvas);

        const centerX = GAME.pos.x + GAME.width * CELL_SIZE / 2;
        const centerY = GAME.pos.y + GAME.height * CELL_SIZE / 2;

        const textConfig = { "horizontalAlignment": "center", "verticalAlignment": "center" };
        canvas.text("PAUSED", centerX, centerY, textConfig);
        canvas.text(`[ ${KEY_BINDINGS.game_pause.join(", ").toUpperCase()} ]`, centerX, centerY + FONT.fontSize, textConfig);
    } else {
        GAME.drawAll(canvas);
    }
}

window.addEventListener("keydown", (e) => {
    const tetromino = GAME.currentTetromino;
    if (tetromino === undefined) {
        return;
    }

    if (KEY_BINDINGS.rotate.includes(e.key)) {
        tetromino.nextShape();
    } else if (KEY_BINDINGS.move_left.includes(e.key)) {
        tetromino.moveX(-1);
    } else if (KEY_BINDINGS.move_down.includes(e.key)) {
        tetromino.moveY(1);
    } else if (KEY_BINDINGS.move_right.includes(e.key)) {
        tetromino.moveX(1);
    } else if (KEY_BINDINGS.drop_down.includes(e.key)) {
        tetromino.moveY(tetromino.castDown());
    } else if (KEY_BINDINGS.hold_tetromino.includes(e.key)) {
        GAME.holdTetromino();
    } else if (KEY_BINDINGS.toggle_settings.includes(e.key)) {
        const settingsPanel = document.getElementById("settingsPanel");
        if (settingsPanel !== null) {
            settingsPanel.classList.toggle("hidden");
        }
    } else if (KEY_BINDINGS.toggle_infos.includes(e.key)) {
        const infoPanel = document.getElementById("infoPanel");
        if (infoPanel !== null) {
            infoPanel.classList.toggle("hidden");
        }
    } else if (KEY_BINDINGS.toggle_controller.includes(e.key)) {
        const controller = document.getElementById("controller");
        if (controller !== null) {
            controller.classList.toggle("hidden");
        }
    } else if (KEY_BINDINGS.game_pause.includes(e.key)) {
        GAME.togglePause();
    }
});

window.addEventListener("load", () => {
    const isMobile = navigator.userAgentData !== undefined && navigator.userAgentData.mobile;
    const controller = document.getElementById("controller");
    if (isMobile) {
        controller.classList.remove("hidden");
    } else {
        controller.classList.add("hidden");

        const infoPanel = document.getElementById("infoPanel");

        Object.keys(KEY_BINDINGS).forEach(
            key => {
                const p = document.createElement("p");
                p.innerText = prettyKeyBinding(key);
                infoPanel.appendChild(p);
            }
        );
    }

    syncSettings();

    GAME.highscore = Number(localStorage.getItem("highscore"));

    const canvas = new wCanvas({
        "onSetup": setup,
        "onDraw": draw,
        "onResize": (canvas) => {
            canvas.element.width = window.innerWidth + 1;
            canvas.element.height = window.innerHeight + 1;

            injectDefaults(canvas);
        }
    });

    canvas.onResize(canvas);

    setInterval(update, 1_000);
});
