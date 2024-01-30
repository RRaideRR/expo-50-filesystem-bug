import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const pickVideoAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: 'Videos',
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      const asset = result.assets[0]

      if (!asset) {
        return;
      }

      const data = {
        url: 'https://storage.googleapis.com/expo-filesystem-test.appspot.com/temp/test.mp4?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-trr0x%40expo-filesystem-test.iam.gserviceaccount.com%2F20240130%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240130T082730Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=3c0c02c95e3d27bb5dada99328ecfc213ee2f8013fa327fea6353c8d364bfbe584460e59d8577201fdbb267e36b7137532da6ee66238d938277566b464d1209cbebd9d112c6773d6aa1491f3c3fa011f597050d210722c42720bb5efdea224f5974e29544ecd90e1b3a6ebcf34ce988878b2601aef44565020adf92654080c97cc45ece17fc0dc0a1e9df1287bb72494e5e0e07080f8f496c4dc8abf16a06afd6db01413a82f07ac88dc89f57634239eae397de3e8e034a3bae997bdc36483432ec60cb473afae5fa0cdc4abf991ebce9211bbd4b105c95840c6e69771555593cf82f19a7f76d935948d00fca723b7fe6e3ada0ae1f89bbec5f0e58180f6497c',
        fileUri: asset.uri
      }

      console.log("Creating Upload Task")
      const uploadTask = FileSystem.createUploadTask(
        data.url,
        data.fileUri,
        {
          httpMethod: 'POST',
          fieldName: 'file',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      console.log("Starting Upload")
      try {
        const response = await uploadTask.uploadAsync();
        console.log("Upload - completed with response")
        console.log("Response: ", JSON.stringify(response))
      } catch(e) {
        console.log("Upload failed due to ", JSON.stringify(e))
      }


    } else {
      alert('You did not select any image.');
    }
  };

  if (!permissionResponse) {
    return null;
  }

  return (
    <View style={styles.container}>
      {permissionResponse.granted ? (
          <Button
            onPress={pickVideoAsync}
            title={"Select Video"}
          />
        ) :
        <Button
          onPress={requestPermission}
          title={"Request Media Library Permission"}
        />}
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
});
