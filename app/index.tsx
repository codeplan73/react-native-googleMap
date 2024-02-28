import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";

const INITIAL_REGION = {
  latitude: 6.335001,
  longitude: 5.602882,
  latitudeDelta: 1,
  longitudeDelta: 2,
};

const index = () => {
  const [region, setRegion] = useState(INITIAL_REGION);
  const mapRef = useRef<MapView>(null);

  const onRegionChanged = (region: Region) => {
    // console.log(region);
  };

  const focusMap = () => {
    const newYorkRegion = region;
    mapRef.current?.animateToRegion(newYorkRegion);
  };

  const zoom = () => {
    mapRef.current?.animateCamera({ zoom: 13 });
  };

  const takeSnapshotAndShare = async () => {
    const snapshot = await mapRef.current?.takeSnapshot({
      width: 300,
      height: 300,
      result: "base64",
    });

    const uri = FileSystem.documentDirectory + "snapshot.png";
    await FileSystem.writeAsStringAsync(uri, snapshot!, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await shareAsync(uri);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        mapType="standard"
        style={StyleSheet.absoluteFill}
        showsUserLocation
        showsMyLocationButton
        rotateEnabled={false}
        region={region}
        onRegionChange={onRegionChanged}
      />

      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={focusMap}>
          <Ionicons name="business" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={zoom}>
          <Ionicons name="earth" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={takeSnapshotAndShare}>
          <Ionicons name="camera" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  btnContainer: {
    position: "absolute",
    top: 60,
    right: 20,
    gap: 10,
  },

  btn: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
});
