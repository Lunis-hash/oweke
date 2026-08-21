import { Tabs, useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Heart, MessageCircle, User, Layers } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { InterviewService } from '@/services/interview';

export default function TabLayout() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const guardCheck = async () => {
      if (!authLoading) {
        if (!token) {
          router.replace('/(auth)/login');
          return;
        }
        try {
          const status = await InterviewService.getStatus();
          if (isMounted) {
            if (!status.isCompleted) {
              const mod = typeof status.currentModule === 'number' ? status.currentModule : 0;
              router.replace(`/interview/${mod}`);
              return;
            }
            setChecking(false);
          }
        } catch {
          if (isMounted) {
            router.replace('/interview/0');
          }
        }
      }
    };

    guardCheck();

    return () => {
      isMounted = false;
    };
  }, [token, authLoading]);

  if (authLoading || checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.neutral.white }}>
        <ActivityIndicator size="large" color={Colors.primary.red} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary.red,
        tabBarInactiveTintColor: Colors.text.inactive,
        tabBarStyle: {
          backgroundColor: Colors.neutral.white,
          borderTopColor: Colors.neutral.border,
          borderTopWidth: 1,
        },
      }}>
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ size, color, focused }) => (
            <Layers size={size} color={focused ? Colors.primary.red : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Matches',
          tabBarIcon: ({ size, color }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
