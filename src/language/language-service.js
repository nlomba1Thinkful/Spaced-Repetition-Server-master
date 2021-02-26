const LinkedList = require('../LinkedList/LinkedList');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },

  getUsersLanguageHead(db, user_id) {
    return db
      .from('language')
      .join('word', function () {
        this.on('word.id', '=', 'language.head');
      })
      .select('original', 'correct_count', 'incorrect_count', 'total_score')
      .where({ 'language.user_id': user_id })
      .first();
  },

  populateLinkedList(head, words) {
    const list = new LinkedList();
    let foundWord = words.find((word) => word.id === head);
    list.insertFirst(foundWord);
    while (foundWord.next) {
      foundWord = words.find((word) => word.id === foundWord.next);
      list.insertLast(foundWord);
    }
    return list;
  },

  async persistData(db, list) {
    let currNode = list.head;
    while (currNode.next) {
      currNode.value.next = currNode.next.value.id;
      await db
        .from('word')
        .where({
          original: currNode.value.original,
          language_id: currNode.value.language_id,
        })
        .update(currNode.value);
      currNode = currNode.next;
    }
    return db
      .from('language')
      .where({ user_id: list.head.value.language_id })
      .update({ total_score: list.total_score, head: list.newHead });
  },
};

module.exports = LanguageService;
