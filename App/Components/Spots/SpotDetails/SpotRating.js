import React from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';
import styled from 'styled-components';
import api from '../../../Services/SeedorfApi';
import spotDetailsFragment from '../../../GraphQL/Spots/Fragments/spotDetails';
import FlatButton from '../../../Components/FlatButton';
import RatingBig from '../../../Components/RatingBig';
import Text from '../../../Components/Text';
import I18n from '../../../I18n';
import Colors from '../../../Themes/Colors';

const HorizontalView = styled.View`
  flex-direction: row;
`;

const Block = styled.View`
  padding: 16px;
`;

class SpotRating extends React.PureComponent {
  state = {
    rating: 0,
    userRating: null, // todo: set from props
    showRating: true,
  }

  submitRating = async () => {
    const { spotId, userId } = this.props;
    const { rating } = this.state;

    if (this.state.rating <= 0) {
      return;
    }

    try {
      const result = await api.submitRating(spotId, userId, rating);
      console.log(result);
      this.setState({ userRating: rating });
    } catch (exc) {
      console.log(exc);
    }
  };

  render() {
    const { rating, userRating, showRating } = this.state;

    if (!showRating) {
      return null;
    }

    return (
      <Block style={{ backgroundColor: Colors.bgGrey }}>
        <Text>{I18n.t('Rate this spot')}</Text>
        <HorizontalView style={{ justifyContent: 'space-between' }}>
          <RatingBig
            rating={rating}
            onPress={i => this.setState({ rating: i })}
          />
          <FlatButton
            text={I18n.t(userRating ? 'thank you' : 'submit').toUpperCase()}
            onPress={this.submitRating}
          />
        </HorizontalView>
      </Block>
    );
  }
}

SpotRating.propTypes = {
  spot: propType(spotDetailsFragment).isRequired, // eslint-disable-line
  userId: PropTypes.string.isRequired,
};

export default SpotRating;