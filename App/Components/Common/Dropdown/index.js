import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown as DropdownMUI } from 'react-native-material-dropdown';
import Fonts from '../../../Themes/Fonts';
import Colors from '../../../Themes/Colors';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
// We extend Dropdown component so that is can receive an array of
// { label, value } pairs instead of only { value }
const Dropdown = ({
  fontColor,
  baseColor,
  tintColor,
  lineWidth,
  size,
  data,
  onChangeText,
  label,
  style,
  disabled,
  ...rest
}) => (
  <DropdownMUI
    data={data.map(item => ({ value: item.label }))}
    onChangeText={(value) => {
      onChangeText(data.find(d => (d.label === value)));
    }}
    label={label}
    labelFontSize={Fonts.style.M.fontSize}
    labelTextStyle={{ fontFamily: Fonts.style.M.fontFamily }}
    labelHeight={1.5 * Fonts.style.M.fontSize}
    errorColor={Colors.red}
    animationDuration={150}
    lineWidth={lineWidth}
    disabledLineWidth={0}
    baseColor={baseColor}
    tintColor={tintColor}
    rippleOpacity={0}
    dropdownPosition={-8}
    dropdownOffset={{ top: 0, left: 16 }}
    itemCount={8}
    // Hide default carret
    renderAccessory={() => (null)}
    inputContainerPadding={14}
    disabled={disabled}
    style={{
      fontSize: Fonts.style[size].fontSize,
      fontWeight: 'normal',
      fontFamily: Fonts.style[size].fontFamily,
      marginTop: 8,
      color: disabled ? Colors.gray : fontColor,
      ...style,
    }}
    {...rest}
  />
);

Dropdown.propTypes = {
  fontColor: PropTypes.string,
  baseColor: PropTypes.string,
  tintColor: PropTypes.string,
  lineWidth: PropTypes.number,
  size: PropTypes.oneOf(Object.keys(Fonts.style)),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    }).isRequired,
  ).isRequired,
  onChangeText: PropTypes.func,
  label: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line
  disabled: PropTypes.bool,
  // Plus all props from react-native-material-textfield
};

Dropdown.defaultProps = {
  fontColor: Colors.black,
  baseColor: Colors.black,
  tintColor: Colors.primaryGreen,
  lineWidth: 1,
  size: 'M',
  label: '',
  onChangeText: () => {},
  style: {},
  disabled: false,
};

export default Dropdown;