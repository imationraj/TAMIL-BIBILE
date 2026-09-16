export interface BibleBook {
  id: number;
  nameTa: string;
  nameEn: string;
  testament: 'OT' | 'NT';
  category: string;
  categoryTa: string;
  chaptersCount: number;
  totalVerses: number;
  chapterVerses: number[];
}

// Canonical chapter and verse counts for all 66 books of the Bible
// Total: 66 Books | 1,189 Chapters | 31,102 Verses
// Old Testament: 39 Books | 929 Chapters | 23,145 Verses
// New Testament: 27 Books | 260 Chapters | 7,957 Verses

export const BIBLE_BOOKS: BibleBook[] = [
  // OLD TESTAMENT (பழைய ஏற்பாடு) - 39 Books
  {
    id: 1,
    nameTa: 'ஆதியாகமம்',
    nameEn: 'Genesis',
    testament: 'OT',
    category: 'Pentateuch',
    categoryTa: 'மோசேயின் ஆகமங்கள்',
    chaptersCount: 50,
    totalVerses: 1533,
    chapterVerses: [
      31, 25, 24, 26, 32, 22, 24, 22, 29, 32,
      32, 20, 18, 24, 21, 16, 27, 33, 38, 18,
      34, 24, 20, 67, 34, 35, 46, 22, 35, 43,
      55, 32, 20, 31, 29, 43, 36, 30, 23, 23,
      57, 38, 34, 34, 28, 34, 31, 22, 33, 26
    ]
  },
  {
    id: 2,
    nameTa: 'யாத்திராகமம்',
    nameEn: 'Exodus',
    testament: 'OT',
    category: 'Pentateuch',
    categoryTa: 'மோசேயின் ஆகமங்கள்',
    chaptersCount: 40,
    totalVerses: 1213,
    chapterVerses: [
      22, 25, 22, 31, 23, 30, 25, 32, 35, 29,
      10, 51, 22, 31, 27, 36, 16, 27, 25, 26,
      36, 31, 33, 18, 40, 37, 21, 43, 46, 38,
      18, 35, 23, 35, 35, 38, 29, 31, 43, 38
    ]
  },
  {
    id: 3,
    nameTa: 'லேவியராகமம்',
    nameEn: 'Leviticus',
    testament: 'OT',
    category: 'Pentateuch',
    categoryTa: 'மோசேயின் ஆகமங்கள்',
    chaptersCount: 27,
    totalVerses: 859,
    chapterVerses: [
      17, 16, 17, 35, 19, 30, 38, 36, 24, 20,
      47, 8, 59, 57, 33, 34, 16, 30, 37, 27,
      24, 33, 44, 23, 55, 46, 34
    ]
  },
  {
    id: 4,
    nameTa: 'எண்ணாகமம்',
    nameEn: 'Numbers',
    testament: 'OT',
    category: 'Pentateuch',
    categoryTa: 'மோசேயின் ஆகமங்கள்',
    chaptersCount: 36,
    totalVerses: 1288,
    chapterVerses: [
      54, 34, 51, 49, 31, 27, 89, 26, 23, 36,
      35, 16, 33, 45, 41, 50, 13, 32, 22, 29,
      35, 41, 30, 25, 18, 65, 23, 31, 40, 16,
      54, 42, 56, 29, 34, 13
    ]
  },
  {
    id: 5,
    nameTa: 'உபாகமம்',
    nameEn: 'Deuteronomy',
    testament: 'OT',
    category: 'Pentateuch',
    categoryTa: 'மோசேயின் ஆகமங்கள்',
    chaptersCount: 34,
    totalVerses: 959,
    chapterVerses: [
      46, 37, 29, 49, 33, 25, 26, 20, 29, 22,
      32, 32, 18, 29, 23, 22, 20, 22, 21, 20,
      23, 30, 25, 22, 19, 19, 26, 68, 29, 20,
      30, 52, 29, 12
    ]
  },
  {
    id: 6,
    nameTa: 'யோசுவா',
    nameEn: 'Joshua',
    testament: 'OT',
    category: 'Historical',
    categoryTa: 'வரலாற்று நூல்கள்',
    chaptersCount: 24,
    totalVerses: 658,
    chapterVerses: [
      18, 24, 17, 24, 15, 27, 26, 35, 27, 43,
      23, 24, 33, 15, 63, 10, 18, 28, 51, 9,
      45, 34, 16, 33
    ]
  },
  {
    id: 7,
    nameTa: 'நியாயாதிபதிகள்',
    nameEn: 'Judges',
    testament: 'OT',
    category: 'Historical',
    categoryTa: 'வரலாற்று நூல்கள்',
    chaptersCount: 21,
    totalVerses: 618,
    chapterVerses: [
      36, 23, 31, 24, 31, 40, 25, 35, 57, 18,
      40, 15, 25, 20, 20, 31, 13, 31, 30, 48,
      25
    ]
  },
  {
    id: 8,
    nameTa: 'ரூத்',
    nameEn: 'Ruth',
    testament: 'OT',
    category: 'Historical',
    categoryTa: 'வரலாற்று நூல்கள்',
    chaptersCount: 4,
    totalVerses: 85,
    chapterVerses: [22, 23, 18, 22]
  },
  {
    id: 9,
    nameTa: '1 சாமுவேல்',
    nameEn: '1 Samuel',
    testament: 'OT',
    category: 'Historical',
    categoryTa: 'வரலாற்று நூல்கள்',
    chaptersCount: 31,
    totalVerses: 810,
    chapterVerses: [
      28, 36, 21, 22, 12, 21, 17, 22, 27, 27,
      15, 25, 23, 52, 35, 23, 58, 30, 24, 42,
      15, 23, 29, 22, 44, 25, 12, 25, 11, 31,
      13
    ]
  },
  {
    id: 10,
    nameTa: '2 சாமுவேல்',
    nameEn: '2 Samuel',
    testament: 'OT',
    category: 'Historical',
    categoryTa: 'வரலாற்று நூல்கள்',
    chaptersCount: 24,
    totalVerses: 695,
    chapterVerses: [
      27, 32, 39, 12, 25, 23, 29, 18, 13, 19,
      27, 31, 39, 33, 37, 23, 29, 33, 43, 26,
      22, 51, 39, 25
    ]
  },
  {
    id: 11,
    nameTa: '1 இராஜாக்கள்',
    nameEn: '1 Kings',
    testament: 'OT',
    category: 'Historical',
    categoryTa: 'வரலாற்று நூல்கள்',
    chaptersCount: 22,
    totalVerses: 816,
    chapterVerses: [
      53, 46, 28, 34, 18, 38, 51, 66, 28, 29,
      43, 33, 34, 31, 34, 34, 24, 46, 21, 43,
      29, 53
    ]
  },
  {
    id: 12,
    nameTa: '2 இராஜாக்கள்',
    nameEn: '2 Kings',
    testament: 'OT',
    category: 'Historical',
    categoryTa: 'வரலாற்று நூல்கள்',
    chaptersCount: 25,
    totalVerses: 719,
    chapterVerses: [
      18, 25, 27, 44, 27, 33, 20, 29, 37, 36,
      21, 21, 25, 29, 38, 20, 41, 37, 37, 21,
      26, 20, 37, 20, 30
    ]
  },
  {
    id: 13,
    nameTa: '1 நாளாகமம்',
    nameEn: '1 Chronicles',
    testament: 'OT',
    category: 'Historical',
    categoryTa: 'வரலாற்று நூல்கள்',
    chaptersCount: 29,
    totalVerses: 942,
    chapterVerses: [
      54, 55, 24, 43, 26, 81, 40, 40, 44, 14,
      47, 40, 14, 17, 29, 43, 27, 17, 19, 8,
      30, 19, 32, 31, 31, 32, 34, 21, 30
    ]
  },
  {
    id: 14,
    nameTa: '2 நாளாகமம்',
    nameEn: '2 Chronicles',
    testament: 'OT',
    category: 'Historical',
    categoryTa: 'வரலாற்று நூல்கள்',
    chaptersCount: 36,
    totalVerses: 822,
    chapterVerses: [
      17, 18, 17, 22, 14, 42, 22, 18, 31, 19,
      23, 16, 22, 15, 19, 14, 19, 34, 11, 37,
      20, 12, 21, 27, 28, 23, 9, 27, 36, 27,
      21, 33, 25, 33, 27, 23
    ]
  },
  {
    id: 15,
    nameTa: 'எஸ்றா',
    nameEn: 'Ezra',
    testament: 'OT',
    category: 'Historical',
    categoryTa: 'வரலாற்று நூல்கள்',
    chaptersCount: 10,
    totalVerses: 280,
    chapterVerses: [11, 70, 13, 24, 17, 22, 28, 36, 15, 44]
  },
  {
    id: 16,
    nameTa: 'நெகேமியா',
    nameEn: 'Nehemiah',
    testament: 'OT',
    category: 'Historical',
    categoryTa: 'வரலாற்று நூல்கள்',
    chaptersCount: 13,
    totalVerses: 406,
    chapterVerses: [11, 20, 32, 23, 19, 19, 73, 18, 38, 39, 36, 47, 31]
  },
  {
    id: 17,
    nameTa: 'எஸ்தர்',
    nameEn: 'Esther',
    testament: 'OT',
    category: 'Historical',
    categoryTa: 'வரலாற்று நூல்கள்',
    chaptersCount: 10,
    totalVerses: 167,
    chapterVerses: [22, 23, 15, 17, 14, 14, 10, 17, 32, 3]
  },
  {
    id: 18,
    nameTa: 'யோபு',
    nameEn: 'Job',
    testament: 'OT',
    category: 'Poetry',
    categoryTa: 'ஞான நூல்கள்',
    chaptersCount: 42,
    totalVerses: 1070,
    chapterVerses: [
      22, 13, 26, 21, 27, 30, 21, 22, 35, 22,
      20, 25, 28, 22, 35, 22, 16, 21, 29, 29,
      34, 30, 17, 25, 6, 14, 23, 28, 25, 31,
      40, 22, 33, 37, 16, 33, 24, 41, 30, 24,
      34, 17
    ]
  },
  {
    id: 19,
    nameTa: 'சங்கீதம்',
    nameEn: 'Psalms',
    testament: 'OT',
    category: 'Poetry',
    categoryTa: 'ஞான நூல்கள்',
    chaptersCount: 150,
    totalVerses: 2461,
    chapterVerses: [
      6, 12, 8, 8, 12, 10, 17, 9, 20, 18,
      7, 8, 6, 7, 5, 11, 15, 50, 14, 9,
      13, 31, 6, 10, 22, 12, 14, 9, 11, 12,
      24, 11, 22, 22, 28, 12, 40, 22, 13, 17,
      13, 11, 5, 26, 17, 11, 9, 14, 20, 23,
      19, 9, 6, 7, 23, 13, 11, 11, 17, 12,
      8, 12, 11, 10, 13, 20, 7, 35, 36, 5,
      24, 20, 28, 23, 10, 12, 20, 72, 13, 19,
      16, 8, 18, 12, 13, 17, 7, 18, 52, 17,
      16, 15, 5, 23, 11, 13, 12, 9, 9, 5,
      8, 28, 22, 35, 45, 48, 43, 13, 31, 7,
      10, 10, 9, 8, 18, 19, 2, 29, 176, 7,
      8, 9, 4, 8, 5, 6, 5, 6, 8, 8,
      3, 18, 3, 3, 21, 26, 9, 8, 24, 13,
      10, 7, 12, 15, 21, 10, 20, 14, 9, 6
    ]
  },
  {
    id: 20,
    nameTa: 'நீதிமொழிகள்',
    nameEn: 'Proverbs',
    testament: 'OT',
    category: 'Poetry',
    categoryTa: 'ஞான நூல்கள்',
    chaptersCount: 31,
    totalVerses: 915,
    chapterVerses: [
      33, 22, 35, 27, 23, 35, 27, 36, 18, 32,
      31, 28, 25, 35, 33, 33, 28, 24, 29, 30,
      31, 29, 35, 34, 28, 28, 27, 28, 27, 33,
      31
    ]
  },
  {
    id: 21,
    nameTa: 'பிரசங்கி',
    nameEn: 'Ecclesiastes',
    testament: 'OT',
    category: 'Poetry',
    categoryTa: 'ஞான நூல்கள்',
    chaptersCount: 12,
    totalVerses: 222,
    chapterVerses: [18, 26, 22, 16, 20, 12, 29, 17, 18, 20, 10, 14]
  },
  {
    id: 22,
    nameTa: 'உன்னதப்பாட்டு',
    nameEn: 'Song of Solomon',
    testament: 'OT',
    category: 'Poetry',
    categoryTa: 'ஞான நூல்கள்',
    chaptersCount: 8,
    totalVerses: 117,
    chapterVerses: [17, 17, 11, 16, 16, 13, 13, 14]
  },
  {
    id: 23,
    nameTa: 'ஏசாயா',
    nameEn: 'Isaiah',
    testament: 'OT',
    category: 'MajorProphets',
    categoryTa: 'பெரிய தீர்க்கதரிசிகள்',
    chaptersCount: 66,
    totalVerses: 1292,
    chapterVerses: [
      31, 22, 26, 6, 30, 13, 25, 22, 21, 34,
      16, 6, 22, 32, 9, 14, 14, 7, 25, 6,
      10, 25, 18, 23, 12, 21, 13, 29, 24, 33,
      9, 20, 24, 17, 10, 22, 38, 22, 8, 31,
      29, 25, 28, 28, 25, 13, 15, 22, 26, 11,
      23, 15, 12, 17, 13, 12, 21, 14, 21, 22,
      11, 12, 19, 12, 25, 24
    ]
  },
  {
    id: 24,
    nameTa: 'எரேமியா',
    nameEn: 'Jeremiah',
    testament: 'OT',
    category: 'MajorProphets',
    categoryTa: 'பெரிய தீர்க்கதரிசிகள்',
    chaptersCount: 52,
    totalVerses: 1364,
    chapterVerses: [
      19, 37, 25, 31, 31, 30, 34, 22, 26, 25,
      23, 17, 27, 22, 21, 21, 27, 23, 15, 18,
      14, 30, 40, 10, 38, 24, 22, 17, 32, 24,
      40, 44, 26, 22, 19, 32, 21, 28, 18, 16,
      18, 22, 13, 30, 5, 28, 7, 47, 39, 46,
      64, 34
    ]
  },
  {
    id: 25,
    nameTa: 'புலம்பல்',
    nameEn: 'Lamentations',
    testament: 'OT',
    category: 'MajorProphets',
    categoryTa: 'பெரிய தீர்க்கதரிசிகள்',
    chaptersCount: 5,
    totalVerses: 154,
    chapterVerses: [22, 22, 66, 22, 22]
  },
  {
    id: 26,
    nameTa: 'எசேக்கியேல்',
    nameEn: 'Ezekiel',
    testament: 'OT',
    category: 'MajorProphets',
    categoryTa: 'பெரிய தீர்க்கதரிசிகள்',
    chaptersCount: 48,
    totalVerses: 1273,
    chapterVerses: [
      28, 10, 27, 17, 17, 14, 27, 18, 11, 22,
      25, 28, 23, 23, 8, 63, 24, 32, 14, 49,
      32, 31, 49, 27, 17, 21, 36, 26, 21, 26,
      18, 32, 33, 31, 15, 38, 28, 23, 29, 49,
      26, 20, 27, 31, 25, 24, 23, 35
    ]
  },
  {
    id: 27,
    nameTa: 'தானியேல்',
    nameEn: 'Daniel',
    testament: 'OT',
    category: 'MajorProphets',
    categoryTa: 'பெரிய தீர்க்கதரிசிகள்',
    chaptersCount: 12,
    totalVerses: 357,
    chapterVerses: [21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13]
  },
  {
    id: 28,
    nameTa: 'ஓசியா',
    nameEn: 'Hosea',
    testament: 'OT',
    category: 'MinorProphets',
    categoryTa: 'சிறிய தீர்க்கதரிசிகள்',
    chaptersCount: 14,
    totalVerses: 197,
    chapterVerses: [11, 23, 5, 19, 15, 11, 16, 14, 17, 15, 12, 14, 16, 9]
  },
  {
    id: 29,
    nameTa: 'யோவேல்',
    nameEn: 'Joel',
    testament: 'OT',
    category: 'MinorProphets',
    categoryTa: 'சிறிய தீர்க்கதரிசிகள்',
    chaptersCount: 3,
    totalVerses: 73,
    chapterVerses: [20, 32, 21]
  },
  {
    id: 30,
    nameTa: 'ஆமோஸ்',
    nameEn: 'Amos',
    testament: 'OT',
    category: 'MinorProphets',
    categoryTa: 'சிறிய தீர்க்கதரிசிகள்',
    chaptersCount: 9,
    totalVerses: 146,
    chapterVerses: [15, 16, 15, 13, 27, 14, 17, 14, 15]
  },
  {
    id: 31,
    nameTa: 'ஒபதியா',
    nameEn: 'Obadiah',
    testament: 'OT',
    category: 'MinorProphets',
    categoryTa: 'சிறிய தீர்க்கதரிசிகள்',
    chaptersCount: 1,
    totalVerses: 21,
    chapterVerses: [21]
  },
  {
    id: 32,
    nameTa: 'யோனா',
    nameEn: 'Jonah',
    testament: 'OT',
    category: 'MinorProphets',
    categoryTa: 'சிறிய தீர்க்கதரிசிகள்',
    chaptersCount: 4,
    totalVerses: 48,
    chapterVerses: [17, 10, 10, 11]
  },
  {
    id: 33,
    nameTa: 'மீகா',
    nameEn: 'Micah',
    testament: 'OT',
    category: 'MinorProphets',
    categoryTa: 'சிறிய தீர்க்கதரிசிகள்',
    chaptersCount: 7,
    totalVerses: 105,
    chapterVerses: [16, 13, 12, 13, 15, 16, 20]
  },
  {
    id: 34,
    nameTa: 'நாகூம்',
    nameEn: 'Nahum',
    testament: 'OT',
    category: 'MinorProphets',
    categoryTa: 'சிறிய தீர்க்கதரிசிகள்',
    chaptersCount: 3,
    totalVerses: 47,
    chapterVerses: [15, 13, 19]
  },
  {
    id: 35,
    nameTa: 'ஆபகூக்',
    nameEn: 'Habakkuk',
    testament: 'OT',
    category: 'MinorProphets',
    categoryTa: 'சிறிய தீர்க்கதரிசிகள்',
    chaptersCount: 3,
    totalVerses: 56,
    chapterVerses: [17, 20, 19]
  },
  {
    id: 36,
    nameTa: 'செப்பனியா',
    nameEn: 'Zephaniah',
    testament: 'OT',
    category: 'MinorProphets',
    categoryTa: 'சிறிய தீர்க்கதரிசிகள்',
    chaptersCount: 3,
    totalVerses: 53,
    chapterVerses: [18, 15, 20]
  },
  {
    id: 37,
    nameTa: 'ஆகாய்',
    nameEn: 'Haggai',
    testament: 'OT',
    category: 'MinorProphets',
    categoryTa: 'சிறிய தீர்க்கதரிசிகள்',
    chaptersCount: 2,
    totalVerses: 38,
    chapterVerses: [15, 23]
  },
  {
    id: 38,
    nameTa: 'சகரியா',
    nameEn: 'Zechariah',
    testament: 'OT',
    category: 'MinorProphets',
    categoryTa: 'சிறிய தீர்க்கதரிசிகள்',
    chaptersCount: 14,
    totalVerses: 211,
    chapterVerses: [21, 13, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21]
  },
  {
    id: 39,
    nameTa: 'மல்கியா',
    nameEn: 'Malachi',
    testament: 'OT',
    category: 'MinorProphets',
    categoryTa: 'சிறிய தீர்க்கதரிசிகள்',
    chaptersCount: 4,
    totalVerses: 55,
    chapterVerses: [14, 17, 18, 6]
  },

  // NEW TESTAMENT (புதிய ஏற்பாடு) - 27 Books
  {
    id: 40,
    nameTa: 'மத்தேயு',
    nameEn: 'Matthew',
    testament: 'NT',
    category: 'Gospels',
    categoryTa: 'சுவிசேஷங்கள்',
    chaptersCount: 28,
    totalVerses: 1071,
    chapterVerses: [
      25, 23, 17, 25, 48, 34, 29, 34, 38, 42,
      30, 50, 58, 36, 39, 28, 27, 35, 30, 34,
      46, 46, 39, 51, 46, 75, 66, 20
    ]
  },
  {
    id: 41,
    nameTa: 'மாற்கு',
    nameEn: 'Mark',
    testament: 'NT',
    category: 'Gospels',
    categoryTa: 'சுவிசேஷங்கள்',
    chaptersCount: 16,
    totalVerses: 678,
    chapterVerses: [
      45, 28, 35, 41, 43, 56, 37, 38, 50, 52,
      33, 44, 37, 72, 47, 20
    ]
  },
  {
    id: 42,
    nameTa: 'லூக்கா',
    nameEn: 'Luke',
    testament: 'NT',
    category: 'Gospels',
    categoryTa: 'சுவிசேஷங்கள்',
    chaptersCount: 24,
    totalVerses: 1151,
    chapterVerses: [
      80, 52, 38, 44, 39, 49, 50, 56, 62, 42,
      54, 59, 35, 35, 32, 31, 37, 43, 48, 47,
      38, 71, 56, 53
    ]
  },
  {
    id: 43,
    nameTa: 'யோவான்',
    nameEn: 'John',
    testament: 'NT',
    category: 'Gospels',
    categoryTa: 'சுவிசேஷங்கள்',
    chaptersCount: 21,
    totalVerses: 879,
    chapterVerses: [
      51, 25, 36, 54, 47, 71, 53, 59, 41, 42,
      57, 50, 38, 31, 27, 33, 26, 40, 42, 31,
      25
    ]
  },
  {
    id: 44,
    nameTa: 'அப்போஸ்தலர்',
    nameEn: 'Acts',
    testament: 'NT',
    category: 'Acts',
    categoryTa: 'வரலாறு',
    chaptersCount: 28,
    totalVerses: 1007,
    chapterVerses: [
      26, 47, 26, 37, 42, 15, 60, 40, 43, 48,
      30, 25, 52, 28, 41, 40, 34, 28, 41, 38,
      40, 30, 35, 27, 27, 32, 44, 31
    ]
  },
  {
    id: 45,
    nameTa: 'ரோமர்',
    nameEn: 'Romans',
    testament: 'NT',
    category: 'Pauline',
    categoryTa: 'பவுலின் நிருபங்கள்',
    chaptersCount: 16,
    totalVerses: 433,
    chapterVerses: [
      32, 29, 31, 25, 21, 23, 25, 39, 33, 21,
      36, 21, 14, 23, 33, 27
    ]
  },
  {
    id: 46,
    nameTa: '1 கொரிந்தியர்',
    nameEn: '1 Corinthians',
    testament: 'NT',
    category: 'Pauline',
    categoryTa: 'பவுலின் நிருபங்கள்',
    chaptersCount: 16,
    totalVerses: 437,
    chapterVerses: [
      31, 16, 23, 21, 13, 20, 40, 13, 27, 33,
      34, 31, 13, 40, 58, 24
    ]
  },
  {
    id: 47,
    nameTa: '2 கொரிந்தியர்',
    nameEn: '2 Corinthians',
    testament: 'NT',
    category: 'Pauline',
    categoryTa: 'பவுலின் நிருபங்கள்',
    chaptersCount: 13,
    totalVerses: 257,
    chapterVerses: [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 14]
  },
  {
    id: 48,
    nameTa: 'கலாத்தியர்',
    nameEn: 'Galatians',
    testament: 'NT',
    category: 'Pauline',
    categoryTa: 'பவுலின் நிருபங்கள்',
    chaptersCount: 6,
    totalVerses: 149,
    chapterVerses: [24, 21, 29, 31, 26, 18]
  },
  {
    id: 49,
    nameTa: 'எபேசியர்',
    nameEn: 'Ephesians',
    testament: 'NT',
    category: 'Pauline',
    categoryTa: 'பவுலின் நிருபங்கள்',
    chaptersCount: 6,
    totalVerses: 155,
    chapterVerses: [23, 22, 21, 32, 33, 24]
  },
  {
    id: 50,
    nameTa: 'பிலிப்பியர்',
    nameEn: 'Philippians',
    testament: 'NT',
    category: 'Pauline',
    categoryTa: 'பவுலின் நிருபங்கள்',
    chaptersCount: 4,
    totalVerses: 104,
    chapterVerses: [30, 30, 21, 23]
  },
  {
    id: 51,
    nameTa: 'கொலோசெயர்',
    nameEn: 'Colossians',
    testament: 'NT',
    category: 'Pauline',
    categoryTa: 'பவுலின் நிருபங்கள்',
    chaptersCount: 4,
    totalVerses: 95,
    chapterVerses: [29, 23, 25, 18]
  },
  {
    id: 52,
    nameTa: '1 தெசலோனிக்கேயர்',
    nameEn: '1 Thessalonians',
    testament: 'NT',
    category: 'Pauline',
    categoryTa: 'பவுலின் நிருபங்கள்',
    chaptersCount: 5,
    totalVerses: 89,
    chapterVerses: [10, 20, 13, 18, 28]
  },
  {
    id: 53,
    nameTa: '2 தெசலோனிக்கேயர்',
    nameEn: '2 Thessalonians',
    testament: 'NT',
    category: 'Pauline',
    categoryTa: 'பவுலின் நிருபங்கள்',
    chaptersCount: 3,
    totalVerses: 47,
    chapterVerses: [12, 17, 18]
  },
  {
    id: 54,
    nameTa: '1 தீமோத்தேயு',
    nameEn: '1 Timothy',
    testament: 'NT',
    category: 'Pauline',
    categoryTa: 'பவுலின் நிருபங்கள்',
    chaptersCount: 6,
    totalVerses: 113,
    chapterVerses: [20, 15, 16, 16, 25, 21]
  },
  {
    id: 55,
    nameTa: '2 தீமோத்தேயு',
    nameEn: '2 Timothy',
    testament: 'NT',
    category: 'Pauline',
    categoryTa: 'பவுலின் நிருபங்கள்',
    chaptersCount: 4,
    totalVerses: 83,
    chapterVerses: [18, 26, 17, 22]
  },
  {
    id: 56,
    nameTa: 'தீத்து',
    nameEn: 'Titus',
    testament: 'NT',
    category: 'Pauline',
    categoryTa: 'பவுலின் நிருபங்கள்',
    chaptersCount: 3,
    totalVerses: 46,
    chapterVerses: [16, 15, 15]
  },
  {
    id: 57,
    nameTa: 'பிலேமோன்',
    nameEn: 'Philemon',
    testament: 'NT',
    category: 'Pauline',
    categoryTa: 'பவுலின் நிருபங்கள்',
    chaptersCount: 1,
    totalVerses: 25,
    chapterVerses: [25]
  },
  {
    id: 58,
    nameTa: 'எபிரெயர்',
    nameEn: 'Hebrews',
    testament: 'NT',
    category: 'General',
    categoryTa: 'பொதுவான நிருபங்கள்',
    chaptersCount: 13,
    totalVerses: 303,
    chapterVerses: [14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25]
  },
  {
    id: 59,
    nameTa: 'யாக்கோபு',
    nameEn: 'James',
    testament: 'NT',
    category: 'General',
    categoryTa: 'பொதுவான நிருபங்கள்',
    chaptersCount: 5,
    totalVerses: 108,
    chapterVerses: [27, 26, 18, 17, 20]
  },
  {
    id: 60,
    nameTa: '1 பேதுரு',
    nameEn: '1 Peter',
    testament: 'NT',
    category: 'General',
    categoryTa: 'பொதுவான நிருபங்கள்',
    chaptersCount: 5,
    totalVerses: 105,
    chapterVerses: [25, 25, 22, 19, 14]
  },
  {
    id: 61,
    nameTa: '2 பேதுரு',
    nameEn: '2 Peter',
    testament: 'NT',
    category: 'General',
    categoryTa: 'பொதுவான நிருபங்கள்',
    chaptersCount: 3,
    totalVerses: 61,
    chapterVerses: [21, 22, 18]
  },
  {
    id: 62,
    nameTa: '1 யோவான்',
    nameEn: '1 John',
    testament: 'NT',
    category: 'General',
    categoryTa: 'பொதுவான நிருபங்கள்',
    chaptersCount: 5,
    totalVerses: 105,
    chapterVerses: [10, 29, 24, 21, 21]
  },
  {
    id: 63,
    nameTa: '2 யோவான்',
    nameEn: '2 John',
    testament: 'NT',
    category: 'General',
    categoryTa: 'பொதுவான நிருபங்கள்',
    chaptersCount: 1,
    totalVerses: 13,
    chapterVerses: [13]
  },
  {
    id: 64,
    nameTa: '3 யோவான்',
    nameEn: '3 John',
    testament: 'NT',
    category: 'General',
    categoryTa: 'பொதுவான நிருபங்கள்',
    chaptersCount: 1,
    totalVerses: 14,
    chapterVerses: [14]
  },
  {
    id: 65,
    nameTa: 'யூதா',
    nameEn: 'Jude',
    testament: 'NT',
    category: 'General',
    categoryTa: 'பொதுவான நிருபங்கள்',
    chaptersCount: 1,
    totalVerses: 25,
    chapterVerses: [25]
  },
  {
    id: 66,
    nameTa: 'வெளிப்படுத்தின விசேஷம்',
    nameEn: 'Revelation',
    testament: 'NT',
    category: 'Revelation',
    categoryTa: 'தீர்க்கதரிசனம்',
    chaptersCount: 22,
    totalVerses: 404,
    chapterVerses: [
      20, 29, 22, 11, 14, 17, 17, 13, 21, 11,
      19, 17, 18, 20, 8, 21, 18, 24, 21, 15,
      27, 21
    ]
  }
];

// Verify totals
export const TOTAL_BIBLE_BOOKS = BIBLE_BOOKS.length; // 66
export const TOTAL_BIBLE_CHAPTERS = BIBLE_BOOKS.reduce((sum, b) => sum + b.chaptersCount, 0); // 1,189
export const TOTAL_BIBLE_VERSES = BIBLE_BOOKS.reduce((sum, b) => sum + b.totalVerses, 0); // 31,102

export const OT_BOOKS = BIBLE_BOOKS.filter(b => b.testament === 'OT');
export const NT_BOOKS = BIBLE_BOOKS.filter(b => b.testament === 'NT');

export const OT_CHAPTERS_COUNT = OT_BOOKS.reduce((sum, b) => sum + b.chaptersCount, 0); // 929
export const NT_CHAPTERS_COUNT = NT_BOOKS.reduce((sum, b) => sum + b.chaptersCount, 0); // 260

export const OT_VERSES_COUNT = OT_BOOKS.reduce((sum, b) => sum + b.totalVerses, 0); // 23,145
export const NT_VERSES_COUNT = NT_BOOKS.reduce((sum, b) => sum + b.totalVerses, 0); // 7,957
