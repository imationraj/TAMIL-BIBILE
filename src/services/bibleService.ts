// Service to fetch, cache, and serve Tamil Bible (Tamil Old Version - O.V. / Union Version - B.S.I.)

export interface BibleVerse {
  pk?: number;
  verse: number;
  text: string;
}

export interface BibleVersionInfo {
  code: string;
  nameTa: string;
  nameEn: string;
  badge: string;
}

export const AVAILABLE_VERSIONS: BibleVersionInfo[] = [
  {
    code: 'TBSI',
    nameTa: 'பரிசுத்த வேதாகமம் (O.V. / Union Version)',
    nameEn: 'Tamil Older Version (B.S.I.)',
    badge: 'முதன்மைப் பதிப்பு (Standard)'
  },
  {
    code: 'TAMBL98',
    nameTa: 'பரிசுத்த பைபிள் (திருவிவிலியம்)',
    nameEn: 'Tamil Contemporary Version',
    badge: 'எளிய தமிழ்'
  },
  {
    code: 'KJV',
    nameTa: 'King James Version (KJV)',
    nameEn: 'English King James Version',
    badge: 'ஆங்கிலம் (English)'
  }
];

// Curated offline scriptures for instant access without network
const OFFLINE_FALLBACK_CHAPTERS: Record<string, BibleVerse[]> = {
  // Genesis 1 (ஆதியாகமம் 1)
  'TBSI_1_1': [
    { verse: 1, text: 'ஆதியிலே தேவன் வானத்தையும் பூமியையும் சிருஷ்டித்தார்.' },
    { verse: 2, text: 'பூமியானது ஒழுங்கின்மையும் வெறுமையுமாய் இருந்தது; ஆழத்தின்மேல் இருள் இருந்தது; தேவனுடைய ஆவியானவர் ஜலத்தின்மேல் அசைவாடிக்கொண்டிருந்தார்.' },
    { verse: 3, text: 'வெளிச்சம் உண்டாகக்கடவது என்றார் தேவன், வெளிச்சம் உண்டாயிற்று.' },
    { verse: 4, text: 'வெளிச்சம் நல்லது என்று தேவன் கண்டார்; வெளிச்சத்தையும் இருளையும் தேவன் வெவ்வேறாகப் பிரித்தார்.' },
    { verse: 5, text: 'தேவன் வெளிச்சத்துக்குப் பகல் என்றும், இருளுக்கு இரவு என்றும் பேரிட்டார்; சாயங்காலமும் விடியற்காலமுமாகி முதலாம் நாள் ஆயிற்று.' },
    { verse: 6, text: 'பின்பு தேவன்: ஜலத்தின் மத்தியில் ஆகாயவிரிவு உண்டாகக்கடவது என்றும், அது ஜலத்தினின்று ஜலத்தைப் பிரிக்கக்கடவது என்றும் சொன்னார்.' },
    { verse: 7, text: 'தேவன் ஆகாயவிரிவை உண்டுபண்ணி, ஆகாயவிரிவுக்குக் கீழே இருக்கிற ஜலத்திற்கும் ஆகாயவிரிவுக்கு மேலே இருக்கிற ஜலத்திற்கும் பிரிவுண்டாக்கினார்; அது அப்படியே ஆயிற்று.' },
    { verse: 8, text: 'தேவன் ஆகாயவிரிவுக்கு வானம் என்று பேரிட்டார்; சாயங்காலமும் விடியற்காலமுமாகி இரண்டாம் நாள் ஆயிற்று.' },
    { verse: 9, text: 'பின்பு தேவன்: வானத்தின் கீழிருக்கிற ஜலம் ஒரே இடத்தில் சேரவும், வெட்டாந்தரை காணப்படவும் கடவது என்றார்; அது அப்படியே ஆயிற்று.' },
    { verse: 10, text: 'தேவன் வெட்டாந்தரைக்குப் பூமி என்றும், சேர்ந்த ஜலத்திற்குச் சமுத்திரம் என்றும் பேரிட்டார்; தேவன் அது நல்லது என்று கண்டார்.' }
  ],
  // Psalm 23 (சங்கீதம் 23)
  'TBSI_19_23': [
    { verse: 1, text: 'கர்த்தர் என் மேய்ப்பராயிருக்கிறார், நான் தாழ்ச்சியடையேன்.' },
    { verse: 2, text: 'அவர் என்னைப் புல்லுள்ள இடங்களில் படுக்கப்பண்ணி, அமர்ந்த தண்ணீர்கள் அண்டையில் என்னைக் கொண்டுபோய் விடுகிறார்.' },
    { verse: 3, text: 'அவர் என் ஆத்துமாவைத் தேற்றி, தம்முடைய நாமத்தினிமித்தம் என்னை நீதியின் பாதைகளில் நடத்துகிறார்.' },
    { verse: 4, text: 'நான் மரண இருளின் பள்ளத்தாக்கிலே நடந்தாலும் பொல்லாப்புக்குப் பயப்படேன்; தேவரீர் என்னோடேகூட இருக்கிறீர்; உமது கோலும் உமது தடியும் என்னைத் தேற்றும்.' },
    { verse: 5, text: 'என் சத்துருக்களுக்கு முன்பாக நீர் எனக்கு ஒரு பந்தியை ஆயத்தப்படுத்தி, என் தலையை எண்ணெயால் அபிஷேகம் பண்ணுகிறீர்; என் பாத்திரம் நிரம்பி வழிகிறது.' },
    { verse: 6, text: 'என் ஜீவனுள்ள நாளெல்லாம் நன்மையும் கிருபையும் என்னைத் தொடரும்; நான் கர்த்தருடைய வீட்டிலே நீடித்த நாட்களாய் நிலைத்திருப்பேன்.' }
  ],
  // Psalm 91 (சங்கீதம் 91)
  'TBSI_19_91': [
    { verse: 1, text: 'உன்னதமானவரின் மறைவிலிருக்கிறவன் சர்வவல்லவருடைய நிழலில் தங்குவான்.' },
    { verse: 2, text: 'நான் கர்த்தரை நோக்கி: நீர் என் அடைக்கலம், என் கோட்டை, என் தேவன், நான் நம்பியிருக்கிறவர் என்று சொல்லுவேன்.' },
    { verse: 3, text: 'அவர் உன்னை வேடனுடைய கண்ணிக்கும், பாழாக்கும் கொள்ளைநோய்க்கும் தப்புவிப்பார்.' },
    { verse: 4, text: 'அவர் தமது சிறகுகளாலே உன்னை மூடுவார்; அவர் செட்டைகளின் கீழே அடைக்கலம் புகுவாய்; அவருடைய சத்தியம் உனக்குப் பரிசையும் கேடகமுமாகும்.' },
    { verse: 5, text: 'இரவில் உண்டாகும் பயங்கரத்துக்கும், பகலில் பறக்கும் அம்புக்கும், இருளில் நடமாடும் கொள்ளைநோய்க்கும், மத்தியானத்தில் பாழாக்கும் சங்காரத்துக்கும் பயப்படாதிருப்பாய்.' }
  ],
  // John 1 (யோவான் 1)
  'TBSI_43_1': [
    { verse: 1, text: 'ஆதியிலே வார்த்தை இருந்தது, அந்த வார்த்தை தேவனிடத்திலிருந்தது, அந்த வார்த்தை தேவனாயிருந்தது.' },
    { verse: 2, text: 'அவர் ஆதியிலே தேவனோடு இருந்தார்.' },
    { verse: 3, text: 'சகலமும் அவர் மூலமாய் உண்டாயிற்று; உண்டானதொன்றும் அவராலேயல்லாமல் உண்டாகவில்லை.' },
    { verse: 4, text: 'அவருக்குள் ஜீவன் இருந்தது, அந்த ஜீவன் மனுஷருக்கு வெளிச்சமாயிருந்தது.' },
    { verse: 5, text: 'அந்த வெளிச்சம் இருளிலே பிரகாசிக்கிறது; இருளானது அதைப் பற்றிக்கொள்ளவில்லை.' }
  ],
  // John 3 (யோவான் 3)
  'TBSI_43_3': [
    { verse: 16, text: 'தேவன், தம்முடைய ஒரேபேறான குமாரனை விசுவாசிக்கிறவன் எவனோ அவன் கெட்டுப்போகாமல் நித்தியஜீவனை அடையும்படிக்கு, அவரைத் தந்தருளி, இவ்வளவாய் உலகத்தில் அன்புகூர்ந்தார்.' },
    { verse: 17, text: 'உலகத்தை ஆக்கினைக்குள்ளாகத் தீர்க்கும்படி தேவன் தம்முடைய குமாரனை உலகத்தில் அனுப்பாமல், அவராலே உலகம் இரட்சிக்கப்படுவதற்காகவே அவரை அனுப்பினார்.' }
  ],
  // Matthew 5 (மத்தேயு 5)
  'TBSI_40_5': [
    { verse: 1, text: 'அவர் திரளான ஜனங்களைக் கண்டு மலையின்மேல் ஏறினார்; அவர் உட்கார்ந்தபொழுது, அவருடைய சீஷர்கள் அவரிடத்தில் வந்தார்கள்.' },
    { verse: 2, text: 'அப்பொழுது அவர் தமது வாயைத் திறந்து அவர்களுக்கு உபதேசித்துச் சொன்னது என்னவென்றால்:' },
    { verse: 3, text: 'ஆவியில் எளிமையுள்ளவர்கள் பாக்கியவான்கள்; பரலோகராஜ்யம் அவர்களுடையது.' },
    { verse: 4, text: 'துயரப்படுகிறவர்கள் பாக்கியவான்கள்; அவர்கள் ஆறுதலடைவார்கள்.' },
    { verse: 5, text: 'சாந்தகுணமுள்ளவர்கள் பாக்கியவான்கள்; அவர்கள் பூமியைச் சுதந்தரித்துக்கொள்ளுவார்கள்.' },
    { verse: 6, text: 'நீதியின்மேல் பசிதாகமுள்ளவர்கள் பாக்கியவான்கள்; அவர்கள் திருப்தியடைவார்கள்.' },
    { verse: 7, text: 'இரக்கமுள்ளவர்கள் பாக்கியவான்கள்; அவர்கள் இரக்கம் பெறுவார்கள்.' },
    { verse: 8, text: 'இருதயத்தில் சுத்தமுள்ளவர்கள் பாக்கியவான்கள்; அவர்கள் தேவனைத் தரிசிப்பார்கள்.' }
  ]
};

