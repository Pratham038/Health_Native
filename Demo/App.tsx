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
import googleFit from 'react-native-google-fit';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [body, setBody] = useState<any>({
    height: 0,
    weight: 0,
    bloodGlu: 0,
    f: 0,
    c: 0,
    moveMinutes: 0,
    bloodPressure: 0,
    Temp: 0,
    heartRate: 0,
    nutrition: 0,
    oxygen: 0,
    dailySteps: 0,
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
      const bloodPressure = await GoogleFit.getBloodPressureSamples(opt);
      const bodyTemp = await GoogleFit.getBodyTemperatureSamples(opt);
      const hertRate = await GoogleFit.getHeartRateSamples(opt);
      const nutrition = await GoogleFit.getDailyNutritionSamples(opt);
      const oxygen = await GoogleFit.getOxygenSaturationSamples(opt);
      const dailySteps = await GoogleFit.getDailyStepCountSamples(opt);
      let x = dailySteps[1];
      let x2 = x.steps[0].value;

      // const weeklySteps = await GoogleFit.getWeeklySteps(,1);
      // const steps = await GoogleFit.getDailySteps();

      const weight = wSamples[0]?.value;
      const height = hSamples[0]?.value;
      const bloodGlucose = bloodGluSamples[0]?.value;
      const distance = fSamples[0]?.distance || 0; // Updated property name
      const calories = cSamples[0]?.calorie || 0; // Updated property name

      console.log('WEIGHT :', wSamples[0].value);
      console.log('HEIGHT :', hSamples[0].value);
      console.log('Blood Glucose :', bloodGluSamples);
      console.log('Daily Distance :', fSamples);
      console.log('Daily Calories : ', calories);
      console.log('Move Minutes :', moveMinutes[0].duration);
      console.log('Blood Pressure :', bloodPressure);
      console.log('Temperature:', bodyTemp);
      console.log('Heart Rate:', hertRate);
      console.log('Nutrition:', nutrition);
      console.log('Oxygen:', oxygen);
      console.log('Daily Steps :', x2);
      // console.log('Weekly Steps :', await GoogleFit.getWeeklySteps());
      // console.log('Steps :', stepValue);

      setBody({
        weight: weight || 0,
        height: height || 0,
        bloodGlu: bloodGlucose || 0,
        f: distance || 0,
        c: calories || 0,
        moveMinutes: moveMinutes[0].duration || 0,
        bloodPressure: bloodPressure || 0,
        Temp: bodyTemp || 0,
        heartRate: hertRate || 0,
        nutrition: nutrition || 0,
        oxygen: oxygen || 0,
        dailySteps: x2 || 0,
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
          <Text style={styles.sectionTitle}>Weight: {String(body.weight)}</Text>
          <Text style={styles.sectionTitle}>Height: {String(body.height)}</Text>
          <Text style={styles.sectionTitle}>
            Blood Glucose: {String(body.bloodGlu)}
          </Text>
          <Text style={styles.sectionTitle}>Distance: {String(body.f)}</Text>
          <Text style={styles.sectionTitle}>Calories: {String(body.c)}</Text>
          <Text style={styles.sectionTitle}>
            Move Minutes: {String(body.moveMinutes)}
          </Text>
          <Text style={styles.sectionTitle}>
            Blood Pressure: {String(body.bloodPressure)}
          </Text>
          <Text style={styles.sectionTitle}>
            Body Temperature: {String(body.Temp)}
          </Text>
          <Text style={styles.sectionTitle}>
            Heart Rate: {String(body.heartRate)}
          </Text>
          <Text style={styles.sectionTitle}>
            Nutrition: {String(body.nutrition)}
          </Text>
          <Text style={styles.sectionTitle}>Oxygen: {String(body.oxygen)}</Text>
          <Text style={styles.sectionTitle}>
            Daily Steps: {String(body.dailySteps)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set background color
  },
  scrollView: {
    flex: 1,
  },
  body: {padding: 50},
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#00cc30', // Set text color
  },
});

export default App;
