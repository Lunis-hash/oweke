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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { AuthService } from '@/services/auth';
import { useAuth } from '@/context/auth';

export default function VerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const userEmail = email || '';
  const { signIn } = useAuth();

  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all filled
    if (newCode.every((digit) => digit !== '') && newCode.join('').length === 4) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (verificationCode: string) => {
    if (!userEmail) {
      Alert.alert('Erreur', 'Adresse e-mail introuvable.');
      return;
    }
    setLoading(true);
    try {
      const res = await AuthService.verifyEmail(userEmail, verificationCode);
      if (res.access_token) {
        await signIn(res.access_token, res.userId, res.refresh_token);
        Alert.alert('Compte vérifié !', 'Votre adresse e-mail a été validée avec succès.', [
          { text: 'Continuer', onPress: () => router.replace('/onboarding/profile-details') },
        ]);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      const msg = error?.response?.data?.message || error?.message || 'Code de vérification invalide';
      Alert.alert('Erreur de vérification', Array.isArray(msg) ? msg.join('\n') : msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userEmail) {
      Alert.alert('Erreur', 'Adresse e-mail introuvable.');
      return;
    }
    try {
      await AuthService.resendVerification(userEmail);
      setTimer(60);
      Alert.alert('Code envoyé', 'Un nouveau code de vérification à 4 chiffres vous a été envoyé par e-mail.');
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Impossible d\'envoyer le code';
      Alert.alert('Erreur', Array.isArray(msg) ? msg.join('\n') : msg);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <View style={styles.backButtonCircle}>
              <Text style={styles.backArrow}>←</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.timer}>{formatTimer(timer)}</Text>
          <Text style={styles.description}>
            Saisissez le code à 4 chiffres envoyé à :{'\n'}
            <Text style={{ fontWeight: 'bold', color: Colors.primary.red }}>{userEmail || 'votre adresse email'}</Text>
          </Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[
                  styles.codeInput,
                  digit && styles.codeInputFilled,
                  index === code.findIndex((d) => d === '') && styles.codeInputActive,
                ]}
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={!loading}
              />
            ))}
          </View>

          {loading && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.md }}>
              <ActivityIndicator color={Colors.primary.red} />
              <Text style={{ color: Colors.primary.red, fontFamily: Typography.fontFamily.medium }}>Vérification...</Text>
            </View>
          )}
        </View>

        <View style={styles.resendContainer}>
          {timer === 0 && (
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResend}
              activeOpacity={0.7}>
              <Text style={styles.resendText}>Renvoyer un nouveau code</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  header: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.red + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: Colors.primary.red,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  timer: {
    fontSize: 48,
    fontWeight: Typography.h1.fontWeight,
    color: Colors.text.primary100,
    marginBottom: Spacing.lg,
  },
  description: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    color: Colors.text.primary70,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  codeContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  codeInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: Colors.neutral.border,
    borderRadius: BorderRadius.md,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: Typography.h3.fontWeight,
    color: Colors.text.primary100,
    backgroundColor: Colors.neutral.white,
  },
  codeInputActive: {
    borderColor: Colors.primary.red + '80',
  },
  codeInputFilled: {
    backgroundColor: Colors.primary.red,
    borderColor: Colors.primary.red,
    color: Colors.neutral.white,
  },
  resendContainer: {
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  resendText: {
    fontSize: Typography.label.fontSize,
    color: Colors.primary.red,
    fontWeight: Typography.label.fontWeight,
  },
});
