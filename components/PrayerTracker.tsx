// components/PrayerTracker.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title } from 'react-native-paper';
import { format } from 'date-fns';

const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const STORAGE_KEY = '@prayer_tracker';

export default function PrayerTracker() {
  const [prayers, setPrayers] = useState<{ [key: string]: boolean }>({});
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setPrayers(parsed[today] || getDefaultPrayers());
      } else {
        setPrayers(getDefaultPrayers());
      }
    } catch (error) {
      Alert.alert('Error loading prayer data');
    }
  };

  const saveData = async (updated: any) => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = savedData ? JSON.parse(savedData) : {};
      parsed[today] = updated;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (error) {
      Alert.alert('Error saving prayer data');
    }
  };

  const togglePrayer = (name: string) => {
    const updated = { ...prayers, [name]: !prayers[name] };
    setPrayers(updated);
    saveData(updated);
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>🕌 Prayer Tracker - {today}</Title>
        {PRAYERS.map((prayer) => (
          <View key={prayer} style={styles.row}>
            <Text style={styles.label}>{prayer}</Text>
            <Switch
              value={prayers[prayer]}
              onValueChange={() => togglePrayer(prayer)}
              color="#4CAF50"
            />
          </View>
        ))}
      </Card.Content>
    </Card>
  );
}

function getDefaultPrayers() {
  const result: { [key: string]: boolean } = {};
  PRAYERS.forEach((p) => (result[p] = false));
  return result;
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 16,
  },
});
