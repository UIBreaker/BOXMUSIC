import type { Song, Playlist, Artist, GenreCategory, AccentTheme } from '../types/music';

// Theme Accent Palettes
export const ACCENT_THEMES: AccentTheme[] = [
  { id: 'emerald', name: 'Neon Emerald', color: '#10B981', glow: 'rgba(16, 185, 129, 0.4)', tailwind: 'emerald-500' },
  { id: 'cyan', name: 'Electric Cyan', color: '#06B6D4', glow: 'rgba(6, 182, 212, 0.4)', tailwind: 'cyan-500' },
  { id: 'purple', name: 'Cyber Purple', color: '#A855F7', glow: 'rgba(168, 85, 247, 0.4)', tailwind: 'purple-500' },
  { id: 'rose', name: 'Sunset Rose', color: '#F43F5E', glow: 'rgba(244, 63, 94, 0.4)', tailwind: 'rose-500' },
  { id: 'amber', name: 'Golden Amber', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)', tailwind: 'amber-500' },
];

// Mock Songs with real playable royalty-free stream audio URLs and timed lyrics
export const MOCK_SONGS: Song[] = [
  {
    id: 's1',
    title: 'Cắt Đôi Nỗi Sầu',
    artist: 'Tăng Duy Tân',
    artistId: 'a1',
    album: 'Cắt Đôi Nỗi Sầu (Single)',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    duration: 184,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'V-Pop',
    mood: ['Chill & Thư giãn', 'V-Pop', 'Năng lượng Gym'],
    isLiked: true,
    plays: 1245000,
    releaseYear: 2023,
    accentColor: '#10B981',
    lyrics: [
      { time: 0, text: '♪ Giai điệu mở đầu dịu êm ♪' },
      { time: 6, text: 'Cắt đôi nỗi sầu anh buông tay' },
      { time: 10, text: 'Gói ghém ký ức vào trong mây' },
      { time: 15, text: 'Từng ngày tháng trôi qua thật nhanh' },
      { time: 20, text: 'Vết thương ấy nay đã dần lành' },
      { time: 26, text: 'Anh gom hết bao nhiêu nụ cười xưa' },
      { time: 31, text: 'Gửi vào gió mang đi trong cơn mưa' },
      { time: 37, text: 'Không còn đau, không còn vương vấn nữa' },
      { time: 43, text: 'Tự ôm lấy chính mình giữa đêm đông lạnh' },
      { time: 50, text: 'Cắt đôi nỗi sầu em ơi ta xa nhau rồi' },
      { time: 56, text: 'Đoạn đường phía trước nay chia đôi lối' },
      { time: 62, text: 'Chúc em bình yên bên ai đắm say' },
      { time: 68, text: 'Dẫu trong lòng còn ngàn nỗi nhớ đong đầy' },
      { time: 78, text: '♪ Drop & Giai điệu sôi động ♪' },
      { time: 95, text: 'Bao đêm trôi qua tự hỏi lòng' },
      { time: 102, text: 'Có phải tình ta đã hóa hư không' },
      { time: 110, text: 'Nhưng thời gian sẽ xóa nhòa tất cả' },
      { time: 118, text: 'Để lại những bài học vô giá' },
      { time: 125, text: 'Cắt đôi nỗi sầu anh bước tiếp thôi!' }
    ]
  },
  {
    id: 's2',
    title: 'Waiting For You',
    artist: 'MONO & Onionn',
    artistId: 'a2',
    album: '22',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    duration: 265,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'V-Pop',
    mood: ['V-Pop', 'Năng lượng Gym', 'Chill & Thư giãn'],
    isLiked: true,
    plays: 3890200,
    releaseYear: 2022,
    accentColor: '#A855F7',
    lyrics: [
      { time: 0, text: '♪ Intro Synthwave cực bắt tai ♪' },
      { time: 8, text: 'Bao nhiêu lâu ta không gặp nhau' },
      { time: 13, text: 'Bao nhiêu lâu ta không thấy nhau' },
      { time: 18, text: 'Em nay đi đâu về đâu hỡi người' },
      { time: 24, text: 'Lòng anh vẫn luôn ngóng chờ nụ cười' },
      { time: 30, text: 'Biết em giờ đây đã có ai chưa?' },
      { time: 36, text: 'Có cùng ai đi dưới cơn mưa chiều?' },
      { time: 42, text: 'Anh một mình góc phố thân quen' },
      { time: 48, text: 'Nhìn ánh đèn mờ ảo từng đêm' },
      { time: 54, text: 'Waiting for you... I am waiting for you baby!' },
      { time: 62, text: 'Chờ một ngày em quay trở lại nơi đây' },
      { time: 70, text: 'Dẫu cho tháng năm có hao gầy' },
      { time: 78, text: 'Tình anh vẫn trao em đong đầy' }
    ]
  },
  {
    id: 's3',
    title: 'Nàng Thơ',
    artist: 'Hoàng Dũng',
    artistId: 'a3',
    album: '25',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    duration: 254,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'Indie Việt',
    mood: ['Indie Việt', 'Chill & Thư giãn', 'Lo-fi Vibe'],
    isLiked: false,
    plays: 2150000,
    releaseYear: 2020,
    accentColor: '#F59E0B',
    lyrics: [
      { time: 0, text: '♪ Tiếng Guitar mộc mạc da diết ♪' },
      { time: 10, text: 'Em ngày nào còn là nàng thơ' },
      { time: 16, text: 'Ngồi bên hiên đón nắng mong chờ' },
      { time: 22, text: 'Tà áo trắng bay trong gió chiều' },
      { time: 28, text: 'Làm tim anh lỡ nhịp thương yêu' },
      { time: 36, text: 'Ta bước bên nhau qua những mùa hoa' },
      { time: 44, text: 'Tưởng chừng tình này chẳng thể phôi pha' },
      { time: 52, text: 'Nhưng thời gian cuốn trôi tất cả' },
      { time: 60, text: 'Để lại trong tim một giấc mơ xa...' },
      { time: 70, text: 'Nàng thơ của anh giờ ở nơi đâu?' }
    ]
  },
  {
    id: 's4',
    title: 'Golden Hour (Lofi Vibe)',
    artist: 'JVKE',
    artistId: 'a4',
    album: 'This Is What Falling In Love Feels Like',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
    duration: 209,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Pop',
    mood: ['Chill & Thư giãn', 'Lo-fi Vibe', 'Tập trung làm việc'],
    isLiked: true,
    plays: 5410000,
    releaseYear: 2022,
    accentColor: '#F59E0B',
    lyrics: [
      { time: 0, text: '♪ Piano intro melody ♪' },
      { time: 6, text: 'It was just two lovers' },
      { time: 11, text: 'Sittin in the car, listenin to Blonde' },
      { time: 16, text: 'Fallin for each other' },
      { time: 21, text: 'Pink and orange skies, feelin super alive' },
      { time: 27, text: 'Your eyes, they shine like glowing stars' },
      { time: 33, text: 'You take my breath away every time' },
      { time: 40, text: 'She\'s got glitter for skin' },
      { time: 46, text: 'My radiant beam in the night' },
      { time: 52, text: 'I don\'t need no light to see you' },
      { time: 58, text: 'Shine... in the golden hour!' }
    ]
  },
  {
    id: 's5',
    title: 'Starboy (Synthwave Remix)',
    artist: 'The Weeknd & Daft Punk',
    artistId: 'a5',
    album: 'Starboy',
    coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?q=80&w=800&auto=format&fit=crop',
    duration: 230,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    genre: 'R&B / Soul',
    mood: ['Năng lượng Gym', 'Chill & Thư giãn'],
    isLiked: true,
    plays: 9800000,
    releaseYear: 2016,
    accentColor: '#06B6D4',
    lyrics: [
      { time: 0, text: '♪ Bassline synth kick-in ♪' },
      { time: 7, text: 'I\'m tryna put you in the worst mood, ah' },
      { time: 12, text: 'P1 cleaner than your church shoes, ah' },
      { time: 17, text: 'Milli point two just to hurt you, ah' },
      { time: 22, text: 'All red Lamb\' just to tease you, ah' },
      { time: 27, text: 'None of these toys on lease too, ah' },
      { time: 32, text: 'Made your whole year in a week too, yah' },
      { time: 38, text: 'Look what you\'ve done!' },
      { time: 43, text: 'I\'m a motherf***in\' starboy!' }
    ]
  },
  {
    id: 's6',
    title: 'Bật Tình Yêu Lên',
    artist: 'Tăng Duy Tân & Hòa Minzy',
    artistId: 'a1',
    album: 'Bật Tình Yêu Lên (Single)',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop',
    duration: 215,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    genre: 'V-Pop',
    mood: ['V-Pop', 'Chill & Thư giãn', 'Năng lượng Gym'],
    isLiked: true,
    plays: 4120000,
    releaseYear: 2023,
    accentColor: '#F43F5E',
    lyrics: [
      { time: 0, text: '♪ Giai điệu tình yêu rộn ràng ♪' },
      { time: 8, text: 'Rót mật ngọt vào tai anh đi' },
      { time: 13, text: 'Nói những lời dịu dàng mê ly' },
      { time: 18, text: 'Bật tình yêu lên cho màn đêm bừng sáng' },
      { time: 24, text: 'Để con tim ta chung một nhịp rộn ràng' },
      { time: 31, text: 'Từng ánh mắt đắm đuối trao nhau' },
      { time: 37, text: 'Quên đi hết thế giới muôn màu' },
      { time: 44, text: 'Chỉ cần hai đứa ta ở cạnh bên' },
      { time: 50, text: 'Đêm nay thắp sáng muôn vì sao êm đềm' }
    ]
  },
  {
    id: 's7',
    title: 'Midnight Lo-Fi Code',
    artist: 'BOX Chillout Lab',
    artistId: 'a6',
    album: 'Deep Focus & Flow',
    coverUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=800&auto=format&fit=crop',
    duration: 198,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    genre: 'Lo-fi & Chill',
    mood: ['Tập trung làm việc', 'Lo-fi Vibe', 'Chill & Thư giãn'],
    isLiked: true,
    plays: 870000,
    releaseYear: 2024,
    accentColor: '#10B981',
    lyrics: [
      { time: 0, text: '♪ Tiếng mưa rơi tí tách ngoài hiên cửa ♪' },
      { time: 15, text: '♪ Tiếng bàn phím gõ êm tai trong đêm muộn ♪' },
      { time: 35, text: '♪ Không gian tĩnh lặng giúp tâm trí tập trung tối đa ♪' },
      { time: 60, text: '♪ Giai điệu mượt mà đưa bạn vào trạng thái Flow ♪' },
      { time: 100, text: '♪ Uống một ngụm trà ấm và tận hưởng khoảnh khắc này ♪' }
    ]
  },
  {
    id: 's8',
    title: 'Lạ Lùng',
    artist: 'Vũ.',
    artistId: 'a7',
    album: 'Hành Tinh Song Song',
    coverUrl: 'https://images.unsplash.com/photo-1445985543469-723388755955?q=80&w=800&auto=format&fit=crop',
    duration: 260,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    genre: 'Indie Việt',
    mood: ['Indie Việt', 'Chill & Thư giãn', 'Lo-fi Vibe'],
    isLiked: false,
    plays: 3540000,
    releaseYear: 2017,
    accentColor: '#3B82F6',
    lyrics: [
      { time: 0, text: '♪ Giai điệu Acoustic ấm áp ♪' },
      { time: 12, text: 'Kìa cơn mưa rào rơi nhẹ góc phố xưa' },
      { time: 20, text: 'Chờ em nơi hẹn ta từng ghé qua' },
      { time: 28, text: 'Biết bao nhiêu điều chưa kịp nói cùng em' },
      { time: 36, text: 'Gửi vào trong gió hòa vào màn đêm...' },
      { time: 48, text: 'Lạ lùng thay em tới mang theo ánh nắng mai' },
      { time: 58, text: 'Sưởi ấm cõi lòng đang hoang hoải thở dài' }
    ]
  }
];

