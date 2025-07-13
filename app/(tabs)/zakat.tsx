import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calculator, DollarSign } from 'lucide-react-native';

export default function ZakatScreen() {
  const [gold, setGold] = useState('');
  const [cash, setCash] = useState('');
  const [silver, setSilver] = useState('');
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

    const nisabValue = GOLD_NISAB * GOLD_PRICE_PER_GRAM; // Using gold nisab as reference
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Calculator size={32} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Zakat Calculator</Text>
          <Text style={styles.headerSubtitle}>
            Calculate your annual Zakat obligation
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>About Zakat</Text>
            <Text style={styles.infoText}>
              Zakat is 2.5% of your wealth held for one lunar year. The current nisab is approximately $5,525 USD (85 grams of gold).
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gold (in grams)</Text>
              <TextInput
                style={styles.input}
                value={gold}
                onChangeText={setGold}
                placeholder="Enter gold in grams"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cash & Savings (in USD)</Text>
              <TextInput
                style={styles.input}
                value={cash}
                onChangeText={setCash}
                placeholder="Enter cash amount"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Silver (in grams)</Text>
              <TextInput
                style={styles.input}
                value={silver}
                onChangeText={setSilver}
                placeholder="Enter silver in grams"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.calculateButton} onPress={calculateZakat}>
                <Text style={styles.calculateButtonText}>Calculate Zakat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resetButton} onPress={reset}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>

          {result && (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <DollarSign size={24} color="#059669" />
                <Text style={styles.resultTitle}>Zakat Calculation</Text>
              </View>
              
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Total Wealth:</Text>
                <Text style={styles.resultValue}>${result.totalAmount.toFixed(2)}</Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Nisab Threshold:</Text>
                <Text style={styles.resultValue}>$5,525.00</Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Zakat Eligible:</Text>
                <Text style={[
                  styles.resultValue,
                  { color: result.isEligible ? '#059669' : '#DC2626' }
                ]}>
                  {result.isEligible ? 'Yes' : 'No'}
                </Text>
              </View>

              {result.isEligible && (
                <View style={styles.zakatDue}>
                  <Text style={styles.zakatLabel}>Zakat Due:</Text>
                  <Text style={styles.zakatAmount}>${result.zakatDue.toFixed(2)}</Text>
                </View>
              )}

              <Text style={styles.disclaimer}>
                * This is an approximate calculation. Please consult with a qualified Islamic scholar for precise guidance.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#DCFCE7',
    marginTop: 4,
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  calculateButton: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resetButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginLeft: 8,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  resultLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  zakatDue: {
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zakatLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669',
  },
  zakatAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669',
  },
  disclaimer: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
  },
});