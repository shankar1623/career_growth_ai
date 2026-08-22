export interface CodingProblem {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  context: string;
  idealAnswerPoints: string[];
  starterCode: {
    javascript: string;
    typescript: string;
    python: string;
    java: string;
    cpp: string;
    go: string;
  };
  testCases: {
    testCaseNumber: number;
    input: string;
    expectedOutput: string;
  }[];
}

export const CODING_PROBLEMS: CodingProblem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    category: "Arrays & Hash Maps",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target in O(n) time.",
    context: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nExample 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\nExample 2:\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n\nConstraints:\n• 2 <= nums.length <= 10^4\n• -10^9 <= nums[i] <= 10^9\n• -10^9 <= target <= 10^9\n• Only one valid answer exists.`,
    idealAnswerPoints: [
      "Hash map lookup in O(1) average time",
      "Single pass through the array O(n) time complexity",
      "O(n) auxiliary space complexity",
      "Correctly handles duplicate values and negative numbers",
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // TODO: Write your algorithm solution here
  
  return [];
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // TODO: Write your algorithm solution here
  
  return [];
}`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # TODO: Write your algorithm solution here
        return []`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // TODO: Write your algorithm solution here
        return new int[]{};
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // TODO: Write your algorithm solution here
        return {};
    }
};`,
      go: `package main

func twoSum(nums []int, target int) []int {
    // TODO: Write your algorithm solution here
    return []int{}
}`,
    },
    testCases: [
      { testCaseNumber: 1, input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]" },
      { testCaseNumber: 2, input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]" },
      { testCaseNumber: 3, input: "nums = [3,3], target = 6", expectedOutput: "[0,1]" },
    ],
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    category: "Arrays & Dynamic Programming",
    difficulty: "Easy",
    description: "Find the maximum profit achievable from buying on one day and selling on a future day in O(n) time.",
    context: `You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.\n\nExample 1:\nInput: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\n\nExample 2:\nInput: prices = [7,6,4,3,1]\nOutput: 0\nExplanation: In this case, no transactions are done and max profit = 0.\n\nConstraints:\n• 1 <= prices.length <= 10^5\n• 0 <= prices[i] <= 10^4`,
    idealAnswerPoints: [
      "Track minimum price seen so far in O(1) space",
      "Calculate current potential profit in single pass O(n) time",
      "Update maximum profit dynamically",
      "Return 0 if prices are strictly decreasing",
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  // TODO: Write your algorithm solution here
  
  return 0;
}`,
      typescript: `function maxProfit(prices: number[]): number {
  // TODO: Write your algorithm solution here
  
  return 0;
}`,
      python: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        # TODO: Write your algorithm solution here
        return 0`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // TODO: Write your algorithm solution here
        return 0;
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // TODO: Write your algorithm solution here
        return 0;
    }
};`,
      go: `package main