// Featured Curated Playlists
export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    title: 'Daily Mix 1: V-Pop Gây Nghiện',
    description: 'Tuyển tập những bản hit V-Pop thịnh hành nhất dành riêng cho bạn mỗi ngày.',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    gradient: 'from-emerald-600 via-teal-900 to-slate-950',
    trackCount: 18,
    songIds: ['s1', 's2', 's6', 's3', 's8'],
    author: 'BOXMUSIC AI',
    updatedAt: 'Hôm nay'
  },
  {
    id: 'p2',
    title: 'Daily Mix 2: Indie & Acoustic Chill',
    description: 'Giai điệu mộc mạc lắng đọng cho buổi chiều ngắm hoàng hôn.',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    gradient: 'from-amber-600 via-orange-950 to-slate-950',
    trackCount: 24,
    songIds: ['s3', 's8', 's4', 's1'],
    author: 'BOXMUSIC AI',
    updatedAt: 'Hôm qua'
  },
  {
    id: 'p3',
    title: 'Deep Focus & Code Flow',
    description: 'Âm thanh Lo-fi không lời tăng cường 200% khả năng tập trung làm việc.',
    coverUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=800&auto=format&fit=crop',
    gradient: 'from-cyan-600 via-blue-950 to-slate-950',
    trackCount: 40,
    songIds: ['s7', 's4', 's5'],
    author: 'BOX Chillout Lab',
    updatedAt: '2 ngày trước'
  },
  {
    id: 'p4',
    title: 'Night Drive Synthwave & EDM',
    description: 'Năng lượng bùng nổ cho những chuyến xe đêm lướt gió.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    gradient: 'from-purple-600 via-fuchsia-950 to-slate-950',
    trackCount: 30,
    songIds: ['s2', 's5', 's1'],
    author: 'BOX Beats',
    updatedAt: '3 ngày trước'
  },
  {
    id: 'p5',
    title: 'Top 50 Việt Nam Hôm Nay',
    description: 'Bảng xếp hạng bài hát được nghe nhiều nhất tuần này tại Việt Nam.',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop',
    gradient: 'from-rose-600 via-red-950 to-slate-950',
    trackCount: 50,
    songIds: ['s1', 's2', 's6', 's3', 's4', 's5', 's7', 's8'],
    author: 'BOX Charts',
    updatedAt: 'Mới cập nhật'
  }
];

