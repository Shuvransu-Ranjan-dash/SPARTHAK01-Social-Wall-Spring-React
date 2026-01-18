import React from 'react';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Mini Social Wall</h1>
      <CreatePost />
      <PostList />
    </div>
  );
};

export default App;