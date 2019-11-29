import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList, Alert } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import firebase from "../config/firebase";
import MapView, { Marker } from 'react-native-maps'

const Result = () => {

    const [items, setItems] = useState([]);
    const [keys, setKeys] = useState([])
    const [latitude, setLatitude] = useState(60.192059);
    const [longitude, setLongitude] = useState(24.945831);
    const [locationName, setLocationName] = useState("");
    const [flag3, setFlag] = useState(true);

    useEffect(() => {
        firebase
            .database()
            .ref("coordinates/")
            .on("value", snapshot => {
                const data = snapshot.val();
                const prods = Object.values(data);
                setKeys(Object.keys(data))
                setItems(prods);
            });
        setFlag(false);
    }, []);

    const alert = (index, Place, time) => {
        Alert.alert(
            'Are you sure you want to delete check in @' + Place,
            'Date & time: ' + time,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => removeItem(index) },
            ],
            { cancelable: false },
        );
    }

    const removeItem = (index) => {
        let deleted = keys[index]
        firebase
            .database()
            .ref(`coordinates/${deleted}`)
            .remove();
    }
    const setFunction = (item) => {

        setLatitude(item.lat),
            setLongitude(item.long),
            setLocationName(item.address)
    }


    return (
        <>
            {
                flag3 ? (

                    <View style={[styles.container, styles.horizontal]}>
                        <ActivityIndicator size={60} color="#0000ff" />
                    </View >
                ) : <View style={{ flex: 1 }}>
                        <LinearGradient
                            colors={['#000000', '#333333']}
                            style={{ flex: 1 }}
                        >
                            <View style={{ flex: 3, }}>
                                <MapView
                                    style={{ flex: 1, margin: 30, }}
                                    region={{
                                        latitude: latitude,
                                        longitude: longitude,
                                        latitudeDelta: 0.0322,
                                        longitudeDelta: 0.0221
                                    }}
                                >
                                    <Marker
                                        coordinate={{ latitude: latitude, longitude: longitude }}
                                        title={locationName} />
                                </MapView>

                            </View>
                            <View style={{ flex: 4 }}>
                                <FlatList
                                    inverted
                                    keyExtractor={(item, index) => index.toString()}
                                    data={items}
                                    renderItem={({ item, index }) => (

                                        < View >
                                            <Text style={{ color: "white", textAlign: "center", paddingTop: 20 }} > Checked in @ {item.Place} - {item.time}</Text>
                                            <Text style={{ color: "white", textAlign: "center" }} onPress={() => alert(index, item.Place, item.time)}> Delete</Text>
                                            <Button title={"Show on map"} onPress={() => setFunction(item)} > </Button>

                                        </View>
                                    )}
                                />
                            </View>

                        </LinearGradient>
                    </View>
            }
        </>

    )

}

export default Result;
const styles = StyleSheet.create({

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

