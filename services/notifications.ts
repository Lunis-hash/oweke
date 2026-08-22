export async function registerForPushNotificationsAsync(): Promise<string | null> {
  try {
    return null;
  } catch (e) {
    return null;
  }
}

export async function scheduleLocalNotification(title: string, body: string) {
  console.log('Notification scheduled:', title, body);
}
