import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components';
import Row from '../Row';
import Spacer from '../Spacer';
import TextField from '../TextField';
import Dropdown from '../Dropdown';
import getPalette from './utils';

//------------------------------------------------------------------------------
// STYLE:
//------------------------------------------------------------------------------
const FlexGrow = styled.View`
  flex-grow: 1; /* full width */
`;
//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const InputField = ({
  comp,
  theme,
  onPress,
  boxed,
  width,
  ...rest
}) => {
  const isTextField = comp === 'TextField';
  const Comp = isTextField ? TextField : Dropdown;
  const pointerEvents = isTextField ? 'none' : 'auto';
  const {
    fontColor,
    baseColor,
    tintColor,
    iconColor,
    lineWidth,
  } = getPalette(theme);

  const touchableStyle = width ? { width } : { flex: 1 };

  if (boxed) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={touchableStyle}
      >
        <Row>
          <FlexGrow pointerEvents={pointerEvents}>
            <Comp
              fontColor={fontColor}
              baseColor={baseColor}
              tintColor={tintColor}
              iconColor={iconColor}
              lineWidth={lineWidth}
              {...rest}
            />
          </FlexGrow>
          {/* Add custom carret */}
          <View>
            <Spacer size="XXL" />
            <Icon
              size={24}
              name="keyboard-arrow-down"
              color={iconColor}
            />
          </View>
        </Row>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={touchableStyle}
    >
      <Row>
        <Spacer orientation="row" size="M" />
        <FlexGrow pointerEvents={pointerEvents}>
          <Comp
            fontColor={fontColor}
            baseColor={baseColor}
            tintColor={tintColor}
            iconColor={iconColor}
            lineWidth={lineWidth}
            style={{
              paddingHorizontal: 8,
              textAlign: 'center',
            }}
            {...rest}
          />
        </FlexGrow>
        {/* Add custom carret */}
        <View>
          <Spacer size="XXL" />
          <Icon
            size={24}
            name="keyboard-arrow-down"
            color={iconColor}
          />
        </View>
        <Spacer orientation="row" size="M" />
      </Row>
    </TouchableOpacity>
  );
};

InputField.propTypes = {
  comp: PropTypes.oneOf(['TextField', 'Dropdown']).isRequired,
  theme: PropTypes.oneOf(['white', 'black', 'transparent', 'mix']),
  onPress: PropTypes.func,
  boxed: PropTypes.bool,
  width: PropTypes.number,
};

InputField.defaultProps = {
  theme: 'black',
  onPress: () => {},
  boxed: false,
  width: null,
};

export default InputField;