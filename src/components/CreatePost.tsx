import React, { useState } from 'react';
import axios from 'axios';

interface FormData {
  username: string;
  text: string;
  image: File | null;
}

const CreatePost: React.FC = () => {
  const [form, setForm] = useState<FormData>({ username: '', text: '', image: null });
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('username', form.username);
    data.append('text', form.text);
    if (form.image) data.append('image', form.image);
    axios.post('http://localhost:8080/SPARTHAK01-SocialWallApp/posts', data).then(() => {
      setLoading(false);
      window.location.reload();
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" required onChange={(e) => setForm({...form, username: e.target.value})} />
      <textarea placeholder="Text" required onChange={(e) => setForm({...form, text: e.target.value})} />
      <input type="file" onChange={(e) => setForm({...form, image: e.target.files ? e.target.files[0] : null})} />
      <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post'}</button>
    </form>
  );
};

export default CreatePost;