import { View, Text, Button, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import YaMap, { Marker, Polyline } from 'react-native-yamap';
import { useTestMutation } from '../store/api/auth.api';



const API_URL = "192.168.100.9:5000";

type RouteEvent = {
  routes: {
    id: string;
    sections: [];
  }[];
  status: string;
};

type Point = {
  lat: number;
  lon: number;
};

type Route = {
  points: Point[];
  id: string;
};

type RouteSection = {
  points: Point[];

  transports: {
    [key: string]: string;
  };

  type: string;
  stops: [];
  routeIndex: number;
  routeInfo: {
    distance: number;
    time: string;
    timeWithTraffic: string;
  };
  sectionInfo: {
    distance: number;
    time: string;
    timeWithTraffic: string;
  };
  sectionColor: string;
};


export default function Map() {
    YaMap.init('3b806cc7-d2e8-49ac-9f8d-fc2c721025b2');
 

  const [coords1, setCoords1] = useState({
    lat: 55.171558085315624,
    lon: 30.214888129711426,
  });
  const [coords2, setCoords2] = useState({
    lat: 55.17176111359353,
    lon: 30.2134098048991,
  });

  const [points, setPoints] = useState<Point[]>([]);
  const [current, setCurrent] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const map = useRef<YaMap>(null);
  const [test, {isLoading}] = useTestMutation();

  async function testFetch() {
    console.log('response');
    const response = await test({});
    console.log(response);
  }
  return (
    <View style={{flex: 1}}>
    <YaMap
        showUserPosition={false}
        onMapPress={event => {
          if (current) {
            setCoords1({
              lat: event.nativeEvent.lat,
              lon: event.nativeEvent.lon,
            });
          } else {
            setCoords2({
              lat: event.nativeEvent.lat,
              lon: event.nativeEvent.lon,
            });
          }
        }}
        style={{ flex: 1 }}
        nightMode={true}
        mapType={'vector'}
        ref={map}
        initialRegion={{
          lat: 55.17,
          lon: 30.2153,
          zoom: 17,
          azimuth: 0,
        }}>
        <Marker point={coords2} scale={1}>
          <View style={styles.marker}>
            <View style={styles.markerTop}></View>
            <View style={styles.markerBottom}></View>
          </View>
        </Marker>
        <Marker point={coords1} scale={1}>
          <View style={styles.marker}>
            <View
              style={{ ...styles.markerTop, backgroundColor: 'green' }}></View>
            <View
              style={{
                ...styles.markerBottom,
                backgroundColor: 'green',
              }}></View>
          </View>
        </Marker>
        {/* <Polyline
          points={points}
          strokeColor="#466ca8"
          strokeWidth={4}
          zIndex={4}
        /> */}
        {routes.map(route => (
          <Polyline
            key={route.id}
            points={route.points}
            strokeColor="#f11515"
            strokeWidth={4}
            zIndex={4}
            onPress={() => {
              setRoutes(routes.filter(item => item.id !== route.id));
            }}
          />
        ))}
        {points ? (
          <Polyline
            points={points}
            strokeColor="#f11515"
            strokeWidth={4}
            zIndex={4}
          />
        ) : null}
      </YaMap>
      <Button
        title="Route"
        onPress={() =>
          map.current?.findDrivingRoutes(
            [coords1, coords2],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            (e: RouteEvent) => {
              const points = e.routes[0].sections.reduce(
                (acc: Point[], item: RouteSection) => [...acc, ...item.points],
                [],
              );
              setPoints(points);
              //setRoutes([...routes, { points: points, id: e.routes[0].id }]);
            },
          )
        }
      />
      <Button title="Marker" onPress={() => setCurrent(!current)} />
      <Button title="Save" onPress={() => testFetch()} />
    </View>
  )
}

const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
    marker: {
      height: 40,
      width: 20,
      position: 'relative',
    },
    markerBottom: {
      height: 10,
      width: 10,
      backgroundColor: 'red',
      transform: [{ rotate: '-45deg' }],
      position: 'absolute',
      bottom: 18,
      left: 5,
    },
    markerTop: {
      height: 20,
      width: 20,
      backgroundColor: 'red',
      borderRadius: 50,
      position: 'absolute',
    },
  });