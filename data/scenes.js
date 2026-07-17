/* =========================================
   WEDDING DETAILS — EDIT EVERYTHING HERE
========================================= */

const wedding = {
  projectStatus: "concept",

  couple: {
    groomFirstName: "Albert",
    groomFullName: "Albert",

    brideFirstName: "Novia",
    brideFullName: "Novia"
  },

  invitation: {
    familyLine: "Together with our families",
    invitationLine: "we invite you to celebrate",
    promiseLine: "the beginning of our forever."
  },

  ceremony: {
    label: "Holy Matrimony",
    date: "To Be Announced",
    day: "To Be Announced",
    time: "To Be Announced",

    venueName: "To Be Announced",
    venueAddress: "To Be Announced",

    mapsLink: ""
  },

  reception: {
    label: "Wedding Reception",
    date: "To Be Announced",
    day: "To Be Announced",
    time: "To Be Announced",

    venueName: "To Be Announced",
    venueAddress: "To Be Announced",

    mapsLink: ""
  },

  dressCode: {
    title: "Dress Code",
    description: "To Be Announced"
  },

  rsvp: {
    deadline: "To Be Announced",
    formLink: "",
    whatsappNumber: ""
  },

  gift: {
    enabled: false,

    bankName: "",
    accountName: "",
    accountNumber: "",

    qrisImage: ""
  },

  contact: {
    groomPhone: "",
    bridePhone: ""
  }
};

