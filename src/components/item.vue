<template>
  <div class="singleItemContainer">
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
    <div class="shortDescription">
      <div v-html="shortDescription"/>
    </div>
    <span
      v-if="item.orderIndex && $store.state.editShit"
      style="background: white; position: absolute; top: 0; left: 50%; transform: translateX(-50%);"
    >
      {{ item.orderIndex }}
    </span>
    <button
      v-if="$store.state.editShit"
      style="position: absolute; top: 0; left: 0;"
      @click="$emit('move-left')"
    >
      L
    </button>
    <button
      v-if="$store.state.editShit"
      style="position: absolute; top: 0; right: 0;"
      @click="$emit('move-right')"
    >
      R
    </button>
    <button
      v-if="$store.state.editShit"
      style="position: absolute; top: 50px; left: 50%; transform: translate(-50%, -50%);"
      @click.stop="openEditDialog"
    >
      Edit
    </button>
    <div
      class="hoverMenu"
      v-if="itemHover || menuHover"
      :style="{ top: mousePosition.y + 'px', left: mousePosition.x + 'px', transform: hoverMenuTranslation }"
      @mouseover="menuHover = true"
      @mouseout="menuHover = false"
    >
      <div :class="['titleBar', rarityColor]">{{ item.name }}</div>
      <div class="textBar" v-html="description"></div>
    </div>

    <div
      id="editDialog"
      class="editDialog"
      v-if="editDialog"
    >
      <div style="display: flex; flex-direction: column; padding: 16px">
        <button style="width: fit-content; align-self: flex-end; margin-bottom: 8px;" @click="editDialog = false">
          Close
        </button>
        <input v-model="editItem.name" placeholder="name"/>
        <select v-model="editItem.rarity">
          <option
            v-for="rarity in rarities"
            :key="rarity"
            :value="rarity"
          >
            {{ rarity }}
          </option>
        </select>
        <textarea v-model="editItem.description" placeholder="description" rows="5"/>
        <input v-model="editItem.shortDescription" placeholder="short description"/>
        <input v-model="editItem.image" placeholder="image"/>
        <button @click="saveEdit" style="margin-top: 20px;">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from "firebase/app";
  import 'firebase/firestore';
  import {cloneDeep} from 'lodash'

  export default {
    props: {
      item: Object,
    },
    data: () => ({
      editDialog: false,
      editItem: {},
      rarities: [
        'Uncommon',
        'Common',
        'Rare',
        'Legendary',
        'Lunar',
      ],
      itemHover: false,
      menuHover: false,
      mousePosition: {
        x: null,
        y: null,
      },
    }),
    computed: {
      description() {
        if (!this.item.description) {
          return null;
        }
        let array = this.item.description.split('/');
        let html = '';
        array.forEach((string, index) => {
          let textClass = index % 2 === 0 ? 'mainText' : 'stackText';
          html += `<span class="${textClass}">${string}</span>`
        })
        return html
      },
      shortDescription() {
        if (!this.item.shortDescription) {
          return null;
        }
        let array = this.item.shortDescription.split('/');
        let html = '';
        array.forEach((string, index) => {
          let textClass = index % 2 === 0 ? 'mainText' : 'stackText';
          html += `<span class="${textClass}">${string}</span>`
        })
        return html
      },
      rarityColor() {
        let string = null;
        if (this.item.rarity)
          string = this.item.rarity.toLowerCase();
        return string;
      },
      hoverMenuTranslation() {
        if (this.mousePosition.x + 300 > document.documentElement.clientWidth)
          return 'translateX(calc(-100% - 40px))';
        else return 'translateX(0)';
      }
    },
    methods: {
      captureCursorPosition(event) {
        this.mousePosition = {
          x: event.clientX + 20,
          y: event.clientY + 20,
        }
      },
      openEditDialog() {
        const outsideClickListener = (event) => {
          if (!event.target.closest('#editDialog') && this.editDialog === true) {
            this.editDialog = false;
            console.log('5')
            document.removeEventListener('click', outsideClickListener)
          }
        }

        document.addEventListener('click', outsideClickListener)

        this.editDialog = true;
        this.editItem = cloneDeep(this.item);
      },
      async saveEdit() {
        await firebase.firestore().collection('items').doc(this.item.key).update(this.editItem);
        this.$emit('updateItem', this.editItem);
        this.editDialog = false;
        this.editItem = {
          name: '',
          description: '',
          image: '',
        }
      }
    },
  }
</script>

<style>
  .singleItemContainer {
    position: relative;
    margin: 4px;
    display: flex;
    flex-direction: column;
  }

  .item {
    width: 81px;
    height: 81px;
  }

  .shortDescription {
    font-size: 10px;
    width: 81px;
    background: black;
    height: calc(100% - 81px);
    display: flex;
    justify-content: center;
    align-items: center;
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

  .editDialog {
    z-index: 10;
    position: fixed;
    top: 50vh;
    left: 50vw;
    background: white;
    border: 1px grey solid;
    transform: translate(-50%, -50%);
    width: 500px;
  }

  .common {
    background: #93E16E;
  }

  .rare {
    background: #E75436;
  }

  .legendary {
    background: yellow;
  }

  .lunar {
    background: #00BFFF;
  }
</style>