import React, { useState } from 'react';
import { QuizQuestion } from '../data/bookData';
import { X, Award, CheckCircle2, XCircle, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';

interface ChapterQuizModalProps {
  chapterTitle: string;
  chapterNumber: number;
  badgeName: string;
  xpReward: number;
  questions: QuizQuestion[];
  isOpen: boolean;
  onClose: () => void;
  onPassQuiz: (score: number, total: number) => void;
}

export const ChapterQuizModal: React.FC<ChapterQuizModalProps> = ({
  chapterTitle,
  chapterNumber,
  badgeName,
  xpReward,
  questions,
  isOpen,
  onClose,
  onPassQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  if (!isOpen || !questions || questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const isAnswered = selectedAnswers[currentIndex] !== undefined;

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answerIndex) {
        score++;
      }
    });
    return score;
  };

  const handleFinish = () => {
    setIsSubmitted(true);
    setHasCompleted(true);
    const score = calculateScore();
    onPassQuiz(score, questions.length);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setHasCompleted(false);
    setCurrentIndex(0);
  };

  const score = calculateScore();
  const passed = score >= Math.ceil(questions.length * 0.7);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-800">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase">
              Lab Knowledge Check • Chapter {chapterNumber}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-neutral-100 truncate max-w-[450px]">
              {chapterTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!hasCompleted ? (
            <>
              {/* Progress and Question Counter */}
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-emerald-400 font-semibold">+{xpReward} XP Reward</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="text-base sm:text-lg font-semibold text-neutral-100 leading-snug">
                {currentQ.question}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200'
                          : 'border-neutral-800 bg-neutral-950/60 hover:bg-neutral-800/80 text-neutral-300'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500 text-neutral-950'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Quiz Completed Results Card */
            <div className="text-center py-6 space-y-5">
              <div
                className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-xl ${
                  passed
                    ? 'bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400'
                    : 'bg-amber-500/20 border-2 border-amber-500/50 text-amber-400'
                }`}
              >
                {passed ? <Award className="w-10 h-10" /> : <RotateCcw className="w-10 h-10" />}
              </div>

              <div>
                <h3 className="text-2xl font-bold text-neutral-100">
                  {passed ? 'Knowledge Check Passed!' : 'Review & Retake'}
                </h3>
                <p className="text-sm text-neutral-400 mt-1">
                  You scored <span className="font-semibold text-neutral-200">{score}</span> out of{' '}
                  <span className="font-semibold text-neutral-200">{questions.length}</span> ({Math.round(
                    (score / questions.length) * 100
                  )}
                  %)
                </p>
              </div>

              {passed && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 max-w-md mx-auto text-left flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-emerald-400">UNLOCKED BADGE:</div>
                    <div className="text-sm font-bold text-neutral-100">{badgeName}</div>
                    <div className="text-xs text-neutral-400">+{xpReward} XP added to your Pentester Profile</div>
                  </div>
                </div>
              )}

              {/* Review list */}
              <div className="text-left space-y-3 pt-4 border-t border-neutral-800">
                <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  Detailed Answer Review
                </h4>
                {questions.map((q, qIdx) => {
                  const userAns = selectedAnswers[qIdx];
                  const isCorrect = userAns === q.answerIndex;
                  return (
                    <div key={qIdx} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1.5">
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <span className="font-medium text-neutral-200">{q.question}</span>
                      </div>
                      <div className="pl-6 text-neutral-400 text-[11px] leading-relaxed">
                        <span className="text-emerald-400 font-medium">Explanation: </span>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          {!hasCompleted ? (
            <>
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 disabled:opacity-20"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    disabled={!isAnswered}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    disabled={!isAnswered}
                    className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>Submit Exam</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={resetQuiz}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:bg-neutral-800 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              >
                Continue Training
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
