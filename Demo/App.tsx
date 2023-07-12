/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import GoogleFit, {Scopes, BucketUnit} from 'react-native-google-fit';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [body, setBody] = useState<any>({
    height: 0,
    weight: 0,
    bloodGlu: 0,
    f: 0,
    c: 0,
  });

  const opt = {
    startDate: '2023-07-10T00:00:00.000Z', // required ISO8601Timestamp
    endDate: new Date().toISOString(), // required ISO8601Timestamp
    bucketUnit: BucketUnit.DAY, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
    bucketInterval: 1,
  };

  async function fetchData() {
    try {
      const wSamples = await GoogleFit.getWeightSamples(opt);
      const hSamples = await GoogleFit.getHeightSamples(opt);
      const bloodGluSamples = await GoogleFit.getBloodGlucoseSamples(opt);
      const fSamples = await GoogleFit.getDailyDistanceSamples(opt);
      const cSamples = await GoogleFit.getDailyCalorieSamples(opt);
      const moveMinutes = await GoogleFit.getMoveMinutes(opt);

      const weight = wSamples[0]?.value;
      const height = hSamples[0]?.value;
      const bloodGlucose = bloodGluSamples[0]?.value;
      const distance = fSamples[0]?.distance || 0; // Updated property name
      const calories = cSamples[0]?.calorie || 0; // Updated property name

      setBody({
        weight: weight || 0,
        height: height || 0,
        bloodGlu: bloodGlucose || 0,
        f: distance || 0,
        c: calories || 0,
        moveMinutes: moveMinutes || 0,
      });
    } catch (error) {
      console.log('Error fetching health data:', error);
    }
  }

  const options = {
    scopes: [Scopes.FITNESS_ACTIVITY_READ, Scopes.FITNESS_BODY_READ],
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    GoogleFit.checkIsAuthorized().then(() => {
      console.log(GoogleFit.isAuthorized);
    });

    GoogleFit.authorize(options)
      .then(authResult => {
        if (authResult.success) {
          console.log(authResult);
          console.log('AUTH_SUCCESS');
          fetchData();
        } else {
          console.log(authResult);
          // console.log('AUTH_DENIED', authResult.message);
        }
      })
      .catch(() => {
        console.log('AUTH_ERROR');
      });

    // ...
    // Call when authorized
  }, []);

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Height: {body.height}</Text>
          <Text style={styles.sectionTitle}>Weight: {body.weight}</Text>
          <Text style={styles.sectionTitle}>
            Blood Glucose: {body.bloodGlu}
          </Text>
          <Text style={styles.sectionTitle}>Distance: {body.f}</Text>
          <Text style={styles.sectionTitle}>Calories: {body.c}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  body: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
});

export default App;
