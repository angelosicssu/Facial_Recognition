import React, {useRef, useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

export default function App() {
  const cameraRef = useRef(null);
  const [hasPermisson, setHasPermission] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState([]);

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleFaceDetected = ({ faces }) => {
    if(faces.length > 0) {
      setDetectedFaces(faces);
    } else {
    }
  };

  const toggleFaceDetection = async () => {
    if(isDetecting) {
      if(cameraRef.current) {
        await cameraRef.current.pausePreview();
      } 
    } else {
        if(cameraRef.current) {
          await cameraRef.current.resumePreview()
        }
      }
      setIsDetecting((prev) => !prev);
    }
  

  const renderFaceBoxes = () => {
    return detectedFaces.map((face, index) => (
      <View
        key={index}
        style={[
          styles.faceBox,
          {
            left: face.bounds.origin.x,
            top: face.bounds.origin.y,
            width: face.bounds.size.width,
            height: face.bounds.size.height,
          }
        ]} 
      />
    ))
  };

  if(hasPermisson === null) {
    return <View style={[styles.container]}/>
  }

  if(hasPermisson === false) {
    <View style={styles.container}>
      <Text>No acess to Camera</Text>
    </View>
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {isDetecting && (
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.front}
            onFacesDetected={handleFaceDetected}
            faceDetectorSettings={{
              mode: FaceDetector.FaceDetectorMode.none,
              detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
              runClassification: FaceDetector.FaceDetectorClassifications.none,
              minDetectionInterval: 300,
              tracking: true,
            }}
            ref={cameraRef}
          >
            {renderFaceBoxes()}
          </Camera>
        )}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={toggleFaceDetection}
      >
        <Text style={styles.buttonText}>
          {isDetecting ? 'Stop Detection' : 'Start Face Detection'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceBox: {
    position: 'absolute',
    borderColor: '#7766C6',
    borderWidth: 2,
    borderRadius: 5
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 10,
  },
  camera: {
    flex: 1
  },
  button: {
    backgroundColor: '#03498d',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18
  }
});
