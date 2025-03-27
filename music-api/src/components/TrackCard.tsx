import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Track, Platform } from '../types/music';

interface TrackCardProps {
  track: Track;
  onPlatformSelect: (platform: Platform) => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, onPlatformSelect }) => {
  return (
    <View style={styles.container}>
      {track.artwork && (
        <Image 
          source={{ uri: track.artwork }} 
          style={styles.artwork}
        />
      )}
      
      <View style={styles.info}>
        <Text style={styles.title}>{track.title}</Text>
        <Text style={styles.artist}>{track.artist}</Text>
        
        <View style={styles.platforms}>
          {Object.entries(track.platformLinks).map(([platform, link]) => (
            <TouchableOpacity
              key={platform}
              style={styles.platformButton}
              onPress={() => onPlatformSelect(platform as Platform)}
            >
              <Text style={styles.platformText}>{platform}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  artwork: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  platforms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  platformButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 8,
  },
  platformText: {
    fontSize: 12,
    color: '#333',
  },
}); 