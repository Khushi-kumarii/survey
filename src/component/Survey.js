import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import '../Survey.css';

const questions = [
  { id: uuidv4(), text: "How satisfied are you with our products?", type: "rating", scale: 5 },
  { id: uuidv4(), text: "How fair are the prices compared to similar retailers?", type: "rating", scale: 5 },
  { id: uuidv4(), text: "How satisfied are you with the value for money of your purchase?", type: "rating", scale: 5 },
  { id: uuidv4(), text: "On a scale of 1-10 how would you recommend us to your friends and family?", type: "rating", scale: 10 },
  { id: uuidv4(), text: "What could we do to improve our service?", type: "text" },
];

const Survey = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sessionId] = useState(() => uuidv4());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const storedAnswers = JSON.parse(localStorage.getItem(sessionId)) || {};
    setAnswers(storedAnswers);
  }, [sessionId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prevAnswers => {
      const updatedAnswers = { ...prevAnswers, [questionId]: answer };
      localStorage.setItem(sessionId, JSON.stringify(updatedAnswers));
      return updatedAnswers;
    });
  };

  const handleNext = () => setCurrentQuestion(prev => Math.min(prev + 1, questions.length - 1));
  const handlePrevious = () => setCurrentQuestion(prev => Math.max(prev - 1, 0));
  const handleSkip = () => handleNext();
  const handleSubmit = () => setShowConfirmation(true);

  const confirmSubmit = () => {
    localStorage.setItem(`${sessionId}-completed`, true);
    setIsCompleted(true);
    setShowConfirmation(false);
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  const cancelSubmit = () => setShowConfirmation(false);

  if (isCompleted) {
    return <div className="thankYouMessage">Thank you for completing the survey! Redirecting...</div>;
  }

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="container">
      <h3 className="header">Customer Survey</h3>
      <p className="questionNumber">{currentQuestion + 1}/{questions.length}</p>
      <p className="questionText">{question.text}</p>

      {question.type === "rating" ? (
        <div>
          {[...Array(question.scale)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handleAnswerChange(question.id, i + 1)}
              className="ratingButton"
              style={{
                backgroundColor: answers[question.id] === i + 1 ? 'red' : 'white',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          value={answers[question.id] || ''}
          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          rows="4"
          cols="30"
          className="textarea"
        />
      )}

      <div className="buttonContainer">
        <button onClick={handlePrevious} disabled={currentQuestion === 0} className="prevButton">Prev</button>
        {!isLastQuestion ? (
          <>
            <button onClick={handleSkip} className="skipButton">Skip</button>
            <button onClick={handleNext} className="nextButton">Next</button>
          </>
        ) : (
          <button onClick={handleSubmit} className="nextButton">Submit</button>
        )}
      </div>

      {showConfirmation && (
        <div className="confirmationDialog">
          <p>Are you sure you want to submit the survey?</p>
          <button onClick={confirmSubmit} className="confirmButton">Yes</button>
          <button onClick={cancelSubmit} className="cancelButton">No</button>
        </div>
      )}
    </div>
  );
};

export default Survey;