func maxProfit(prices []int) int {
    // TODO: Write your algorithm solution here
    return 0
}`,
    },
    testCases: [
      { testCaseNumber: 1, input: "prices = [7,1,5,3,6,4]", expectedOutput: "5" },
      { testCaseNumber: 2, input: "prices = [7,6,4,3,1]", expectedOutput: "0" },
      { testCaseNumber: 3, input: "prices = [2,4,1]", expectedOutput: "2" },
    ],
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    category: "Stack & Strings",
    difficulty: "Easy",
    description: "Determine if an input string containing '()', '{}', '[]' has valid closing bracket order.",
    context: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.\n\nExample 1:\nInput: s = "()"\nOutput: true\n\nExample 2:\nInput: s = "()[]{}"\nOutput: true\n\nExample 3:\nInput: s = "(]"\nOutput: false\n\nConstraints:\n• 1 <= s.length <= 10^4\n• s consists of parentheses only '()[]{}'.`,
    idealAnswerPoints: [
      "Use Stack LIFO structure to match open and close brackets",
      "Hash map for matching bracket pairs",
      "O(n) time and O(n) auxiliary space complexity",
      "Handles unbalanced open brackets at the end of the string",
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // TODO: Write your algorithm solution here
  
  return false;
}`,
      typescript: `function isValid(s: string): boolean {
  // TODO: Write your algorithm solution here
  
  return false;
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        # TODO: Write your algorithm solution here
        return False`,
      java: `class Solution {
    public boolean isValid(String s) {
        // TODO: Write your algorithm solution here
        return false;
    }
}`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // TODO: Write your algorithm solution here
        return false;
    }
};`,
      go: `package main

func isValid(s string) bool {
    // TODO: Write your algorithm solution here
    return false
}`,
    },
    testCases: [
      { testCaseNumber: 1, input: 's = "()"', expectedOutput: "true" },
      { testCaseNumber: 2, input: 's = "()[]{}"', expectedOutput: "true" },
      { testCaseNumber: 3, input: 's = "(]"', expectedOutput: "false" },
    ],
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray (Kadane's Algorithm)",
    category: "Dynamic Programming & Arrays",
    difficulty: "Medium",
    description: "Find the contiguous subarray with the largest sum in linear O(n) time.",
    context: `Given an integer array nums, find the subarray with the largest sum, and return its sum.\n\nExample 1:\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.\n\nExample 2:\nInput: nums = [1]\nOutput: 1\n\nExample 3:\nInput: nums = [5,4,-1,7,8]\nOutput: 23\n\nConstraints:\n• 1 <= nums.length <= 10^5\n• -10^4 <= nums[i] <= 10^4`,
    idealAnswerPoints: [
      "Kadane's Algorithm linear single-pass O(n) time",
      "Dynamic programming state: currentSum = max(num, currentSum + num)",
      "O(1) constant auxiliary space complexity",
      "Handles arrays with all negative numbers correctly",
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // TODO: Write your algorithm solution here
  
  return 0;
}`,
      typescript: `function maxSubArray(nums: number[]): number {
  // TODO: Write your algorithm solution here
  
  return 0;
}`,
      python: `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        # TODO: Write your algorithm solution here
        return 0`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // TODO: Write your algorithm solution here
        return 0;
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // TODO: Write your algorithm solution here
        return 0;
    }
};`,
      go: `package main

func maxSubArray(nums []int) int {
    // TODO: Write your algorithm solution here
    return 0
}`,
    },
    testCases: [
      { testCaseNumber: 1, input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
      { testCaseNumber: 2, input: "nums = [1]", expectedOutput: "1" },
      { testCaseNumber: 3, input: "nums = [5,4,-1,7,8]", expectedOutput: "23" },
    ],
  },
  {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    category: "Sliding Window & Strings",
    difficulty: "Medium",
    description: "Find the length of the longest substring without repeating characters in O(n) time.",
    context: `Given a string s, find the length of the longest substring without duplicate characters.\n\nExample 1:\nInput: s = "abcabcbb"\nOutput: 3\nExplanation: The answer is "abc", with the length of 3.\n\nExample 2:\nInput: s = "bbbbb"\nOutput: 1\nExplanation: The answer is "b", with the length of 1.\n\nExample 3:\nInput: s = "pwwkew"\nOutput: 3\nExplanation: The answer is "wke", with the length of 3.\n\nConstraints:\n• 0 <= s.length <= 5 * 10^4\n• s consists of English letters, digits, symbols and spaces.`,
    idealAnswerPoints: [
      "Sliding window technique with left and right pointers",
      "Hash map or Set to track visited character indices",
      "O(n) time complexity",
      "Handles empty strings and strings with unique characters",
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // TODO: Write your algorithm solution here
  
  return 0;
}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
  // TODO: Write your algorithm solution here
  
  return 0;
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # TODO: Write your algorithm solution here
        return 0`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // TODO: Write your algorithm solution here
        return 0;
    }
}`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // TODO: Write your algorithm solution here
        return 0;
    }
};`,
      go: `package main

