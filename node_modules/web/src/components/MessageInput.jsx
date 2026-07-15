import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

const MessageInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="min-h-[60px] max-h-[120px] resize-none"
        disabled={disabled}
      />
      <Button type="submit" size="icon" className="h-[60px] w-[60px]" disabled={disabled || !message.trim()}>
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
};

export default MessageInput;