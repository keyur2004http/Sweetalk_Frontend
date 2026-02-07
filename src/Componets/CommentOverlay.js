import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { addComment,getPostComments } from '../Service/api';

const CommentOverlay = ({ postId, show, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
  const fetchComments = async () => {
    if (!postId) return;
    try {
      const data = await getPostComments(postId);
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchComments();
}, [postId, show]);

const handleCommentSubmit = async () => {
  if (!newComment.trim()) return;

  try {
    const userId = localStorage.getItem("userId");
    await addComment(postId, userId, newComment);
    setNewComment("");
    const updated = await getPostComments(postId);
    setComments(updated);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map((comment, idx) => (
          <div key={idx} className="mb-2 border-bottom pb-2">
            <b>@{comment.user.username}</b>: {comment.content}
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer className="d-flex flex-column gap-2">
        <Form.Control
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button variant="primary" onClick={handleCommentSubmit}>
          Post Comment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default CommentOverlay;
