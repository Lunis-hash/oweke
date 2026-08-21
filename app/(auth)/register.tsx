import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import Button from '@/components/ui/Button';
import SocialButton from '@/components/ui/SocialButton';
import Input from '@/components/ui/Input';
import { AuthService } from '@/services/auth';
import * as SecureStore from 'expo-secure-store';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'H' | 'F' | ''>('');
  const [city, setCity] = useState('');
  const [job, setJob] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateAge = (dateString: string) => {
    const birth = new Date(dateString);
    if (isNaN(birth.getTime())) return -1;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleRegister = async () => {
    // 1. Validation Client (Frontend)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s\-\.\(\)]{8,20}$/;

    if (!firstName.trim() || firstName.trim().length < 2) {
      Alert.alert('Prénom invalide', 'Le prénom doit contenir au moins 2 caractères.');
      return;
    }

    if (!lastName.trim() || lastName.trim().length < 2) {
      Alert.alert('Nom invalide', 'Le nom doit contenir au moins 2 caractères.');
      return;
    }

    if (!email.trim() || !emailRegex.test(email.trim())) {
      Alert.alert('Email invalide', 'Veuillez saisir une adresse email valide (ex: utilisateur@domaine.com).');
      return;
    }

    if (phone.trim() && !phoneRegex.test(phone.trim())) {
      Alert.alert(
        'Numéro de téléphone invalide',
        'Veuillez entrer un numéro au format international valide (ex: +33 6 12 34 56 78 ou +225 07 01 02 03 04).'
      );
      return;
    }

    if (!job.trim() || job.trim().length < 2) {
      Alert.alert('Profession obligatoire', 'Veuillez renseigner votre profession (au moins 2 caractères).');
      return;
    }

    if (!gender) {
      Alert.alert('Genre obligatoire', 'Veuillez choisir votre genre.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Sécurité', 'Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    // Validation Date de naissance et Age >= 18
    const age = calculateAge(birthDate);
    if (age === -1) {
      Alert.alert('Date invalide', 'Le format de la date de naissance est invalide (YYYY-MM-DD attendu, ex: 1995-05-20).');
      return;
    }
    if (age < 18) {
      Alert.alert('Accès refusé', 'Vous devez avoir au moins 18 ans pour vous inscrire sur BOLIGO.');
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Conditions d\'utilisation', 'Veuillez accepter les Conditions d\'utilisation et la Politique de confidentialité.');
      return;
    }

    setLoading(true);

    try {
      const response = await AuthService.register({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthDate: new Date(birthDate).toISOString(),
        gender: gender as 'H' | 'F',
        city: city.trim() || undefined,
        telephone: phone.trim() || undefined,
        job: job.trim(),
      });

      Alert.alert(
        'Vérification e-mail requise',
        'Votre compte a été créé. Un code de vérification à 4 chiffres vous a été envoyé par e-mail.',
        [
          {
            text: 'Saisir le code',
            onPress: () =>
              router.push({
                pathname: '/(auth)/verify',
                params: { email: email.trim() },
              }),
          },
        ]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error?.readableMessage || error?.response?.data?.message || 'Une erreur est survenue lors de l\'inscription';
      const finalMessage = Array.isArray(message) ? message.join('\n') : message;
      Alert.alert('Erreur d\'inscription', finalMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(auth)/login');
  };

  const handleSocialLogin = (type: string) => {
    console.log(`Social Register with ${type}`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>BOLIGO.COM</Text>
          <Text style={styles.subtitle}>Inscrivez-vous pour continuer</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Prénom *"
            placeholder="Votre prénom"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />

          <Input
            label="Nom *"
            placeholder="Votre nom"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />

          <Input
            label="Email *"
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Numéro de téléphone"
            placeholder="+33 6 12 34 56 78 ou +225 07 01 02 03 04"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            hint="Format international accepté (France, Europe, Afrique, etc.)"
          />

          <Input
            label="Date de naissance *"
            placeholder="YYYY-MM-DD (ex: 1990-01-01)"
            value={birthDate}
            onChangeText={setBirthDate}
            keyboardType="number-pad"
            hint="Vous devez avoir au moins 18 ans"
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Genre *</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'H' && styles.genderButtonActive]}
                onPress={() => setGender('H')}
              >
                <Text style={[styles.genderText, gender === 'H' && styles.genderTextActive]}>Homme</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'F' && styles.genderButtonActive]}
                onPress={() => setGender('F')}
              >
                <Text style={[styles.genderText, gender === 'F' && styles.genderTextActive]}>Femme</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Input
            label="Ville"
            placeholder="Votre ville"
            value={city}
            onChangeText={setCity}
            autoCapitalize="words"
          />

          <Input
            label="Profession / Job *"
            placeholder="Ex: Développeur, Chef de projet..."
            value={job}
            onChangeText={setJob}
            autoCapitalize="words"
          />

          <Input
            label="Mot de passe *"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            hint="Minimum 8 caractères, avec majuscule et chiffre"
          />

          <Input
            label="Confirmer le mot de passe *"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAcceptedTerms(!acceptedTerms)}>
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
              {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              J'accepte les{' '}
              <Text style={styles.link}>Conditions d'utilisation</Text> et la{' '}
              <Text style={styles.link}>Politique de confidentialité</Text>
            </Text>
          </TouchableOpacity>

          <Button
            title={loading ? 'Création en cours...' : 'Créer mon compte'}
            onPress={handleRegister}
            variant="primary"
            disabled={!acceptedTerms || loading}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou s'inscrire avec</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialGrid}>
            <SocialButton type="google" onPress={() => handleSocialLogin('google')} />
            <SocialButton type="facebook" onPress={() => handleSocialLogin('facebook')} />
          </View>

          <TouchableOpacity style={styles.loginLink} onPress={handleLogin}>
            <Text style={styles.loginText}>
              Déjà un compte ? <Text style={styles.link}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.xl,
  },
  logo: {
    fontSize: 36,
    fontWeight: Typography.h1.fontWeight,
    color: Colors.primary.blue,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.body.fontSize,
    color: Colors.text.primary70,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.label.fontSize,
    fontWeight: Typography.label.fontWeight,
    color: Colors.text.primary100,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.body.fontSize,
    color: Colors.text.primary100,
    backgroundColor: Colors.neutral.white,
  },
  hint: {
    fontSize: Typography.label.fontSize - 2,
    color: Colors.text.primary40,
    marginTop: Spacing.xs,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.neutral.border,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary.blue,
    borderColor: Colors.primary.blue,
  },
  checkmark: {
    color: Colors.neutral.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxText: {
    flex: 1,
    fontSize: Typography.label.fontSize,
    color: Colors.text.primary70,
    lineHeight: 20,
  },
  socialGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  loginLink: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  loginText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.body.fontSize,
    color: Colors.text.primary70,
  },
  link: {
    color: Colors.primary.blue,
    fontFamily: Typography.fontFamily.medium,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral.border,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: Typography.label.fontSize,
    color: Colors.text.primary40,
    fontFamily: Typography.fontFamily.regular,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  genderButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.neutral.white,
  },
  genderButtonActive: {
    backgroundColor: Colors.primary.blue,
    borderColor: Colors.primary.blue,
  },
  genderText: {
    fontSize: Typography.body.fontSize,
    color: Colors.text.primary100,
    fontFamily: Typography.fontFamily.medium,
  },
  genderTextActive: {
    color: Colors.neutral.white,
    fontFamily: Typography.fontFamily.bold,
  },
});
