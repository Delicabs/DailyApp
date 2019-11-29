import React, { useEffect, useState } from 'react';
import { Animated, ActivityIndicator, View, Alert, FlatList, ImageBackground, StyleSheet } from 'react-native';
import { Text, ListItem } from 'react-native-elements';
import moment from 'moment';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView, { Marker } from 'react-native-maps'
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationEvents } from "react-navigation";
import _ from 'lodash'
import firebase from "../config/firebase";





const HomeScreen = props => {
    const [temp, setTemp] = useState("");
    const [wind, setWind] = useState("");
    const [name, setName] = useState("");
    const [date, setDate] = useState(moment().format('MMMM Do '));
    const [list, setList] = useState([]);
    const [flag2, setflag2] = useState(true);
    const [buttonName, setButtonName] = useState("Map")
    const [flag, setFlag] = useState(false)
    const [location, setLocation] = useState(null);
    const [latitude, setLatitude] = useState(60.149188);
    const [longitude, setLongitude] = useState(24.682887);
    const [locationName, setLocationName] = useState("")
    const [currentCity, setCurrentCity] = useState("");
    const [contryCode, setCode] = useState("GB");
    const [image, setImage] = useState(require('../assets/clear.png'))
    var weekDayName = moment(new Date().getDate()).format('dddd');
    const [size, setSize] = useState(1)
    const [address, setAddress] = useState("");
    const [place, setPlace] = useState("");
    const [bFlag, setBflag] = useState(true);
    const [buttonColor, setButtonColor] = useState(['#283048', '#859398'])
    const [button2Text, setButton2Text] = useState("Loading location")
    const [flag3, setFlag3] = useState(true)
    const [fadeAnim] = useState(new Animated.Value(0))
    console.log(name)


    list.splice(5)

    useEffect(() => {
        getLocation();
        getNews();

    }, []);

    getLocation = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== "granted") {
            Alert.alert("No permission to access location");

        } else {
            let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true })
            setLocation(location)
            setLongitude(location.coords.longitude)
            setLatitude(location.coords.latitude);
            let long = location.coords.longitude
            let lat = location.coords.latitude


            const url =
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCuI2avPYKckJnIV7nVg2lfJZGbpLggoNs`
            fetch(url)
                .then(response => response.json())
                .then(responseJson => {
                    let city = (responseJson.results[1].address_components[2].long_name)
                    //console.log(city)
                    setLocationName(responseJson.results[1].address_components[1].long_name)
                    setAddress(responseJson.results[1].formatted_address)
                    setCurrentCity(responseJson.results[1].address_components[2].long_name)

                    setButtonColor(['#0082c8', '#667db6'])
                    setBflag(false)
                    setButton2Text("Save location")


                    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=e898492b177f9a28625dc55cfa8a8ddc`
                    fetch(url)
                        .then(response => response.json())
                        .then(responseJson => {

                            setTemp(responseJson.main.temp + "\u2103");
                            setWind(responseJson.wind.speed);
                            setName(responseJson.name)
                            setCode(responseJson.sys.country)
                            let weather = (responseJson.weather[0].description)
                            compareWeather(weather)
                            compareCoordinates(long, lat);


                        })
                        .catch(error => {
                            Alert.alert("Error", error);
                        });
                })
                .catch(error => {
                    Alert.alert("Error", error.message);

                });
        }

    }


    const compareCoordinates = (long, lat) => {

        if (long >= -122.091812 && long <= -122.074303 && lat >= 37.412837 && lat <= 37.424425) {
            setPlace("Google")
        } else if (long >= 25.058707 && long <= 25.059801 && lat >= 25.059801 && lat <= 60.197085) {
            setPlace("Home")
        } else if (long >= 24.933437 && long <= 60.201157 && lat >= 24.935218 && lat <= 60.201956) {
            setPlace("Haaga-Helia")
        } else if (long >= 24.962622 && long <= 60.192488 && lat >= 24.964784 && lat <= 60.193486) {
            setPlace("Koululla")
        } else {
            setPlace("Check in location not set, see location from map view")

        }

    }

    const compareWeather = (weather) => {
        if (weather == "scattered clouds" || weather == "broken clouds" || weather == "few clouds" || weather == "overcast clouds") {
            setImage(require('../assets/cloud.png'))
        } else if (weather == "clear sky") {
            setImage(require('../assets/clear.png'))
        } else if (weather == "shower rain" || weather == "rain" || weather == "light rain" || weather == "moderate rain") {
            setImage(require('../assets/rainy.png'))
        }
        else if (weather == "thunderstorm") {
            setImage(require('../assets/thunder.png'))
        }
        else if (weather == "snow" || weather === "light snow") {
            setImage(require('../assets/snow.png'))
        }
        else if (weather == "mist") {
            setImage(require('../assets/snow.png'))

        } else {
            setImage(require('../assets/main.png'))
        }
        setFlag3(false)

    }
    const saveItem = async () => {
        firebase
            .database()
            .ref("coordinates/")
            .push({ "Place": place, "lat": latitude, "long": longitude, time: moment().format('MMMM Do h:mm:ss a '), "address": address });

    };
    const changeColor = () => {
        setBflag(true)
        setButtonColor(['#859398', '#859398'])
        setButton2Text("Thank you for checking in")
        setPlace("");
        Animated.timing(
            fadeAnim,
            {
                toValue: 120,
                duration: 5000,
            }
        ).start();


    }



    const getNews = () => {

        const url =
            "https://newsapi.org/v2/top-headlines?country=us&apiKey=a192c65cfb4d44219840136efc527feb"
        fetch(url)
            .then(response => response.json())
            .then(responseJson => {
                const list = responseJson.articles
                const tiko = _.filter(list, function (o) { return o.description; });
                setList(tiko)
            })
            .catch(error => {
                Alert.alert("Error", error.message);
            });


    }

    keyExtractor = (item, index) => index.toString()
    renderItem = ({ item }) => (
        <ListItem
            containerStyle={{ backgroundColor: "#403B4A" }}
            linearGradientProps={{ colors: ['#434343', '#000000'] }}
            titleStyle={{ color: "white" }}
            title={item.title}

            leftAvatar={{ source: { uri: item.urlToImage }, rounded: false }}
            chevron
            onLongPress={() => props.navigation.navigate("News", { article: item.content, title: item.description, author: item.author, source: item.source, url: item.urlToImage })}
        />
    )

    const buttonPressed = () => {
        if (buttonName == "Map") {
            setButtonName("News")
            setflag2(false)
            setFlag(true)
            setSize(4)

        }
        if (buttonName == "News") {
            setButtonName("Map")
            setflag2(true)
            setFlag(false)
            setSize(1)
        }
    }

    const newBackgroundColor = fadeAnim.interpolate({
        inputRange: [0, 150],
        outputRange: ["transparent", '#EC6F66']
    })


    return (
        <>
            {
                flag3 ? (

                    <View style={[styles.container, styles.horizontal]}>
                        <ActivityIndicator size={60} color="#0000ff" />

                    </View >
                ) : <View style={{ flex: 1, width: "100%", backgroundColor: "black" }}>
                        <NavigationEvents onDidFocus={() => getLocation()} />
                        <View style={{ flex: 1, alignItems: "center" }}>
                            <ImageBackground source={image} style={{ width: '100%', height: '100%' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "flex-end", }}>
                                    <Animated.View
                                        style={{
                                            backgroundColor: newBackgroundColor,

                                            margin: 5,
                                            padding: 5,


                                            justifyContent: "center"
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => props.navigation.navigate("Results")} >
                                            <Text style={{ fontSize: 15, color: "white" }}>My check in's</Text>
                                        </TouchableOpacity>
                                    </Animated.View>




                                </View>
                                <Text h4Style={styles.Header} h4>{currentCity}</Text>
                                <Text h4Style={styles.Header} h4 >{weekDayName} {date}</Text>
                                <Text style={styles.temperature}>{` ${temp}  ${wind}m/s`}</Text>
                            </ImageBackground>
                        </View>
                        <View style={{ flex: size }}>
                            <TouchableOpacity onPress={() => buttonPressed()} >
                                <LinearGradient
                                    colors={['#F3A183', '#EC6F66']}
                                    style={{ padding: 15, alignItems: 'center', }}>


                                    <View>
                                        <Text style={{ fontSize: 15, color: "white" }}>{buttonName}</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                            {flag2 ? (
                                <FlatList
                                    keyExtractor={keyExtractor}
                                    renderItem={renderItem}
                                    data={list}
                                />
                            ) : <View style={{ flex: 1 }}>
                                    <MapView
                                        style={{ flex: 1 }}
                                        region={{
                                            latitude: latitude,
                                            longitude: longitude,
                                            latitudeDelta: 0.0322,
                                            longitudeDelta: 0.0221
                                        }} >
                                        <Marker
                                            coordinate={{ latitude: latitude, longitude: longitude }}
                                            title={locationName}
                                        />
                                    </MapView>
                                    <TouchableOpacity
                                        disabled={bFlag}
                                        onPress={() => {
                                            saveItem();
                                            changeColor();
                                        }} >
                                        <LinearGradient
                                            //
                                            colors={buttonColor}
                                            style={{ padding: 15, alignItems: 'center', }}>


                                            <View>
                                                <Text style={{ fontSize: 15, color: "white" }}>{button2Text}</Text>
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>


                                </View>
                            }

                        </View>
                    </View>
            }
        </>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    text: {
        fontSize: 30
    },
    temperature: {
        fontSize: 20, marginLeft: 30, marginRight: 30, textAlign: "center", color: "white"

    },
    Header: {
        textAlign: "center", color: "white",


        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10

    },
    container: {
        backgroundColor: "black",
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }


});
