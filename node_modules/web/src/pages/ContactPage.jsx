import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactPage = () => {
  const [message, setMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    // You will need to replace these with your EmailJS credentials
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', { message }, 'YOUR_PUBLIC_KEY')
      .then(() => alert("Message sent successfully!"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="p-8 text-white max-w-lg mx-auto bg-zinc-900 rounded-3xl border border-zinc-800">
      <h1 className="text-2xl font-bold mb-6">Help & Contact</h1>
      <form onSubmit={sendEmail} className="grid gap-4">
        <textarea 
          className="bg-black p-4 rounded-xl border border-zinc-700 w-full h-40"
          placeholder="Describe your concern here..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="bg-red-600 py-3 rounded-xl font-bold">Submit Complaint</button>
      </form>
    </div>
  );
};
export default ContactPage;