import React, {Component} from 'react';
import {View} from 'react-native';
import {ActivityIndicatorComponent} from '../components';
import {commonStyle} from '../common';

const withDelayLoading = WrappedComponent => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        delay: false,
      };
      this.time;
    }

    componentDidMount() {
      this.time = setTimeout(() => {
        this.setState({
          delay: true,
        });
      }, 300);
    }

    componentWillUnmount() {
      clearTimeout(this.time);
    }

    render() {
      if (this.state.delay) {
        return <WrappedComponent {...this.props} delay={this.state.delay} />;
      } else {
        return (
          <View style={[commonStyle.flex1, commonStyle.justItemCenter]}>
            <ActivityIndicatorComponent />
          </View>
        );
      }
    }
  };
};

export default withDelayLoading;
