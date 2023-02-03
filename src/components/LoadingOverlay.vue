<template>
  <div>
    <div v-if="type == 'simple'" :class="{load: true, fadeOut: loaded}" :style="{'background-color': background}">
      <v-row justify="center" style="height: 100vh">
        <v-col align-self="center" align="center">
          <h1 class="pb-5" :style="{'color': fontColor, 'font-family': `${fontFamily} !important`, 'fontSize': fontSize}"><slot></slot></h1>
          <v-progress-circular
            :size="size"
            :color="color"
            indeterminate
          ></v-progress-circular>
        </v-col>
      </v-row>
    </div>
    <div v-if="type == 'animated'" :class="{load: true, fadeOut: loaded}" :style="{'background-color': background}">
      <v-row justify="center" style="height: 100vh">
        <v-col align-self="center" align="center">
          <h1 class="pb-5" :style="{'color': fontColor, 'font-family': `${fontFamily} !important`, 'fontSize': fontSize}"><slot></slot></h1>
          <img :width="width" :height="height" :src="require('@/assets/images/' + imageName + '')"/>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
export default {
  name: "loadingOverlay",
  props: {
    type: {
      type: String,
      default: 'simple'
    },
    loaded: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    imageName: String,
    fontColor: {
      type: String,
      default: 'white'    
    },
    fontFamily: {
      type: String,
      default: "var(--font-poppins)"
    },
    fontSize: {
      type: String,
      default: "32pt"
    },
    color: {
      type: String,
      default: 'white'    
    },
    size: {
      type: Number,
      default: 150   
    },
    background: {
      type: String,
      default: "rgb(0, 0, 0, 0.4)"   
    },
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>
<style lang="css" scoped>
  .load {
    position: absolute;
    top: 0;
    left: 0;
    height: max(100%, 100vh);
    width: 100%;
    z-index: 2147483646;
  }
  .text {
    color: white;
  }
  .fadeOut {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s 0.2s, opacity 0.2s linear;
  }
</style>