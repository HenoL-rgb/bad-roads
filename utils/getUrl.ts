import { Point } from '../types/Point';

export function getUrl(points: Point[]) {
  const lon = points[0]?.lon;
  const lat = points[0]?.lat;

  const trace: string = points.reduce((acc: string, value: Point) => {
    acc += ',' + value.lon + ',';
    acc += value.lat;

    return acc;
  }, '');

  return (
    'https://static-maps.yandex.ru/1.x/?lang=en_US&ll=' +
    +lon +
    ',' +
    lat +
    '&size=300,300&z=17&l=skl&pl=c:ec473fFF,f:00FF00A0,w:7' +
    trace
  );
}
