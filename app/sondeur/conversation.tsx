import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { Send, Heart, Video, Sparkles } from 'lucide-react-native';
import client from '@/services/api';

// ─── Types ─────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  sentAt: string;
}

// ─── Composant bulle de message ────────────────────────────────────
function MessageBubble({ message, isMe }: { message: ChatMessage; isMe: boolean }) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
    ]).start();
  }, []);

  if (isMe) {
    return (
      <Animated.View style={[styles.userBubbleWrap, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <LinearGradient
          colors={[Colors.primary.red, Colors.primary.purple]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.userBubble}
        >
          <Text style={styles.userText}>{message.text}</Text>
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.partnerBubbleWrap, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.partnerAvatar}>
        <LinearGradient
          colors={[Colors.primary.red, Colors.primary.purple]}
          style={styles.avatarGrad}
        >
          <Text style={styles.avatarText}>{message.senderName.charAt(0)}</Text>
        </LinearGradient>
      </View>
      <View style={styles.partnerBubble}>
        <Text style={styles.partnerText}>{message.text}</Text>
      </View>
    </Animated.View>
  );
}

// ─── Écran principal : Chat Libre ──────────────────────────────────
export default function ChatLibreScreen() {
  const router = useRouter();
  const { matchId, matchName = 'Match', journeyId: urlJourneyId } = useLocalSearchParams<{
    matchId: string; matchName: string; journeyId: string;
  }>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [compatScore, setCompatScore] = useState(78);

  const scrollRef  = useRef<ScrollView>(null);
  const headerFade = useRef(new Animated.Value(0)).current;
  const scoreAnim  = useRef(new Animated.Value(78)).current;

  const scrollDown = () =>
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);

  const addMessage = (msg: Omit<ChatMessage, 'id'>) => {
    const m = { ...msg, id: Date.now().toString() + Math.random() };
    setMessages(prev => [...prev, m]);
    scrollDown();
    return m;
  };

  // Charger le journey et les messages existants
  useEffect(() => {
    loadChat();
    Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const loadChat = async () => {
    const jId = urlJourneyId || null;
    if (!jId) return;

    setJourneyId(jId);

    try {
      const statusRes = await client.get(`/journey/${jId}/status`);
      const status = statusRes.data;

      if (status.currentStep === 'phase_harmonie') {
        // Pas encore en chat libre — rediriger vers Mes matchs
        addMessage({
          text: 'Bienvenue ! Votre parcours Harmonie doit être complété avant d\'accéder au chat libre.',
          senderId: 'system',
          senderName: 'BOLIGO',
          sentAt: new Date().toISOString(),
        });
        return;
      }

      setIsCompleted(true);

      // Charger les messages existants du journey
      try {
        const msgsRes = await client.get(`/journey/${jId}/messages`);
        const existingMsgs = msgsRes.data || [];
        setMessages(existingMsgs.map((m: any) => ({
          id: m.id,
          text: m.content,
          senderId: m.senderId,
          senderName: m.senderId === matchId ? (matchName as string) : 'Moi',
          sentAt: m.sentAt,
        })));
      } catch {
        // Pas de messages encore
      }

      addMessage({
        text: `🎉 Félicitations ! Votre parcours Harmonie avec ${status.partnerName || matchName} est terminé. Vous pouvez maintenant discuter librement !`,
        senderId: 'system',
        senderName: 'BOLIGO',
        sentAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Failed to load chat:', e);
      addMessage({
        text: 'Erreur de connexion au parcours. Réessayez.',
        senderId: 'system',
        senderName: 'BOLIGO',
        sentAt: new Date().toISOString(),
      });
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !journeyId) return;
    const text = inputText.trim();
    setInputText('');

    // Afficher immédiatement
    const msg = addMessage({
      text,
      senderId: 'me',
      senderName: 'Moi',
      sentAt: new Date().toISOString(),
    });

    // Sauvegarder en DB
    try {
      await client.post('/journey/message', {
        journeyId,
        content: text,
        type: 'texte',
      });
    } catch (e) {
      console.error('Failed to send message:', e);
    }
  };

  const startVideoCall = () => {
    Alert.alert(
      'Appel vidéo verrouillé',
      'L\'accès aux appels vidéo est réservé aux membres ayant terminé les 3 jours du parcours Sondeur. Poursuivez vos réponses quotidiennes !',
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.neutral.white} />

      {/* ── Header ───────────────────────────────────────────────── */}
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => { if (router.canGoBack()) router.back(); else router.replace('/(tabs)/messages'); }} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <LinearGradient
              colors={[Colors.primary.red + '20', Colors.primary.purple + '20']}
              style={styles.matchAvatar}
            >
              <Text style={styles.matchAvatarText}>
                {typeof matchName === 'string' ? matchName.charAt(0) : 'M'}
              </Text>
            </LinearGradient>
            <View>
              <Text style={styles.headerTitle}>
                {typeof matchName === 'string' ? matchName : 'Match'}
              </Text>
              <Text style={styles.headerSub}>Chat libre</Text>
            </View>
          </View>

          <View style={styles.scorePill}>
            <Heart size={11} color={Colors.primary.red} fill={Colors.primary.red} />
            <Animated.Text style={styles.scorePillText}>
              {scoreAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }) as any}
            </Animated.Text>
          </View>
        </View>

        {/* Bouton appel vidéo */}
        {isCompleted && (
          <TouchableOpacity onPress={startVideoCall} style={styles.videoBtn} activeOpacity={0.85}>
            <LinearGradient
              colors={[Colors.primary.red + '15', Colors.primary.purple + '12']}
              style={styles.videoBtnGrad}
            >
              <Video size={16} color={Colors.primary.red} />
              <Text style={styles.videoBtnText}>Lancer l'appel vidéo</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* ── Messages ─────────────────────────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMe={msg.senderId === 'me' || msg.senderName === 'Moi'}
          />
        ))}
      </ScrollView>

      {/* ── Input ────────────────────────────────────────────────── */}
      {isCompleted && (
        <View style={styles.inputArea}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Écris un message..."
              placeholderTextColor={Colors.text.primary40}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              onPress={handleSend}
              activeOpacity={0.85}
              disabled={!inputText.trim()}
              style={styles.sendBtnWrap}
            >
              <LinearGradient
                colors={
                  inputText.trim()
                    ? [Colors.primary.red, Colors.primary.purple]
                    : ['#DEDEDE', '#DEDEDE']
                }
                style={styles.sendBtn}
              >
                <Send size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },

  // Header
  header: {
    backgroundColor: Colors.neutral.white,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.border + '40',
    gap: Spacing.sm,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.neutral.backgroundLight,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 20, color: Colors.text.primary100 },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginHorizontal: Spacing.md },
  matchAvatar: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.primary.red + '40',
  },
  matchAvatarText: { fontFamily: Typography.fontFamily.bold, fontSize: 17, color: Colors.primary.red },
  headerTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 16, color: Colors.text.primary100 },
  headerSub: { fontFamily: Typography.fontFamily.regular, fontSize: 11, color: Colors.text.primary40, marginTop: 1 },
  scorePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary.red + '10',
    paddingHorizontal: Spacing.sm, paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  scorePillText: { fontFamily: Typography.fontFamily.bold, fontSize: 12, color: Colors.primary.red },

  // Video button
  videoBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden' },
  videoBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  videoBtnText: { fontFamily: Typography.fontFamily.medium, fontSize: 13, color: Colors.primary.red },

  // Scroll
  scrollContent: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, paddingBottom: 32 },

  // User bubble
  userBubbleWrap: { alignItems: 'flex-end', marginBottom: Spacing.md },
  userBubble: { maxWidth: '82%', borderRadius: BorderRadius.lg, padding: Spacing.md },
  userText: { fontFamily: Typography.fontFamily.regular, fontSize: 14, lineHeight: 22, color: '#fff' },

  // Partner bubble
  partnerBubbleWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm, marginBottom: Spacing.md },
  partnerAvatar: {},
  avatarGrad: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Typography.fontFamily.bold, fontSize: 13, color: '#fff' },
  partnerBubble: {
    flex: 1, backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.neutral.border + '60',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  partnerText: { fontFamily: Typography.fontFamily.regular, fontSize: 14, lineHeight: 22, color: Colors.text.primary100 },

  // Input
  inputArea: {
    backgroundColor: Colors.neutral.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.border + '40',
    paddingBottom: Platform.OS === 'ios' ? 28 : Spacing.md,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm,
    backgroundColor: Colors.neutral.backgroundLight,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
  },
  input: {
    flex: 1,
    fontFamily: Typography.fontFamily.regular,
    fontSize: 15, color: Colors.text.primary100,
    paddingVertical: Spacing.sm,
    maxHeight: 100,
  },
  sendBtnWrap: { borderRadius: 20, overflow: 'hidden' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
