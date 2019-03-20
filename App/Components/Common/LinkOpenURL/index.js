import React from 'react';
import PropTypes from 'prop-types';
import { Linking, TouchableOpacity } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../../Themes/Colors';
import Fonts from '../../../Themes/Fonts';
import Row from '../Row';
import Text from '../Text';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const LinkOpenURL = ({
  text,
  href,
  color,
  iconSet,
  iconName,
  size,
  underline,
}) => {
  const Icon = iconSet === 'MaterialIcon' ? MaterialIcon : MaterialCommunityIcon;

  return (
    <TouchableOpacity onPress={() => { Linking.openURL(href); }}>
      <Row
        justifyContent="space-between"
        alignItems="center"
      >
        <Text
          size={size}
          color={color}
          underline={underline}
        >
          {text}
        </Text>
        {!!iconName && (
          <Icon // TODO: build a wrapper around Icon to receive color, iconSet and iconName props
            name={iconName}
            size={24}
            color={Colors.black}
          />
        )}
      </Row>
    </TouchableOpacity>
  );
};

LinkOpenURL.propTypes = {
  text: PropTypes.string,
  href: PropTypes.string,
  color: PropTypes.oneOf(Object.keys(Colors)),
  iconSet: PropTypes.oneOf(['MaterialIcon', 'MaterialCommunityIcon']),
  iconName: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(Fonts)),
  underline: PropTypes.bool,
};

LinkOpenURL.defaultProps = {
  text: '',
  href: '',
  color: 'black',
  iconSet: 'MaterialIcon',
  iconName: '',
  size: 'M',
  underline: false,
};

export default LinkOpenURL;
