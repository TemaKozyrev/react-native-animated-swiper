import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  PanResponder,
  Animated
} from 'react-native';

import PropTypes from 'prop-types';

const { width, height } = Dimensions.get('window');

const dragOffsetForTransparency = 0.95 * width;

export default class AnimatedSwiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      prevPage: 0,
      swipe: false,
      countPage: 0,
    };
  }

  componentWillMount() {
    this.setState({ countPage: this.props.children.length })
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
    if (JSON.stringify(this.state) == JSON.stringify(nextState) || (!this.state.swipe && nextState.swipe)) {
      return true;
    }
    if (nextState.currentPage != this.state.currentPage || nextState.swipe) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <View style={this.props.containerStyle}>
        <ScrollView
          horizontal
          pagingEnabled
          scrollEnabled={false}
          ref={(scrollView) => {this.scrollView = scrollView}}>
          {this.props.children.map((component, index) => (
            <PageComponent
              swipe={this.state.swipe}
              changeSwipeState={this.changeSwipeState} 
              scrollTo={this.scrollTo}
              currentPage={this.state.currentPage}
              prevPage={this.state.prevPage}
              countPage={this.state.countPage}
              dragOffsetForTransparency={this.props.dragOffsetForTransparency}
              swipebleWidth={this.props.swipebleWidth}
              swipebleHeight={this.props.swipebleHeight}
              nextPageAnimationDuration={this.props.nextPageAnimationDuration}
              nextPageRotate={this.props.nextPageRotate}
              currentPageRotate={this.props.currentPageRotate}
              page={index}
              key={index}
            >
              { component }
            </PageComponent>
          ))}
        </ScrollView>
      </View>
    );
  }
}

AnimatedSwiper.propTypes = {
  children: PropTypes.array,
  dragOffsetForTransparency: PropTypes.number,
  containerStyle: PropTypes.object,
  swipebleWidth: PropTypes.number,
  swipebleHeight: PropTypes.number,
  nextPageAnimationDuration: PropTypes.number,
  currentPageRotate: PropTypes.array,
  nextPageRotate: PropTypes.array
}

AnimatedSwiper.defaultProps = {
  children: [],
  dragOffsetForTransparency: 0.95 * width,
  swipebleWidth: width,
  swipebleHeight: height,
  nextPageAnimationDuration: 500,
  nextPageRotate: [],
  currentPageRotate: [],
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
        width: this.props.swipebleWidth,
        height: this.props.swipebleHeight,
        alignItems: 'center',
        justifyContent: 'center'
      },
      {
        opacity: this.state.containerTranslateX.interpolate({
          inputRange: [-this.props.dragOffsetForTransparency, 0, this.props.dragOffsetForTransparency],
          outputRange: [0, 1, 0],
        }),
          transform: [{
          translateX: this.state.containerTranslateX,
        }, {
          rotate: this.state.containerTranslateX.interpolate({
          inputRange: [-dragOffsetForTransparency, 0, dragOffsetForTransparency],
          outputRange: this.props.nextPageRotate.length === 3 ? this.props.nextPageRotate : ['0deg', '0deg', '0deg']
          })
        }]
      }
    ]
  }

  animatedStyle() {
    const { dragOffsetForTransparency } = this.props;
    return [
      {
        width: this.props.swipebleWidth,
        height: this.props.swipebleHeight,
        justifyContent: 'center',
        alignItems: 'center',
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
            outputRange: this.props.currentPageRotate.length === 3 ? this.props.currentPageRotate : ['0deg', '0deg', '0deg']
          })
        }]
      }
    ]
  }

  componentWillMount() {
    const { dragOffsetForTransparency } = this.props;

    if (this.props.page !== this.props.currentPage) {
      this.state.containerTranslateX.setValue(dragOffsetForTransparency);
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
          if (this.props.page < this.props.countPage - 1) {
            this.props.changeSwipeState(true);
            Animated.spring(this.state.containerTranslateX, {toValue: -dragOffsetForTransparency, useNativeDriver: true}).start();                      
            this.props.scrollTo(this.props.page + 1, this.props.page);
          } else {
            Animated.spring(this.state.containerTranslateX, {toValue: 0, useNativeDriver: true}).start();                      
          }
        };
        if (this.state.containerTranslateX._value > 100) {
          if (this.props.page > 0) {
            this.props.changeSwipeState(true);
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
    const { dragOffsetForTransparency } = this.props;
    if (this.props.page === nextProps.currentPage && nextProps.swipe) {
      if (nextProps.prevPage > this.props.page) {
        this.state.containerTranslateX.setValue(-dragOffsetForTransparency);
      } else {
        this.state.containerTranslateX.setValue(dragOffsetForTransparency);
      }
      Animated.timing(this.state.containerTranslateX, {toValue:0, duration: this.props.nextPageAnimationDuration, useNativeDriver: true}).start(() => { this.props.changeSwipeState(false); this.state.containerTranslateX.setValue(0); });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.swipe || Math.abs(this.props.page - nextProps.currentPage) > 1)
      return false;
    return true;
  }

  updateStyleBasedOnDeltaX(dx) {
    let opacity = 1 - Math.abs(dx) / this.props.dragOffsetForTransparency;
    if (opacity < 0) opacity = 0;
    this.setContainerStyles(opacity, dx);
  }

  render() {
    return(
      <View style={styles.swipeble}>
        <Animated.View
          //ref={component => this._swipeble = component}
          style={(this.props.page === this.props.currentPage ) ? this.animatedStyle() : this.nextPageAnimatedStyle()}
          {...this.panResponder.panHandlers}>
          {this.props.children}
        </Animated.View>
      </View>
    )
  }
}

PageComponent.propTypes = {
  swipe: PropTypes.bool.isRequired,
  changeSwipeState: PropTypes.func.isRequired,
  scrollTo: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  prevPage: PropTypes.number.isRequired,
  countPage: PropTypes.number.isRequired,
  dragOffsetForTransparency: PropTypes.number.isRequired,
  swipebleWidth: PropTypes.number.isRequired,
  swipebleHeight: PropTypes.number.isRequired,
  nextPageAnimationDuration: PropTypes.number.isRequired,
  nextPageRotate: PropTypes.array.isRequired,
  currentPageRotate: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired
}

const styles = StyleSheet.create({
  swipeble: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

