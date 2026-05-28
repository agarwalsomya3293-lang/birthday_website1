// Customizable love story configuration.
// Replace the Unsplash placeholder URLs with your actual polaroids/photos!

export interface PolaroidPhoto {
  id: number;
  url: string;
  caption: string;
  date: string;
  rotation: number; // degrees of tilt for polaroid styling
}

export interface TimelineEvent {
  id: number;
  title: string;
  date: string;
  description: string;
  icon: string;
  glowColor: string; // Tailwind glow classes
}

export interface LoveReason {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

export interface ConstellationStar {
  id: number;
  x: number; // percentage width 10-90
  y: number; // percentage height 10-90
  message: string;
  photoUrl?: string;
  title: string;
}

export const BIRTHDAY_CONFIG = {
  partnerName: "My Love",
  birthdayDate: "2026-10-24T00:00:00", // Change this to your partner's birthday! Format: YYYY-MM-DDTHH:MM:SS
  musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", // Romantic placeholder piano track (royalty-free)
  
  // Hero section words carousel
  romanticPhrases: [
    "My safe place 🏡",
    "My favorite person ✨",
    "My happiness ❤️",
    "My forever & always 🌌",
    "My beautiful dream come true 💫"
  ],

  // Section 1 - Memories Polaroid Grid
  memoriesPhotos: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop",
      caption: "When our hands first fit perfectly together.",
      date: "October 12, 2024",
      rotation: -3
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop",
      caption: "Chasing golden sunsets and laughing till our sides hurt.",
      date: "November 3, 2024",
      rotation: 4
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=600&auto=format&fit=crop",
      caption: "Late night conversations under a sky full of sparklers.",
      date: "December 31, 2024",
      rotation: -5
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop",
      caption: "Waking up next to you is the best part of my day.",
      date: "February 14, 2025",
      rotation: 2
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1482841628122-9080d44bb807?q=80&w=600&auto=format&fit=crop",
      caption: "Our quiet walks by the roaring ocean.",
      date: "April 18, 2025",
      rotation: -2
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
      caption: "The radiant smile that captured my heart forever.",
      date: "May 10, 2025",
      rotation: 3
    }
  ] as PolaroidPhoto[],

  // Section 2 - Relationship Timeline
  timelineEvents: [
    {
      id: 1,
      title: "First Meeting",
      date: "September 15, 2024",
      description: "In a crowded room, our eyes met, and suddenly the noise faded. It felt as if time stood still.",
      icon: "Sparkles",
      glowColor: "shadow-[0_0_20px_rgba(255,183,197,0.3)] border-pink-400/30"
    },
    {
      id: 2,
      title: "First Chat",
      date: "September 18, 2024",
      description: "A simple 'hello' that unlocked hours of non-stop talking. We stayed up until 4 AM sharing secrets.",
      icon: "MessageCircle",
      glowColor: "shadow-[0_0_20px_rgba(167,139,250,0.3)] border-purple-400/30"
    },
    {
      id: 3,
      title: "First Date",
      date: "October 05, 2024",
      description: "A cozy little coffee shop, followed by hours of wandering the city. I knew then you were special.",
      icon: "Coffee",
      glowColor: "shadow-[0_0_20px_rgba(245,158,11,0.3)] border-amber-400/30"
    },
    {
      id: 4,
      title: "First Photo Together",
      date: "October 12, 2024",
      description: "Both of us smiling nervously, captured on a polaroid that now sits on my desk as my prized possession.",
      icon: "Camera",
      glowColor: "shadow-[0_0_20px_rgba(255,183,197,0.3)] border-pink-400/30"
    },
    {
      id: 5,
      title: "Favorite Memory",
      date: "December 31, 2024",
      description: "Standing under the midnight fireworks, whispering wishes for our future. My only wish was to stay with you.",
      icon: "Heart",
      glowColor: "shadow-[0_0_20px_rgba(167,139,250,0.3)] border-purple-400/30"
    },
    {
      id: 6,
      title: "Today & Beyond",
      date: "May 2026",
      description: "Every day with you is a new favorite page in our book. Here's to writing a thousand more chapters together.",
      icon: "Infinity",
      glowColor: "shadow-[0_0_20px_rgba(245,158,11,0.3)] border-amber-400/30"
    }
  ] as TimelineEvent[],

  // Section 3 - Reasons I Love You
  reasons: [
    {
      id: 1,
      title: "Your Smile",
      description: "It lights up even my darkest days. A single genuine smile from you chases away every worry I carry.",
      iconName: "Smile"
    },
    {
      id: 2,
      title: "Your Voice",
      description: "My favorite melody. Hearing you laugh is a sound I could listen to for the rest of my life on repeat.",
      iconName: "Volume2"
    },
    {
      id: 3,
      title: "Your Kindness",
      description: "You care so deeply about the world around you, always showing endless empathy and lifting others up.",
      iconName: "Compassion"
    },
    {
      id: 4,
      title: "Your Comfort",
      description: "The way you hold me, or simply squeeze my hand, immediately lets me know that everything is going to be okay.",
      iconName: "Shield"
    },
    {
      id: 5,
      title: "Your Passion",
      description: "The way your eyes light up when talking about the things you love is absolutely mesmerizing to witness.",
      iconName: "Zap"
    },
    {
      id: 6,
      title: "Everything About You",
      description: "From your sleepy morning face to your wonderful soul. You are a masterpiece I will cherish forever.",
      iconName: "Flame"
    }
  ] as LoveReason[],

  // Section 4 - Secret Letter
  secretLetter: {
    salutation: "To My Absolute Favorite Person,",
    paragraphs: [
      "Happy Birthday, my love! Today, the universe celebrated the day you entered it, and I celebrate the day you walked into my life and made everything infinitely brighter.",
      "You are my safe harbor in a chaotic world, my laughter on a gloomy day, and the person I want to share every sunset, every coffee, and every sleepy Sunday morning with.",
      "Thank you for being you—so tenderly kind, incredibly patient, and absolutely beautiful. I love the way we can talk about the deepest mysteries of the universe, or just laugh about nothing at all for hours.",
      "As you blow out your candles today, know that my biggest wish has already come true: having you in my life. I promise to stand by you, support your wildest dreams, and love you more with each passing breath.",
      "Forever and always, in every lifetime, in every universe..."
    ],
    closing: "With all my heart and soul,",
    signature: "Yours Forever ❤️"
  },

  // Section 5 - Memory Star Sky (Interactive stars)
  constellationStars: [
    {
      id: 1,
      x: 20,
      y: 35,
      title: "Our Secret Code",
      message: "Do you remember when we laughed so hard at that inside joke that we couldn't even breathe? It's still my favorite memory.",
      photoUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: 2,
      x: 35,
      y: 65,
      title: "Late Night Drive",
      message: "The night we drove without a destination, listening to music on full volume. That night felt like infinite freedom.",
      photoUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: 3,
      x: 55,
      y: 25,
      title: "Rainy Day Hugs",
      message: "When it was pouring outside, and we just stayed in, cooked together, and cuddled under a heavy blanket. Safe and warm.",
      photoUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: 4,
      x: 70,
      y: 55,
      title: "The Dream We Shared",
      message: "The promise we made to one day travel to that small coastal town and buy a little house by the sea. I can't wait to build that with you.",
      photoUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: 5,
      x: 85,
      y: 30,
      title: "My Eternal Promise",
      message: "I promise to love you, cherish you, respect you, and hold you close through all the seasons of our lives.",
      photoUrl: "https://images.unsplash.com/photo-1482841628122-9080d44bb807?q=80&w=400&auto=format&fit=crop"
    }
  ] as ConstellationStar[]
};
