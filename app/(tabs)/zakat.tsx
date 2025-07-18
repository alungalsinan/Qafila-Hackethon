import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeContext';

interface ZakatInfo {
  title: string;
  description: string;
  icon: string;
}

const zakatInfo: ZakatInfo[] = [
  {
    title: 'What is Zakat?',
    description: 'Zakat is one of the Five Pillars of Islam. It is a form of obligatory charity that purifies wealth and helps those in need.',
    icon: 'information-circle',
  },
  {
    title: 'Nisab Threshold',
    description: 'The minimum amount of wealth one must have before being liable to pay Zakat. Currently approximately $5,525 USD.',
    icon: 'trending-up',
  },
  {
    title: 'Zakat Rate',
    description: 'The standard rate for Zakat on cash, gold, and silver is 2.5% of the total amount held for one lunar year.',
    icon: 'calculator',
  },
];

export default function ZakatScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [gold, setGold] = useState('');
  const [cash, setCash] = useState('');
  const [silver, setSilver] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<ZakatInfo | null>(null);
  const [result, setResult] = useState<{
    totalAmount: number;
    zakatDue: number;
    isEligible: boolean;
  } | null>(null);

  // Nisab values (approximate in USD)
  const GOLD_NISAB = 85; // grams
  const SILVER_NISAB = 595; // grams
  const GOLD_PRICE_PER_GRAM = 65; // USD (approximate)
  const SILVER_PRICE_PER_GRAM = 0.8; // USD (approximate)
  const ZAKAT_RATE = 0.025; // 2.5%

  const calculateZakat = () => {
    const goldValue = parseFloat(gold) || 0;
    const cashValue = parseFloat(cash) || 0;
    const silverValue = parseFloat(silver) || 0;

    const goldInUSD = goldValue * GOLD_PRICE_PER_GRAM;
    const silverInUSD = silverValue * SILVER_PRICE_PER_GRAM;
    const totalAmount = goldInUSD + cashValue + silverInUSD;

    const nisabValue = GOLD_NISAB * GOLD_PRICE_PER_GRAM;
    const isEligible = totalAmount >= nisabValue;
    const zakatDue = isEligible ? totalAmount * ZAKAT_RATE : 0;

    setResult({
      totalAmount,
      zakatDue,
      isEligible,
    });
  };

  const reset = () => {
    setGold('');
    setCash('');
    setSilver('');
    setResult(null);
  };

  const openInfo = (info: ZakatInfo) => {
    setSelectedInfo(info);
    setShowInfo(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.logoContainer}>
                <Ionicons name="calculator" size={28} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Zakat Calculator</Text>
                <Text style={styles.headerSubtitle}>Calculate your annual obligation</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
              <Ionicons 
                name={isDark ? 'sunny' : 'moon'} 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Quick Info Cards */}
          <View style={styles.infoSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Guide</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.infoScroll}>
              {zakatInfo.map((info, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => openInfo(info)}
                >
                  <View style={[styles.infoIcon, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name={info.icon as any} size={24} color={colors.primary} />
                  </View>
                  <Text style={[styles.infoTitle, { color: colors.text }]}>{info.title}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Calculator Form */}
          <View style={[styles.calculatorCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Enter Your Assets</Text>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputHeader}>
                <Ionicons name="diamond" size={20} color={colors.secondary} />
                <Text style={[styles.inputLabel, { color: colors.text }]}>Gold (grams)</Text>
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={gold}
                onChangeText={setGold}
                placeholder="Enter gold amount"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputHeader}>
                <Ionicons name="cash" size={20} color={colors.success} />
                <Text style={[styles.inputLabel, { color: colors.text }]}>Cash & Savings (USD)</Text>
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={cash}
                onChangeText={setCash}
                placeholder="Enter cash amount"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputHeader}>
                <Ionicons name="medal" size={20} color={colors.textSecondary} />
                <Text style={[styles.inputLabel, { color: colors.text }]}>Silver (grams)</Text>
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={silver}
                onChangeText={setSilver}
                placeholder="Enter silver amount"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.calculateButton, { backgroundColor: colors.primary }]} 
                onPress={calculateZakat}
              >
                <Ionicons name="calculator" size={20} color="#FFFFFF" />
                <Text style={styles.calculateButtonText}>Calculate</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.resetButton, { backgroundColor: colors.background, borderColor: colors.border }]} 
                onPress={reset}
              >
                <Ionicons name="refresh" size={20} color={colors.textSecondary} />
                <Text style={[styles.resetButtonText, { color: colors.textSecondary }]}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Results */}
          {result && (
            <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
              <View style={styles.resultHeader}>
                <Ionicons name="analytics" size={24} color={colors.primary} />
                <Text style={[styles.resultTitle, { color: colors.text }]}>Zakat Calculation</Text>
              </View>
              
              <View style={styles.resultGrid}>
                <View style={[styles.resultItem, { backgroundColor: colors.background }]}>
                  <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>Total Wealth</Text>
                  <Text style={[styles.resultValue, { color: colors.text }]}>${result.totalAmount.toFixed(2)}</Text>
                </View>

                <View style={[styles.resultItem, { backgroundColor: colors.background }]}>
                  <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>Nisab Threshold</Text>
                  <Text style={[styles.resultValue, { color: colors.text }]}>$5,525.00</Text>
                </View>

                <View style={[styles.resultItem, { backgroundColor: colors.background }]}>
                  <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>Eligible for Zakat</Text>
                  <View style={styles.eligibilityContainer}>
                    <Ionicons 
                      name={result.isEligible ? 'checkmark-circle' : 'close-circle'} 
                      size={20} 
                      color={result.isEligible ? colors.success : colors.error} 
                    />
                    <Text style={[
                      styles.resultValue,
                      { color: result.isEligible ? colors.success : colors.error }
                    ]}>
                      {result.isEligible ? 'Yes' : 'No'}
                    </Text>
                  </View>
                </View>
              </View>

              {result.isEligible && (
                <View style={[styles.zakatDue, { backgroundColor: colors.primary + '20' }]}>
                  <View style={styles.zakatHeader}>
                    <Ionicons name="gift" size={24} color={colors.primary} />
                    <Text style={[styles.zakatLabel, { color: colors.primary }]}>Zakat Due</Text>
                  </View>
                  <Text style={[styles.zakatAmount, { color: colors.primary }]}>${result.zakatDue.toFixed(2)}</Text>
                </View>
              )}

              <View style={[styles.disclaimer, { backgroundColor: colors.background }]}>
                <Ionicons name="information-circle" size={16} color={colors.textSecondary} />
                <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
                  This is an approximate calculation. Please consult with a qualified Islamic scholar for precise guidance.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Info Modal */}
      <Modal
        visible={showInfo}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowInfo(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowInfo(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Zakat Information</Text>
            <View style={{ width: 24 }} />
          </View>
          
          {selectedInfo && (
            <View style={styles.modalContent}>
              <View style={[styles.modalIconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name={selectedInfo.icon as any} size={48} color={colors.primary} />
              </View>
              <Text style={[styles.modalInfoTitle, { color: colors.text }]}>{selectedInfo.title}</Text>
              <Text style={[styles.modalInfoDescription, { color: colors.textSecondary }]}>
                {selectedInfo.description}
              </Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for tab bar
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  infoCard: {
    width: 140,
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  calculatorCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  calculateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    gap: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
  resultGrid: {
    gap: 12,
    marginBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  eligibilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  zakatDue: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  zakatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  zakatLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  zakatAmount: {
    fontSize: 32,
    fontWeight: '700',
  },
  disclaimer: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 8,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalInfoTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalInfoDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});