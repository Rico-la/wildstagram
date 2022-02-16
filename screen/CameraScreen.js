import React, { useState, useEffect, useRef } from 'react'
import { Text, View, Button } from 'react-native'
import { Camera } from 'expo-camera';
import * as ImageManipulator from "expo-image-manipulator";

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <Camera style={{ flex: 1 }} ref={cameraRef} type={type} />
      <Button
        title='Flip'
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}>
      </Button>
      <Button
        title='Take a picture'
        onPress={async () => {
          const pictureMetadata = await cameraRef.current.takePictureAsync();
          await ImageManipulator.manipulateAsync(pictureMetadata.uri, [
            { resize: { width: 800 } },
          ])
        }}
      />
    </>
  );
}
