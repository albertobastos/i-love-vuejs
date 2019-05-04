import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// methods to use during actions and mutations

// fills [patternSize] tiles from an empty-assumed matrix
const fillRandomPattern = (matrix, patternSize) => {
  const totalTiles = matrix.length * 2;
  let leftPatternTiles = patternSize;
  while (leftPatternTiles > 0) {
    const newRowRandom = Math.round(Math.random() * (totalTiles - 1));
    const newColumnRandom = Math.round(Math.random() * (totalTiles - 1));
    if (newRowRandom < matrix.length && newColumnRandom < matrix.length) {
      const cell = matrix[newRowRandom][newColumnRandom];
      if (cell.content !== 'pattern') {
        cell.content = 'pattern';
        leftPatternTiles--;
      }
    }
  }
}

// creates a NxN matrix with N random tiles filled
const initMatrix = (gameSize) => {
  const matrix = [];
  for (let row = 0; row < gameSize; row++) {
    const rowColumns = [];
    for (let col = 0; col < gameSize; col++) {
      rowColumns.push({
        display: true,
        showResult: false,
        // values: empty / pattern / clickError / clickSuccess
        content: 'empty'
      });
    }
    matrix.push(rowColumns);
  }
  fillRandomPattern(matrix, gameSize);
  return matrix;
}

// store config

const matrixState = {
  // values: empty | in-progress | end
  status: 'empty',
  gameSize: 4,
  revealedTiles: 0,
  successTiles: 0,
  matrix: [] //initMatrix(GAME_SIZE)
};

// store definition

export default new Vuex.Store({
  state: matrixState,
  mutations: {
    updateMatrix(state, matrix) {
      state.matrix = matrix;
    },
    setRevealedTiles(state, result) {
      state.revealedTiles = result.revealed;
      state.successTiles = result.success;
    },
    updateTile(state, { row, column, updatedTile }) {
      const updatedMatrix = Object.assign({}, state.matrix);
      updatedMatrix[row][column] = updatedTile;
      state.matrix = updatedMatrix;
    },
    setGameStatus(state, status) {
      state.status = status;
    },
    setGameSize(state, gameSize) {
      state.gameSize = gameSize;
    }
  },
  actions: {
    newGame(context) {
      const newMatrix = initMatrix(context.state.gameSize);
      context.commit('updateMatrix', newMatrix);
      context.commit('setRevealedTiles', {
        revealed: 0,
        success: 0
      })
      context.commit('setGameStatus', 'in-progress');
      setTimeout(() => {
        context.dispatch('togglePatternVisibility', false);
      }, 1500);
    },
    togglePatternVisibility(context, doShow) {
      const updatedMatrix = context.state.matrix.map((row) => {
        return row.map((cell) => Object.assign({}, cell, { display: doShow }));
      })
      context.commit('updateMatrix', updatedMatrix);
    },
    changeGameSize(context, gameSize) {
      context.commit('setGameSize', gameSize);
      if (context.state.status !== 'empty') {
        context.dispatch('newGame');
      }
    },
    revealTile(context, tile) {
      const { state } = context;
      if (state.revealedTiles === state.gameSize) {
        return;
      }
      if (tile.display) {
        // ignore clicks while pattern is revealed
        return;
      }
      if (tile.content !== 'empty' && tile.content !== 'pattern') {
        // ignore clicks on already clicked tiles
        return;
      }
      const isSuccess = tile.content === 'pattern';
      const totalRevealed = state.revealedTiles + 1;
      // no dispath here, we mutate the state directly
      tile.content = isSuccess ? 'click-success' : 'click-error';
      tile.display = true;
      context.commit('setRevealedTiles', {
        revealed: totalRevealed,
        success: state.successTiles + (isSuccess ? 1 : 0)
      });
      if (totalRevealed === state.gameSize) {
        context.dispatch('onEndGame');
      }
    },
    onEndGame(context) {
      context.commit('setGameStatus', 'end');
      context.state.matrix.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
          const cellCount = (rowIndex * context.state.gameSize) + columnIndex;
          setTimeout(() => {
            context.commit('updateTile', {
              row: rowIndex,
              column: columnIndex,
              updatedTile: { ...cell, display: true, showResult: true }
            });
          }, 100 * cellCount);
        });
      });
    },
  }
})
