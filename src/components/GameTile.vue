<template>
  <div class="game-tile" :class="tileClasses" @click="tileClick">
    <span class="game-tile__symbol" :class="{'show-result': tile.showResult }">{{ endResult }}</span>
  </div>
</template>

<script>
export default {
  name: "GameTile",
  props: {
    tile: {
      type: Object,
      required: true
    }
  },
  computed: {
    tileClasses() {
      return {
        "is-revealed": this.tile.display,
        [`has-${this.tile.content}`]: true
      };
    },
    endResult() {
      switch (this.tile.content) {
        case "click-success":
          return "🤩";
        case "pattern":
          return "🙅";
        case "click-error":
          return "🤦";
        case "empty":
        default:
          // Return a symbol even for empty cells, to keep the same space
          return "👍";
      }
    }
  },
  methods: {
    tileClick() {
      this.$store.dispatch("revealTile", this.tile);
    }
  }
};
</script>

<style lang="scss" scoped>
.game-tile {
  padding: 1.5em;
  background: #3a2a25;
  color: white;
  margin: 0;
  border: 2px solid gray;
  border-collapse: collapse;
  &.has-pattern {
    &.is-revealed {
      background-color: blue;
    }
  }
  &.has-click-success {
    background-color: limegreen;
  }
  &.has-click-error {
    background-color: crimson;
  }
  &__symbol {
    font-size: 2em;
    display: block;
    min-width: 60px;
    visibility: hidden;
    &.show-result {
      visibility: visible;
    }
  }
}
</style>