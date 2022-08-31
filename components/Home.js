import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { searchMovie } from '../utils/request';
import Result from './Results';

import {useNetInfo} from "@react-native-community/netinfo";
import InternetConnectionLost from './InternetConnectionLost';

export default function Home() {

  const [filterState, setFilterState] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const netInfo = useNetInfo();

  const search = () => {
    setLoading(true)
    searchMovie(filterState).then((responseJson) => {
      setData(responseJson.Search)
      setLoading(false)
    })
  }

  const backHome = () => {
    setData([])
  }

  return (
    netInfo.isConnected?
      <View style={styles.container}>
        <Text style={styles.title}>Search for movies and shows</Text>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFilterState(text.toLowerCase())}
            placeholder="Movie or Show"
            autoCorrect={false}
          />
          <TouchableOpacity onPress={search}>
            <Image
              style={styles.img}
              source={require('../assets/img/search.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={backHome}>
            <Image
              style={styles.img}
              source={require('../assets/img/home.png')}
            />
          </TouchableOpacity>
        </View>
        {!loading && <Result data={data} loading={loading}/>}
      </View>
    :
      <InternetConnectionLost />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20
  },
  input: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    width: '80%',
    padding: 10
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
    alignSelf: 'center',
    marginLeft: 10
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  }
});
