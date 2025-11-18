# 📱 Integrasi Mobile App - React Native & LynxJS

Halo developer! 👋 

Dokumen ini berisi contoh kode lengkap untuk mengintegrasikan chatbot API backend ini ke aplikasi mobile Anda, baik menggunakan **React Native** maupun **LynxJS**. 

Semua contoh kode sudah siap digunakan - tinggal copy, paste, dan sesuaikan dengan kebutuhan Anda! 🚀

## 🎯 Apa yang Akan Anda Dapatkan?

Di dokumen ini, Anda akan menemukan:
- ✅ Contoh kode lengkap React Native/Expo
- ✅ Contoh kode lengkap LynxJS
- ✅ API endpoints yang tersedia
- ✅ Cara integrasi dengan backend
- ✅ Tips dan best practices

## 📚 Quick Links

- **React Native Docs**: https://reactnative.dev/
- **Expo Docs**: https://expo.dev/
- **LynxJS GitHub**: https://github.com/lynx-js/lynx (jika menggunakan framework ini)
- **Backend API**: `http://localhost:3000/api` (development)

> 💡 **Tips**: Ganti `your-api-url` dengan URL backend Anda yang sebenarnya!

## React Native / Expo Example

```typescript
// ChatScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const API_URL = 'http://your-api-url:3000/api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const getHotelRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/chat/recommendations?limit=5`);
      const data = await response.json();
      
      const recommendationsText = data.recommendations
        .map((h: any) => `🏨 ${h.name} - ${h.location}${h.rating ? ` ⭐ ${h.rating}` : ''}`)
        .join('\n');
      
      const botMessage: Message = {
        id: Date.now().toString(),
        text: `Here are some hotel recommendations:\n\n${recommendationsText}`,
        isUser: false,
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Recommendations error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, item.isUser ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about hotels..."
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={sendMessage}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.recommendationsButton}
        onPress={getHotelRecommendations}
        disabled={loading}
      >
        <Text style={styles.recommendationsButtonText}>Get Recommendations</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  message: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 12,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  recommendationsButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  recommendationsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
```

## Lynx Framework Example

```typescript
// chat.lynx.ts
import { Component, State, Prop } from '@lynx-js/lynx';

@Component({
  template: `
    <view class="container">
      <scroll-view class="messages">
        <view 
          v-for="message in messages" 
          :key="message.id"
          :class="['message', message.isUser ? 'user' : 'bot']"
        >
          <text>{{ message.text }}</text>
        </view>
      </scroll-view>
      
      <view class="input-container">
        <input 
          v-model="inputText" 
          placeholder="Ask about hotels..."
          @submit="sendMessage"
        />
        <button @click="sendMessage" :disabled="loading">
          Send
        </button>
      </view>
      
      <button @click="getRecommendations" :disabled="loading">
        Get Hotel Recommendations
      </button>
    </view>
  `,
  styles: `
    .container { flex: 1; padding: 16px; }
    .messages { flex: 1; }
    .message { padding: 12px; margin: 4px 0; border-radius: 8px; }
    .user { background: #007AFF; align-self: flex-end; }
    .bot { background: #E5E5EA; align-self: flex-start; }
    .input-container { flex-direction: row; margin-top: 8px; }
    input { flex: 1; border: 1px solid #ddd; padding: 12px; }
    button { background: #007AFF; color: white; padding: 12px; }
  `
})
export class ChatScreen {
  @State() messages: Array<{ id: string; text: string; isUser: boolean }> = [];
  @State() inputText: string = '';
  @State() loading: boolean = false;
  
  private API_URL = 'http://your-api-url:3000/api';

  async sendMessage() {
    if (!this.inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: this.inputText,
      isUser: true,
    };

    this.messages.push(userMessage);
    const messageText = this.inputText;
    this.inputText = '';
    this.loading = true;

    try {
      const response = await fetch(`${this.API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await response.json();
      
      this.messages.push({
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
      });
    } catch (error) {
      console.error('Chat error:', error);
      this.messages.push({
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
      });
    } finally {
      this.loading = false;
    }
  }

  async getRecommendations() {
    this.loading = true;
    try {
      const response = await fetch(`${this.API_URL}/chat/recommendations?limit=5`);
      const data = await response.json();
      
      const recommendationsText = data.recommendations
        .map((h: any) => `🏨 ${h.name} - ${h.location}${h.rating ? ` ⭐ ${h.rating}` : ''}`)
        .join('\n');
      
      this.messages.push({
        id: Date.now().toString(),
        text: `Here are some hotel recommendations:\n\n${recommendationsText}`,
        isUser: false,
      });
    } catch (error) {
      console.error('Recommendations error:', error);
    } finally {
      this.loading = false;
    }
  }
}
```

## API Endpoints for Mobile App

### Chat Endpoint
```
POST /api/chat
Body: { "message": "Recommend a hotel" }
Response: { "response": "...", "conversationId": "..." }
```

### Recommendations Endpoint
```
GET /api/chat/recommendations?location=Paris&limit=5
Response: { "recommendations": [...] }
```

### Posts Endpoint (for displaying published content)
```
GET /api/posts
Response: [{ "id": "...", "title": "...", "content": "...", "imageUrl": "...", "hotel": {...} }]
```

## Notes

- Replace `your-api-url` with your actual backend URL
- For production, use HTTPS
- Consider adding authentication if needed
- Handle network errors gracefully
- Add loading states and error handling