// Clean HTML tags like <i>, </i>, <br>
export function cleanVerseText(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Fetch chapter verses from API with local caching & offline resilience
 */
export async function getChapterVerses(
  bookId: number, 
  chapter: number, 
  version: string = 'TBSI'
): Promise<BibleVerse[]> {
  const cacheKey = `bible_cache_${version}_${bookId}_${chapter}`;

  // 1. Check local storage cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore localStorage errors
  }

  // 2. Fetch from Bolls Bible API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const url = `https://bolls.life/get-chapter/${version}/${bookId}/${chapter}/`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const cleaned: BibleVerse[] = data.map((v: any) => ({
          pk: v.pk,
          verse: Number(v.verse),
          text: cleanVerseText(v.text)
        }));

        // Store in cache for offline use
        try {
          localStorage.setItem(cacheKey, JSON.stringify(cleaned));
        } catch {
          // If storage quota exceeded, pass
        }

        return cleaned;
      }
    }
  } catch (err) {
    console.warn('Network fetch for Bible chapter failed or timed out:', err);
  }

  // 3. Check fallback offline dictionary
  const fallbackKey = `${version}_${bookId}_${chapter}`;
  if (OFFLINE_FALLBACK_CHAPTERS[fallbackKey]) {
    return OFFLINE_FALLBACK_CHAPTERS[fallbackKey];
  }

  // 4. If all else fails, return empty array (caller can display retry state)
  return [];
}

/**
 * Copy text to clipboard
 */
export async function copyVerseToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch {
    return false;
  }
}

/**
 * Share verse using Web Share API or WhatsApp
 */
export function shareVerse(reference: string, text: string): void {
  const shareText = `📖 ${reference}\n\n"${text}"\n\n— Tamil Bible (O.V. / Union Version)\nஇயேசு கிறிஸ்துவின் அன்பின் ஊழியம் (P. Pethuraj: +919840041759 | pethuelraj@gmail.com)`;

  if (navigator.share) {
    navigator.share({
      title: reference,
      text: shareText
    }).catch(() => {
      // Fallback to WhatsApp
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    });
  } else {
    // Open WhatsApp directly
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  }
}

/**
 * Text to speech (Read aloud)
 */
export function speakTamilVerse(text: string): void {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel(); // Stop ongoing
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ta-IN';
  utterance.rate = 0.9; // Slightly slower for clear Tamil enunciation
  utterance.pitch = 1.0;

  // Try to find a Tamil voice if available
  const voices = window.speechSynthesis.getVoices();
  const taVoice = voices.find(v => v.lang.includes('ta') || v.name.toLowerCase().includes('tamil'));
  if (taVoice) {
    utterance.voice = taVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
