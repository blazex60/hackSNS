import Link from "next/link";
import styles from "./feed.module.css";

const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
const storyColors = [...Array(8)].map(() => randomColor());
const suggestionColors = [...Array(5)].map(() => randomColor());

export default function FeedPage() {
  const suggestions = [
    { name: "kenoere", reason: "Followed by heych2002 + 7 more" },
    { name: "lofti232", reason: "Followed by kenoere + 12 more" },
    { name: "sapphireblues_19", reason: "Followed by lofti232 + 3 more" },
    { name: "gwangurl77", reason: "Followed by lofti232 + 19 more" },
    { name: "amesthyst_grl", reason: "Followed by dark_emeralds" },
  ];

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.navBar}>
        <div className={styles.navContent}>
          <div className={styles.logo}>nyanstagram</div>
          
          <div className={styles.searchBar}>
            <span className={styles.icon} style={{fontSize: '14px', marginRight: '8px', color: '#8e8e8e'}}>🔍</span>
            <span className={styles.searchText}>Search</span>
          </div>

          <div className={styles.navIcons}>
            <Link href="/feed" className={styles.icon}>🏠</Link>
            <div className={styles.icon}>💬</div>
            <div className={styles.icon}>➕</div>
            <div className={styles.icon}>🧭</div>
            <div className={styles.icon}>❤️</div>
            <Link href="/profile">
               <div className={styles.navAvatar}>
                 <div className={styles.navAvatarImg} style={{backgroundColor: '#e1306c'}}></div>
               </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Left Column - Feed */}
        <div className={styles.leftCol}>
          {/* Stories */}
          <div className={styles.storiesBox}>
            <div className={styles.storiesList}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={styles.storyItem}>
                  <div className={styles.storyAvatarBorder}>
                    <div className={styles.storyAvatar} style={{backgroundColor: storyColors[i]}}></div>
                  </div>
                  <span className={styles.storyName}>user_{i+1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Posts */}
          <article className={styles.post}>
            <div className={styles.postHeader}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar} style={{backgroundColor: '#a65c2e'}}></div>
                <span className={styles.userName}>amethyst_grl</span>
              </div>
              <div className={styles.moreIcon}>•••</div>
            </div>
            
            {/* Using a solid color or gradient to simulate the image */}
            <div className={styles.postImage} style={{ 
               height: '600px', 
               background: 'no-repeat center/cover url("https://images.unsplash.com/photo-1546519638-68e109498ee2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80")' 
            }}></div>
            
            <div className={styles.postFooter}>
              <div className={styles.actionButtons}>
                <div className={styles.leftActions}>
                  <div className={styles.actionIcon}>❤️</div>
                  <div className={styles.actionIcon}>💬</div>
                  <div className={styles.actionIcon}>✈️</div>
                </div>
                <div className={styles.actionIcon}>🔖</div>
              </div>
              
              <span className={styles.likes}>262,463 likes</span>
              
              <div className={styles.caption}>
                <span className={styles.captionUser}>amethyst_grl</span>
                Learning new basketball tricks! 🏀 #sports #fun
              </div>
              
              <div className={styles.commentsLink}>View all 1,200 comments</div>
              <time className={styles.time}>2 HOURS AGO</time>
            </div>
          </article>

          <article className={styles.post}>
            <div className={styles.postHeader}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar} style={{backgroundColor: '#b3e5fc'}}></div>
                <span className={styles.userName}>natgeo</span>
              </div>
              <div className={styles.moreIcon}>•••</div>
            </div>
            
            <div className={styles.postImage} style={{ 
              height: '500px',
              background: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)' 
            }}></div>
            
            <div className={styles.postFooter}>
              <div className={styles.actionButtons}>
                <div className={styles.leftActions}>
                  <div className={styles.actionIcon}>❤️</div>
                  <div className={styles.actionIcon}>💬</div>
                  <div className={styles.actionIcon}>✈️</div>
                </div>
                <div className={styles.actionIcon}>🔖</div>
              </div>
              
              <span className={styles.likes}>52,901 likes</span>
              
              <div className={styles.caption}>
                <span className={styles.captionUser}>natgeo</span>
                Exploring the depths of the ocean...
              </div>
               <div className={styles.commentsLink}>View all 320 comments</div>
              <time className={styles.time}>5 HOURS AGO</time>
            </div>
          </article>
        </div>

        {/* Right Column - Sidebar */}
        <div className={styles.rightCol}>
          <div className={styles.sidebarSection}>
            <div className={styles.currentUser}>
               <div className={styles.currentAvatar} style={{backgroundColor: '#e1306c'}}></div>
               <div className={styles.currentInfo}>
                 <span className={styles.currentUsername}>eloears</span>
                 <span className={styles.currentName}>eloears</span>
               </div>
               <button className={styles.switchLink}>Switch</button>
            </div>

            <div className={styles.suggestionsHeader}>
              <span className={styles.suggestionsTitle}>Suggestions For You</span>
              <span className={styles.seeAll}>See All</span>
            </div>

            <div className={styles.suggestionsList}>
              {suggestions.map((user, i) => (
                <div key={i} className={styles.suggestionItem}>
                   <div className={styles.userInfo}>
                      <div className={styles.suggAvatar} style={{backgroundColor: suggestionColors[i]}}></div>
                      <div className={styles.suggInfo}>
                        <span className={styles.suggUsername}>{user.name}</span>
                        <span className={styles.suggReason}>{user.reason}</span>
                      </div>
                   </div>
                   <button className={styles.followLink}>Follow</button>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.footerLinks}>
                <a href="#" className={styles.footerLink}>About</a> • 
                <a href="#" className={styles.footerLink}>Help</a> • 
                <a href="#" className={styles.footerLink}>Press</a> • 
                <a href="#" className={styles.footerLink}>API</a> • 
                <a href="#" className={styles.footerLink}>Jobs</a> • 
                <a href="#" className={styles.footerLink}>Privacy</a> • 
                <a href="#" className={styles.footerLink}>Terms</a> • 
                <a href="#" className={styles.footerLink}>Locations</a> • 
                <a href="#" className={styles.footerLink}>Top Accounts</a> • 
                <a href="#" className={styles.footerLink}>Hashtags</a> • 
                <a href="#" className={styles.footerLink}>Language</a>
              </div>
              <div className={styles.copyright}>© 2026 NYANSTAGRAM FROM TAMA</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
