import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getMovieById } from '../utils/request';

export default function Result({data, loading}) {
  const [selectedItem, setSelectedItem] = useState(-1)
  const [itemData, setItemData] = useState({})
  const [loadingInfo, setLoadingInfo] = useState(false)
  const [seen, setSeen] = useState([])
  const [favorites, setFavorites] = useState([])
  const [resultData, setResultData] = useState(data)

  useEffect(() => {
    setSelectedItem(-1)
    if ((!data || data.length === 0) && favorites.length !== 0) loadFavorites(favorites)
  }, [data]);

  const getInfo = (id) => {
    setLoadingInfo(true)
    getMovieById(id).then((responseJson) => {
      setItemData(responseJson)
      setLoadingInfo(false)
    })
  }

  const loadFavorites = (favorites) => {
    setResultData(favorites)

  }

  useEffect(() => {
    AsyncStorage.getItem('seen').then((value) => {
      if (value) {
        setSeen(JSON.parse(value))
      }
    })
    AsyncStorage.getItem('favorites').then((value) => {
      if (value) {
        setFavorites(JSON.parse(value))
        if (!data || data.length === 0) loadFavorites(JSON.parse(value))
      }
    })
  }, []);

  const addToFavorites = (item) => {
    favorites.push(item)
    setFavorites(favorites)
    AsyncStorage.setItem("favorites", JSON.stringify(favorites))
  }

  const addToSeen = (item) => {
    seen.push(item.imdbID)
    setSeen(seen)
    setResultData(resultData.filter(item => !seen.includes(item.imdbID)))
    AsyncStorage.setItem("seen", JSON.stringify(seen))
  }

  const _renderItem = ({ item, index }) => (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {setSelectedItem(index); getInfo(item.imdbID)}}>
        <View style={styles.options}>
          <Text style={styles.title}>{item.Title}</Text>
          <TouchableOpacity onPress={() => addToFavorites(item)}>
            <Image
              style={[styles.icon, favorites.indexOf(item.imdbID) !== -1? styles.favorite: null]}
              source={require('../assets/img/fav.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addToSeen(item)}>
            <Image
              style={styles.icon}
              source={require('../assets/img/seen.png')}
            />
          </TouchableOpacity>
        </View>
        {index === selectedItem && itemData && !loading &&
          <View style={styles.card}>
            <View style={styles.container}>
              {!loadingInfo && <Image
                style={styles.img}
                source={{uri: itemData.Poster}}
              />}
            </View>
            <View style={styles.container}>
              <Text style={styles.title}>{itemData.Plot}</Text>
              <Text style={[styles.title, styles.rating]}> Rating {itemData.imdbRating}</Text>
            </View>
          </View>}
      </TouchableOpacity>
      {index !== selectedItem && <View style={styles.divider} />}
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        disableVirtualization
        data={resultData && resultData.filter(item => !seen.includes(item.imdbID))}
        renderItem={_renderItem}
        keyExtractor={(_, index) => index.toString()}
        initialNumToRender={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    textAlign: 'justify'
  },
  img: {
    width: 100,
    height: 200,
    alignSelf: 'center',
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    marginTop: 12,
    marginBottom: 12,
  },
  card: {
    flexDirection:'row',
    marginTop: 10,
    marginBottom: 20,
    minWidth: '90%'
  },
  rating:{
    fontWeight: 'bold'
  },
  icon: {
    width: 25,
    height: 25,
    alignSelf: 'flex-end',
    marginLeft: 10,
    tintColor: '#aaaaaa'
  },
  favorite: {
    tintColor: 'orange'
  },
  options: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  }
});
