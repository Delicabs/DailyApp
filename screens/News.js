import React from 'react';
import { View, Image } from 'react-native';
import { Text } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';




const News = (props) => {
    const { params } = props.navigation.state;


    return (
        <View style={{ flex: 1 }}>

            <LinearGradient
                colors={['#000000', '#333333']}
                style={{ flex: 1 }}

            >
                <View style={{ flex: 1 }} >

                    <Text style={{ color: "white", fontSize: 30, textAlign: "center", paddingBottom: 10 }}>{params.source.name}</Text>
                    <Image
                        source={{ uri: params.url }}
                        style={{ width: '100%', height: 200 }}
                    />

                    <Text style={{ color: "white", fontSize: 18, paddingTop: 10, marginLeft: 15, marginRight: 15, }}>{params.title}</Text>
                    <Text style={{ color: "white", fontSize: 15, marginLeft: 15, marginRight: 15, paddingTop: 15 }} >{params.article}</Text>
                    <Text style={{ color: "white", fontSize: 10, marginLeft: 15, marginRight: 15, paddingTop: 20 }}>{params.author}</Text>
                </View>
            </LinearGradient>

        </View>
    )
}

export default News