const scenes = {
  arrival: {
    type: "weddingHero",

    groomName: wedding.couple.groomFirstName,
    brideName: wedding.couple.brideFirstName,

    familyText: wedding.invitation.familyLine,
    invitationText: wedding.invitation.invitationLine,
    futureText: wedding.invitation.promiseLine,

    button: "Open Invitation",
    next: "memoryBox"
  },
  memoryBox: {
    type: "box",
    smallText: "Something for our future",
    title: `${wedding.couple.groomFirstName} & ${wedding.couple.brideFirstName}`,
    body: "Tap the invitation case to open it.",
    next: "chapterIntro"
  },
  chapterIntro: {
    type: "formalInvitation",

    smallText: wedding.invitation.familyLine,

    groomName: wedding.couple.groomFirstName,
    brideName: wedding.couple.brideFirstName,

    invitationLine: "request the honour of your presence",
    celebrationLine: "at the celebration of their marriage.",

    next: "weddingDetails"
  },
  weddingDetails: {
    type: "weddingDetails",

    smallText: "The Wedding Day",
    title: "Save the Moment",

    notice:
      "Our date and venue are still being lovingly prepared. The confirmed details will appear here when the time is right.",

    ceremony: wedding.ceremony,
    reception: wedding.reception,

    next: "futurePromise"
  },


  ourJourney: {
  type: "adventureCarousel",

  smallText: "A little about us",
  title: "Our Journey",

  intro:
    "Before this invitation became a possibility, there were ordinary days, unexpected adventures, and countless moments that slowly became ours.",

  images: [
    "images/adventures/01.jpg",
    "images/adventures/02.jpg",
    "images/adventures/03.jpg",
    "images/adventures/04.jpg",
    "images/adventures/05.jpg",
    "images/adventures/06.jpg",
    "images/adventures/07.jpg",
    "images/adventures/08.jpg"
  ],

  reflection:
    "We did not arrive here through one perfect moment. We arrived through all the small moments in which we continued choosing each other.",

  finalText:
    "And someday, we hope to take the next step surrounded by the people who have been part of our lives.",

  next: "futurePromise"
},

  futurePromise: {
    type: "breath",

    lines: [
      "The date is still unwritten.",
      "The place is still waiting.",
      "But the future...",
      "already feels like ours."
    ],

    next: null
  },
  everydayUs: {
    type: "chapter",
    smallText: "01",
    title: "The Everyday Us",
    next: "adventures",
    moments: [
      {
        image: "images/everyday-us/01.jpg",
        text: "I used to think the gym was only a place to work out."
      },
      {
        image: "images/everyday-us/02-srgb.jpg",
        text: "But somehow, our ordinary routines became some of my favorite memories."
      },
      {
        images: [
          "images/everyday-us/kite-left-srgb.jpg",
          "images/everyday-us/kite-right.jpg"
        ],
        text: "Not because the days were special. Because you were there."
      }
    ]
  },  
  adventures: {
    type: "adventureCarousel",
    smallText: "02",
    title: "Our Little Adventures",

    intro: "We visited so many places this year.",

    images: [
      "images/adventures/01.jpg",
      "images/adventures/02.jpg",
      "images/adventures/03.jpg",
      "images/adventures/04.jpg",
      "images/adventures/05.jpg",
      "images/adventures/06.jpg",
      "images/adventures/07.jpg",
      "images/adventures/08.jpg",
      "images/adventures/09.jpg",
      "images/adventures/10.jpg",
      "images/adventures/11.jpg",
      "images/adventures/12.jpg",
      "images/adventures/13.jpg",
      "images/adventures/14.jpg",
      "images/adventures/15.jpg",
      "images/adventures/16.jpg",
      "images/adventures/17.jpg",
      "images/adventures/18.jpg",
      "images/adventures/19.jpg",
      "images/adventures/20.jpg",
      "images/adventures/21.jpg",
      "images/adventures/22.jpg",
      "images/adventures/23.jpg",
      "images/adventures/24.jpg",
      "images/adventures/25.jpg",
      "images/adventures/26.jpg",
      "images/adventures/27.jpeg",
      "images/adventures/29.jpeg",
      "images/adventures/30.jpeg",
      "images/adventures/31.jpeg"     
    ],

    reflection:
      "Some were far, some were simple, but every trip felt better with you beside me.",

    finalText:
      "Years from now, I may forget the roads we took, but I’ll remember who I was walking with.",

    next: "mahjongMemory"
  },  
  mahjongMemory: {
    type: "mahjong",
    smallText: "A little game we know too well",
    title: "One Last Round?",
    body: "We played so many random Mahjong nights together. So before we continue...",
    next: "afterMahjongBreath"
  },

  afterMahjongBreath: {
    type: "breath",
    lines: [
      "Some memories are loud.",
      "Some are quiet.",
      "But all of them became ours."
    ],
    next: "funnyUs"
  },
  
  funnyUs: {
    type: "chapter",
    smallText: "03",
    title: "The Funniest Us",
    next: "littleThings",
    moments: [
      {
        image: "images/funny/01.jpeg",
        text: "Some of our best memories weren't planned at all."
      },
      {
        image: "images/funny/02.jpeg",
        text: "Sometimes all it took was one silly joke to make the whole day unforgettable."
      },
      {
        image: "images/funny/03.jpeg",
        text: "If someone asked me what happiness looked like... it would probably look something like this."
      }
    ]
  },

  littleThings: {
    type: "chapter",
    smallText: "04",
    title: "The Little Things",
    next: "reflection",
    moments: [
      {
        image: "images/little-things/little-things.jpg",
        text: "The biggest memories weren't always the biggest moments. They were the tiny things you probably didn't even realize I noticed."
      }
    ]
  },

  reflection: {
    type: "chapter",
    smallText: "05",
    title: "What This Year Meant",
    next: "finalLetter",
    moments: [
      {
        image: "images/reflection/reflection.jpg",
        text: "This year wasn't special because everything was perfect. It was special because we kept choosing each other through every ordinary and extraordinary moment."
      }
    ]
  },

  holdHand: {
    type: "holdHand",
    smallText: "Before the last letter...",
    title: "Hold my hand.",
    body: "Just for a little while.",
    next: "finalLetter"
  },

  beforeLetterBreath: {
    type: "breath",
    lines: [
      "And if you ever wonder",
      "where my heart feels safest...",
      "it is here.",
      "With you."
    ],
    next: "finalLetter"
  },

  finalLetter: {
    type: "letter",
    smallText: "One last thing...",
    title: "For You",
    body: "Thank you for being part of my days, my routines, my adventures, and my future. I hope this little memory box reminds you how loved you are.",
    next: "ending"
  },


  ending: {
    type: "ending",
    smallText: "Chapter Three ends here.",
    title: "See you in Chapter Four.",
    body: "Let’s make more memories together.",
    finalText: "Happy Anniversary.",
    next: null
  }
};