// Mock Artists
export const MOCK_ARTISTS: Artist[] = [
  {
    id: 'a1',
    name: 'Tăng Duy Tân',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    monthlyListeners: '2.4M',
    followers: '1.2M',
    bio: 'Chàng nhạc sĩ / ca sĩ triệu view với các bản hit mang giai điệu ma mị độc đáo như Bên Trên Tầng Lầu, Cắt Đôi Nỗi Sầu, Bật Tình Yêu Lên.',
    genre: 'V-Pop / Dance Pop',
    isVerified: true,
    topTrackIds: ['s1', 's6']
  },
  {
    id: 'a2',
    name: 'MONO',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    monthlyListeners: '3.1M',
    followers: '1.8M',
    bio: 'Nghệ sĩ trẻ đa tài khuấy đảo làn sóng âm nhạc thế hệ mới với phong cách trình diễn cuốn hút và album 22 đỉnh cao.',
    genre: 'V-Pop / R&B',
    isVerified: true,
    topTrackIds: ['s2']
  },
  {
    id: 'a3',
    name: 'Hoàng Dũng',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    monthlyListeners: '1.8M',
    followers: '950K',
    bio: 'Chàng "Hoàng tử tình ca" của âm nhạc Việt với giọng hát truyền cảm sâu lắng và những ca khúc bất hủ như Nàng Thơ, Yếu Đuối.',
    genre: 'Indie Pop / Ballad',
    isVerified: true,
    topTrackIds: ['s3']
  },
  {
    id: 'a4',
    name: 'JVKE',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop',
    monthlyListeners: '18.5M',
    followers: '6.2M',
    bio: 'Hiện tượng âm nhạc toàn cầu với ca khúc đình đám Golden Hour đứng đầu bảng xếp hạng Billboard.',
    genre: 'Pop / Indie Pop',
    isVerified: true,
    topTrackIds: ['s4']
  },
  {
    id: 'a5',
    name: 'The Weeknd',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?q=80&w=1200&auto=format&fit=crop',
    monthlyListeners: '110M',
    followers: '45M',
    bio: 'Biểu tượng R&B đương đại và Synthwave hàng đầu thế giới với hàng loạt giải Grammy danh giá.',
    genre: 'R&B / Synthpop',
    isVerified: true,
    topTrackIds: ['s5']
  },
  {
    id: 'a7',
    name: 'Vũ.',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=600&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1445985543469-723388755955?q=80&w=1200&auto=format&fit=crop',
    monthlyListeners: '2.2M',
    followers: '1.4M',
    bio: 'Chàng trai của những bản tình ca mộc mạc Indie Việt: Lạ Lùng, Bước Qua Mùa Cô Đơn, Đông Kiếm Em.',
    genre: 'Indie Việt',
    isVerified: true,
    topTrackIds: ['s8']
  }
];

