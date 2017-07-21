# react-native-animated-swiper
Animated swiper for React Native.

### Installation

```bash
$ npm i rn-animated-swiper --save
```

### Example

<img src="https://github.com/TemaKozyrev/react-native-animated-swiper/blob/master/examples/shots/animated-swiper.gif" width="280">

### Usage

```

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';
import AnimatedSwiper from 'rn-animated-swiper';


const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 450,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 30
  }
});

export default () => (
  <AnimatedSwiper
    currentPageRotate={['90deg', '0deg', '-90deg']}
    nextPageRotate={['-70deg', '0deg', '70deg']}
    dragOffsetForTransparency={300}
    swipebleWidth={300}
    swipebleHeight={450}
    nextPageAnimationDuration={300}
    containerStyle={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'pink',
    }}
  >
    {[
      <View style={[styles.card, { backgroundColor: 'blue' }]}><Text style={styles.text}>Hello</Text></View>, 
      <View style={[styles.card, { backgroundColor: 'red' }]}><Text style={styles.text}>React Native</Text></View>,
      <View style={[styles.card, { backgroundColor: 'purple' }]}><Text style={styles.text}>Awesome</Text></View>
    ]}
  </AnimatedSwiper>
)
```

### Properties

| Prop  | Default  | Type | Description |
| :------------ |:---------------:| :---------------:| :-----|
| currentPageRotate | ['0deg', '0deg', '0deg'] | `array` | Left/Right swipe interpolate offset rotate for current page
| nextPageRotate | ['0deg', '0deg', '0deg'] | `array` | Left/Right swipe interpolate offset rotate for next page |
| dragOffsetForTransparency | screenWidth | `number` | Swipe offset for transparency |
| swipebleWidth | screenWidth | `number` | Width where can start swipe (from center screen) |
| swipebleHeight | screenHeight | `number` | Height where can start swipe (from center screen)|
| nextPageAnimationDuration | 500 | `number` | How long will the animation continue on the next screen |
| containerStyle | `{flex: 1, justifyContent: 'center', alignItems: 'center', }` | `object` | Style for wrapper |
