import React, { useState } from 'react';
import axios from 'axios';
import CommentModal from './CommentModal';

interface Post {
  id: number;
  username: string;
  text: string;
  imageUrl?: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
}

interface PostItemProps {
  post: Post;
}

const BASE_URL = 'http://localhost:8080/SPARTHAK01-SocialWallApp';

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [likes, setLikes] = useState<number>(post.likes);
  const [commentsCount, setCommentsCount] = useState<number>(post.commentsCount);

  // ✅ Handle Like Button
  const handleLike = async (): Promise<void> => {
    try {
      await axios.post(`${BASE_URL}/posts/${post.id}/like`);
      setLikes(prev => prev + 1);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  return (
    <div className="post" style={{ border: '1px solid #ccc', padding: '12px', marginBottom: '12px', borderRadius: '8px' }}>
      <h3>{post.username}</h3>
      <p>{post.text}</p>

      {post.imageUrl && (
        <img
          src={`${BASE_URL}${post.imageUrl}`}
          alt="Post"
          style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '6px', marginTop: '8px' }}
        />
      )}

      <p style={{ marginTop: '8px' }}>
        Likes: {likes} | Comments: {commentsCount}
      </p>

      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button onClick={handleLike}>Like</button>

        {/* ✅ Pass callback to update comment count */}
        <CommentModal
          postId={post.id}
          onCommentAdded={() => setCommentsCount(prev => prev + 1)}
        />
      </div>
    </div>
  );
};

export default PostItem;
