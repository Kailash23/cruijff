import React from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';
import { Query } from 'react-apollo';
import { FlatList } from 'react-native';
import sportFragment from '../../../GraphQL/Sports/Fragments/sport';
import GET_SPORTS from '../../../GraphQL/Sports/Queries/GET_SPORTS';
import CenteredActivityIndicator from '../CenteredActivityIndicator';
import SportCard from '../SportCard';
import { makeNumGenerator } from '../../../utils';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const SportsList = ({ selectedSport, onSportPress }) => {
  const numGenerator = makeNumGenerator();

  return (
    <Query query={GET_SPORTS}>
      {({ loading, error, data }) => {
        if (loading) { return <CenteredActivityIndicator />; }
        if (error || !data) { return null; }

        return (
          <FlatList
            keyExtractor={item => item.uuid}
            data={data.sports.filter(sport => (
              sport
              && sport.category
              && sport.category.toUpperCase() !== 'OTHERS'
              && sport.category.toUpperCase() !== 'FITNESS'
            ))}
            renderItem={({ item }) => (
              <SportCard
                testID={`sport_${numGenerator()}`}
                sport={item}
                isSelected={(
                  selectedSport
                  && selectedSport.uuid
                  && item.uuid === selectedSport.uuid
                ) || false}
                onPress={onSportPress}
              />
            )}
            ItemSeparatorComponent={null}
            // Force list to re-render whenever selected sport changes
            extraData={selectedSport ? selectedSport.uuid : null}
          />
        );
      }}
    </Query>
  );
};

SportsList.propTypes = {
  selectedSport: propType(sportFragment),
  onSportPress: PropTypes.func,
};

SportsList.defaultProps = {
  selectedSport: null,
  onSportPress: () => {},
};

export default SportsList;
