import client from './api';

export async function startVideoCall(journeyId: string) {
  try {
    const res = await client.post('/video/call-token', { journeyId });
    return res.data;
  } catch (error) {
    console.error('Failed to start video call', error);
    throw error;
  }
}

export async function endVideoCall(callId: string, durationOrReason?: number | string) {
  try {
    const res = await client.post('/video/end', { callId, durationOrReason });
    return res.data;
  } catch (error) {
    console.error('Failed to end video call', error);
    throw error;
  }
}

export async function getSession(sessionId: string) {
  try {
    const res = await client.get(`/video/session/${sessionId}`);
    return res.data;
  } catch (error) {
    return { id: sessionId, token: 'mock-token' };
  }
}

export async function joinVideoSession(sessionId: string) {
  try {
    const res = await client.post(`/video/join/${sessionId}`);
    return res.data;
  } catch (error) {
    return { token: 'mock-token' };
  }
}

export const VideoService = {
  startVideoCall,
  endVideoCall,
  end: endVideoCall,
  getCallToken: startVideoCall,
  getSession,
  join: joinVideoSession,
};

export default VideoService;
