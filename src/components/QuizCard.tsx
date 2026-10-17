import React, { useState } from 'react';
import { QuizItem } from '../data/curriculumData';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';

interface QuizCardProps {
  quiz: QuizItem[];
  lessonTitle: string;
  isCompleted: boolean;
  onPassLesson: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  lessonTitle,
  isCompleted,
  onPassLesson,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!quiz || quiz.length === 0) return null;

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        score++;
      }
    });
    return score;
  };

  const score = calculateScore();
  const passed = score >= Math.ceil(quiz.length * 0.8); // 80% passing threshold (e.g. 4/5)
  const allAnswered = Object.keys(selectedAnswers).length === quiz.length;

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (passed) {
      onPassLesson();
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Knowledge Gate • 5 MCQ Questions
            </span>
          </div>
          <h3 className="text-lg font-bold text-neutral-100 mt-1">
            Validate Mastery to Unlock Completion
          </h3>
          <p className="text-xs text-neutral-400">
            Passing threshold: 80% (4 out of 5 correct) to verify your hands-on comprehension.
          </p>
        </div>

        {isCompleted && (
          <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>LESSON COMPLETED (+250 XP)</span>
          </div>
        )}
      </div>

      {/* 5 Questions */}
      <div className="space-y-6">
        {quiz.map((item, qIdx) => {
          const userChoice = selectedAnswers[qIdx];
          const isCorrect = userChoice === item.answer;

          return (
            <div
              key={qIdx}
              className={`p-4 rounded-xl border transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500/50 bg-emerald-950/20'
                    : 'border-red-500/40 bg-red-950/20'
                  : 'border-neutral-850 bg-neutral-900/60'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="w-6 h-6 rounded-md bg-neutral-800 font-mono text-xs font-bold flex items-center justify-center text-neutral-300 shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <span className="text-sm font-semibold text-neutral-100 leading-snug">
                  {item.question}
                </span>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                {item.options.map((opt, oIdx) => {
                  const isSelected = userChoice === oIdx;
                  const isAnswer = item.answer === oIdx;

                  let optClass = 'border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300';
                  if (isSubmitted) {
                    if (isAnswer) {
                      optClass = 'border-emerald-500 bg-emerald-950/50 text-emerald-200 font-medium';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'border-red-500 bg-red-950/50 text-red-300';
                    } else {
                      optClass = 'border-neutral-800 bg-neutral-900/40 text-neutral-500';
                    }
                  } else if (isSelected) {
                    optClass = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-medium';
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(qIdx, oIdx)}
                      disabled={isSubmitted}
                      className={`text-left p-3 rounded-lg border text-xs flex items-center gap-2.5 transition-all ${optClass}`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500 text-neutral-950'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="leading-tight">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {isSubmitted && (
                <div className="mt-3 pl-9 pt-2 border-t border-neutral-800/80 text-xs text-neutral-400">
                  <span className="font-semibold text-emerald-400">Explanation: </span>
                  {item.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission Footer */}
      <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        {!isSubmitted ? (
          <>
            <div className="text-xs text-neutral-400 font-mono">
              Answered {Object.keys(selectedAnswers).length} of {quiz.length} questions
            </div>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white font-semibold text-xs tracking-wide transition-all shadow-md shadow-emerald-600/20"
            >
              Submit Quiz & Validate
            </button>
          </>
        ) : (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}
              >
                {passed ? <Award className="w-6 h-6" /> : <RotateCcw className="w-6 h-6" />}
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-100">
                  {passed ? 'Lesson Mastered & Verified!' : 'Score Under Passing Threshold'}
                </div>
                <div className="text-xs text-neutral-400">
                  You scored {score}/{quiz.length} ({Math.round((score / quiz.length) * 100)}%).{' '}
                  {passed
                    ? 'Progress recorded to your student profile.'
                    : 'Review the explanations above and retake.'}
                </div>
              </div>
            </div>

            <button
              onClick={handleRetake}
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
