import { storiesOf } from '@storybook/react-native';
import React from 'react';
import PropTypes from 'prop-types';
import Colors from '../../../Themes/Colors';
import Block from '../Block';
import TimePickerField from './index';

class Container extends React.PureComponent {
  state = { value: null }

  handleChange = (date) => {
    this.setState({ value: date });
  }

  render() {
    const { theme } = this.props;
    const { value } = this.state;

    return (
      <TimePickerField
        theme={theme}
        value={value}
        onChange={this.handleChange}
      />
    );
  }
}

Container.propTypes = {
  theme: PropTypes.oneOf(['black', 'white']),
};

Container.defaultProps = {
  theme: 'black',
};

storiesOf('Common.TimePickerField', module)
  .add('TimePickerField', () => <Container />)
  .add('TimePickerField white theme', () => (
    <Block bgColor={Colors.primaryGreen}>
      <Container theme="white" />
    </Block>
  ));
