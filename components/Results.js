import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getMovieById } from '../utils/request';

export default function Result({data, loading}) {
  const [selectedItem, setSelectedItem] = useState(-1)
  const [itemData, setItemData] = useState({})
  const [loadingInfo, setLoadingInfo] = useState(false)

  useEffect(() => {
    setSelectedItem(-1)
  }, [data]); 

  const getInfo = (id) => {
    setLoadingInfo(true)
    getMovieById(id).then((responseJson) => {
      setItemData(responseJson)
      setLoadingInfo(false)
    })
  }

  const _renderItem = ({ item, index }) => (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {setSelectedItem(index); getInfo(item.imdbID)}}>
        <View style={styles.options}>
          <Text style={styles.title}>{item.Title}</Text>
          <TouchableOpacity>
            <Image
              style={styles.icon}
              source={require('../assets/img/fav.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity>
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
        data={data}
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
    marginLeft: 10
  },
  options: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  }
});
