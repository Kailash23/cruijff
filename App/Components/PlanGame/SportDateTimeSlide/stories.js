import { storiesOf } from '@storybook/react-native';
import React from 'react';
import PropTypes from 'prop-types';
import Colors from '../../../Themes/Colors';
import Block from '../../Common/Block';
import SportDateTimeSlide from './index';

class Container extends React.PureComponent {
  state = {
    sport: null,
    date: null,
    time: null,
    capacity: null,
  }

  handleChange = ({ fieldName, value }) => {
    this.setState({ [fieldName]: value });
  }

  render() {
    const { theme } = this.props;
    const {
      sport,
      date,
      time,
      capacity,
    } = this.state;

    return (
      <SportDateTimeSlide
        theme={theme}
        sport={sport}
        date={date}
        time={time}
        capacity={capacity}
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

storiesOf('PlanGame.SportDateTimeSlide', module)
  .add('SportDateTimeSlide white theme', () => (
    <Block bgColor={Colors.primaryGreen}>
      <Container theme="white" />
    </Block>
  ));