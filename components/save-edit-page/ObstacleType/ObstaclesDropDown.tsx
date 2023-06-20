import { ScrollView } from 'react-native';
import React from 'react';
import Modal, { ModalRefProps } from '../../modals/Modal';
import ObstaclesItem from './ObstaclesItem';
import * as assets from '../../../pages/save-edit-route/assets';

type ObstaclesDropDownProps = {
  modalRef: React.RefObject<ModalRefProps>;
  setObstacle: (value: number) => void;
  data: {
    id: number;
    icon: keyof typeof assets;
    description: string;
  }[];
};

export default function ObstaclesDropDown({
  modalRef,
  setObstacle,
  data,
}: ObstaclesDropDownProps) {
  return (
    <Modal ref={modalRef}>
      <ScrollView>
        {data?.map(item => (
          <ObstaclesItem
            icon={item.icon}
            id={item.id}
            description={item.description}
            handlePress={id => setObstacle(id)}
            key={item.id}
          />
        ))}
        {data?.map(item => (
          <ObstaclesItem
            icon={item.icon}
            id={item.id}
            description={item.description}
            handlePress={id => setObstacle(id)}
            key={item.id}
          />
        ))}
        {data?.map(item => (
          <ObstaclesItem
            icon={item.icon}
            id={item.id}
            description={item.description}
            handlePress={id => setObstacle(id)}
            key={item.id}
          />
        ))}
        {data?.map(item => (
          <ObstaclesItem
            icon={item.icon}
            id={item.id}
            description={item.description}
            handlePress={id => setObstacle(id)}
            key={item.id}
          />
        ))}
        {data?.map(item => (
          <ObstaclesItem
            icon={item.icon}
            id={item.id}
            description={item.description}
            handlePress={id => setObstacle(id)}
            key={item.id}
          />
        ))}
        {data?.map(item => (
          <ObstaclesItem
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
