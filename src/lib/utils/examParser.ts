import { ParsedExam } from '../types';

/**
 * Parse exam_content into problems, answers, and problem count
 *
 * Expected format:
 * ### 시험지
 * 1. Problem 1
 * 2. Problem 2
 *
 * ### 정답지
 * 1. Answer 1
 * 2. Answer 2
 *
 * ### 채점 기준
 * ...
 */
export function parseExamContent(examContent: string): ParsedExam {
  try {
    // Extract sections
    const sections = examContent.split('###').map(s => s.trim());

    // Find 시험지 section
    const problemSection = sections.find(s => s.startsWith('시험지'));
    const answerSection = sections.find(s => s.startsWith('정답지'));

    if (!problemSection || !answerSection) {
      throw new Error('시험지 또는 정답지 섹션을 찾을 수 없습니다');
    }

    // Extract content after "시험지" header
    const problemsText = problemSection.replace(/^시험지\s*\n/, '').trim();
    const answersText = answerSection.replace(/^정답지\s*\n/, '').trim();

    // Split by numbered items (1., 2., 3., etc.)
    const problems = splitByNumberedItems(problemsText);
    const answers = splitByNumberedItems(answersText);

    return {
      problems,
      answers,
      problemCount: problems.length,
    };
  } catch (error) {
    console.error('Failed to parse exam content:', error);
    // Return safe defaults
    return {
      problems: [],
      answers: [],
      problemCount: 0,
    };
  }
}

/**
 * Split text by numbered items (1., 2., 3., etc.)
 */
function splitByNumberedItems(text: string): string[] {
  // Match patterns like "1.", "2.", etc. at the start of a line
  const regex = /(?:^|\n)(\d+)\.\s*/g;

  // Find all matches
  const matches = [...text.matchAll(regex)];

  if (matches.length === 0) {
    return text.trim() ? [text.trim()] : [];
  }

  const items: string[] = [];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const startIndex = match.index! + match[0].length;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index! : text.length;

    const content = text.slice(startIndex, endIndex).trim();
    if (content) {
      items.push(content);
    }
  }

  return items;
}

/**
 * Format problem number for display
 */
export function formatProblemNumber(num: number): string {
  return `문제 ${num}`;
}

/**
 * Validate student answers
 */
export function validateAnswers(answers: string[], problemCount: number): boolean {
  if (answers.length !== problemCount) {
    return false;
  }

  // Check that all answers are non-empty
  return answers.every(answer => answer.trim().length > 0);
}
