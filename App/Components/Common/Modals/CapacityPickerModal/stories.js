import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';
import { WithApolloMockProvider } from '../../../../GraphQL';
import ModalProps from '../../../../RenderProps/modal-props';
import RaisedButton from '../../RaisedButton';
import CapacityPickerModal from './index';

const Container = () => (
  <ModalProps>
    {({ visible, openModal, closeModal }) => (
      <View>
        <RaisedButton
          label="Open Modal"
          onPress={openModal}
        />
        <CapacityPickerModal
          visible={visible}
          onSelect={closeModal}
          onClose={closeModal}
        />
      </View>
    )}
  </ModalProps>
);

storiesOf('Modals.CapacityPickerModal', module)
  .add('CapacityPickerModal', () => (
    <WithApolloMockProvider>
      <Container />
    </WithApolloMockProvider>
  ));
