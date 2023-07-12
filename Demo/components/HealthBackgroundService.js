import React, { useEffect } from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import BackgroundTimer from 'react-native-background-timer';

const HealthBackgroundService = () => {
  useEffect(() => {
    // Configure background fetch
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // Minimum interval in minutes
        stopOnTerminate: false, // Continue background fetch after app termination
        startOnBoot: true, // Start background fetch on device boot
        enableHeadless: true, // Enable headless background fetch task
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Require network connection for background fetch
      },
      async (taskId) => {
        // Perform health-related tasks here
        // e.g., fetch health data, update database, etc.

        // You can use BackgroundTimer.setTimeout for longer tasks
        BackgroundTimer.setTimeout(async () => {
          // Long-running task here

          // Signal completion of the background task
          BackgroundFetch.finish(taskId);
        }, 5000); // Delay in milliseconds for the long-running task
      },
      (error) => {
        console.log('Background fetch failed to start:', error);
      }
    );

    // Start the background fetch
    BackgroundFetch.start();

    // Cleanup on component unmount
    return () => {
      BackgroundFetch.stop();
    };
  }, []);

  return null;
};

export default HealthBackgroundService;
