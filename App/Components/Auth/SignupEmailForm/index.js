import React from 'react';
import PropTypes from 'prop-types';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ErrorHandling from 'error-handling-utils';
import isEmail from 'validator/lib/isEmail';
import styled from 'styled-components';
import pick from 'lodash/pick';
import I18n from '../../../I18n';
import Colors from '../../../Themes/Colors';
import Block from '../../Common/Block';
// import Spacer from '../../Common/Spacer';
import Text from '../../Common/Text';
import LinkOpenURL from '../../Common/LinkOpenURL';
import TextField from '../../Common/TextField';
import RaisedButton from '../../Common/RaisedButton';

// TODO: use INIT_STATE and INTI_ERRORS
//------------------------------------------------------------------------------
// CONSTANTS:
//------------------------------------------------------------------------------
const MAX_CHARS = 120;
const FIELDS = ['firstName', 'lastName', 'email'];
//------------------------------------------------------------------------------
// STYLE:
//------------------------------------------------------------------------------
const FlexOne = styled.ScrollView`
  flex: 1; /* full height */
`;
//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
// TODO: use KeyboardAwareScrollView
class SignupEmailForm extends React.PureComponent {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    errors: {
      firstName: [],
      lastName: [],
      email: [],
    },
    // Keep track of field position in order to 'scroll to' on error
    offsetY: {
      firstName: 0,
      lastName: 0,
      email: 0,
    },
  }

  componentWillReceiveProps({ errors }) {
    // Display server side errors coming from the outside
    if (errors) {
      this.setState({
        errors: {
          firstName: [],
          lastName: [],
          email: [],
          ...errors,
        },
      });
    }
  }

  clearErrors = () => {
    this.setState({
      errors: {
        firstName: [],
        lastName: [],
        email: [],
      },
    });
  };

  handleLayout = ({ fieldName, nativeEvent }) => {
    const { offsetY } = this.state;

    this.setState({
      offsetY: {
        ...offsetY,
        [fieldName]: nativeEvent.layout.y,
      },
    });
  }

  handleChange = ({ fieldName, value }) => {
    const { errors } = this.state;

    // Update value and clear errors for the given field
    this.setState({
      [fieldName]: value,
      errors: ErrorHandling.clearErrors(errors, fieldName),
    });
  }

  validateFields = ({ firstName, lastName, email }) => {
    // Initialize errors
    const errors = {
      firstName: [],
      lastName: [],
      email: [],
    };

    // Sanitize input
    const _firstName = firstName && firstName.trim(); // eslint-disable-line no-underscore-dangle

    if (!_firstName) {
      errors.firstName.push('signupEmailForm.fields.firstName.errors.required');
    } else if (_firstName.length > MAX_CHARS) {
      errors.firstName.push('signupEmailForm.fields.firstName.errors.tooLong');
    }

    // Sanitize input
    const _lastName = lastName && lastName.trim(); // eslint-disable-line no-underscore-dangle

    if (!_lastName) {
      errors.lastName.push('signupEmailForm.fields.lastName.errors.required');
    } else if (_lastName.length > MAX_CHARS) {
      errors.lastName.push('signupEmailForm.fields.lastName.errors.tooLong');
    }

    // Sanitize input
    const _email = email && email.trim(); // eslint-disable-line no-underscore-dangle

    if (!_email) {
      errors.email.push('signupEmailForm.fields.email.errors.required');
    } else if (!isEmail(_email)) {
      errors.email.push('signupEmailForm.fields.email.errors.invalid');
    } else if (_email.length > MAX_CHARS) {
      errors.email.push('signupEmailForm.fields.email.errors.tooLong');
    }

    return errors;
  };

  handleSubmit = () => {
    const {
      onBeforeHook,
      onClientCancelHook,
      onClientErrorHook,
      onSuccessHook,
    } = this.props;

    // Run before logic if provided and return on error. onBeforeHook will set the 'disabled'
    // value to 'true' so that the user cannot re-submit the form
    try {
      onBeforeHook();
    } catch (exc) {
      onClientCancelHook();
      return; // return silently
    }

    // Get field values
    const fields = pick(this.state, FIELDS);

    // Clear previous errors if any
    this.clearErrors();

    // Validate fields
    const errors = this.validateFields(fields);

    // In case of errors, display on UI and return handler to parent component
    if (ErrorHandling.hasErrors(errors)) {
      this.setState({ errors });
      // Scroll to first error field
      const { offsetY } = this.state;
      const firstErrorKey = ErrorHandling.getFirstError(errors).key; // 'firstName', 'lastName', ...
      const y = parseInt(offsetY[firstErrorKey], 10);
      this.scroller.scrollTo({ x: 0, y });
      // Pass event up to parent component. onClientErrorHook will set 'disabled'
      // value back to 'false' so that the user can re-submit the form
      onClientErrorHook();
      return;
    }

    // Pass event up to parent component
    onSuccessHook(fields);
  }

  render() {
    const { disabled } = this.props;
    const {
      firstName,
      lastName,
      email,
      errors,
    } = this.state;

    // Apply translation and concatenate field errors (string)
    const firstNameErrors = ErrorHandling.getFieldErrors(errors, 'firstName', I18n.t);
    const lastNameErrors = ErrorHandling.getFieldErrors(errors, 'lastName', I18n.t);
    const emailErrors = ErrorHandling.getFieldErrors(errors, 'email', I18n.t);

    return (
      <FlexOne
        ref={(scroller) => { this.scroller = scroller; }}
        testID="signupScrollView"
      >
        <Block
          midHeight
          onLayout={({ nativeEvent }) => { this.handleLayout({ fieldName: 'firstName', nativeEvent }); }}
        >
          <TextField
            testID="signupFieldFirstName"
            label={I18n.t('signupEmailForm.fields.firstName.label')}
            placeholder={I18n.t('signupEmailForm.fields.firstName.placeholder')}
            value={firstName}
            error={firstNameErrors}
            size="ML"
            disabled={disabled}
            autoFocus
            onChangeText={(value) => {
              this.handleChange({ fieldName: 'firstName', value });
            }}
          />
        </Block>
        <Block
          midHeight
          onLayout={({ nativeEvent }) => { this.handleLayout({ fieldName: 'lastName', nativeEvent }); }}
        >
          <TextField
            testID="signupFieldLastName"
            label={I18n.t('signupEmailForm.fields.lastName.label')}
            placeholder={I18n.t('signupEmailForm.fields.lastName.placeholder')}
            value={lastName}
            error={lastNameErrors}
            size="ML"
            disabled={disabled}
            onChangeText={(value) => {
              this.handleChange({ fieldName: 'lastName', value });
            }}
          />
        </Block>
        <Block
          midHeight
          onLayout={({ nativeEvent }) => { this.handleLayout({ fieldName: 'email', nativeEvent }); }}
        >
          <TextField
            testID="signupFieldEmail"
            label={I18n.t('signupEmailForm.fields.email.label')}
            placeholder={I18n.t('signupEmailForm.fields.email.placeholder')}
            value={email}
            error={emailErrors}
            size="ML"
            disabled={disabled}
            keyboardType="email-address"
            onChangeText={(value) => {
              this.handleChange({ fieldName: 'email', value });
            }}
          />
        </Block>
        <Block>
          <Text.M style={{ color: Colors.black }}>
            {I18n.t('signupEmailForm.terms.prefix')}
          </Text.M>
          <LinkOpenURL
            text={I18n.t('signupEmailForm.terms.link')}
            href="https://www.sportyspots.com/terms.html"
            color={Colors.actionYellow}
            underline
          />
        </Block>
        <Block>
          <RaisedButton
            testID="signupButtonSubmit"
            variant="info"
            label={I18n.t('signupEmailForm.btnLabel')}
            disabled={disabled}
            onPress={this.handleSubmit}
          />
        </Block>
      </FlexOne>
    );
  }
}

SignupEmailForm.propTypes = {
  disabled: PropTypes.bool,
  errors: PropTypes.object, // eslint-disable-line
  onBeforeHook: PropTypes.func,
  onClientCancelHook: PropTypes.func,
  onClientErrorHook: PropTypes.func,
  onSuccessHook: PropTypes.func,
};

SignupEmailForm.defaultProps = {
  disabled: false,
  errors: null,
  onBeforeHook: () => {},
  onClientCancelHook: () => {},
  onClientErrorHook: () => {},
  onSuccessHook: () => {},
};

export default SignupEmailForm;
