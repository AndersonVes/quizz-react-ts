import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';

// Components
import QuestionCard from './components/QuestionCard';

// Types
import { Difficulty, QuestionState } from './API';

// Styles
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  console.log(questions);



  const startTrivia = async () => {
    setLoading(true)
    setGameOver(false)

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    )

    setQuestions(newQuestions)
    setScore(0)
    setUserAnswers([])
    setNumber(0)
    setLoading(false)


  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // user's answer
      const answer = e.currentTarget.value
      // Check answer against correct answer
      const correct = questions[number].correct_answer === answer
      //Add score if answer is correct
      if (correct) setScore(prev => prev + 1)
      // Save answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      }
      setUserAnswers(prev => [...prev, answerObject])
    }
  }

  const nextQuestion = () => {
    // Move on to the next question if is not the last one
    const nextQuestion = number + 1

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    } else {
      setNumber(nextQuestion)
    }

  }

  return (
    <>
      <Wrapper>
        <h1>TECH QUIZ</h1>
        <span className='credits'>Made in react by <a href='https://github.com/AndersonVes' rel='noreferrer' target='_blank'>Anderson Vesguerber</a> </span>

        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (

          <button className='start' onClick={startTrivia}>
            Start
          </button>
        ) : null}
        {!gameOver ? <p className='score'>Score: {score}</p> : null}
        {loading && <p>Loading questions...</p>}
        {!loading && !gameOver && (

          <QuestionCard
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver &&
          !loading &&
          userAnswers.length === number + 1 &&
          number !== TOTAL_QUESTIONS - 1 ? (
          <button className='next' onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper>
      <GlobalStyle />
    </>
  )
}

export default App;
