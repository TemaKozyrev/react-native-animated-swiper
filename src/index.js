/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  PanResponder,
  Animated
} from 'react-native';

const { width, height } = Dimensions.get('window');

const dragOffsetForTransparency = 0.95 * width;

export default class AwesomeProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //containerTranslateX: new Animated.Value(0),
      currentPage: 0,
      prevPage: 0,
      swipe: false,
    };
  }

  componentWillMount() {
    this.changeSwipeState = (newState) => {
      this.setState({ swipe: newState });
    }
    this.scrollTo = (nextPage, fromPage) => {
      this.scrollView.scrollTo({x: nextPage * width});
      this.setState({ prevPage: fromPage });
      this.setState({ currentPage: nextPage });
    } 
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.currentPage != this.state.currentPage || nextState.swipe) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          onScroll={(event) => {
            if (event.nativeEvent.contentOffset.x % width == 0) {
              this.setState({ swipe: false });
            } else {
              console.log('swipe end');
              this.setState({ swipe: true });
            };
          }}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          ref={(scrollView) => {this.scrollView = scrollView}}>
          <PageComponent swipe={this.state.swipe} changeSwipeState={this.changeSwipeState} scrollTo={this.scrollTo} currentPage={this.state.currentPage} page={0} prevPage={this.state.prevPage}/>
          <PageComponent swipe={this.state.swipe} changeSwipeState={this.changeSwipeState} scrollTo={this.scrollTo} currentPage={this.state.currentPage} page={1} prevPage={this.state.prevPage}/>
          <PageComponent swipe={this.state.swipe} changeSwipeState={this.changeSwipeState} scrollTo={this.scrollTo} currentPage={this.state.currentPage} page={2} prevPage={this.state.prevPage}/>
          <PageComponent swipe={this.state.swipe} changeSwipeState={this.changeSwipeState} scrollTo={this.scrollTo} currentPage={this.state.currentPage} page={3} prevPage={this.state.prevPage}/>
          <PageComponent swipe={this.state.swipe} changeSwipeState={this.changeSwipeState} scrollTo={this.scrollTo} currentPage={this.state.currentPage} page={4} prevPage={this.state.prevPage}/>
        </ScrollView>
      </View>
    );
  }
}

class PageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      containerTranslateX: new Animated.Value(0),
    };
  }

  nextPageAnimatedStyle() {
    return [
      {
        width: 200,
        height: 450
      },
      {
        opacity: this.state.containerTranslateX.interpolate({
          inputRange: [-dragOffsetForTransparency, 0, dragOffsetForTransparency],
          outputRange: [1, 0, 1],
        }),
          transform: [{
          translateX: this.state.containerTranslateX,
        }]
      }
    ]
  }

  animatedStyle() {
    return [
      {
        width: 280,
        height: 450
      },
      {
        opacity: this.state.containerTranslateX.interpolate({
          inputRange: [-dragOffsetForTransparency, 0, dragOffsetForTransparency],
          outputRange: [0, 1, 0],
        }),
          transform: [{
          translateX: this.state.containerTranslateX,
        }, {
          rotate: this.state.containerTranslateX.interpolate({
            inputRange: [-dragOffsetForTransparency, 0, dragOffsetForTransparency],
            outputRange: ['-90deg', '0deg', '90deg'],
          })
        }]
      }
    ]
  }

  componentWillMount() {
    if (this.props.page !== this.props.currentPage) {
      this.state.containerTranslateX.setValue(width);
    }
      
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return true
      },
      onPanResponderMove: Animated.event([null, {
        dx: this.state.containerTranslateX
      }]),
      onPanResponderRelease: (evt, gestureState) => {
        if (this.state.containerTranslateX._value < -100) {
          if (this.props.page < 4) {
            Animated.spring(this.state.containerTranslateX, {toValue: -dragOffsetForTransparency, useNativeDriver: true}).start();                      
            this.props.scrollTo(this.props.page + 1, this.props.page);
          } else {
            Animated.spring(this.state.containerTranslateX, {toValue: 0, useNativeDriver: true}).start();                      
          }
        };
        if (this.state.containerTranslateX._value > 100) {
          if (this.props.page > 0) {
            Animated.spring(this.state.containerTranslateX, {toValue: dragOffsetForTransparency, useNativeDriver: true}).start();            
            this.props.scrollTo(this.props.page - 1, this.props.page);
          } else {
            Animated.spring(this.state.containerTranslateX, {toValue: 0, useNativeDriver: true}).start();            
          }
        }
        if (this.state.containerTranslateX._value < 100 && this.state.containerTranslateX._value > -100) {
          Animated.spring(this.state.containerTranslateX, {toValue: 0, useNativeDriver: true}).start();
        }
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.page === nextProps.currentPage) {
      if (nextProps.prevPage > this.props.page) {
        this.state.containerTranslateX.setValue(-width);
      } else {
        this.state.containerTranslateX.setValue(width);
      }
      Animated.spring(this.state.containerTranslateX, {toValue:0, useNativeDriver: true}).start();
    }
  }

  updateStyleBasedOnDeltaX(dx) {
    let opacity = 1 - Math.abs(dx) / dragOffsetForTransparency;
    if (opacity < 0) opacity = 0;
    this.setContainerStyles(opacity, dx);
  }

  render() {
    return(
      <View style={styles.swipeble}>
        <Animated.View
          ref={component => this._swipeble = component}
          style={(this.props.page === this.props.currentPage ) ? this.animatedStyle() : this.nextPageAnimatedStyle()}
          // style={this.animatedStyle()}
          {...this.panResponder.panHandlers}>
          <View style={styles.cardTwo}/>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  swipeble: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#333333',
    borderColor: 'red',
    width: 200,
    height: 200
  },
  cardTwo: {
    backgroundColor: 'red',
    borderColor: 'red',
    width: 280,
    height: 450
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
