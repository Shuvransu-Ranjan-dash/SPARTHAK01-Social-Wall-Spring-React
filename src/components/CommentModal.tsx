import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Comment {
  id: number;
  postId: number;
  username: string;
  comment: string;
  createdAt: string;
}

interface NewComment {
  username: string;
  comment: string;
}

interface CommentModalProps {
  postId: number;
  onCommentAdded: () => void; // ✅ REQUIRED
}

const BASE_URL = 'http://localhost:8080/SPARTHAK01-SocialWallApp';

const CommentModal: React.FC<CommentModalProps> = ({
  postId,
  onCommentAdded, // ✅ DESTRUCTURED
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<NewComment>({
    username: '',
    comment: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch comments when modal opens
  useEffect(() => {
    if (showModal) {
      axios
        .get<Comment[]>(`${BASE_URL}/posts/${postId}/comments`)
        .then(res => setComments(res.data))
        .catch(err => console.error('Fetch comments error:', err));
    }
  }, [showModal, postId]);

  // ✅ Add comment
  const handleAddComment = async (): Promise<void> => {
    if (!newComment.username || !newComment.comment) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/posts/${postId}/comments`,
        newComment,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // ✅ Update modal comments list
      setComments(prev => [...prev, response.data]);

      // ✅ UPDATE COMMENT COUNT IN POST ITEM
      onCommentAdded();

      setNewComment({ username: '', comment: '' });
    } catch (error: any) {
      console.error(
        'Add comment error:',
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>View Comments</button>

      {showModal && (
        <div className="modal">
          <button onClick={() => setShowModal(false)}>Close</button>

          <div>
            {comments.map(c => (
              <p key={c.id}>
                <strong>{c.username}</strong>: {c.comment}
              </p>
            ))}
          </div>

          <input
            placeholder="Username"
            value={newComment.username}
            onChange={e =>
              setNewComment({ ...newComment, username: e.target.value })
            }
          />

          <input
            placeholder="Comment"
            value={newComment.comment}
            onChange={e =>
              setNewComment({ ...newComment, comment: e.target.value })
            }
          />

          <button onClick={handleAddComment} disabled={loading}>
            {loading ? 'Adding...' : 'Add Comment'}
          </button>
        </div>
      )}
    </>
  );
};

export default CommentModal;
