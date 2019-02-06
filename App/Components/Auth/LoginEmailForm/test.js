import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import I18n from '../../../I18n';
import LoginEmailForm from '.';

const validEmail = 'valid@email.com';
const invalidEmail = 'invalid@email';

describe('LoginEmailForm', () => {
  it('renders without crashing', () => {
    const rendered = renderer.create(<LoginEmailForm />).toJSON();
    expect(rendered).toBeTruthy();
  });

  it('renders custom label button', () => {
    const wrapper = shallow(<LoginEmailForm />);
    expect(wrapper.find({ testID: 'loginSubmitButton' }).props().label).toBe(I18n.t('loginEmailForm.btnLabel'));
  });

  it('errors when form is submitted without email', () => {
    const handleClientError = jest.fn();
    const wrapper = shallow(<LoginEmailForm onClientErrorHook={handleClientError} />);

    // Sanity check
    expect(wrapper.find({ testID: 'loginInputEmail' }).props().value).toBe('');

    wrapper.find({ testID: 'loginSubmitButton' }).props().onPress();

    expect(wrapper.find({ testID: 'loginInputEmail' }).props().error).toBe(I18n.t('loginEmailForm.fields.email.errors.required'));
    expect(handleClientError).toBeCalled();
  });

  it('errors when form is submitted with invalid email', () => {
    const handleClientError = jest.fn();
    const wrapper = shallow(<LoginEmailForm onClientErrorHook={handleClientError} />);

    // Sanity check
    expect(wrapper.find({ testID: 'loginInputEmail' }).props().value).toBe('');

    wrapper.find({ testID: 'loginInputEmail' }).props().onChangeText(invalidEmail);
    wrapper.find({ testID: 'loginSubmitButton' }).props().onPress();

    expect(wrapper.find({ testID: 'loginInputEmail' }).props().error).toBe(I18n.t('loginEmailForm.fields.email.errors.invalid'));
    expect(handleClientError).toBeCalled();
  });

  it('clears errors when email input field is modified after error', () => {
    const handleClientError = jest.fn();
    const wrapper = shallow(<LoginEmailForm onClientErrorHook={handleClientError} />);

    // Sanity check
    expect(wrapper.find({ testID: 'loginInputEmail' }).props().value).toBe('');

    wrapper.find({ testID: 'loginInputEmail' }).props().onChangeText(invalidEmail);
    wrapper.find({ testID: 'loginSubmitButton' }).props().onPress();

    expect(wrapper.find({ testID: 'loginInputEmail' }).props().error).toBe(I18n.t('loginEmailForm.fields.email.errors.invalid'));
    expect(handleClientError).toBeCalled();

    wrapper.find({ testID: 'loginInputEmail' }).props().onChangeText(validEmail);
    wrapper.find({ testID: 'loginSubmitButton' }).props().onPress();

    expect(wrapper.find({ testID: 'loginInputEmail' }).props().error).toBe('');
  });

  it('aborts form submission if onBeforeHook throws', () => {
    const handleBefore = jest.fn().mockImplementation(() => { throw new Error(); });
    const handleClientCancel = jest.fn();
    const handleSuccess = jest.fn();

    const wrapper = shallow(
      <LoginEmailForm
        onBeforeHook={handleBefore}
        onClientCancelHook={handleClientCancel}
        onSuccessHook={handleSuccess}
      />,
    );

    // Sanity check
    expect(wrapper.find({ testID: 'loginInputEmail' }).props().value).toBe('');

    wrapper.find({ testID: 'loginInputEmail' }).props().onChangeText(validEmail);
    wrapper.find({ testID: 'loginSubmitButton' }).props().onPress();

    expect(handleBefore).toBeCalled();
    expect(handleClientCancel).toBeCalled();
    expect(handleSuccess).not.toBeCalled();
  });

  it('calls onSuccessHook when valid email is provided', () => {
    const handleBefore = jest.fn();
    const handleClientCancel = jest.fn();
    const handleClientError = jest.fn();
    const handleSuccess = jest.fn();

    const wrapper = shallow(
      <LoginEmailForm
        onBeforeHook={handleBefore}
        onClientCancelHook={handleClientCancel}
        onClientErrorHook={handleClientError}
        onSuccessHook={handleSuccess}
      />,
    );

    // Sanity check
    expect(wrapper.find({ testID: 'loginInputEmail' }).props().value).toBe('');

    wrapper.find({ testID: 'loginInputEmail' }).props().onChangeText(validEmail);

    expect(wrapper.state().email).toBe(validEmail);

    wrapper.find({ testID: 'loginSubmitButton' }).props().onPress();

    expect(handleBefore).toBeCalled();
    expect(handleClientCancel).not.toBeCalled();
    expect(handleSuccess).toBeCalledWith(expect.objectContaining({ email: validEmail }));
  });
});
