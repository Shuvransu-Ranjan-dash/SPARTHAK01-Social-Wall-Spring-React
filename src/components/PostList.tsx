import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostItem from './PostItem';

interface Post {
  id: number;
  username: string;
  text: string;
  imageUrl?: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

 useEffect(() => {
  console.log('Fetching from: http://localhost:8080/SPARTHAK01-SocialWallApp/posts');
  axios.get<Post[]>('http://localhost:8080/SPARTHAK01-SocialWallApp/posts')
    .then(res => {
      console.log('Response:', res.data);
      setPosts(res.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
      setLoading(false);
    });
}, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="feed">
      {posts.map(post => <PostItem key={post.id} post={post} />)}
    </div>
  );
};

export default PostList;