func lengthOfLongestSubstring(s string) int {
    // TODO: Write your algorithm solution here
    return 0
}`,
    },
    testCases: [
      { testCaseNumber: 1, input: 's = "abcabcbb"', expectedOutput: "3" },
      { testCaseNumber: 2, input: 's = "bbbbb"', expectedOutput: "1" },
      { testCaseNumber: 3, input: 's = "pwwkew"', expectedOutput: "3" },
    ],
  },
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    category: "Hash Sets & Arrays",
    difficulty: "Easy",
    description: "Given an integer array nums, return true if any value appears at least twice.",
    context: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.\n\nExample 1:\nInput: nums = [1,2,3,1]\nOutput: true\n\nExample 2:\nInput: nums = [1,2,3,4]\nOutput: false\n\nExample 3:\nInput: nums = [1,1,1,3,3,4,3,2,4,2]\nOutput: true\n\nConstraints:\n• 1 <= nums.length <= 10^5\n• -10^9 <= nums[i] <= 10^9`,
    idealAnswerPoints: [
      "Hash Set lookup in O(1) average time",
      "Single-pass early return O(n) time complexity",
      "O(n) auxiliary space complexity",
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
function containsDuplicate(nums) {
  // TODO: Write your algorithm solution here
  
  return false;
}`,
      typescript: `function containsDuplicate(nums: number[]): boolean {
  // TODO: Write your algorithm solution here
  
  return false;
}`,
      python: `class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        # TODO: Write your algorithm solution here
        return False`,
      java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        // TODO: Write your algorithm solution here
        return false;
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        // TODO: Write your algorithm solution here
        return false;
    }
};`,
      go: `package main

func containsDuplicate(nums []int) bool {
    // TODO: Write your algorithm solution here
    return false
}`,
    },
    testCases: [
      { testCaseNumber: 1, input: "nums = [1,2,3,1]", expectedOutput: "true" },
      { testCaseNumber: 2, input: "nums = [1,2,3,4]", expectedOutput: "false" },
      { testCaseNumber: 3, input: "nums = [1,1,1,3,3,4,3,2,4,2]", expectedOutput: "true" },
    ],
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs (Dynamic Programming)",
    category: "Dynamic Programming",
    difficulty: "Easy",
    description: "Find how many distinct ways you can climb n steps taking 1 or 2 steps each time.",
    context: `You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\nExample 1:\nInput: n = 2\nOutput: 2\nExplanation: There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps\n\nExample 2:\nInput: n = 3\nOutput: 3\nExplanation: There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step\n\nConstraints:\n• 1 <= n <= 45`,
    idealAnswerPoints: [
      "Fibonacci sequence recurrence: dp[i] = dp[i-1] + dp[i-2]",
      "Iterative bottom-up dynamic programming in O(n) time",
      "O(1) constant space optimization keeping two variables",
      "Base cases for n=1 and n=2 handled correctly",
    ],
    starterCode: {
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // TODO: Write your algorithm solution here
  
  return 0;
}`,
      typescript: `function climbStairs(n: number): number {
  // TODO: Write your algorithm solution here
  
  return 0;
}`,
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        # TODO: Write your algorithm solution here
        return 0`,
      java: `class Solution {
    public int climbStairs(int n) {
        // TODO: Write your algorithm solution here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        // TODO: Write your algorithm solution here
        return 0;
    }
};`,
      go: `package main

func climbStairs(n int) int {
    // TODO: Write your algorithm solution here
    return 0
}`,
    },
    testCases: [
      { testCaseNumber: 1, input: "n = 2", expectedOutput: "2" },
      { testCaseNumber: 2, input: "n = 3", expectedOutput: "3" },
      { testCaseNumber: 3, input: "n = 5", expectedOutput: "8" },
    ],
  },
  {
    id: "binary-search",
    title: "Binary Search",
    category: "Binary Search & Divide and Conquer",
    difficulty: "Easy",
    description: "Search for target in sorted array in logarithmic O(log n) time.",
    context: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.\n\nExample 1:\nInput: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4\nExplanation: 9 exists in nums and its index is 4.\n\nExample 2:\nInput: nums = [-1,0,3,5,9,12], target = 2\nOutput: -1\nExplanation: 2 does not exist in nums so return -1.\n\nConstraints:\n• 1 <= nums.length <= 10^4\n• -10^4 < nums[i], target < 10^4\n• All the integers in nums are unique.\n• nums is sorted in ascending order.`,
    idealAnswerPoints: [
      "Two pointers (low, high) with midpoint calculation `low + Math.floor((high - low) / 2)` to avoid overflow",
      "Logarithmic O(log n) time complexity",
      "O(1) constant auxiliary space complexity",
      "Return -1 if target is not found",
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  // TODO: Write your algorithm solution here
  
  return -1;
}`,
      typescript: `function search(nums: number[], target: number): number {
  // TODO: Write your algorithm solution here
  
  return -1;
}`,
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        # TODO: Write your algorithm solution here
        return -1`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // TODO: Write your algorithm solution here
        return -1;
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        // TODO: Write your algorithm solution here
        return -1;
    }
};`,
      go: `package main

func search(nums []int, target int) int {
    // TODO: Write your algorithm solution here
    return -1
}`,
    },
    testCases: [
      { testCaseNumber: 1, input: "nums = [-1,0,3,5,9,12], target = 9", expectedOutput: "4" },
      { testCaseNumber: 2, input: "nums = [-1,0,3,5,9,12], target = 2", expectedOutput: "-1" },
      { testCaseNumber: 3, input: "nums = [5], target = 5", expectedOutput: "0" },
    ],
  },
];

// Helper to get a dynamic coding problem on each interview creation
export function getRandomCodingProblem(seed?: string | number): CodingProblem {
  if (seed !== undefined) {
    const num = typeof seed === "string" ? seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) : seed;
    return CODING_PROBLEMS[num % CODING_PROBLEMS.length];
  }
  const randomIndex = Math.floor(Math.random() * CODING_PROBLEMS.length);
  return CODING_PROBLEMS[randomIndex];
}
