import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { AuthService } from '@/services/auth';
import { useAuth } from '@/context/auth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Photos de fond (couple, émotion forte) ────────────────────────
const BG_IMAGES = [
  'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80',
];

// ─── Particules décoratives ────────────────────────────────────────
const PARTICLES = [
  { size: 6,  top: '10%', left: '10%',  color: Colors.primary.red,    opacity: 0.5, duration: 7000  },
  { size: 8,  top: '17%', right: '8%',  color: Colors.primary.purple, opacity: 0.45, duration: 9000 },
  { size: 5,  top: '76%', left: '8%',   color: Colors.primary.orange, opacity: 0.4, duration: 8000  },
  { size: 7,  top: '80%', right: '10%', color: Colors.primary.red,    opacity: 0.35, duration: 11000},
];

function Particle({ size, top, left, right, color, opacity, duration }: any) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: duration / 2, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: duration / 2, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size, height: size,
        borderRadius: size / 2,
        top, left, right,
        backgroundColor: color,
        opacity,
        transform: [{
          translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] }),
        }],
      }}
    />
  );
}

// ─── Écran principal ───────────────────────────────────────────────
export default function SignUpScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);

  const handleSocialSignUp = async (provider: 'google' | 'facebook') => {
    setSocialLoading(provider);
    try {
      const socialId = `user_${provider}_official`;
      const mockProfile = {
        email: `${provider}.user@boligo.com`,
        firstName: provider === 'google' ? 'Google' : 'Facebook',
        lastName: 'Membre',
        id: socialId,
      };

      const result = await AuthService.socialLogin(provider, `token_${socialId}`, mockProfile);
      if (result.access_token) {
        await signIn(result.access_token, result.userId, result.refresh_token);
        router.replace('/onboarding/value-slides');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erreur', `Inscription via ${provider} échouée.`);
    } finally {
      setSocialLoading(null);
    }
  };

  // Animations d'entrée
  const topAnim    = useRef(new Animated.Value(0)).current;
  const topSlide   = useRef(new Animated.Value(22)).current;
  const cardAnim   = useRef(new Animated.Value(0)).current;
  const cardScale  = useRef(new Animated.Value(0.94)).current;
  const cardSlide  = useRef(new Animated.Value(16)).current;
  const imgFade    = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Préchargement images
    BG_IMAGES.forEach(url => Image.prefetch(url));

    // Animation d'entrée
    Animated.parallel([
      Animated.timing(topAnim, {
        toValue: 1, duration: 800,
        delay: 150, useNativeDriver: true,
      }),
      Animated.spring(topSlide, {
        toValue: 0, friction: 8, tension: 50,
        delay: 150, useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 1, duration: 900,
        delay: 400, useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1, friction: 7, tension: 50,
        delay: 400, useNativeDriver: true,
      }),
      Animated.spring(cardSlide, {
        toValue: 0, friction: 8, tension: 55,
        delay: 400, useNativeDriver: true,
      }),
    ]).start();

    // Rotation images de fond
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(imgFade, { toValue: 0.4, duration: 900, useNativeDriver: true }),
        Animated.timing(imgFade, { toValue: 1,   duration: 900, useNativeDriver: true }),
      ]).start();
      setCurrentImage(prev => (prev + 1) % BG_IMAGES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Photo flouée en fond */}
      <Animated.Image
        source={{ uri: BG_IMAGES[currentImage] }}
        style={[styles.bgImage, { opacity: imgFade }]}
        blurRadius={18}
        resizeMode="cover"
      />

      {/* Overlay sombre */}
      <View style={styles.overlay} />

      {/* Particules */}
      {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

      {/* Contenu centré */}
      <View style={styles.screen}>

        {/* Logo + badge en haut */}
        <Animated.View
          style={[
            styles.topSection,
            {
              opacity: topAnim,
              transform: [{ translateY: topSlide }],
            },
          ]}
        >
          <View style={styles.badgeTop}>
            <Text style={styles.badgeTopText}>Dating sérieux</Text>
          </View>

          <Text style={styles.logo}>BOLIGO</Text>

          <Text style={styles.taglineHeader}>
            Des connexions qui ont du sens.
          </Text>
        </Animated.View>

        {/* Card premium centrale */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardAnim,
              transform: [
                { scale: cardScale },
                { translateY: cardSlide },
              ],
            },
          ]}
        >
          {/* Ligne dégradé décorative */}
          <LinearGradient
            colors={[Colors.primary.red, Colors.primary.purple, Colors.primary.orange]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardTopLine}
          />

          {/* Titre */}
          <Text style={styles.cardTitle}>
            Prêt à vivre{'\n'}
            <Text style={styles.cardTitleItalic}>une vraie connexion ?</Text>
          </Text>

          {/* Description */}
          <Text style={styles.cardDesc}>
            Rejoins une communauté où la compatibilité réelle passe avant les photos.
          </Text>

          {/* Trust pills */}
          <View style={styles.trustRow}>
            {['Profils vérifiés', 'Gratuit', 'Sécurisé'].map((label) => (
              <View key={label} style={styles.trustPill}>
                <LinearGradient
                  colors={[Colors.primary.red, Colors.primary.purple]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.pillDot}
                />
                <Text style={styles.trustPillText}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Bouton principal */}
          <TouchableOpacity
            onPress={() => router.push('/onboarding/profile-details')}
            activeOpacity={0.85}
            style={styles.btnWrapper}
            disabled={isLoading}
          >
            <LinearGradient
              colors={[Colors.primary.red, Colors.primary.purple, Colors.primary.orange]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btn}
            >
              <Text style={styles.btnText}>Commencer l'aventure</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Séparateur pour Auth Sociale */}
          <View style={styles.separator}>
            <View style={styles.sepLine} />
            <Text style={styles.sepText}>ou s'inscrire avec</Text>
            <View style={styles.sepLine} />
          </View>

          {/* Boutons Sociaux */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity 
              onPress={() => handleSocialSignUp('google')} 
              style={styles.socialButton}
              activeOpacity={0.8}
              disabled={isLoading || socialLoading !== null}
            >
              {socialLoading === 'google' ? (
                <>
                  <ActivityIndicator color={Colors.text.primary70} />
                  <Text style={styles.socialButtonText}>Connexion...</Text>
                </>
              ) : (
                <>
                  <Image 
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }} 
                    style={styles.socialIcon} 
                  />
                  <Text style={styles.socialButtonText}>Google</Text>
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => handleSocialSignUp('facebook')} 
              style={styles.socialButton}
              activeOpacity={0.8}
              disabled={isLoading || socialLoading !== null}
            >
              {socialLoading === 'facebook' ? (
                <>
                  <ActivityIndicator color={Colors.text.primary70} />
                  <Text style={styles.socialButtonText}>Connexion...</Text>
                </>
              ) : (
                <>
                  <Image 
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/124/124010.png' }} 
                    style={styles.socialIcon} 
                  />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Séparateur */}
          <View style={styles.separator}>
            <View style={styles.sepLine} />
            <Text style={styles.sepText}>déjà membre ?</Text>
            <View style={styles.sepLine} />
          </View>

          {/* Lien connexion */}
          <View style={styles.signinRow}>
            <Text style={styles.signinText}>Tu as déjà un compte — </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              activeOpacity={0.7}
            >
              <Text style={styles.signinLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },

  // Fond flouté
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    transform: [{ scale: 1.15 }],
  },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.52)',
  },

  // Layout principal
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },

  // Section logo
  topSection: {
    alignItems: 'center',
  },
  badgeTop: {
    backgroundColor: 'rgba(233,64,87,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(233,64,87,0.35)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    marginBottom: Spacing.sm,
  },
  badgeTopText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  logo: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 44,
    color: Colors.primary.red,
    letterSpacing: 3,
    // Note : pour le vrai dégradé texte, utiliser MaskedView + LinearGradient
  },
  taglineHeader: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.7)',
    marginTop: Spacing.xs,
    letterSpacing: 0.3,
  },

  // Card premium
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(233,64,87,0.12)',
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 12,
  },
  cardTopLine: {
    height: 3,
    width: 60,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.h3.fontSize,
    lineHeight: Typography.h3.lineHeight,
    color: Colors.text.primary100,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  cardTitleItalic: {
    fontFamily: Typography.fontFamily.serif,
    fontStyle: 'italic',
    fontSize: 22,
    color: Colors.primary.red,
  },
  cardDesc: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 12.5,
    color: Colors.text.primary70,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xs,
  },

  // Trust pills
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    flexWrap: 'wrap',
  },
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.neutral.backgroundLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
  },
  pillDot: {
    width: 5,
    height: 5,
    borderRadius: BorderRadius.full,
  },
  trustPillText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 11,
    color: Colors.text.primary70,
  },

  // Bouton
  btnWrapper: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  btn: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
  },
  btnText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.labelLarge.fontSize,
    color: Colors.neutral.white,
    letterSpacing: 0.2,
  },

  // Séparateur
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sepLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  sepText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 11,
    color: Colors.text.primary40,
  },

  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral.white,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    borderRadius: BorderRadius.lg,
    paddingVertical: 12,
    gap: Spacing.sm,
  },
  socialIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  socialButtonText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary70,
  },

  // Connexion
  signinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.label.fontSize,
    color: Colors.text.primary40,
  },
  signinLink: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.label.fontSize,
    color: Colors.primary.red,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.primary.red,
  },
});