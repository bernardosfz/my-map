import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";

const capitals = [
  {
    name: "Brasília",
    latitude: -15.7801,
    longitude: -47.9292,
    info: "Capital do Brasil e do Distrito Federal",
  },
  {
    name: "São Paulo",
    latitude: -23.5505,
    longitude: -46.6333,
    info: "Capital do estado de São Paulo",
  },
  {
    name: "Rio de Janeiro",
    latitude: -22.9068,
    longitude: -43.1729,
    info: "Capital do estado do Rio de Janeiro",
  },
  {
    name: "Salvador",
    latitude: -12.9714,
    longitude: -38.5014,
    info: "Capital do estado da Bahia",
  },
  {
    name: "Belo Horizonte",
    latitude: -19.9167,
    longitude: -43.9345,
    info: "Capital do estado de Minas Gerais",
  },
  {
    name: "Fortaleza",
    latitude: -3.7172,
    longitude: -38.5434,
    info: "Capital do estado do Ceará",
  },
  {
    name: "Curitiba",
    latitude: -25.429,
    longitude: -49.267,
    info: "Capital do estado do Paraná",
  },
  {
    name: "Manaus",
    latitude: -3.119,
    longitude: -60.0217,
    info: "Capital do estado do Amazonas",
  },
  {
    name: "Recife",
    latitude: -8.0476,
    longitude: -34.877,
    info: "Capital do estado de Pernambuco",
  },
  {
    name: "Porto Alegre",
    latitude: -30.0346,
    longitude: -51.2177,
    info: "Capital do estado do Rio Grande do Sul",
  },
];

export default function App() {
  const [markers, setMarkers] = useState([]);
  const [uniqueMarker, setUniqueMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkers((prevMarkers) => [...prevMarkers, { latitude, longitude }]);
  };

  const handleUniqueMarker = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setUniqueMarker({ latitude, longitude });
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Permissão para acessar a localização foi negada."
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Coordenadas" onPress={() => console.log(uniqueMarker)} />
      <MapView
        initialRegion={
          userLocation || {
            latitude: -15.7801,
            longitude: -47.9292,
            latitudeDelta: 30,
            longitudeDelta: 30,
          }
        }
        provider="google"
        style={{ flex: 1 }}
        onPress={handleUniqueMarker}
      >
        {/* <Marker
          coordinate={{
            latitude: -15.7801,
            longitude: -47.9292,
          }}
        /> */}

        {userLocation && (
          <Marker
            pinColor="black"
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
          />
        )}

        {uniqueMarker && (
          <Marker
            pinColor="orange"
            coordinate={{
              latitude: uniqueMarker.latitude,
              longitude: uniqueMarker.longitude,
            }}
          />
        )}

        {markers.map((item, index) => (
          <Marker
            pinColor="blue"
            key={index}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
          />
        ))}

        {capitals.map((item, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.title}>{item.name}</Text>
                <Text>{item.info}</Text>
                <Button
                  title="Visualizar"
                  onPress={() => console.log(item.name)}
                />
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <StatusBar style="auto" />

      {/* <MapView
        style={styles.map}
        
        region={userLocation}
        onPress={handleMapPress}
      > */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  callout: {
    width: 150,
    padding: 5,
  },
  title: {
    fontWeight: "bold",
  },
});