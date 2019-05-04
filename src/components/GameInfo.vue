<template>
  <div class="game-info">
    <button @click="restartGame">New game</button>
    <label for="game-size">Game size:</label>
    <select if="game-size" @change="changeGameSize($event)">
      <option
        v-for="size in availableGameSizes"
        v-bind:value="size"
        v-bind:selected="size === gameSize ? 'selected' : ''"
        :key="size"
      >{{ size }}</option>
    </select>
    <div class="stats" v-show="showStats">
      <span v-show="!winner">
        Tiles left:
        <strong :class="{'no-tiles-left': tilesLeft === 0}">{{tilesLeft}}</strong>
      </span>
      <span v-show="winner" class="winner">Congratulations!</span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "GameInfo",
  data() {
    return {
      availableGameSizes: [3, 4, 5, 6, 7]
    };
  },
  computed: {
    ...mapState({
      gameSize: state => state.gameSize,
      showStats: state => state.status !== "empty",
      tilesLeft: state => state.gameSize - state.revealedTiles,
      winner: state =>
        state.status === "end" && state.successTiles === state.gameSize
    })
  },
  methods: {
    restartGame() {
      this.$store.dispatch("newGame");
    },
    changeGameSize(event) {
      this.$store.dispatch("changeGameSize", Number(event.target.value));
    }
  }
};
</script>

<style lang="scss" scoped>
.game-info {
  button {
    margin: 1em;
    padding: 0.5em;
    font-weight: bold;
  }
  select {
    margin-left: 0.2em;
    padding: 0.5em;
  }
  .stats {
    font-style: italic;
    margin-bottom: 1em;
  }
  .no-tiles-left {
    color: red;
  }
  .winner {
    color: #006600;
  }
}
</style>