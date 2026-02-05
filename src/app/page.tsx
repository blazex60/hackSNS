import Link from 'next/link';

export default function LandingPage() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>サービスへようこそ</h1>
      <p>ここはランディングページです。</p>
      
      <div style={{ marginTop: '20px' }}>
        <Link href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
          ログインはこちら
        </Link>
      </div>
    </main>
  );
}