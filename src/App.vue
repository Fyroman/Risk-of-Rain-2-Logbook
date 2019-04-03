<template>
  <div id="app">
    <div style="display: flex; width: 100%; justify-content: center;">
      <div style="width: 300px; display: flex; flex-direction: column;">
        <input v-model="newItem.name" placeholder="name"/>
        <textarea v-model="newItem.description" placeholder="description" rows="5"/>
        <input v-model="newItem.image" placeholder="image"/>
        <button @click="submit" style="margin-top: 20px;">Send</button>
      </div>
    </div>
    <div class="itemGrid">
      <item
        v-for="(item, index) in items"
        :key="index"
        :item="item"
        @move-left="moveLeft(item.key, index)"
        @move-right="moveRight(item.key, index)"
      />
    </div>
  </div>
</template>

<script>
  import firebase from "firebase/app";
  import 'firebase/firestore';
  import Item from './components/item'

  export default {
    name: "app",
    components: {
      Item,
    },
    data: () => ({
      items: [],
      newItem: {
        name: '',
        description: '',
        image: '',
      }
    }),
    methods: {
      async submit() {
        await firebase.firestore().collection('items').add({orderIndex: this.items.length, ...this.newItem})
        await this.getItems();
        this.newItem = {
          name: '',
          description: '',
          image: '',
        }
      },
      async getItems() {
        let array = [];
        await firebase.firestore().collection('items').orderBy('orderIndex').get().then(snap => {
          snap.forEach(doc => {
            array.push({key: doc.id, ...doc.data()});
          })
        })
        this.items = array;
      },
      async moveLeft(key, index) {
        let batch = firebase.firestore().batch()
        let ref = firebase.firestore().collection('items').doc(key);
        batch.update(ref, {orderIndex: index - 1});
        ref = firebase.firestore().collection('items').doc(this.items[index - 1].key);
        batch.update(ref, {orderIndex: index});
        await batch.commit()
        let a = this.items[index - 1];
        let b = this.items[index];
        this.items.splice(index - 1, 2, b, a)
        // await this.getItems();
      },
      async moveRight(key, index) {
        let batch = firebase.firestore().batch()
        let ref = firebase.firestore().collection('items').doc(key);
        batch.update(ref, {orderIndex: index + 1});
        ref = firebase.firestore().collection('items').doc(this.items[index + 1].key);
        batch.update(ref, {orderIndex: index});
        await batch.commit()
        let a = this.items[index];
        let b = this.items[index + 1];
        this.items.splice(index, 2, b, a)
        // await this.getItems();
      }
    },
    async created() {
      this.getItems();
    }
  };
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .itemGrid {
    display: flex;
    flex-wrap: wrap;
    width: calc(89px * 12);
  }
</style>
