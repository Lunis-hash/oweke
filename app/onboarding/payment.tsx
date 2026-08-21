import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStripe } from '@stripe/stripe-react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Check, ShieldCheck, Sparkles, ChevronLeft, Lock } from 'lucide-react-native';
import { useAppContext } from '@/context/AppContext';
import { PaymentService } from '@/services/payment';
import { Typography, Spacing } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Palette de couleurs officielle Onboarding BOLIGO ──────────────────
const COLORS = {
  bg: '#FFFFFF',
  red: '#E8403A',
  redDark: '#C42E29',
  orange: '#E8834A',
  purple: '#7C5CE8',
  purpleDark: '#5A3AB8',
  gold: '#C89A2E',
  goldDark: '#A87C1C',
  teal: '#0F9A90',
  tealDark: '#0D7C74',
  green: '#1E9E5A',
  greenDark: '#158044',
  ink: '#14100E',
  ink2: '#5C534C',
  ink3: '#918780',
  line: 'rgba(20,16,14,0.10)',
};

interface PaymentOption {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  period: string;
  credits: number;
  description: string;
  features: { text: string; strong: string; prefix?: string; suffix?: string }[];
  isHero?: boolean;
  tag?: string;
  extraTitle?: string;
}

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addCredits } = useAppContext();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [selectedOption, setSelectedOption] = useState<PaymentOption | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const topPadding = Platform.OS === 'ios' ? insets.top + 4 : (insets.top > 0 ? insets.top + 6 : 14);
  const bottomPadding = Math.max(insets.bottom + 20, 24);

  const options: PaymentOption[] = [
    {
      id: 'parcours_harmonie',
      name: 'Parcours Harmonie',
      price: '15 €',
      priceValue: 15,
      period: 'le parcours',
      credits: 1,
      description: "L'essentiel, pour rencontrer sans perdre de temps.",
      features: [
        { prefix: 'Profils compatibles à ', strong: '80 % minimum', text: '', suffix: '' },
        { prefix: '', strong: '3 jours', text: '', suffix: " de questions guidées par l'IA" },
        { prefix: '', strong: '3 jours', text: '', suffix: " d'échanges libres" },
        { prefix: 'Appel vidéo de ', strong: '7 minutes', text: '', suffix: '' },
        { prefix: 'Protection ', strong: 'anti-ghosting', text: '', suffix: '' },
      ],
      isHero: false,
    },
    {
      id: 'harmonie_premium',
      name: 'Harmonie Premium',
      tag: 'Le plus choisi',
      price: '50 €',
      priceValue: 50,
      period: 'le parcours',
      credits: 5,
      description: "Aucune limite. Tu choisis qui tu veux — et tu ne paies que si c'est réciproque.",
      extraTitle: 'Tout le parcours, plus :',
      features: [
        { prefix: '', strong: 'Tous les profils', text: '', suffix: ', de 0 à 100 % de compatibilité' },
        { prefix: '', strong: "L'invitation exclusive", text: '', suffix: ' : tu offres le crédit à la personne de ton choix' },
        { prefix: '', strong: 'Elle refuse ? Tu ne paies rien.', text: '', suffix: ' Ton crédit revient automatiquement' },
        { prefix: 'Appel vidéo prolongé à ', strong: '30 minutes', text: '', suffix: '' },
      ],
      isHero: true,
    },
  ];

  const handleSelectOption = (option: PaymentOption) => {
    setSelectedOption(option);
    setShowCheckout(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedOption) return;
    setIsProcessing(true);

    try {
      const response = await PaymentService.createPaymentIntent(selectedOption.id);

      // Si mode Web, ou Mock fallback de test
      if (Platform.OS === 'web' || response.isMock) {
        console.log('⚠️ [Payment] Mode Web ou Simulation détecté.');
        setPaymentSuccess(true);
        await addCredits(selectedOption.credits);
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1800);
        return;
      }

      // Initialiser la feuille de paiement native Stripe
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: response.paymentIntent,
        customerId: response.customer,
        customerEphemeralKeySecret: response.ephemeralKey,
        merchantDisplayName: 'BOLIGO',
        defaultBillingDetails: {
          name: 'Client BOLIGO',
        },
      });

      if (initError) {
        Alert.alert('Mode dégradé', `Erreur d'initialisation Stripe : ${initError.message}. Simulation activée.`);
        setPaymentSuccess(true);
        await addCredits(selectedOption.credits);
        setTimeout(() => router.replace('/(tabs)'), 1800);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code !== 'Canceled') {
          Alert.alert('Paiement échoué', presentError.message);
        }
        setIsProcessing(false);
      } else {
        setPaymentSuccess(true);
        await addCredits(selectedOption.credits);
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1800);
      }
    } catch (err: any) {
      console.error(err);
      const message = err?.readableMessage || err?.response?.data?.message || err?.message || 'Erreur inconnue';
      Alert.alert('Erreur', `Impossible d'initier le paiement : ${message}`);
      setIsProcessing(false);
    }
  };

  // ═════════════════════════════════════════════════════════════════════
  // VUE RÉCAPITULATIF & CONFIRMATION STRIPE
  // ═════════════════════════════════════════════════════════════════════
  if (showCheckout) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />

        {/* Top bar */}
        <View style={[styles.checkoutHeader, { paddingTop: topPadding }]}>
          <TouchableOpacity
            onPress={() => setShowCheckout(false)}
            style={styles.backButton}
            disabled={isProcessing}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={COLORS.ink} />
          </TouchableOpacity>
          <Text style={styles.checkoutTitle}>Paiement Sécurisé</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={[styles.checkoutBody, { paddingBottom: bottomPadding }]}>
          {paymentSuccess ? (
            <View style={styles.successContainer}>
              <View style={styles.successCircle}>
                <Sparkles size={56} color={COLORS.goldDark} />
              </View>
              <Text style={styles.successTitle}>Paiement Confirmé !</Text>
              <Text style={styles.successSubtitle}>
                Votre formule {selectedOption?.name} est maintenant active. Vos crédits ont été ajoutés avec succès.
              </Text>
              <ActivityIndicator size="small" color={COLORS.goldDark} style={{ marginTop: 24 }} />
            </View>
          ) : (
            <View style={styles.formContainer}>
              {/* Carte Récapitulative stylisée Onboarding */}
              <View style={[styles.orderSummaryCard, selectedOption?.isHero && styles.orderSummaryHero]}>
                {selectedOption?.isHero && (
                  <View style={styles.orderBadge}>
                    <Text style={styles.orderBadgeText}>PREMIUM</Text>
                  </View>
                )}
                <Text style={styles.summarySub}>FORMULE SÉLECTIONNÉE</Text>
                <Text style={styles.summaryTitle}>{selectedOption?.name}</Text>
                <Text style={styles.summaryDesc}>{selectedOption?.description}</Text>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryTotalRow}>
                  <Text style={styles.totalLabel}>Total à régler</Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.totalAmount}>{selectedOption?.price}</Text>
                    <Text style={styles.totalPeriod}>Paiement unique · Sans abonnement</Text>
                  </View>
                </View>
              </View>

              {/* Bloc Réassurance Stripe */}
              <View style={styles.securityBox}>
                <View style={styles.securityIconCircle}>
                  <ShieldCheck size={28} color={COLORS.green} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.securityTitle}>Paiement 100% Chiffré & Sécurisé</Text>
                  <Text style={styles.securitySubtitle}>
                    Vos coordonnées bancaires sont directement chiffrées par Stripe. BOLIGO ne conserve aucune donnée de carte bancaire.
                  </Text>
                </View>
              </View>

              {/* Bouton de paiement principal */}
              {selectedOption?.isHero ? (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleConfirmPayment}
                  disabled={isProcessing}
                  style={{ marginBottom: 14 }}
                >
                  <LinearGradient
                    colors={['#D9AE3C', '#A87C1C']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.ctaPrimaryGradient}
                  >
                    {isProcessing ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <Text style={styles.ctaPrimaryText}>
                        Payer {selectedOption?.price} avec Stripe →
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleConfirmPayment}
                  disabled={isProcessing}
                  style={styles.ctaRegularBtn}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color={COLORS.ink} />
                  ) : (
                    <Text style={styles.ctaRegularText}>
                      Payer {selectedOption?.price} avec Stripe
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowCheckout(false)}
                disabled={isProcessing}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Modifier mon choix</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // ═════════════════════════════════════════════════════════════════════
  // VUE PRINCIPALE — ÉCRAN DES TARIFS (STYLE EXACT ONBOARDING)
  // ═════════════════════════════════════════════════════════════════════
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* ── ARRIÈRE-PLAN MESH GRADIENT BLOBS ── */}
      <View style={styles.meshBackground} pointerEvents="none">
        <View style={[styles.blob, styles.blobGold]} />
        <View style={[styles.blob, styles.blobRed]} />
      </View>

      {/* ── TOP BAR ONBOARDING ── */}
      <View style={[styles.topbar, { paddingTop: topPadding }]}>
        <View style={styles.topbarLeft}>
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace('/(tabs)');
            }}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <ChevronLeft size={22} color={COLORS.ink} />
          </TouchableOpacity>
          <Text style={styles.logoText}>BOLIGO</Text>
        </View>

        <TouchableOpacity onPress={() => router.replace('/(tabs)')} activeOpacity={0.7}>
          <Text style={styles.skipText}>Plus tard</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
      >
        {/* ── EN-TÊTE DU CHOIX DU PARCOURS ── */}
        <View style={styles.headerSection}>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>CHOISIS TON PARCOURS</Text>
          </View>

          <Text style={styles.pageTitle}>
            Un parcours. <Text style={styles.pageTitleItalic}>Sept jours. Une vraie rencontre.</Text>
          </Text>
        </View>

        {/* ── GRILLE DES OFFRES / PACKS ── */}
        <View style={styles.packGrid}>
          {options.map((option) => {
            if (option.isHero) {
              // ── CARTE HERO PREMIUM (OR) ──
              return (
                <View key={option.id} style={styles.packHeroCard}>
                  {/* Badge top "Le plus choisi" */}
                  <View style={styles.heroTagBadge}>
                    <LinearGradient
                      colors={['#D9AE3C', '#A87C1C']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.heroTagGradient}
                    >
                      <Text style={styles.heroTagText}>{option.tag || 'LE PLUS CHOISI'}</Text>
                    </LinearGradient>
                  </View>

                  <Text style={styles.heroPackName}>{option.name.toUpperCase()}</Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceAmount}>{option.price}</Text>
                    <Text style={styles.pricePeriod}>{option.period}</Text>
                  </View>

                  <Text style={styles.packDesc}>{option.description}</Text>

                  {option.extraTitle && (
                    <View style={styles.plusDividerRow}>
                      <Text style={styles.plusTitleText}>{option.extraTitle.toUpperCase()}</Text>
                    </View>
                  )}

                  {/* Liste des bénéfices Premium */}
                  <View style={styles.featureList}>
                    {option.features.map((feat, index) => (
                      <View key={index} style={styles.featureRow}>
                        <View style={styles.tickmarkGold}>
                          <Check size={11} color={COLORS.goldDark} strokeWidth={3.5} />
                        </View>
                        <Text style={styles.featureText}>
                          {feat.prefix}
                          <Text style={styles.featureStrong}>{feat.strong}</Text>
                          {feat.suffix}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* CTA Passer en Premium */}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleSelectOption(option)}
                    style={styles.heroCtaWrapper}
                  >
                    <LinearGradient
                      colors={['#D9AE3C', '#A87C1C']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.heroCtaBtn}
                    >
                      <Text style={styles.heroCtaText}>Passer en Premium →</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              );
            }

            // ── CARTE PARCOURS HARMONIE (STANDARD) ──
            return (
              <View key={option.id} style={styles.packStandardCard}>
                <Text style={styles.standardPackName}>{option.name.toUpperCase()}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.priceAmount}>{option.price}</Text>
                  <Text style={styles.pricePeriod}>{option.period}</Text>
                </View>

                <Text style={styles.packDesc}>{option.description}</Text>

                {/* Liste des bénéfices Standard */}
                <View style={styles.featureList}>
                  {option.features.map((feat, index) => (
                    <View key={index} style={styles.featureRow}>
                      <View style={styles.tickmarkGreen}>
                        <Check size={11} color={COLORS.green} strokeWidth={3.5} />
                      </View>
                      <Text style={styles.featureText}>
                        {feat.prefix}
                        <Text style={styles.featureStrong}>{feat.strong}</Text>
                        {feat.suffix}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Bouton Choisir ce parcours */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSelectOption(option)}
                  style={styles.standardCtaBtn}
                >
                  <Text style={styles.standardCtaText}>Choisir ce parcours</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* ── LIGNE DE RÉASSURANCE ONBOARDING ── */}
        <View style={styles.reassureLine}>
          <Text style={styles.reassureItem}>Paiement unique</Text>
          <Text style={styles.reassureDot}>●</Text>
          <Text style={styles.reassureBold}>Sans abonnement</Text>
          <Text style={styles.reassureDot}>●</Text>
          <Text style={styles.reassureItem}>100% Sécurisé</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ═════════════════════════════════════════════════════════════════════
// FEUILLE DE STYLES EXACTE ONBOARDING & CHARTE BOLIGO
// ═════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  meshBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    opacity: 0.12,
  },
  blobGold: {
    backgroundColor: COLORS.gold,
    top: -40,
    right: -50,
  },
  blobRed: {
    backgroundColor: COLORS.red,
    bottom: -30,
    left: -40,
  },

  // Top bar
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
    zIndex: 10,
  },
  topbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    padding: 6,
    marginLeft: -4,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2.2,
    color: COLORS.red,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.ink3,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
  },

  // En-tête
  headerSection: {
    marginBottom: 14,
  },
  badgePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(200,154,46,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(200,154,46,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 8,
  },
  badgePillText: {
    color: COLORS.goldDark,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  pageTitle: {
    fontSize: Math.min(SCREEN_WIDTH * 0.058, 22),
    fontWeight: '800',
    color: COLORS.ink,
    lineHeight: 28,
    letterSpacing: -0.3,
    fontFamily: Typography.fontFamily.serif || Typography.fontFamily.bold,
  },
  pageTitleItalic: {
    fontWeight: '400',
    fontStyle: 'italic',
    color: COLORS.ink2,
  },

  // Pack Grid
  packGrid: {
    gap: 16,
    marginBottom: 20,
  },

  // Pack Standard Card
  packStandardCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: COLORS.line,
    borderRadius: 16,
    padding: 20,
  },
  standardPackName: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: COLORS.ink3,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 6,
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.ink,
    lineHeight: 36,
    fontFamily: Typography.fontFamily.serif || Typography.fontFamily.bold,
  },
  pricePeriod: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.ink3,
  },
  packDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.ink2,
    marginBottom: 14,
  },

  // Feature rows
  featureList: {
    gap: 9,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },
  tickmarkGreen: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: 'rgba(30,158,90,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1.5,
  },
  tickmarkGold: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: 'rgba(200,154,46,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1.5,
  },
  featureText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.ink2,
  },
  featureStrong: {
    fontWeight: '700',
    color: COLORS.ink,
  },

  standardCtaBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: COLORS.line,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  standardCtaText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.ink,
  },

  // Pack Hero Card (Premium)
  packHeroCard: {
    backgroundColor: 'rgba(200,154,46,0.03)',
    borderWidth: 2,
    borderColor: COLORS.gold,
    borderRadius: 16,
    padding: 20,
    position: 'relative',
  },
  heroTagBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroTagGradient: {
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  heroTagText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  heroPackName: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: COLORS.goldDark,
    marginBottom: 6,
  },
  plusDividerRow: {
    paddingTop: 11,
    marginBottom: 11,
    borderTopWidth: 1,
    borderColor: 'rgba(200,154,46,0.35)',
    borderStyle: 'dashed',
  },
  plusTitleText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: COLORS.goldDark,
  },
  heroCtaWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: COLORS.goldDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4,
  },
  heroCtaBtn: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // Réassurance
  reassureLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 6,
    marginBottom: 16,
  },
  reassureItem: {
    fontSize: 11.5,
    fontWeight: '500',
    color: COLORS.ink3,
  },
  reassureBold: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.ink2,
  },
  reassureDot: {
    fontSize: 5,
    color: '#D6CFC8',
  },

  // ═══════════════════════════════════════════════════════════════════
  // CHECKOUT MODAL STYLES
  // ═══════════════════════════════════════════════════════════════════
  checkoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.ink,
  },
  checkoutBody: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  formContainer: {
    flex: 1,
  },
  orderSummaryCard: {
    backgroundColor: '#FAFAF8',
    borderWidth: 1.5,
    borderColor: COLORS.line,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  orderSummaryHero: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(200,154,46,0.03)',
  },
  orderBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.goldDark,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  orderBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  summarySub: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: COLORS.ink3,
    marginBottom: 4,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 6,
    fontFamily: Typography.fontFamily.serif || Typography.fontFamily.bold,
  },
  summaryDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.ink2,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.line,
    marginVertical: 14,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.ink2,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.ink,
    fontFamily: Typography.fontFamily.serif || Typography.fontFamily.bold,
  },
  totalPeriod: {
    fontSize: 10.5,
    color: COLORS.ink3,
    marginTop: 2,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F7FDF9',
    borderWidth: 1,
    borderColor: 'rgba(30,158,90,0.2)',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  securityIconCircle: {
    marginTop: 2,
  },
  securityTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.greenDark,
    marginBottom: 4,
  },
  securitySubtitle: {
    fontSize: 11.5,
    lineHeight: 16,
    color: COLORS.ink2,
  },
  ctaPrimaryGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.goldDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 4,
  },
  ctaPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  ctaRegularBtn: {
    backgroundColor: COLORS.red,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: COLORS.red,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  ctaRegularText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.ink3,
    textDecorationLine: 'underline',
  },

  // Success
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(200,154,46,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 10,
    fontFamily: Typography.fontFamily.serif || Typography.fontFamily.bold,
  },
  successSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.ink2,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  // Styles Hybrides Région & Mobile Money
  regionToggleBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  regionTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  regionTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  regionTabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.ink3,
  },
  regionTabTextActive: {
    fontWeight: '800',
    color: COLORS.ink,
  },
  mobileMoneyBox: {
    marginBottom: 16,
  },
  mobileMoneyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 10,
  },
  mobileMoneyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mobileMoneyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: (SCREEN_WIDTH - 64) / 2,
    padding: 12,
    backgroundColor: '#FAFAF8',
    borderWidth: 1.5,
    borderColor: COLORS.line,
    borderRadius: 12,
  },
  mobileMoneyName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.ink,
  },
});
