const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');

const languageRouter = express.Router();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`,
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );
    res.json({
      language: req.language,
      words,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/head', async (req, res, next) => {
  try {
    const head = await LanguageService.getUsersLanguageHead(
      req.app.get('db'),
      req.user.id
    );
    const { correct_count, incorrect_count, original, total_score } = head;
    const result = {
      nextWord: original,
      totalScore: total_score,
      wordCorrectCount: correct_count,
      wordIncorrectCount: incorrect_count,
    };
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

languageRouter.route('/guess').post(async (req, res, next) => {
  try {
    const guess = req.body.guess;
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );
    if (!guess) {
      return res.status(400).json({ error: "Missing 'guess' in request body" });
    }
    const list = LanguageService.populateLinkedList(req.language.head, words);
    list.total_score = req.language.total_score;
    const head = list.head;
    const answer = head.value.translation;
    let isCorrect = false;

    if (answer === guess) {
      head.value.memory_value = head.value.memory_value * 2;
      head.value.correct_count++;
      list.total_score++;
      isCorrect = true;
    } else {
      head.value.memory_value = 1;
      head.value.incorrect_count++;
    }

    list.updateWordPosition(head.value.memory_value + 1);
    list.newHead = list.head.value.id;
    const response = {
      nextWord: list.head.value.original,
      totalScore: list.total_score,
      wordCorrectCount: list.head.value.correct_count,
      wordIncorrectCount: list.head.value.incorrect_count,
      answer,
      isCorrect,
    };

    await LanguageService.persistData(req.app.get('db'), list);
    //console.log(JSON.stringify(list, null, 2));
    return res.json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = languageRouter;
