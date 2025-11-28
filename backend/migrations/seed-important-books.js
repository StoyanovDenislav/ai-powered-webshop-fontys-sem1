const database = require("../database");

const IMPORTANT_BOOKS = [
  // Ancient & Classical Literature (20 books)
  {
    title: "The Iliad",
    author: "Homer",
    description:
      "Ancient Greek epic poem about the Trojan War, exploring themes of honor, rage, and mortality.",
    price: 18.99,
    genres: ["Classic", "Epic", "Poetry"],
    stock_qty: 25,
  },
  {
    title: "The Odyssey",
    author: "Homer",
    description:
      "Epic tale of Odysseus's journey home after the Trojan War, filled with adventure and mythology.",
    price: 18.99,
    genres: ["Classic", "Epic", "Poetry"],
    stock_qty: 25,
  },
  {
    title: "The Republic",
    author: "Plato",
    description:
      "Foundational philosophical work exploring justice, governance, and the ideal state.",
    price: 16.99,
    genres: ["Philosophy", "Classic"],
    stock_qty: 20,
  },
  {
    title: "Meditations",
    author: "Marcus Aurelius",
    description:
      "Personal writings of the Roman Emperor, offering Stoic philosophy and practical wisdom.",
    price: 14.99,
    genres: ["Philosophy", "Classic"],
    stock_qty: 30,
  },
  {
    title: "The Art of War",
    author: "Sun Tzu",
    description:
      "Ancient Chinese military treatise on strategy, tactics, and leadership.",
    price: 12.99,
    genres: ["Philosophy", "History"],
    stock_qty: 35,
  },
  {
    title: "Metamorphoses",
    author: "Ovid",
    description:
      "Narrative poem chronicling the history of the world through mythological transformations.",
    price: 19.99,
    genres: ["Classic", "Poetry", "Mythology"],
    stock_qty: 15,
  },
  {
    title: "The Aeneid",
    author: "Virgil",
    description:
      "Latin epic poem following Aeneas's journey from Troy to Italy, founding Rome.",
    price: 17.99,
    genres: ["Classic", "Epic", "Poetry"],
    stock_qty: 18,
  },
  {
    title: "Oedipus Rex",
    author: "Sophocles",
    description:
      "Greek tragedy exploring fate, free will, and the tragic downfall of King Oedipus.",
    price: 13.99,
    genres: ["Classic", "Drama"],
    stock_qty: 22,
  },
  {
    title: "The Analects",
    author: "Confucius",
    description:
      "Collection of sayings and ideas attributed to the Chinese philosopher Confucius.",
    price: 15.99,
    genres: ["Philosophy", "Classic"],
    stock_qty: 20,
  },
  {
    title: "Tao Te Ching",
    author: "Laozi",
    description:
      "Fundamental text of Taoism, offering wisdom on living in harmony with the Tao.",
    price: 14.99,
    genres: ["Philosophy", "Classic"],
    stock_qty: 28,
  },
  {
    title: "Nicomachean Ethics",
    author: "Aristotle",
    description:
      "Aristotle's ethical philosophy examining virtue, happiness, and the good life.",
    price: 17.99,
    genres: ["Philosophy", "Classic"],
    stock_qty: 18,
  },
  {
    title: "The Histories",
    author: "Herodotus",
    description:
      "First great narrative history, chronicling the Greco-Persian Wars.",
    price: 21.99,
    genres: ["History", "Classic"],
    stock_qty: 12,
  },
  {
    title: "The Prince",
    author: "Niccolò Machiavelli",
    description:
      "Political treatise on acquiring and maintaining power, defining pragmatic leadership.",
    price: 14.99,
    genres: ["Philosophy", "History"],
    stock_qty: 25,
  },
  {
    title: "The Divine Comedy",
    author: "Dante Alighieri",
    description:
      "Epic poem depicting a journey through Hell, Purgatory, and Paradise.",
    price: 22.99,
    genres: ["Classic", "Poetry", "Epic"],
    stock_qty: 16,
  },
  {
    title: "The Canterbury Tales",
    author: "Geoffrey Chaucer",
    description:
      "Collection of stories told by pilgrims on their way to Canterbury.",
    price: 19.99,
    genres: ["Classic", "Poetry"],
    stock_qty: 14,
  },
  {
    title: "Bhagavad Gita",
    author: "Vyasa",
    description:
      "Hindu scripture presenting a conversation between Prince Arjuna and Lord Krishna.",
    price: 15.99,
    genres: ["Philosophy", "Classic"],
    stock_qty: 24,
  },
  {
    title: "The Epic of Gilgamesh",
    author: "Anonymous",
    description:
      "Ancient Mesopotamian epic following the adventures of King Gilgamesh.",
    price: 16.99,
    genres: ["Classic", "Epic", "Mythology"],
    stock_qty: 15,
  },
  {
    title: "One Thousand and One Nights",
    author: "Anonymous",
    description:
      "Collection of Middle Eastern folk tales including Aladdin and Sinbad.",
    price: 24.99,
    genres: ["Classic", "Fantasy"],
    stock_qty: 18,
  },
  {
    title: "The Symposium",
    author: "Plato",
    description:
      "Philosophical text exploring the nature of love through a series of speeches.",
    price: 14.99,
    genres: ["Philosophy", "Classic"],
    stock_qty: 17,
  },
  {
    title: "Confessions",
    author: "Saint Augustine",
    description:
      "Autobiographical work outlining Augustine's spiritual journey and conversion.",
    price: 16.99,
    genres: ["Philosophy", "Memoir", "Classic"],
    stock_qty: 19,
  },

  // Renaissance & Early Modern (15 books)
  {
    title: "Don Quixote",
    author: "Miguel de Cervantes",
    description:
      "Satirical novel about a man who loses his sanity and becomes a knight-errant.",
    price: 21.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 20,
  },
  {
    title: "Hamlet",
    author: "William Shakespeare",
    description:
      "Tragedy of the Prince of Denmark seeking revenge for his father's murder.",
    price: 15.99,
    genres: ["Classic", "Drama"],
    stock_qty: 30,
  },
  {
    title: "Macbeth",
    author: "William Shakespeare",
    description:
      "Tragedy exploring ambition, power, and guilt through the downfall of a Scottish king.",
    price: 14.99,
    genres: ["Classic", "Drama"],
    stock_qty: 28,
  },
  {
    title: "Paradise Lost",
    author: "John Milton",
    description:
      "Epic poem depicting the fall of Satan and the temptation of Adam and Eve.",
    price: 18.99,
    genres: ["Classic", "Poetry", "Epic"],
    stock_qty: 16,
  },
  {
    title: "Utopia",
    author: "Thomas More",
    description:
      "Fictional island society with seemingly perfect social and political systems.",
    price: 15.99,
    genres: ["Philosophy", "Classic"],
    stock_qty: 20,
  },
  {
    title: "Essays",
    author: "Michel de Montaigne",
    description:
      "Collection of personal essays covering a wide range of subjects and human nature.",
    price: 19.99,
    genres: ["Philosophy", "Essays", "Classic"],
    stock_qty: 15,
  },
  {
    title: "Leviathan",
    author: "Thomas Hobbes",
    description:
      "Political philosophy arguing for a social contract and sovereign authority.",
    price: 17.99,
    genres: ["Philosophy", "History"],
    stock_qty: 14,
  },
  {
    title: "Discourse on Method",
    author: "René Descartes",
    description:
      "Philosophical work introducing Cartesian doubt and 'I think, therefore I am.'",
    price: 14.99,
    genres: ["Philosophy", "Classic"],
    stock_qty: 18,
  },
  {
    title: "Pensées",
    author: "Blaise Pascal",
    description:
      "Collection of fragments defending Christianity and exploring human nature.",
    price: 16.99,
    genres: ["Philosophy", "Classic"],
    stock_qty: 13,
  },
  {
    title: "The Social Contract",
    author: "Jean-Jacques Rousseau",
    description:
      "Political philosophy on legitimate political authority and popular sovereignty.",
    price: 15.99,
    genres: ["Philosophy", "History"],
    stock_qty: 17,
  },
  {
    title: "Candide",
    author: "Voltaire",
    description:
      "Satirical novella critiquing optimism and exposing the absurdities of the world.",
    price: 14.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 22,
  },
  {
    title: "Gulliver's Travels",
    author: "Jonathan Swift",
    description:
      "Satirical novel following Lemuel Gulliver's voyages to strange lands.",
    price: 16.99,
    genres: ["Classic", "Fiction", "Fantasy"],
    stock_qty: 20,
  },
  {
    title: "The Wealth of Nations",
    author: "Adam Smith",
    description:
      "Foundational work of classical economics examining market systems and capitalism.",
    price: 24.99,
    genres: ["Philosophy", "History"],
    stock_qty: 12,
  },
  {
    title: "A Vindication of the Rights of Woman",
    author: "Mary Wollstonecraft",
    description:
      "Pioneering feminist treatise arguing for women's education and equality.",
    price: 16.99,
    genres: ["Philosophy", "History"],
    stock_qty: 15,
  },
  {
    title: "Common Sense",
    author: "Thomas Paine",
    description:
      "Revolutionary pamphlet advocating American independence from Britain.",
    price: 12.99,
    genres: ["History", "Philosophy"],
    stock_qty: 18,
  },

  // 19th Century Literature (30 books)
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description:
      "Romantic novel examining marriage, morality, and misconceptions in Georgian England.",
    price: 16.99,
    genres: ["Classic", "Romance", "Fiction"],
    stock_qty: 35,
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    description:
      "Gothic novel about a scientist who creates life with tragic consequences.",
    price: 15.99,
    genres: ["Classic", "Horror", "Fiction"],
    stock_qty: 30,
  },
  {
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    description:
      "Story of an orphaned governess and her emotional growth and love.",
    price: 17.99,
    genres: ["Classic", "Romance", "Fiction"],
    stock_qty: 28,
  },
  {
    title: "Wuthering Heights",
    author: "Emily Brontë",
    description:
      "Passionate and dark tale of love and revenge on the Yorkshire moors.",
    price: 16.99,
    genres: ["Classic", "Romance", "Fiction"],
    stock_qty: 25,
  },
  {
    title: "Moby-Dick",
    author: "Herman Melville",
    description:
      "Epic tale of Captain Ahab's obsessive quest to kill the white whale.",
    price: 19.99,
    genres: ["Classic", "Fiction", "Adventure"],
    stock_qty: 20,
  },
  {
    title: "Les Misérables",
    author: "Victor Hugo",
    description:
      "Epic novel exploring justice, redemption, and revolution in 19th-century France.",
    price: 24.99,
    genres: ["Classic", "Fiction", "History"],
    stock_qty: 18,
  },
  {
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    description:
      "Psychological novel about guilt, morality, and redemption after murder.",
    price: 18.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 22,
  },
  {
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    description:
      "Philosophical novel exploring faith, doubt, and morality through three brothers.",
    price: 21.99,
    genres: ["Classic", "Fiction", "Philosophy"],
    stock_qty: 16,
  },
  {
    title: "War and Peace",
    author: "Leo Tolstoy",
    description:
      "Epic novel chronicling Russian society during the Napoleonic era.",
    price: 26.99,
    genres: ["Classic", "Fiction", "History"],
    stock_qty: 15,
  },
  {
    title: "Anna Karenina",
    author: "Leo Tolstoy",
    description:
      "Tragic story of an aristocratic woman's affair and its consequences.",
    price: 19.99,
    genres: ["Classic", "Fiction", "Romance"],
    stock_qty: 20,
  },
  {
    title: "Madame Bovary",
    author: "Gustave Flaubert",
    description:
      "Realist novel about a doctor's wife seeking escape from provincial life.",
    price: 17.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 18,
  },
  {
    title: "The Count of Monte Cristo",
    author: "Alexandre Dumas",
    description:
      "Adventure novel of betrayal, imprisonment, and elaborate revenge.",
    price: 21.99,
    genres: ["Classic", "Fiction", "Adventure"],
    stock_qty: 24,
  },
  {
    title: "Great Expectations",
    author: "Charles Dickens",
    description:
      "Coming-of-age story of Pip and his journey through Victorian England.",
    price: 17.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 22,
  },
  {
    title: "A Tale of Two Cities",
    author: "Charles Dickens",
    description:
      "Historical novel set during the French Revolution, exploring sacrifice and resurrection.",
    price: 16.99,
    genres: ["Classic", "Fiction", "History"],
    stock_qty: 25,
  },
  {
    title: "Oliver Twist",
    author: "Charles Dickens",
    description:
      "Story of an orphan boy's experiences in the criminal underworld of London.",
    price: 16.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 20,
  },
  {
    title: "The Scarlet Letter",
    author: "Nathaniel Hawthorne",
    description: "Tale of sin, guilt, and redemption in Puritan New England.",
    price: 15.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 19,
  },
  {
    title: "The Adventures of Huckleberry Finn",
    author: "Mark Twain",
    description:
      "Coming-of-age story following Huck and Jim's journey down the Mississippi River.",
    price: 16.99,
    genres: ["Classic", "Fiction", "Adventure"],
    stock_qty: 26,
  },
  {
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    description: "Gothic novel exploring beauty, morality, and hedonism.",
    price: 15.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 23,
  },
  {
    title: "Dracula",
    author: "Bram Stoker",
    description:
      "Gothic horror novel introducing the iconic vampire Count Dracula.",
    price: 16.99,
    genres: ["Classic", "Horror", "Fiction"],
    stock_qty: 28,
  },
  {
    title: "Heart of Darkness",
    author: "Joseph Conrad",
    description: "Novella exploring imperialism and human nature in the Congo.",
    price: 14.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 20,
  },
  {
    title: "The Strange Case of Dr Jekyll and Mr Hyde",
    author: "Robert Louis Stevenson",
    description:
      "Gothic novella about a man's dual nature and moral struggles.",
    price: 13.99,
    genres: ["Classic", "Horror", "Fiction"],
    stock_qty: 24,
  },
  {
    title: "Treasure Island",
    author: "Robert Louis Stevenson",
    description: "Classic adventure novel about pirates and buried treasure.",
    price: 15.99,
    genres: ["Classic", "Adventure", "Fiction"],
    stock_qty: 22,
  },
  {
    title: "The Time Machine",
    author: "H.G. Wells",
    description:
      "Science fiction novel about time travel and the future of humanity.",
    price: 14.99,
    genres: ["Classic", "Fiction", "Science Fiction"],
    stock_qty: 21,
  },
  {
    title: "Twenty Thousand Leagues Under the Sea",
    author: "Jules Verne",
    description:
      "Adventure novel following Captain Nemo and his submarine Nautilus.",
    price: 17.99,
    genres: ["Classic", "Adventure", "Fiction"],
    stock_qty: 19,
  },
  {
    title: "The Jungle Book",
    author: "Rudyard Kipling",
    description:
      "Collection of stories about Mowgli, a boy raised by wolves in India.",
    price: 15.99,
    genres: ["Classic", "Fiction", "Adventure"],
    stock_qty: 20,
  },
  {
    title: "The Turn of the Screw",
    author: "Henry James",
    description:
      "Gothic ghost story about a governess and mysterious occurrences.",
    price: 13.99,
    genres: ["Classic", "Horror", "Fiction"],
    stock_qty: 17,
  },
  {
    title: "Uncle Tom's Cabin",
    author: "Harriet Beecher Stowe",
    description:
      "Anti-slavery novel depicting the harsh reality of enslaved African Americans.",
    price: 16.99,
    genres: ["Classic", "Fiction", "History"],
    stock_qty: 15,
  },
  {
    title: "The Awakening",
    author: "Kate Chopin",
    description:
      "Novel exploring a woman's sexual and artistic awakening in Louisiana.",
    price: 14.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 18,
  },
  {
    title: "The Red Badge of Courage",
    author: "Stephen Crane",
    description:
      "War novel following a young soldier's psychological journey during the Civil War.",
    price: 14.99,
    genres: ["Classic", "Fiction", "History"],
    stock_qty: 16,
  },
  {
    title: "Thus Spoke Zarathustra",
    author: "Friedrich Nietzsche",
    description:
      "Philosophical novel introducing concepts of the Übermensch and eternal recurrence.",
    price: 18.99,
    genres: ["Philosophy", "Classic"],
    stock_qty: 17,
  },

  // Early 20th Century (25 books)
  {
    title: "Ulysses",
    author: "James Joyce",
    description:
      "Modernist novel paralleling Homer's Odyssey in a single day in Dublin.",
    price: 22.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 14,
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "Jazz Age novel exploring wealth, love, and the American Dream.",
    price: 16.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 40,
  },
  {
    title: "Mrs Dalloway",
    author: "Virginia Woolf",
    description:
      "Modernist novel following a day in the life of Clarissa Dalloway in post-WWI England.",
    price: 15.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 18,
  },
  {
    title: "To the Lighthouse",
    author: "Virginia Woolf",
    description:
      "Modernist novel exploring perception, memory, and the passage of time.",
    price: 16.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 16,
  },
  {
    title: "A Room of One's Own",
    author: "Virginia Woolf",
    description:
      "Extended essay on women and fiction, advocating for women's independence.",
    price: 14.99,
    genres: ["Philosophy", "Essays"],
    stock_qty: 20,
  },
  {
    title: "The Metamorphosis",
    author: "Franz Kafka",
    description:
      "Absurdist novella about a man who wakes up transformed into an insect.",
    price: 13.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 25,
  },
  {
    title: "The Trial",
    author: "Franz Kafka",
    description:
      "Surreal novel about a man arrested and prosecuted by an inaccessible authority.",
    price: 15.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 19,
  },
  {
    title: "In Search of Lost Time",
    author: "Marcel Proust",
    description:
      "Monumental novel exploring memory, time, and society in Belle Époque France.",
    price: 29.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 10,
  },
  {
    title: "The Sound and the Fury",
    author: "William Faulkner",
    description:
      "Modernist novel depicting the decline of a Southern aristocratic family.",
    price: 17.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 15,
  },
  {
    title: "As I Lay Dying",
    author: "William Faulkner",
    description: "Novel following a family's journey to bury their matriarch.",
    price: 16.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 16,
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    description:
      "Dystopian novel depicting a technologically advanced but dehumanized society.",
    price: 16.99,
    genres: ["Classic", "Fiction", "Science Fiction"],
    stock_qty: 30,
  },
  {
    title: "1984",
    author: "George Orwell",
    description:
      "Dystopian novel about totalitarianism, surveillance, and thought control.",
    price: 16.99,
    genres: ["Classic", "Fiction", "Science Fiction"],
    stock_qty: 35,
  },
  {
    title: "Animal Farm",
    author: "George Orwell",
    description:
      "Allegorical novella satirizing the Russian Revolution and Stalinism.",
    price: 14.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 32,
  },
  {
    title: "The Grapes of Wrath",
    author: "John Steinbeck",
    description:
      "Novel depicting a family's struggle during the Great Depression.",
    price: 18.99,
    genres: ["Classic", "Fiction", "History"],
    stock_qty: 20,
  },
  {
    title: "Of Mice and Men",
    author: "John Steinbeck",
    description:
      "Tragic novella about two displaced migrant workers during the Depression.",
    price: 14.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 28,
  },
  {
    title: "The Sun Also Rises",
    author: "Ernest Hemingway",
    description:
      "Novel depicting the Lost Generation's post-WWI disillusionment.",
    price: 16.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 22,
  },
  {
    title: "A Farewell to Arms",
    author: "Ernest Hemingway",
    description: "War novel exploring love and loss during World War I.",
    price: 17.99,
    genres: ["Classic", "Fiction", "History"],
    stock_qty: 20,
  },
  {
    title: "For Whom the Bell Tolls",
    author: "Ernest Hemingway",
    description:
      "Novel set during the Spanish Civil War, exploring duty and sacrifice.",
    price: 18.99,
    genres: ["Classic", "Fiction", "History"],
    stock_qty: 18,
  },
  {
    title: "The Old Man and the Sea",
    author: "Ernest Hemingway",
    description:
      "Novella about an aging fisherman's epic struggle with a giant marlin.",
    price: 14.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 25,
  },
  {
    title: "All Quiet on the Western Front",
    author: "Erich Maria Remarque",
    description:
      "Anti-war novel depicting the horrors of WWI from a German soldier's perspective.",
    price: 16.99,
    genres: ["Classic", "Fiction", "History"],
    stock_qty: 21,
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description:
      "Coming-of-age novel following teenager Holden Caulfield's alienation.",
    price: 16.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 30,
  },
  {
    title: "Invisible Man",
    author: "Ralph Ellison",
    description:
      "Novel exploring African American identity and social invisibility.",
    price: 17.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 19,
  },
  {
    title: "The Stranger",
    author: "Albert Camus",
    description:
      "Existentialist novel about an emotionally detached man who commits murder.",
    price: 15.99,
    genres: ["Classic", "Fiction", "Philosophy"],
    stock_qty: 24,
  },
  {
    title: "The Plague",
    author: "Albert Camus",
    description: "Allegorical novel about an outbreak of plague in Algeria.",
    price: 16.99,
    genres: ["Classic", "Fiction", "Philosophy"],
    stock_qty: 20,
  },
  {
    title: "Being and Nothingness",
    author: "Jean-Paul Sartre",
    description:
      "Existentialist philosophical text on consciousness, being, and freedom.",
    price: 24.99,
    genres: ["Philosophy"],
    stock_qty: 12,
  },

  // Mid-Late 20th Century (30 books)
  {
    title: "Lord of the Flies",
    author: "William Golding",
    description:
      "Novel about British boys stranded on an island, descending into savagery.",
    price: 15.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 28,
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description:
      "Novel addressing racial injustice in the American South through a child's eyes.",
    price: 16.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 35,
  },
  {
    title: "One Hundred Years of Solitude",
    author: "Gabriel García Márquez",
    description:
      "Magical realist epic chronicling the Buendía family over generations.",
    price: 19.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 22,
  },
  {
    title: "Love in the Time of Cholera",
    author: "Gabriel García Márquez",
    description: "Romantic novel spanning decades, exploring enduring love.",
    price: 17.99,
    genres: ["Classic", "Fiction", "Romance"],
    stock_qty: 20,
  },
  {
    title: "Lolita",
    author: "Vladimir Nabokov",
    description:
      "Controversial novel about obsession, told by an unreliable narrator.",
    price: 17.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 18,
  },
  {
    title: "Slaughterhouse-Five",
    author: "Kurt Vonnegut",
    description:
      "Anti-war novel using science fiction elements to explore the bombing of Dresden.",
    price: 16.99,
    genres: ["Classic", "Fiction", "Science Fiction"],
    stock_qty: 24,
  },
  {
    title: "Catch-22",
    author: "Joseph Heller",
    description:
      "Satirical war novel depicting the absurdity of military bureaucracy.",
    price: 18.99,
    genres: ["Classic", "Fiction"],
    stock_qty: 22,
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    description:
      "Epic fantasy trilogy about the quest to destroy the One Ring.",
    price: 34.99,
    genres: ["Fantasy", "Classic", "Fiction"],
    stock_qty: 30,
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description:
      "Fantasy novel following Bilbo Baggins on an unexpected adventure.",
    price: 16.99,
    genres: ["Fantasy", "Classic", "Fiction"],
    stock_qty: 32,
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    description: "Science fiction epic set on the desert planet Arrakis.",
    price: 19.99,
    genres: ["Science Fiction", "Fiction"],
    stock_qty: 28,
  },
  {
    title: "Foundation",
    author: "Isaac Asimov",
    description:
      "Science fiction series about the fall and rise of galactic civilization.",
    price: 17.99,
    genres: ["Science Fiction", "Fiction"],
    stock_qty: 20,
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    description:
      "Dystopian novel about a future where books are banned and burned.",
    price: 15.99,
    genres: ["Classic", "Fiction", "Science Fiction"],
    stock_qty: 26,
  },
  {
    title: "The Handmaid's Tale",
    author: "Margaret Atwood",
    description:
      "Dystopian novel depicting a totalitarian theocracy and women's oppression.",
    price: 17.99,
    genres: ["Fiction", "Science Fiction"],
    stock_qty: 30,
  },
  {
    title: "Beloved",
    author: "Toni Morrison",
    description:
      "Novel exploring the legacy of slavery and trauma in post-Civil War America.",
    price: 17.99,
    genres: ["Fiction", "Classic"],
    stock_qty: 20,
  },
  {
    title: "The Color Purple",
    author: "Alice Walker",
    description:
      "Epistolary novel about African American women in the early 20th century South.",
    price: 16.99,
    genres: ["Fiction", "Classic"],
    stock_qty: 22,
  },
  {
    title: "Midnight's Children",
    author: "Salman Rushdie",
    description:
      "Magical realist novel about India's transition from British colonialism to independence.",
    price: 19.99,
    genres: ["Fiction"],
    stock_qty: 16,
  },
  {
    title: "The Name of the Rose",
    author: "Umberto Eco",
    description:
      "Historical mystery novel set in a 14th-century Italian monastery.",
    price: 19.99,
    genres: ["Fiction", "Mystery"],
    stock_qty: 18,
  },
  {
    title: "The Bell Jar",
    author: "Sylvia Plath",
    description:
      "Semi-autobiographical novel exploring mental illness and identity.",
    price: 15.99,
    genres: ["Fiction", "Classic"],
    stock_qty: 24,
  },
  {
    title: "On the Road",
    author: "Jack Kerouac",
    description:
      "Beat Generation novel chronicling cross-country travels and bohemian lifestyle.",
    price: 16.99,
    genres: ["Fiction", "Classic"],
    stock_qty: 22,
  },
  {
    title: "A Clockwork Orange",
    author: "Anthony Burgess",
    description:
      "Dystopian novel exploring youth violence and behavioral conditioning.",
    price: 15.99,
    genres: ["Fiction", "Science Fiction"],
    stock_qty: 20,
  },
  {
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    description:
      "Novel depicting the effects of colonialism on Nigerian tribal society.",
    price: 15.99,
    genres: ["Fiction", "Classic"],
    stock_qty: 22,
  },
  {
    title: "The Remains of the Day",
    author: "Kazuo Ishiguro",
    description:
      "Novel about an English butler reflecting on his life and service.",
    price: 16.99,
    genres: ["Fiction"],
    stock_qty: 18,
  },
  {
    title: "Never Let Me Go",
    author: "Kazuo Ishiguro",
    description: "Dystopian novel about clones raised for organ donation.",
    price: 17.99,
    genres: ["Fiction", "Science Fiction"],
    stock_qty: 20,
  },
  {
    title: "The Unbearable Lightness of Being",
    author: "Milan Kundera",
    description:
      "Philosophical novel exploring love and existence during the Prague Spring.",
    price: 17.99,
    genres: ["Fiction", "Philosophy"],
    stock_qty: 16,
  },
  {
    title: "Disgrace",
    author: "J.M. Coetzee",
    description:
      "Novel exploring post-apartheid South Africa through a disgraced professor.",
    price: 16.99,
    genres: ["Fiction"],
    stock_qty: 15,
  },
  {
    title: "The God of Small Things",
    author: "Arundhati Roy",
    description:
      "Novel about fraternal twins in India and the consequences of forbidden love.",
    price: 17.99,
    genres: ["Fiction"],
    stock_qty: 18,
  },
  {
    title: "White Teeth",
    author: "Zadie Smith",
    description:
      "Multi-generational novel exploring multiculturalism in contemporary London.",
    price: 17.99,
    genres: ["Fiction"],
    stock_qty: 19,
  },
  {
    title: "The Road",
    author: "Cormac McCarthy",
    description:
      "Post-apocalyptic novel about a father and son's journey through devastation.",
    price: 16.99,
    genres: ["Fiction"],
    stock_qty: 24,
  },
  {
    title: "Blood Meridian",
    author: "Cormac McCarthy",
    description:
      "Western novel depicting extreme violence in the American frontier.",
    price: 17.99,
    genres: ["Fiction", "History"],
    stock_qty: 16,
  },
  {
    title: "Infinite Jest",
    author: "David Foster Wallace",
    description:
      "Postmodern novel exploring addiction, entertainment, and American culture.",
    price: 24.99,
    genres: ["Fiction"],
    stock_qty: 12,
  },

  // Non-Fiction & Philosophy (20 books)
  {
    title: "The Origin of Species",
    author: "Charles Darwin",
    description:
      "Foundational scientific work introducing the theory of evolution by natural selection.",
    price: 19.99,
    genres: ["Science", "History"],
    stock_qty: 20,
  },
  {
    title: "The Communist Manifesto",
    author: "Karl Marx",
    description:
      "Political pamphlet outlining communist ideology and class struggle.",
    price: 12.99,
    genres: ["Philosophy", "History"],
    stock_qty: 22,
  },
  {
    title: "Das Kapital",
    author: "Karl Marx",
    description: "Critical analysis of capitalism and political economy.",
    price: 24.99,
    genres: ["Philosophy", "History"],
    stock_qty: 14,
  },
  {
    title: "The Interpretation of Dreams",
    author: "Sigmund Freud",
    description:
      "Foundational text introducing psychoanalysis and dream analysis.",
    price: 19.99,
    genres: ["Psychology", "Philosophy"],
    stock_qty: 18,
  },
  {
    title: "The Second Sex",
    author: "Simone de Beauvoir",
    description:
      "Feminist treatise analyzing women's oppression and otherness.",
    price: 21.99,
    genres: ["Philosophy", "History"],
    stock_qty: 17,
  },
  {
    title: "The Diary of a Young Girl",
    author: "Anne Frank",
    description:
      "Diary of a Jewish girl hiding from Nazis during World War II.",
    price: 14.99,
    genres: ["Memoir", "History"],
    stock_qty: 30,
  },
  {
    title: "Night",
    author: "Elie Wiesel",
    description:
      "Holocaust memoir recounting experiences in Nazi concentration camps.",
    price: 14.99,
    genres: ["Memoir", "History"],
    stock_qty: 25,
  },
  {
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    description:
      "Holocaust memoir and introduction to logotherapy, finding meaning in suffering.",
    price: 15.99,
    genres: ["Memoir", "Philosophy", "Psychology"],
    stock_qty: 28,
  },
  {
    title: "The Autobiography of Malcolm X",
    author: "Malcolm X",
    description:
      "Autobiography of the influential African American activist and minister.",
    price: 17.99,
    genres: ["Memoir", "History"],
    stock_qty: 22,
  },
  {
    title: "Silent Spring",
    author: "Rachel Carson",
    description:
      "Environmental science book warning about the dangers of pesticides.",
    price: 16.99,
    genres: ["Science", "History"],
    stock_qty: 18,
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    description: "Popular science book exploring cosmology and the universe.",
    price: 18.99,
    genres: ["Science"],
    stock_qty: 24,
  },
  {
    title: "The Selfish Gene",
    author: "Richard Dawkins",
    description: "Gene-centered view of evolution and natural selection.",
    price: 17.99,
    genres: ["Science"],
    stock_qty: 20,
  },
  {
    title: "Guns, Germs, and Steel",
    author: "Jared Diamond",
    description: "Exploration of how geography shaped human civilizations.",
    price: 19.99,
    genres: ["History", "Science"],
    stock_qty: 18,
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    description: "History of humankind from the Stone Age to the modern era.",
    price: 21.99,
    genres: ["History", "Science"],
    stock_qty: 32,
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    description: "Exploration of two systems of thinking and cognitive biases.",
    price: 19.99,
    genres: ["Psychology", "Science"],
    stock_qty: 24,
  },
  {
    title: "The Structure of Scientific Revolutions",
    author: "Thomas S. Kuhn",
    description: "Analysis of how scientific paradigms shift and evolve.",
    price: 18.99,
    genres: ["Philosophy", "Science"],
    stock_qty: 15,
  },
  {
    title: "The Feminine Mystique",
    author: "Betty Friedan",
    description:
      "Feminist work challenging women's domestic roles in the 1960s.",
    price: 16.99,
    genres: ["Philosophy", "History"],
    stock_qty: 16,
  },
  {
    title: "The Fire Next Time",
    author: "James Baldwin",
    description:
      "Essays on race and American society during the Civil Rights era.",
    price: 15.99,
    genres: ["Essays", "History"],
    stock_qty: 20,
  },
  {
    title: "The Double Helix",
    author: "James D. Watson",
    description: "Personal account of the discovery of DNA's structure.",
    price: 16.99,
    genres: ["Science", "Memoir"],
    stock_qty: 17,
  },
  {
    title: "Orientalism",
    author: "Edward Said",
    description:
      "Critical analysis of Western representations of the Eastern world.",
    price: 19.99,
    genres: ["Philosophy", "History"],
    stock_qty: 14,
  },

  // Contemporary & Recent (10 books)
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    description: "Novel about friendship and redemption set in Afghanistan.",
    price: 17.99,
    genres: ["Fiction"],
    stock_qty: 26,
  },
  {
    title: "Life of Pi",
    author: "Yann Martel",
    description:
      "Survival story of a boy stranded on a lifeboat with a Bengal tiger.",
    price: 16.99,
    genres: ["Fiction"],
    stock_qty: 24,
  },
  {
    title: "The Brief Wondrous Life of Oscar Wao",
    author: "Junot Díaz",
    description:
      "Novel blending Dominican history with the life of an overweight nerd.",
    price: 17.99,
    genres: ["Fiction"],
    stock_qty: 18,
  },
  {
    title: "Americanah",
    author: "Chimamanda Ngozi Adichie",
    description:
      "Novel exploring race, immigration, and identity across continents.",
    price: 17.99,
    genres: ["Fiction"],
    stock_qty: 20,
  },
  {
    title: "Half of a Yellow Sun",
    author: "Chimamanda Ngozi Adichie",
    description:
      "Novel set during the Nigerian Civil War, exploring love and survival.",
    price: 17.99,
    genres: ["Fiction", "History"],
    stock_qty: 18,
  },
  {
    title: "The Goldfinch",
    author: "Donna Tartt",
    description:
      "Coming-of-age novel centered on a painting stolen during a terrorist attack.",
    price: 19.99,
    genres: ["Fiction"],
    stock_qty: 22,
  },
  {
    title: "A Little Life",
    author: "Hanya Yanagihara",
    description:
      "Intense novel exploring friendship, trauma, and survival in New York.",
    price: 21.99,
    genres: ["Fiction"],
    stock_qty: 16,
  },
  {
    title: "The Underground Railroad",
    author: "Colson Whitehead",
    description:
      "Historical novel reimagining the Underground Railroad as an actual railroad.",
    price: 17.99,
    genres: ["Fiction", "History"],
    stock_qty: 20,
  },
  {
    title: "Normal People",
    author: "Sally Rooney",
    description:
      "Contemporary novel exploring the complex relationship between two Irish teens.",
    price: 16.99,
    genres: ["Fiction", "Romance"],
    stock_qty: 28,
  },
  {
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    description:
      "Mystery novel about a marsh girl accused of murder in North Carolina.",
    price: 17.99,
    genres: ["Fiction", "Mystery"],
    stock_qty: 30,
  },
];