// Explore Genre Categories
export const MOCK_GENRES: GenreCategory[] = [
  {
    id: 'g1',
    name: 'V-Pop Thịnh Hành',
    gradient: 'from-emerald-500 to-teal-800',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop',
    songCount: 120
  },
  {
    id: 'g2',
    name: 'Indie & Acoustic',
    gradient: 'from-amber-500 to-orange-800',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop',
    songCount: 85
  },
  {
    id: 'g3',
    name: 'Lo-Fi & Chill Vibes',
    gradient: 'from-cyan-500 to-blue-800',
    coverUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=400&auto=format&fit=crop',
    songCount: 150
  },
  {
    id: 'g4',
    name: 'R&B / Soul',
    gradient: 'from-purple-500 to-indigo-900',
    coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?q=80&w=400&auto=format&fit=crop',
    songCount: 95
  },
  {
    id: 'g5',
    name: 'Pop Quốc Tế (US-UK)',
    gradient: 'from-rose-500 to-pink-800',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=400&auto=format&fit=crop',
    songCount: 210
  },
  {
    id: 'g6',
    name: 'EDM & Electronic',
    gradient: 'from-violet-500 to-purple-900',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop',
    songCount: 140
  },
  {
    id: 'g7',
    name: 'Gym & Workout',
    gradient: 'from-red-500 to-amber-800',
    coverUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop',
    songCount: 75
  },
  {
    id: 'g8',
    name: 'Đêm Muộn & Lắng Đọng',
    gradient: 'from-slate-700 to-slate-950',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop',
    songCount: 64
  }
];

// Mood Filter Tags
export const MOOD_TAGS = [
  'Tất cả',
  'Chill & Thư giãn',
  'V-Pop',
  'Tập trung làm việc',
  'Năng lượng Gym',
  'Indie Việt',
  'Lo-fi Vibe'
];
