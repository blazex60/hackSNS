import styles from './PostCard.module.css';
import Image from 'next/image';

interface PostCardProps {
  displayName: string;
  username: string;
  content: string;
  timestamp: string;
  likes?: number;
  comments?: number;
  imageUrl?: string;
}

export default function PostCard({
  displayName,
  username,
  content,
  timestamp,
  likes = 0,
  comments = 0,
  imageUrl,
}: PostCardProps) {
  return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        <div className={styles.avatar}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className={styles.userInfo}>
          <p className={styles.displayName}>{displayName}</p>
          <p className={styles.username}>@{username}</p>
        </div>
        <span className={styles.timestamp}>{timestamp}</span>
      </div>

      <div className={styles.postContent}>{content}</div>

      {imageUrl && (
        <Image
          src={imageUrl}
          alt="投稿画像"
          className={styles.postImage}
          width={600}
          height={400}
          style={{ objectFit: 'cover' }}
        />
      )}

      <div className={styles.postActions}>
        <button className={styles.actionButton}>
          <span>💬</span>
          <span>{comments}</span>
        </button>
        <button className={styles.actionButton}>
          <span>❤️</span>
          <span>{likes}</span>
        </button>
        <button className={styles.actionButton}>
          <span>🔄</span>
        </button>
        <button className={styles.actionButton}>
          <span>📤</span>
        </button>
      </div>
    </div>
  );
}
