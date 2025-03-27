import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Track, Platform } from '../types/music';
import { TrackCard } from '../components/TrackCard';

export const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Здесь будет логика поиска через API
      // const results = await musicService.searchTrack(searchQuery);
      // setTracks(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformSelect = async (track: Track, platform: Platform) => {
    const link = track.platformLinks[platform];
    if (link) {
      try {
        await Linking.openURL(link);
      } catch (error) {
        console.error('Cannot open link:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        placeholder="Вставьте ссылку на трек или введите название"
        placeholderTextColor="#666"
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={tracks}
          renderItem={({ item }) => (
            <TrackCard
              track={item}
              onPlatformSelect={(platform) => handlePlatformSelect(item, platform)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.tracksList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchInput: {
    margin: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loader: {
    marginTop: 20,
  },
  tracksList: {
    padding: 16,
  },
}); 