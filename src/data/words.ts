export type PartOfSpeech = 'n.' | 'v.' | 'adj.' | 'adv.';
export type Grade = '初一' | '初二' | '初三';

export interface Word {
  id: string;
  word: string;
  phonetic: string;
  translation: string[];
  partOfSpeech: PartOfSpeech;
  grade: Grade;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
}

export const WORDS: Word[] = [
  // Nouns (20)
  { id: 'n1', word: 'apple', phonetic: '/ˈæpl/', translation: ['苹果'], partOfSpeech: 'n.', grade: '初一', examples: ['I eat an apple every day.'], synonyms: [], antonyms: [] },
  { id: 'n2', word: 'book', phonetic: '/bʊk/', translation: ['书', '书籍'], partOfSpeech: 'n.', grade: '初一', examples: ['This is a good book.'], synonyms: [], antonyms: [] },
  { id: 'n3', word: 'cat', phonetic: '/kæt/', translation: ['猫'], partOfSpeech: 'n.', grade: '初一', examples: ['The cat is sleeping.'], synonyms: [], antonyms: [] },
  { id: 'n4', word: 'dog', phonetic: '/dɒɡ/', translation: ['狗'], partOfSpeech: 'n.', grade: '初一', examples: ['My dog likes to play.'], synonyms: [], antonyms: [] },
  { id: 'n5', word: 'family', phonetic: '/ˈfæməli/', translation: ['家庭', '家人'], partOfSpeech: 'n.', grade: '初一', examples: ['I love my family.'], synonyms: [], antonyms: [] },
  { id: 'n6', word: 'girl', phonetic: '/ɡɜːl/', translation: ['女孩'], partOfSpeech: 'n.', grade: '初一', examples: ['The girl is reading.'], synonyms: [], antonyms: ['boy'] },
  { id: 'n7', word: 'house', phonetic: '/haʊs/', translation: ['房子', '住宅'], partOfSpeech: 'n.', grade: '初一', examples: ['They live in a big house.'], synonyms: ['home'], antonyms: [] },
  { id: 'n8', word: 'idea', phonetic: '/aɪˈdɪə/', translation: ['主意', '想法'], partOfSpeech: 'n.', grade: '初二', examples: ['That is a great idea!'], synonyms: ['thought'], antonyms: [] },
  { id: 'n9', word: 'job', phonetic: '/dʒɒb/', translation: ['工作', '职业'], partOfSpeech: 'n.', grade: '初二', examples: ['He has a new job.'], synonyms: ['work'], antonyms: [] },
  { id: 'n10', word: 'key', phonetic: '/kiː/', translation: ['钥匙', '关键'], partOfSpeech: 'n.', grade: '初一', examples: ['I lost my key.'], synonyms: [], antonyms: [] },
  { id: 'n11', word: 'letter', phonetic: '/ˈletə(r)/', translation: ['信', '字母'], partOfSpeech: 'n.', grade: '初一', examples: ['She wrote a letter to her friend.'], synonyms: [], antonyms: [] },
  { id: 'n12', word: 'money', phonetic: '/ˈmʌni/', translation: ['钱', '金钱'], partOfSpeech: 'n.', grade: '初二', examples: ['I need some money to buy a book.'], synonyms: [], antonyms: [] },
  { id: 'n13', word: 'name', phonetic: '/neɪm/', translation: ['名字', '名称'], partOfSpeech: 'n.', grade: '初一', examples: ['What is your name?'], synonyms: [], antonyms: [] },
  { id: 'n14', word: 'office', phonetic: '/ˈɒfɪs/', translation: ['办公室'], partOfSpeech: 'n.', grade: '初二', examples: ['He works in an office.'], synonyms: [], antonyms: [] },
  { id: 'n15', word: 'paper', phonetic: '/ˈpeɪpə(r)/', translation: ['纸', '试卷'], partOfSpeech: 'n.', grade: '初一', examples: ['Write your name on the paper.'], synonyms: [], antonyms: [] },
  { id: 'n16', word: 'question', phonetic: '/ˈkwestʃən/', translation: ['问题'], partOfSpeech: 'n.', grade: '初一', examples: ['I have a question.'], synonyms: ['problem'], antonyms: ['answer'] },
  { id: 'n17', word: 'room', phonetic: '/ruːm/', translation: ['房间', '空间'], partOfSpeech: 'n.', grade: '初一', examples: ['Clean your room.'], synonyms: [], antonyms: [] },
  { id: 'n18', word: 'school', phonetic: '/skuːl/', translation: ['学校'], partOfSpeech: 'n.', grade: '初一', examples: ['I go to school by bus.'], synonyms: [], antonyms: [] },
  { id: 'n19', word: 'time', phonetic: '/taɪm/', translation: ['时间', '次数'], partOfSpeech: 'n.', grade: '初一', examples: ['What time is it?'], synonyms: [], antonyms: [] },
  { id: 'n20', word: 'water', phonetic: '/ˈwɔːtə(r)/', translation: ['水'], partOfSpeech: 'n.', grade: '初一', examples: ['Drink more water.'], synonyms: [], antonyms: [] },

  // Verbs (15)
  { id: 'v1', word: 'ask', phonetic: '/ɑːsk/', translation: ['问', '请求'], partOfSpeech: 'v.', grade: '初一', examples: ['Can I ask you a question?'], synonyms: ['inquire'], antonyms: ['answer'] },
  { id: 'v2', word: 'buy', phonetic: '/baɪ/', translation: ['买'], partOfSpeech: 'v.', grade: '初一', examples: ['I want to buy a new pen.'], synonyms: ['purchase'], antonyms: ['sell'] },
  { id: 'v3', word: 'come', phonetic: '/kʌm/', translation: ['来'], partOfSpeech: 'v.', grade: '初一', examples: ['Please come here.'], synonyms: [], antonyms: ['go'] },
  { id: 'v4', word: 'do', phonetic: '/duː/', translation: ['做', '干'], partOfSpeech: 'v.', grade: '初一', examples: ['I do my homework every day.'], synonyms: [], antonyms: [] },
  { id: 'v5', word: 'eat', phonetic: '/iːt/', translation: ['吃'], partOfSpeech: 'v.', grade: '初一', examples: ['What do you want to eat?'], synonyms: [], antonyms: [] },
  { id: 'v6', word: 'find', phonetic: '/faɪnd/', translation: ['找到', '发现'], partOfSpeech: 'v.', grade: '初一', examples: ['I cannot find my book.'], synonyms: ['discover'], antonyms: ['lose'] },
  { id: 'v7', word: 'go', phonetic: '/ɡəʊ/', translation: ['去', '走'], partOfSpeech: 'v.', grade: '初一', examples: ['Let us go to the park.'], synonyms: [], antonyms: ['come'] },
  { id: 'v8', word: 'have', phonetic: '/hæv/', translation: ['有', '吃'], partOfSpeech: 'v.', grade: '初一', examples: ['I have a sister.'], synonyms: ['own'], antonyms: [] },
  { id: 'v9', word: 'know', phonetic: '/nəʊ/', translation: ['知道', '认识'], partOfSpeech: 'v.', grade: '初一', examples: ['I do not know the answer.'], synonyms: [], antonyms: [] },
  { id: 'v10', word: 'like', phonetic: '/laɪk/', translation: ['喜欢'], partOfSpeech: 'v.', grade: '初一', examples: ['I like playing basketball.'], synonyms: ['love'], antonyms: ['dislike', 'hate'] },
  { id: 'v11', word: 'make', phonetic: '/meɪk/', translation: ['做', '制造'], partOfSpeech: 'v.', grade: '初一', examples: ['My mom makes a cake for me.'], synonyms: ['create'], antonyms: [] },
  { id: 'v12', word: 'play', phonetic: '/pleɪ/', translation: ['玩', '打（球）'], partOfSpeech: 'v.', grade: '初一', examples: ['They play football after school.'], synonyms: [], antonyms: [] },
  { id: 'v13', word: 'read', phonetic: '/riːd/', translation: ['读', '阅读'], partOfSpeech: 'v.', grade: '初一', examples: ['I like to read books.'], synonyms: [], antonyms: [] },
  { id: 'v14', word: 'see', phonetic: '/siː/', translation: ['看见', '明白'], partOfSpeech: 'v.', grade: '初一', examples: ['I can see a bird in the tree.'], synonyms: ['look'], antonyms: [] },
  { id: 'v15', word: 'take', phonetic: '/teɪk/', translation: ['拿', '带走', '花费'], partOfSpeech: 'v.', grade: '初一', examples: ['Take your umbrella with you.'], synonyms: ['bring'], antonyms: ['give'] },

  // Adjectives (10)
  { id: 'adj1', word: 'big', phonetic: '/bɪɡ/', translation: ['大的'], partOfSpeech: 'adj.', grade: '初一', examples: ['This is a big apple.'], synonyms: ['large'], antonyms: ['small'] },
  { id: 'adj2', word: 'cold', phonetic: '/kəʊld/', translation: ['冷的'], partOfSpeech: 'adj.', grade: '初一', examples: ['It is very cold today.'], synonyms: ['chilly'], antonyms: ['hot'] },
  { id: 'adj3', word: 'good', phonetic: '/ɡʊd/', translation: ['好的'], partOfSpeech: 'adj.', grade: '初一', examples: ['He is a good student.'], synonyms: ['nice'], antonyms: ['bad'] },
  { id: 'adj4', word: 'happy', phonetic: '/ˈhæpi/', translation: ['开心的', '快乐的'], partOfSpeech: 'adj.', grade: '初一', examples: ['I am very happy today.'], synonyms: ['glad'], antonyms: ['sad'] },
  { id: 'adj5', word: 'hot', phonetic: '/hɒt/', translation: ['热的'], partOfSpeech: 'adj.', grade: '初一', examples: ['The soup is too hot.'], synonyms: ['warm'], antonyms: ['cold'] },
  { id: 'adj6', word: 'new', phonetic: '/njuː/', translation: ['新的'], partOfSpeech: 'adj.', grade: '初一', examples: ['I have a new bike.'], synonyms: ['fresh'], antonyms: ['old'] },
  { id: 'adj7', word: 'old', phonetic: '/əʊld/', translation: ['旧的', '老的'], partOfSpeech: 'adj.', grade: '初一', examples: ['This is an old book.'], synonyms: [], antonyms: ['new', 'young'] },
  { id: 'adj8', word: 'red', phonetic: '/red/', translation: ['红色的'], partOfSpeech: 'adj.', grade: '初一', examples: ['She likes red apples.'], synonyms: [], antonyms: [] },
  { id: 'adj9', word: 'small', phonetic: '/smɔːl/', translation: ['小的'], partOfSpeech: 'adj.', grade: '初一', examples: ['The cat is very small.'], synonyms: ['little'], antonyms: ['big'] },
  { id: 'adj10', word: 'young', phonetic: '/jʌŋ/', translation: ['年轻的'], partOfSpeech: 'adj.', grade: '初一', examples: ['He is a young man.'], synonyms: [], antonyms: ['old'] },

  // Adverbs (5)
  { id: 'adv1', word: 'always', phonetic: '/ˈɔːlweɪz/', translation: ['总是', '一直'], partOfSpeech: 'adv.', grade: '初一', examples: ['He always gets up early.'], synonyms: [], antonyms: ['never'] },
  { id: 'adv2', word: 'here', phonetic: '/hɪə(r)/', translation: ['在这里'], partOfSpeech: 'adv.', grade: '初一', examples: ['Come here, please.'], synonyms: [], antonyms: ['there'] },
  { id: 'adv3', word: 'never', phonetic: '/ˈnevə(r)/', translation: ['从不', '绝不'], partOfSpeech: 'adv.', grade: '初一', examples: ['I never eat that.'], synonyms: [], antonyms: ['always'] },
  { id: 'adv4', word: 'now', phonetic: '/naʊ/', translation: ['现在'], partOfSpeech: 'adv.', grade: '初一', examples: ['What are you doing now?'], synonyms: ['currently'], antonyms: ['then'] },
  { id: 'adv5', word: 'there', phonetic: '/ðeə(r)/', translation: ['在那里'], partOfSpeech: 'adv.', grade: '初一', examples: ['Look over there.'], synonyms: [], antonyms: ['here'] },
];
