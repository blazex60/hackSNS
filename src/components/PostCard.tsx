import Image from 'next/image';
import styles from './PostCard.module.css';

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
    <article className={styles.postCard}>
      {/* ヘッダー */}
      <div className={styles.postHeader}>
        <div className={styles.userInfo}>
          <div className={styles.avatarRing}>
            <div className={styles.avatar}>
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>
          <span className={styles.username}>{username}</span>
        </div>
        <button className={styles.moreButton} aria-label="その他">
          <Image src="/icon-more.svg" alt="その他" width={20} height={20} />
        </button>
      </div>

      {/* 画像 */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="投稿画像"
          className={styles.postImage}
          width={600}
          height={600}
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <div className={styles.postImagePlaceholder} />
      )}

      {/* フッター */}
      <div className={styles.postFooter}>
        <div className={styles.actionButtons}>
          <div className={styles.leftActions}>
            <button className={styles.actionButton} aria-label="いいね">
              <Image src="/icon-heart.svg" alt="いいね" width={24} height={24} />
            </button>
            <button className={styles.actionButton} aria-label="コメント">
              <Image src="/icon-comment.svg" alt="コメント" width={24} height={24} />
            </button>
            <button className={styles.actionButton} aria-label="シェア">
              <Image src="/icon-share.svg" alt="シェア" width={24} height={24} />
            </button>
          </div>
          <button className={styles.actionButton} aria-label="保存">
            <Image src="/icon-bookmark.svg" alt="保存" width={24} height={24} />
          </button>
        </div>

        <span className={styles.likes}>{likes.toLocaleString()} likes</span>

        <div className={styles.caption}>
          <span className={styles.captionUser}>{username}</span>
          {content}
        </div>

        {comments > 0 && (
          <button className={styles.commentsLink}>
            {comments}件のコメントをすべて見る
          </button>
        )}

        <time className={styles.time}>{timestamp}</time>
      </div>
    </article>
  );
}
