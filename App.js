import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// const API_KEY = hidden for public view;
//
const icons = {
  Clear: "weather-sunny",
  Clouds: "weather-cloudy",
  Drizzle: "weather-rainy",
  Rain: "weather-pouring",
  Snow: "weather-snowy",
  Thunderstorm: "weather-lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    // get location permission
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
      //setCity(":&#40;");
    }

    // get location information
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);

    // get weather information
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    //console.log(json.list);
    setDays(json.list);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={{ ...styles.tinyText, color: "#2E3532" }}>
          Current location
        </Text>
        <Text style={styles.cityname}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        //showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days && days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          // improvement: when location is not permitted
          days?.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.tinyText}>{day.dt_txt.substring(5, 16)}</Text>
              <Text style={styles.temp}>
                {parseFloat(day.main.temp).toFixed(1)}°C
              </Text>
              <MaterialCommunityIcons
                name={icons[day.weather[0].main]}
                size={48}
                color="#242423"
              />
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A9C6EF",
  },
  city: {
    flex: 0.6,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cityname: {
    marginBottom: 50,
    color: "#242423",
    fontSize: 54,
    fontWeight: "600",
  },
  weather: {
    //backgroundColor: "#E8EDDF",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    //marginTop: 40,
    //justifyContent: "center",
  },
  temp: {
    color: "#242423",
    textShadowColor: "#E8EDDF",
    fontSize: 60,
    fontWeight: "500",
    marginBottom: 10,
  },
  description: {
    color: "#242423",
    fontSize: 40,
    fontWeight: "500",
  },
  tinyText: {
    color: "#242423",
    fontSize: 20,
  },
});
