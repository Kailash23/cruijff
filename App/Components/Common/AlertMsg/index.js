import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../../Themes/Colors';
import Text from '../Text';
import Block from '../Block';
import Row from '../Row';
import Spacer from '../Spacer';
import getPalette from './utils';

//------------------------------------------------------------------------------
// STYLE:
//------------------------------------------------------------------------------
const StyledBlock = styled(Block)`
  border-radius: 4px;
`;
//------------------------------------------------------------------------------
const FullWidth = styled.View`
  flex: 1; /* full width */
`;
//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const AlertMsg = ({ status, value }) => {
  const palette = getPalette(status);
  const { iconName, fontColor, bgColor } = palette; // string to be used Colors[string]

  return (
    <StyledBlock bgColor={Colors[bgColor]}>
      <Row>
        <Icon
          name={iconName}
          size={24}
          color={Colors[fontColor]}
        />
        <Spacer row size="M" />
        <FullWidth>
          <Text size="M" color={fontColor}>
            {value}
          </Text>
        </FullWidth>
      </Row>
    </StyledBlock>
  );
};

AlertMsg.propTypes = {
  status: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  value: PropTypes.string,
};

AlertMsg.defaultProps = {
  value: '',
};

export default AlertMsg;
