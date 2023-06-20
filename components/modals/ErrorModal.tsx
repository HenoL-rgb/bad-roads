import { View, Text } from 'react-native';
import React from 'react';
import Modal, { ModalRefProps } from './Modal';

type Props = {
  modalRef: React.RefObject<ModalRefProps>;
  error: string;
};

export default function ErrorModal({modalRef, error}: Props) {
  return <Modal ref={modalRef}>
    <View>
      
    </View>
  </Modal>;
}
