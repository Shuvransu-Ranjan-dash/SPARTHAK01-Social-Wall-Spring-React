import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Post {
  id: number;
  username: string;
  text: string;
  imageUrl?: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
}

interface Comment {
  id: number;
  postId: number;
  username: string;
  comment: string;
  createdAt: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      axios.get<Post>(`http://localhost:8080/SPARTHAK01-SocialWallApp/posts/${id}`)
        .then(res => setPost(res.data))
        .catch(console.error);
      axios.get<Comment[]>(`http://localhost:8080/SPARTHAK01-SocialWallApp/posts/${id}/comments`)
        .then(res => setComments(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="post-detail">
      <div className="post">
        <h3>{post.username}</h3>
        <p>{post.text}</p>
        {post.imageUrl && <img src={`http://localhost:8080/SPARTHAK01-SocialWallApp${post.imageUrl}`} alt="Post" />}
        <p>Likes: {post.likes}</p>
      </div>
      <div className="comments">
        <h4>Comments</h4>
        {comments.map(c => <p key={c.id}>{c.username}: {c.comment}</p>)}
      </div>
    </div>
  );
};

export default PostDetail;