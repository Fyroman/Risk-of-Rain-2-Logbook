<template>
  <div style="position: relative;">
    <img
      v-if="item.image"
      :src="item.image"
      class="item"
      @mousemove="captureCursorPosition"
      @mouseover="itemHover = true"
      @mouseout="itemHover = false"
    />
    <div
      v-else
      class="item"
      style="background: grey;"
      @mousemove="captureCursorPosition"
      @mouseover="itemHover = true"
      @mouseout="itemHover = false"
    >
    </div>
    <span
      v-if="item.orderIndex && $store.state.editShit"
      style="background: white; position: absolute; top: 4px; left: 38px;"
    >
      {{ item.orderIndex }}
    </span>
    <button
      v-if="$store.state.editShit"
      style="position: absolute; top: 4px; left: 4px;"
      @click="$emit('move-left')"
    >
      L
    </button>
    <button
      v-if="$store.state.editShit"
      style="position: absolute; top: 4px; right: 4px;"
      @click="$emit('move-right')"
    >
      R
    </button>
    <div
      class="hoverMenu"
      v-if="itemHover || menuHover"
      :style="{ top: mousePosition.y + 'px', left: mousePosition.x + 'px' }"
      @mouseover="menuHover = true"
      @mouseout="menuHover = false"
    >
      <div class="titleBar">{{ item.name }}</div>
      <div class="textBar" v-html="description"></div>
    </div>
  </div>
</template>

<script>
  import firebase from "firebase/app";
  import 'firebase/firestore';

  export default {
    props: {
      item: Object,
    },
    data: () => ({
      itemHover: false,
      menuHover: false,
      mousePosition: {
        x: null,
        y: null,
      },
    }),
    computed: {
      description() {
        let array = this.item.description.split('/');
        let html = '';
        array.forEach((string, index) => {
          let textClass = index % 2 === 0 ? 'mainText' : 'stackText';
          html += `<span class="${textClass}">${string}</span>`
        })
        return html
      }
    },
    methods: {
      captureCursorPosition(event) {
        this.mousePosition = {
          x: event.clientX + 20,
          y: event.clientY + 20,
        }
      },
    }
  }
</script>

<style>
  .item {
    margin: 4px;
    width: 81px;
    height: 81px;
  }

  .hoverMenu {
    position: fixed;
    width: 300px;
    background: darkgreen;
    display: flex;
    flex-direction: column;
    z-index: 1;
  }

  .titleBar {
    background: lightgrey;
    display: flex;
    align-items: center;
    justify-items: center;
    padding: 12px;
    font-size: 20px;
    color: white;
    text-shadow: black 1px 1px;
  }

  .textBar {
    background: black;
    padding: 12px;
    font-size: 12px;
  }

  .mainText {
    color: white;
  }

  .stackText {
    color: grey;
  }
</style>