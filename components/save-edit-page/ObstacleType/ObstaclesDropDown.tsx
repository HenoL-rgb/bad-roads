import { ScrollView, View } from 'react-native';
import React from 'react';
import Modal, { ModalRefProps } from '../../modals/Modal';
import { Other } from '../../../pages/save-edit-route/assets';
import ObstaclesItem from './ObstaclesItem';
import { SvgProps } from 'react-native-svg';

type ObstaclesDropDownProps = {
  modalRef: React.RefObject<ModalRefProps>;
  obstacle: any | null;
  setObstacle: (value: number) => void;
  data: {
    id:number,
    icon: React.FC<SvgProps>,
    description: string,
  }[]
};

const data = [
  {
    id: 1,
    icon: Other,
    description:
      'Указатель предупреждает участников дорожного движения' +
      ' о подъезде к участку дороги, на котором имеются опасности,' +
      ' не предусмотренные другими предупреждающими знаками',
  },
];

export default function ObstaclesDropDown({
  modalRef,
  setObstacle,
  data
}: ObstaclesDropDownProps) {
  return (
    <Modal ref={modalRef}>
      <ScrollView>
        {data?.map(item => (
          <ObstaclesItem
            Icon={item.icon}
            id={item.id}
            description={item.description}
            handlePress={(id) => setObstacle(id)}
            key={item.id}
          />
        ))}
      </ScrollView>
    </Modal>
  );
}
