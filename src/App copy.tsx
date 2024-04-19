import React, { useState, useEffect } from 'react';
import AppNature from './template_nature/AppNature';
import axios from 'axios';

interface Message {
  id: number;
  title: string;
  body: string;
}

interface NewMessage {
  id: number;
  name: string;
  message: string;
}

interface MessageFormProps {
  addMessage: (message: NewMessage) => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ addMessage }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !message) {
      alert('Please fill in both name and message.');
      return;
    }

    try {
      const response = await axios.post<Message>('https://jsonplaceholder.typicode.com/posts', {
        title: name,
        body: message,
        userId: 1,
      });

      const newMessage: NewMessage = {
        id: response.data.id,
        name,
        message,
      };

      addMessage(newMessage);
      setName('');
      setMessage('');
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Your Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Message:
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      <button type="submit">Send Message</button>
    </form>
  );
};

interface MessageListProps {
  messages: NewMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <ul>
      {messages.map((message) => (
        <li key={message.id}>
          <strong>{message.name}:</strong> {message.message}
        </li>
      ))}
    </ul>
  );
};

const App: React.FC = () => {
  const uri = process.env.REACT_APP_PUBLIC_URL;
  const [messages, setMessages] = useState<NewMessage[]>([]);

  useEffect(() => {
    // Fetch initial messages from the dummy API
    const fetchMessages = async () => {
      try {
        const response = await axios.get<Message[]>('https://jsonplaceholder.typicode.com/posts?userId=1');
        setMessages(response.data.map((post) => ({ id: post.id, name: post.title, message: post.body })));
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const addMessage = (newMessage: NewMessage) => {
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="App">
      <AppNature />
      <div>
        <h1>Marriage Messages</h1>
        <MessageForm addMessage={addMessage} />
        <MessageList messages={messages} />
      </div>
    </div>
  );
};

export default App;
