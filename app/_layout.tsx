import React, { useEffect } from 'react';
import {SplashScreen, Stack} from 'expo-router';
import { useFonts } from 'expo-font';
import { GlobalProvider } from '@/context/GlobalProvider';

//Makes the native splash screen remain visible until hideAsync is called(until assets are loaded).
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });
  
  useEffect(() => {
    if (error) throw error;
  
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);
  
  if (!fontsLoaded && !error) {
    return null;
  }

  /**
   * The difference between (folderName) and [folderName] is as follows:
   * (folderName): This is used for grouping screens without adding to the URL or 
   route path. It's often used for organizing screens that don't need to be part of 
   the navigation path explicitly, such as grouping authentication screens.
   * [folderName]: This denotes a dynamic route segment, similar to Next.js. It is 
   used when the path includes a variable parameter. For example, search/[query] allows 
   the route to capture different search queries as parameters in the URL.
   */

  return (
   <GlobalProvider> 
    <Stack>
      <Stack.Screen name='index' options={{headerShown: false}}/>
      <Stack.Screen name='(auth)' options={{headerShown: false}}/>
      <Stack.Screen name='(tabs)' options={{headerShown: false}}/>
      <Stack.Screen name='search/[query]' options={{headerShown: false}}/>
    </Stack>
  </GlobalProvider>
  );
}

export default RootLayout;