async function seedBooks() {
  try {
    console.log("🌱 Starting to seed books...");

    // Clear existing books
    await database.query("DELETE FROM books WHERE id > 0", []);
    console.log("✅ Cleared existing books");

    // Insert all books
    let successCount = 0;
    for (const book of IMPORTANT_BOOKS) {
      try {
        await database.query(
          `INSERT INTO books (title, author, description, price, genres, stock_qty)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            book.title,
            book.author,
            book.description,
            book.price,
            book.genres,
            book.stock_qty,
          ]
        );
        successCount++;
        if (successCount % 10 === 0) {
          console.log(`📚 Inserted ${successCount} books...`);
        }
      } catch (err) {
        console.error(`❌ Error inserting "${book.title}":`, err.message);
      }
    }

    console.log(
      `\n✅ Successfully seeded ${successCount} out of ${IMPORTANT_BOOKS.length} books!`
    );
    console.log("\n📊 Books by genre:");

    const genreCounts = await database.query(
      `SELECT UNNEST(genres) as genre, COUNT(*) as count 
       FROM books 
       GROUP BY genre 
       ORDER BY count DESC`,
      []
    );

    genreCounts.forEach((row) => {
      console.log(`   ${row.genre}: ${row.count} books`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding books:", error);
    process.exit(1);
  }
}

seedBooks();
