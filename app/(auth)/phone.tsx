import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Check, ChevronDown } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import Button from '@/components/ui/Button';
import { COUNTRIES, detectUserCountry } from '@/constants/countries';

export default function PhoneScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(() => detectUserCountry());
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.dialCode.includes(searchQuery)
  );

  const handleContinue = () => {
    if (phoneNumber.length >= 8) {
      router.push('/(auth)/verify');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Mon numéro mobile</Text>
          <Text style={styles.description}>
            Entrez votre numéro de téléphone. Un code de vérification à 4 chiffres vous sera envoyé par SMS pour sécuriser votre compte.
          </Text>

          <View style={styles.phoneContainer}>
            <TouchableOpacity
              style={styles.countryCodeContainer}
              onPress={() => setShowCountryModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.flag}>{selectedCountry.flag}</Text>
              <Text style={styles.countryCode}>{selectedCountry.dialCode}</Text>
              <ChevronDown size={14} color={Colors.text.primary40} />
            </TouchableOpacity>

            <TextInput
              style={styles.phoneInput}
              placeholder={selectedCountry.code === 'CI' ? '07 01 02 03 04' : selectedCountry.code === 'FR' ? '06 12 34 56 78' : 'Numéro de mobile'}
              placeholderTextColor={Colors.text.primary40}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Continuer"
            onPress={handleContinue}
            variant="primary"
            disabled={phoneNumber.trim().length < 8}
          />
        </View>

        {/* ── Modal de sélection de pays ──────────────────────────── */}
        <Modal
          visible={showCountryModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCountryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowCountryModal(false)} />
            <View style={styles.modalSheet}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Sélectionner un pays</Text>

              <View style={styles.searchBar}>
                <Search size={16} color={Colors.text.primary40} />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Rechercher un pays ou indicatif..."
                  placeholderTextColor={Colors.text.primary40}
                  autoFocus
                />
              </View>

              <FlatList
                data={filteredCountries}
                keyExtractor={item => item.code}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.countryItem, selectedCountry.code === item.code && styles.countryItemActive]}
                    onPress={() => {
                      setSelectedCountry(item);
                      setSearchQuery('');
                      setShowCountryModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.countryFlag}>{item.flag}</Text>
                    <Text style={[styles.countryName, selectedCountry.code === item.code && styles.countryNameActive]}>
                      {item.name}
                    </Text>
                    <Text style={styles.dialCodeBadge}>{item.dialCode}</Text>
                    {selectedCountry.code === item.code && (
                      <Check size={16} color={Colors.primary.red} strokeWidth={2.5} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  content: {
    flex: 1,
    paddingTop: Spacing.xxl * 2,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontSize: Typography.h1.fontSize,
    lineHeight: Typography.h1.lineHeight,
    fontWeight: Typography.h1.fontWeight,
    color: Colors.text.primary100,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    color: Colors.text.primary70,
    marginBottom: Spacing.xl,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.neutral.white,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: Colors.neutral.border,
    backgroundColor: '#FAFAF9',
    gap: Spacing.xs,
  },
  flag: {
    fontSize: 20,
  },
  countryCode: {
    fontSize: 15,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.primary100,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text.primary100,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    maxHeight: '80%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.neutral.border,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.primary100,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.neutral.backgroundLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text.primary100,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border + '40',
  },
  countryItemActive: {
    backgroundColor: Colors.primary.red + '08',
  },
  countryFlag: {
    fontSize: 24,
  },
  countryName: {
    flex: 1,
    fontFamily: Typography.fontFamily.medium,
    fontSize: 15,
    color: Colors.text.primary100,
  },
  countryNameActive: {
    color: Colors.primary.red,
    fontFamily: Typography.fontFamily.bold,
  },
  dialCodeBadge: {
    fontSize: 13.5,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.primary70,
    marginRight: 6,
  },
});
