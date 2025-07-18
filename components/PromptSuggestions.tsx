import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
}

const suggestions = [
  { icon: 'moon', text: 'Daily Duas', prompt: 'Can you share some daily duas I should recite?' },
  { icon: 'time', text: 'Prayer Times', prompt: 'What are the prayer times and their importance?' },
  { icon: 'book', text: 'Quran Reading', prompt: 'How should I approach reading the Quran daily?' },
  { icon: 'heart', text: 'Dhikr Guide', prompt: 'What are some important dhikr I should do daily?' },
  { icon: 'star', text: 'Islamic Etiquette', prompt: 'What are the Islamic etiquettes for daily life?' },
  { icon: 'people', text: 'Family Relations', prompt: 'How should I maintain good relations with family in Islam?' },
];

export default function PromptSuggestions({ onSelectPrompt }: PromptSuggestionsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Quick Questions</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.suggestionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => onSelectPrompt(suggestion.prompt)}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name={suggestion.icon as any} size={20} color={colors.primary} />
            </View>
            <Text style={[styles.suggestionText, { color: colors.text }]} numberOfLines={2}>
              {suggestion.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  suggestionCard: {
    width: 120,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
});