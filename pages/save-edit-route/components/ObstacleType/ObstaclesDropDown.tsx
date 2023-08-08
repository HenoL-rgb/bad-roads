import React from 'react';
import { ScrollView } from 'react-native';

import Modal, { ModalRefProps } from '../../../../components/modals/Modal';
import { ThemesType } from '../../../../types/Themes';
import * as assets from '../../assets';

import ObstaclesItem from './ObstaclesItem';

type ObstaclesDropDownProps = {
  theme: ThemesType;
  modalRef: React.RefObject<ModalRefProps>;
  setObstacle: (value: number) => void;
  data: {
    id: number;
    icon: keyof typeof assets;
    description: string;
  }[];
};

export default function ObstaclesDropDown({
  theme,
  modalRef,
  setObstacle,
  data,
}: ObstaclesDropDownProps) {
  return (
    <Modal ref={modalRef}>
      <ScrollView>
        {data?.map(item => (
          <ObstaclesItem
            theme={theme}
            icon={item.icon}
            id={item.id}
            description={item.description}
            handlePress={id => setObstacle(id)}
            key={item.id}
          />
        ))}
      </ScrollView>
    </Modal>
  );
}
