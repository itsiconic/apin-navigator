/* ================================================
   Comprehensive Skill Assessments Seed Data
   Run: npx tsx prisma/seed-assessments.ts
   ================================================ */

import { PrismaClient, QuestionCategory, QuestionDifficulty, AssessmentDifficulty } from "@prisma/client";

const prisma = new PrismaClient();

interface OptionData {
  text: string;
  isCorrect: boolean;
}

interface QuestionData {
  text: string;
  code?: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  points: number;
  explanation: string;
  options: OptionData[];
}

interface AssessmentData {
  skillSlug: string;
  title: string;
  slug: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  difficulty: AssessmentDifficulty;
  questions: QuestionData[];
}

const assessmentsData: AssessmentData[] = [
  // ==========================================
  // 1. JAVASCRIPT COMPREHENSIVE EXAM (30 Questions)
  // ==========================================
  {
    skillSlug: "javascript",
    title: "JavaScript Professional Competency & Systems Assessment",
    slug: "javascript-professional-assessment",
    description: "Evaluates comprehensive JS knowledge: Event loop mechanics, Closures, Prototypes, Asynchronous control flow, Memory management, and Problem solving.",
    durationMinutes: 45,
    totalQuestions: 30,
    passingScore: 70,
    difficulty: AssessmentDifficulty.ADVANCED,
    questions: [
      {
        text: "What will be the exact console output of this code snippet?",
        code: `console.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);`,
        category: QuestionCategory.PROGRAMMING,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Synchronous code runs first (1, 4). The microtask queue (Promise.then) takes precedence before the macrotask queue (setTimeout), so 3 is printed, then 2.",
        options: [
          { text: "1, 4, 3, 2", isCorrect: true },
          { text: "1, 2, 3, 4", isCorrect: false },
          { text: "1, 4, 2, 3", isCorrect: false },
          { text: "1, 3, 4, 2", isCorrect: false },
        ],
      },
      {
        text: "In JavaScript's prototype inheritance chain, what does Object.prototype.__proto__ evaluate to?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Object.prototype is at the top of the prototype inheritance chain, and its [[Prototype]] is null.",
        options: [
          { text: "null", isCorrect: true },
          { text: "undefined", isCorrect: false },
          { text: "Object.prototype", isCorrect: false },
          { text: "TypeError: illegal access", isCorrect: false },
        ],
      },
      {
        text: "Which of the following describes the difference between WeakMap and Map in terms of garbage collection?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Keys in a WeakMap must be non-null objects and are held weakly, meaning if no other references exist to the object key, it is eligible for garbage collection.",
        options: [
          { text: "WeakMap keys must be objects and do not prevent garbage collection if no other reference exists", isCorrect: true },
          { text: "WeakMap values are garbage collected automatically every 60 seconds", isCorrect: false },
          { text: "WeakMap is iterable with for...of while Map is not", isCorrect: false },
          { text: "Map keys are always strings whereas WeakMap keys can be symbols", isCorrect: false },
        ],
      },
      {
        text: "What will be printed when the following code is executed in strict mode?",
        code: `const obj = {\n  val: 42,\n  getVal: () => this.val\n};\nconsole.log(obj.getVal());`,
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Arrow functions do not bind their own 'this'. In lexical scope, 'this' refers to the enclosing lexical context (window/global/undefined in modules), where val is undefined.",
        options: [
          { text: "undefined", isCorrect: true },
          { text: "42", isCorrect: false },
          { text: "TypeError: Cannot read property 'val' of undefined", isCorrect: false },
          { text: "null", isCorrect: false },
        ],
      },
      {
        text: "Consider the following closure counter. What is the output?",
        code: `function createCounter() {\n  let count = 0;\n  return {\n    increment() { return ++count; },\n    get value() { return count; }\n  };\n}\nconst c1 = createCounter();\nconst c2 = createCounter();\nc1.increment();\nc1.increment();\nconsole.log(c1.value, c2.value);`,
        category: QuestionCategory.PROGRAMMING,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Each invocation of createCounter establishes a new lexical environment with its own isolated 'count' variable.",
        options: [
          { text: "2 0", isCorrect: true },
          { text: "2 2", isCorrect: false },
          { text: "0 0", isCorrect: false },
          { text: "1 0", isCorrect: false },
        ],
      },
      {
        text: "What happens when you pass a negative index to Array.prototype.slice(-2)?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "A negative index indicates an offset from the end of the array (array.length - 2), extracting the last 2 elements.",
        options: [
          { text: "It extracts elements starting from length - 2 to the end of the array", isCorrect: true },
          { text: "It throws a RangeError", isCorrect: false },
          { text: "It returns an empty array", isCorrect: false },
          { text: "It reverses the array and slices 2 elements", isCorrect: false },
        ],
      },
      {
        text: "What will this asynchronous code output?",
        code: `async function test() {\n  console.log('A');\n  await null;\n  console.log('B');\n}\ntest();\nconsole.log('C');`,
        category: QuestionCategory.PROGRAMMING,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "'A' logs synchronously. The 'await null' wraps in a resolved promise microtask, yielding control back to caller. 'C' logs synchronously, and once microtask queue drains, 'B' logs.",
        options: [
          { text: "A, C, B", isCorrect: true },
          { text: "A, B, C", isCorrect: false },
          { text: "C, A, B", isCorrect: false },
          { text: "B, A, C", isCorrect: false },
        ],
      },
      {
        text: "How does the V8 engine optimize hidden classes (Shapes) for object property access?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.HARD,
        points: 2,
        explanation: "V8 creates transitions between hidden classes when properties are added in the same order, enabling monomorphic inline caching (IC).",
        options: [
          { text: "Objects sharing the same keys initialized in the same order share transitions and shape descriptors for inline caching", isCorrect: true },
          { text: "V8 converts all objects to binary hash tables immediately on initialization", isCorrect: false },
          { text: "Properties added via Object.defineProperty bypass hidden classes completely", isCorrect: false },
          { text: "Hidden classes are only generated for functions that use prototype chaining", isCorrect: false },
        ],
      },
      {
        text: "What does Promise.allSettled() return compared to Promise.all()?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Promise.allSettled() waits for all promises to resolve or reject and returns an array of outcome objects ({ status: 'fulfilled', value } or { status: 'rejected', reason }), never short-circuiting on rejection.",
        options: [
          { text: "An array of objects describing the outcome of each promise whether fulfilled or rejected", isCorrect: true },
          { text: "The value of the first promise that fulfills", isCorrect: false },
          { text: "Only the values of fulfilled promises, discarding rejections silently", isCorrect: false },
          { text: "A boolean indicating if every promise was fulfilled", isCorrect: false },
        ],
      },
      {
        text: "Which of the following will cause a memory leak in a modern SPA if not cleaned up?",
        category: QuestionCategory.SYSTEM_DESIGN,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Global window event listeners or setInterval callbacks capturing references to DOM elements or closures will prevent garbage collection even when components unmount.",
        options: [
          { text: "Attaching an event listener to window or document that retains references in its closure without removeEventListener", isCorrect: true },
          { text: "Using structuredClone on deep objects", isCorrect: false },
          { text: "Using const instead of let inside function scopes", isCorrect: false },
          { text: "Creating promises that resolve within 1 millisecond", isCorrect: false },
        ],
      },
      {
        text: "What is the time complexity of searching for an item in a JavaScript Set vs Array.prototype.includes()?",
        category: QuestionCategory.PROBLEM_SOLVING,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Set.prototype.has() operates in average O(1) time due to hash table bucket lookups, whereas Array.prototype.includes() requires O(n) linear scanning.",
        options: [
          { text: "Set has O(1) average lookup, Array has O(n) linear scan", isCorrect: true },
          { text: "Both have O(log n) binary search complexity", isCorrect: false },
          { text: "Set has O(n) and Array has O(1)", isCorrect: false },
          { text: "Set lookup requires O(n log n)", isCorrect: false },
        ],
      },
      {
        text: "What is the result of typeof NaN and isNaN('123') vs Number.isNaN('123')?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "typeof NaN is 'number'. Global isNaN('123') coerces string '123' to number 123 (which is not NaN, returns false). Number.isNaN('123') does not coerce, returning false.",
        options: [
          { text: "'number', false, false", isCorrect: true },
          { text: "'nan', true, false", isCorrect: false },
          { text: "'undefined', false, true", isCorrect: false },
          { text: "'number', true, true", isCorrect: false },
        ],
      },
      {
        text: "Analyze the output of this generator function:",
        code: `function* gen() {\n  const x = yield 10;\n  yield x * 2;\n}\nconst g = gen();\nconsole.log(g.next().value);\nconsole.log(g.next(5).value);`,
        category: QuestionCategory.PROGRAMMING,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "The first next() runs up to yield 10 (value: 10). The second next(5) replaces the yield expression with 5, assigning x = 5. Then it yields 5 * 2 = 10.",
        options: [
          { text: "10, 10", isCorrect: true },
          { text: "10, 20", isCorrect: false },
          { text: "10, undefined", isCorrect: false },
          { text: "undefined, 10", isCorrect: false },
        ],
      },
      {
        text: "What is the primary difference between debounce and throttle functions in frontend event handling?",
        category: QuestionCategory.PROBLEM_SOLVING,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Debounce delays execution until a quiet period of N ms passes without events (e.g. search autocomplete). Throttle guarantees execution at most once every N ms (e.g. scroll/resize).",
        options: [
          { text: "Debounce waits for a pause in events; Throttle enforces a maximum execution frequency over time", isCorrect: true },
          { text: "Debounce is for mouse events while throttle is exclusively for network requests", isCorrect: false },
          { text: "Throttle cancels all prior invocations, debounce executes all queued calls sequentially", isCorrect: false },
          { text: "Debounce runs immediately on leading edge, throttle only on trailing edge", isCorrect: false },
        ],
      },
      {
        text: "What is the behavior of structuredClone() when copying an object with a circular reference?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "structuredClone preserves cyclical references correctly, unlike JSON.parse(JSON.stringify(obj)) which throws a TypeError.",
        options: [
          { text: "It correctly clones the object graph preserving circular references", isCorrect: true },
          { text: "It throws a TypeError: Converting circular structure to JSON", isCorrect: false },
          { text: "It replaces circular references with null", isCorrect: false },
          { text: "It causes an infinite loop and stack overflow", isCorrect: false },
        ],
      },
      {
        text: "What will be printed by this code regarding JavaScript variable hoisting?",
        code: `var a = 1;\nfunction test() {\n  console.log(a);\n  var a = 2;\n}\ntest();`,
        category: QuestionCategory.PROGRAMMING,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Inside test(), 'var a' is hoisted to the top of the function scope with value undefined, shadowing the outer 'a'.",
        options: [
          { text: "undefined", isCorrect: true },
          { text: "1", isCorrect: false },
          { text: "2", isCorrect: false },
          { text: "ReferenceError: a is not defined", isCorrect: false },
        ],
      },
      {
        text: "What is the Temporal Dead Zone (TDZ) in JavaScript?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "The period between entering the scope containing a let or const variable and the line where it is declared/initialized, during which accessing it throws a ReferenceError.",
        options: [
          { text: "The span between scope entry and variable declaration where let/const access throws ReferenceError", isCorrect: true },
          { text: "The delay between setTimeout firing and its callback execution", isCorrect: false },
          { text: "A deprecated garbage collection cycle phase in V8", isCorrect: false },
          { text: "The duration an idle Web Worker remains active in memory", isCorrect: false },
        ],
      },
      {
        text: "What does the following Proxy trap intercept?",
        code: `const p = new Proxy({}, {\n  get(target, prop, receiver) {\n    return prop in target ? target[prop] : 'default';\n  }\n});`,
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "The 'get' trap intercepts property reading, returning 'default' whenever the requested property is absent from target.",
        options: [
          { text: "Intercepts property access and returns 'default' if the property doesn't exist", isCorrect: true },
          { text: "Intercepts assignment and throws an error", isCorrect: false },
          { text: "Prevents properties from being deleted", isCorrect: false },
          { text: "Creates a deep read-only clone", isCorrect: false },
        ],
      },
      {
        text: "How does JavaScript manage concurrency if it is single-threaded?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "JavaScript uses an Event Loop model with a call stack and queues (Microtask and Task queues) backed by underlying OS threads in the host runtime (libuv or browser Web APIs).",
        options: [
          { text: "Through a non-blocking Event Loop backed by host runtime thread pools (e.g., libuv/browser APIs)", isCorrect: true },
          { text: "By spawning native OS threads for every async function call", isCorrect: false },
          { text: "By time-slicing bytecode execution across multiple CPU cores automatically", isCorrect: false },
          { text: "JavaScript is actually multithreaded by default in Node.js 18+", isCorrect: false },
        ],
      },
      {
        text: "Given an unsorted array of integers, which algorithm achieves O(n) average time complexity for finding the k-th smallest element?",
        category: QuestionCategory.PROBLEM_SOLVING,
        difficulty: QuestionDifficulty.HARD,
        points: 2,
        explanation: "QuickSelect (based on Quicksort partitioning) achieves O(n) average time complexity because it only recurses into one half of the partition.",
        options: [
          { text: "QuickSelect", isCorrect: true },
          { text: "Binary Search", isCorrect: false },
          { text: "Merge Sort", isCorrect: false },
          { text: "Bubble Sort", isCorrect: false },
        ],
      },
      {
        text: "What does Symbol.iterator enable when implemented on an object?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Implementing [Symbol.iterator]() allows the object to conform to the iterable protocol, making it usable with for...of loops and the spread operator [...obj].",
        options: [
          { text: "Allows the object to be consumed by for...of loops and spread syntax", isCorrect: true },
          { text: "Makes the object completely immutable and sealed", isCorrect: false },
          { text: "Converts the object keys into symbols", isCorrect: false },
          { text: "Enables serialization into JSON", isCorrect: false },
        ],
      },
      {
        text: "What is the danger of using eval() or Function() constructor with untrusted input?",
        category: QuestionCategory.SYSTEM_DESIGN,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "eval() executes arbitrary code with full privileges in the current scope, creating Remote Code Execution (RCE) / XSS vulnerabilities and defeating engine JIT optimizations.",
        options: [
          { text: "Arbitrary code execution / XSS vulnerability and severe JIT de-optimization", isCorrect: true },
          { text: "It causes an immediate memory leak in the garbage collector", isCorrect: false },
          { text: "It converts all numbers to 32-bit floats", isCorrect: false },
          { text: "It disables the browser's Same-Origin Policy for the entire domain", isCorrect: false },
        ],
      },
      {
        text: "What will this expression return?",
        code: `[1, 2, 3].reduce((acc, val) => {\n  acc[val] = val * 10;\n  return acc;\n}, {});`,
        category: QuestionCategory.PROGRAMMING,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "The reduce function starts with {} and maps each array item as a key whose value is val * 10, resulting in { '1': 10, '2': 20, '3': 30 }.",
        options: [
          { text: "{ '1': 10, '2': 20, '3': 30 }", isCorrect: true },
          { text: "[10, 20, 30]", isCorrect: false },
          { text: "60", isCorrect: false },
          { text: "{ val: 30 }", isCorrect: false },
        ],
      },
      {
        text: "In Node.js, what is the key difference between process.nextTick() and setImmediate()?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "process.nextTick() runs immediately after current operation completes before the event loop advances to the next phase; setImmediate() runs in the Check phase of the event loop.",
        options: [
          { text: "process.nextTick fires before event loop advances to next phase; setImmediate fires in Check phase", isCorrect: true },
          { text: "setImmediate runs before any microtask queue processing", isCorrect: false },
          { text: "process.nextTick is only available in web browsers", isCorrect: false },
          { text: "setImmediate has a 4ms mandatory minimum delay", isCorrect: false },
        ],
      },
      {
        text: "What is the purpose of Object.freeze() vs Object.seal()?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Object.seal() prevents adding/deleting properties but allows modifying existing writable properties. Object.freeze() additionally makes all existing properties non-writable (read-only).",
        options: [
          { text: "seal prevents adding/deleting properties; freeze also prevents modifying existing property values", isCorrect: true },
          { text: "freeze is deep recursive; seal is shallow only", isCorrect: false },
          { text: "seal turns an object into a WeakMap; freeze turns it into a Map", isCorrect: false },
          { text: "freeze only works on arrays, while seal only works on plain objects", isCorrect: false },
        ],
      },
      {
        text: "How do you detect if two objects are structurally equal (deep equality) in vanilla JavaScript without circular reference crashes?",
        category: QuestionCategory.PROBLEM_SOLVING,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "A recursive equality function tracking visited object pairs using a WeakMap/Map or structuredClone comparison handles cycles and nested keys.",
        options: [
          { text: "Recursive traversal tracking visited objects with a WeakMap to guard against cycles", isCorrect: true },
          { text: "JSON.stringify(a) === JSON.stringify(b)", isCorrect: false },
          { text: "Object.is(a, b)", isCorrect: false },
          { text: "a === b", isCorrect: false },
        ],
      },
      {
        text: "What is the return value of Boolean(new Boolean(false))?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "new Boolean(false) creates an object instance. In JavaScript, all objects are truthy, so Boolean(object) evaluates to true.",
        options: [
          { text: "true", isCorrect: true },
          { text: "false", isCorrect: false },
          { text: "null", isCorrect: false },
          { text: "TypeError", isCorrect: false },
        ],
      },
      {
        text: "What does the 'navigator.sendBeacon()' API solve compared to standard fetch() on page unload?",
        category: QuestionCategory.SYSTEM_DESIGN,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "sendBeacon() queues analytics data to be transmitted asynchronously by the browser even after the document has unloaded without blocking page navigation.",
        options: [
          { text: "Asynchronously sends analytics/telemetry data during unload without delaying navigation", isCorrect: true },
          { text: "Allows fetching cross-origin files bypassing CORS entirely", isCorrect: false },
          { text: "Establishes a persistent bidirectional WebSocket tunnel", isCorrect: false },
          { text: "Compresses JSON payloads using Brotli in the background", isCorrect: false },
        ],
      },
      {
        text: "What is the result of Math.max() with no arguments, and Math.min() with no arguments?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Math.max() returns -Infinity, and Math.min() returns +Infinity, because every valid number is greater than -Infinity and smaller than +Infinity.",
        options: [
          { text: "-Infinity and Infinity", isCorrect: true },
          { text: "0 and 0", isCorrect: false },
          { text: "NaN and NaN", isCorrect: false },
          { text: "Infinity and -Infinity", isCorrect: false },
        ],
      },
      {
        text: "In production web applications, which technique prevents Prototype Pollution attacks?",
        category: QuestionCategory.SYSTEM_DESIGN,
        difficulty: QuestionDifficulty.HARD,
        points: 2,
        explanation: "Creating dictionaries with Object.create(null), freezing Object.prototype, or filtering keys like '__proto__', 'constructor', and 'prototype' during deep merges prevents prototype pollution.",
        options: [
          { text: "Using Object.create(null) for dictionaries and validating against __proto__ and constructor keys", isCorrect: true },
          { text: "Wrapping all functions in try...catch blocks", isCorrect: false },
          { text: "Replacing all objects with Arrays", isCorrect: false },
          { text: "Using TypeScript's 'any' type on all untrusted JSON objects", isCorrect: false },
        ],
      },
    ],
  },

  // ==========================================
  // 2. TYPESCRIPT ARCHITECTURE & TYPES (30 Questions)
  // ==========================================
  {
    skillSlug: "typescript",
    title: "TypeScript Senior Architecture & Type Systems Assessment",
    slug: "typescript-senior-architecture-assessment",
    description: "Evaluates comprehensive TypeScript competency: Conditional types, Inferred types, Template literal types, Branded types, Discriminated unions, and Strict variance.",
    durationMinutes: 45,
    totalQuestions: 30,
    passingScore: 70,
    difficulty: AssessmentDifficulty.ADVANCED,
    questions: [
      {
        text: "What does the 'infer' keyword do inside a conditional type in TypeScript?",
        code: `type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;`,
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "'infer' declares a type variable within the conditional extends clause that TypeScript deduces from the matching type pattern.",
        options: [
          { text: "Introduces a type variable to be deduced from the type being matched", isCorrect: true },
          { text: "Forces TypeScript to cast the type to runtime Object", isCorrect: false },
          { text: "Imports a type dynamically from external modules", isCorrect: false },
          { text: "Checks if a variable is defined at runtime", isCorrect: false },
        ],
      },
      {
        text: "What is the difference between 'unknown' and 'any' in TypeScript?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "'unknown' is the type-safe counterpart of 'any'. Anything can be assigned to unknown, but unknown cannot be assigned to other types or operated on without type narrowing/checking.",
        options: [
          { text: "'unknown' requires explicit type checking or narrowing before operations; 'any' turns off type checking entirely", isCorrect: true },
          { text: "'unknown' only allows primitives, while 'any' accepts objects", isCorrect: false },
          { text: "'any' is deprecated in TypeScript 5+", isCorrect: false },
          { text: "'unknown' is evaluated at runtime, while 'any' is compile-time only", isCorrect: false },
        ],
      },
      {
        text: "What will the following conditional type evaluate to?",
        code: `type Box<T> = T extends any ? T[] : never;\ntype Result = Box<string | number>;`,
        category: QuestionCategory.PROGRAMMING,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Naked type parameters in conditional types distribute over union types, so Box<string | number> distributes into Box<string> | Box<number> = string[] | number[].",
        options: [
          { text: "string[] | number[]", isCorrect: true },
          { text: "(string | number)[]", isCorrect: false },
          { text: "never[]", isCorrect: false },
          { text: "unknown", isCorrect: false },
        ],
      },
      {
        text: "How do you disable distributivity in a conditional type?",
        code: `type NonDistributed<T> = [T] extends [any] ? T[] : never;`,
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Wrapping the checked type parameter in a tuple (e.g. [T] extends [any]) prevents distributivity across union members.",
        options: [
          { text: "Wrap both sides of the extends keyword in square brackets [T] extends [U]", isCorrect: true },
          { text: "Use the 'readonly' modifier before T", isCorrect: false },
          { text: "Use keyof T instead of T", isCorrect: false },
          { text: "Add the 'non-distribute' pragma comment", isCorrect: false },
        ],
      },
      {
        text: "What is a Discriminated Union pattern in TypeScript and why is it preferred over type assertions?",
        category: QuestionCategory.PROBLEM_SOLVING,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "A union of object types sharing a common literal property (discriminant) allows TypeScript to automatically narrow the type in switch/if blocks with 100% type safety and exhaustive checking.",
        options: [
          { text: "Types sharing a common literal discriminant property enabling exhaustive, safe narrowing", isCorrect: true },
          { text: "A union that throws errors if any property is undefined", isCorrect: false },
          { text: "A technique to merge multiple classes into a single interface", isCorrect: false },
          { text: "A compiler flag that enforces snake_case property names", isCorrect: false },
        ],
      },
      {
        text: "What does the 'never' type represent in TypeScript?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "The 'never' type represents values that never occur, such as the return type of a function that always throws an error or enters an infinite loop, or the bottom of an exhaustive union check.",
        options: [
          { text: "The bottom type representing values that can never occur or exist", isCorrect: true },
          { text: "An alias for null and undefined combined", isCorrect: false },
          { text: "A type that allows any method call without compiler checks", isCorrect: false },
          { text: "A function that has not yet been executed", isCorrect: false },
        ],
      },
      {
        text: "What will the following Template Literal type produce?",
        code: `type Event = \`on\${'Click' | 'Hover'}\`;`,
        category: QuestionCategory.PROGRAMMING,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Template literal types interpolate each member of the union, producing 'onClick' | 'onHover'.",
        options: [
          { text: "'onClick' | 'onHover'", isCorrect: true },
          { text: "string", isCorrect: false },
          { text: "['onClick', 'onHover']", isCorrect: false },
          { text: "never", isCorrect: false },
        ],
      },
      {
        text: "What does the 'satisfies' operator introduced in TypeScript 4.9 do differently than 'as' type assertion?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "'satisfies' checks that an expression matches a type contract without changing or widening the inferred specific literal type of the expression.",
        options: [
          { text: "Validates conformity to a type while preserving the most specific inferred type of the value", isCorrect: true },
          { text: "Overrides the compiler to force treat any type as valid", isCorrect: false },
          { text: "Converts TypeScript types into runtime Zod schemas automatically", isCorrect: false },
          { text: "Only checks properties marked with optional modifier", isCorrect: false },
        ],
      },
      {
        text: "What is a 'Branded' or 'Nominal' type in TypeScript, and what problem does it solve?",
        category: QuestionCategory.SYSTEM_DESIGN,
        difficulty: QuestionDifficulty.HARD,
        points: 2,
        explanation: "TypeScript is structurally typed; adding a unique phantom symbol or tag (e.g. { __brand: 'UserId' }) creates nominally distinct types (e.g. UserId vs OrderId), preventing accidental misuse of raw primitives.",
        options: [
          { text: "Simulates nominal typing on primitives using phantom brand tags to prevent cross-assignment of identical underlying types", isCorrect: true },
          { text: "Licenses code under a commercial brand", isCorrect: false },
          { text: "Applies CSS branding classes to JSX elements", isCorrect: false },
          { text: "Generates unique UUIDs for class instances at runtime", isCorrect: false },
        ],
      },
      {
        text: "What is the result of keyof any in TypeScript?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "In JavaScript, object property keys can only be strings, numbers, or symbols. Therefore keyof any is string | number | symbol.",
        options: [
          { text: "string | number | symbol", isCorrect: true },
          { text: "string", isCorrect: false },
          { text: "any", isCorrect: false },
          { text: "never", isCorrect: false },
        ],
      },
      {
        text: "What is the function of the Omit<T, K> utility type?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Omit<T, K> constructs a type by picking all properties from T and then removing keys specified in K (implemented as Pick<T, Exclude<keyof T, K>>).",
        options: [
          { text: "Constructs a type by picking all properties from T and removing K", isCorrect: true },
          { text: "Makes all properties in K optional", isCorrect: false },
          { text: "Deletes properties from the JavaScript object at runtime", isCorrect: false },
          { text: "Extracts only the keys listed in K", isCorrect: false },
        ],
      },
      {
        text: "What is the difference between an 'interface' and a 'type' alias regarding declaration merging?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Multiple interface declarations with the same name in the same scope merge their members automatically. Type aliases cannot be redeclared and will cause a compiler error.",
        options: [
          { text: "Interfaces with identical names merge automatically; Type aliases throw duplicate identifier errors", isCorrect: true },
          { text: "Type aliases merge automatically; interfaces throw duplicate identifier errors", isCorrect: false },
          { text: "Interfaces cannot extend other interfaces", isCorrect: false },
          { text: "Type aliases are compiled to JavaScript classes, interfaces disappear", isCorrect: false },
        ],
      },
      {
        text: "What happens when 'strictNullChecks' compiler option is set to false?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "When false, null and undefined are in the domain of every type (e.g. string can be null), leading to runtime Cannot read property errors.",
        options: [
          { text: "null and undefined are allowed as valid values for any type", isCorrect: true },
          { text: "null and undefined are completely banned from the language", isCorrect: false },
          { text: "TypeScript will automatically replace all nulls with empty objects", isCorrect: false },
          { text: "It causes tsc compilation to fail immediately", isCorrect: false },
        ],
      },
      {
        text: "What is function parameter bivariance in TypeScript under default settings?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.HARD,
        points: 2,
        explanation: "Historically method parameters are bivariant for compatibility, but strictFunctionTypes makes function parameters contravariant.",
        options: [
          { text: "Methods allow both wider and narrower parameter types unless strictFunctionTypes is enabled", isCorrect: true },
          { text: "Functions can accept both synchronous and asynchronous callbacks", isCorrect: false },
          { text: "Parameters can be passed in any order", isCorrect: false },
          { text: "Return types can be both void and Promise<void>", isCorrect: false },
        ],
      },
      {
        text: "How do you write a custom Type Guard function in TypeScript?",
        code: `function isFish(pet: Fish | Bird): pet is Fish {\n  return (pet as Fish).swim !== undefined;\n}`,
        category: QuestionCategory.PROGRAMMING,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "A custom type guard uses a type predicate return type signature in the form 'parameter is Type'.",
        options: [
          { text: "Define the return type as 'param is Type'", isCorrect: true },
          { text: "Return typeof param === 'Type'", isCorrect: false },
          { text: "Use the @guard JSDoc tag above the function", isCorrect: false },
          { text: "Prefix the function name with 'asserts'", isCorrect: false },
        ],
      },
      {
        text: "What does the 'readonly' array modifier ensure?",
        code: `const arr: readonly number[] = [1, 2, 3];`,
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "readonly prevents mutating methods like push, pop, splice, and direct index assignment (arr[0] = 5).",
        options: [
          { text: "Mutating methods like push/pop and index assignments produce compiler errors", isCorrect: true },
          { text: "The array is deeply cloned in memory", isCorrect: false },
          { text: "The array values cannot be read in loops", isCorrect: false },
          { text: "Object.freeze() is invoked at runtime automatically", isCorrect: false },
        ],
      },
      {
        text: "What is the output type of Exclude<'a' | 'b' | 'c', 'a'>?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Exclude<T, U> excludes members of T that are assignable to U, leaving 'b' | 'c'.",
        options: [
          { text: "'b' | 'c'", isCorrect: true },
          { text: "'a'", isCorrect: false },
          { text: "never", isCorrect: false },
          { text: "string", isCorrect: false },
        ],
      },
      {
        text: "What will this mapped type produce?",
        code: `type Mutable<T> = {\n  -readonly [P in keyof T]: T[P];\n};`,
        category: QuestionCategory.PROGRAMMING,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "The '-readonly' prefix removes the readonly modifier from all properties of T, making them writable.",
        options: [
          { text: "Removes the readonly modifier making all properties mutable", isCorrect: true },
          { text: "Removes all optional flags", isCorrect: false },
          { text: "Makes all properties readonly", isCorrect: false },
          { text: "Deletes all properties", isCorrect: false },
        ],
      },
      {
        text: "What does the 'as const' assertion do when applied to an object literal?",
        code: `const routes = { HOME: '/', LOGIN: '/login' } as const;`,
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "'as const' signals to TypeScript that all properties are readonly and their values should be typed as specific string literals instead of widened to string.",
        options: [
          { text: "Infers literal types for values and marks all properties as readonly", isCorrect: true },
          { text: "Converts the object to an ECMAScript enum", isCorrect: false },
          { text: "Prevents JavaScript garbage collection", isCorrect: false },
          { text: "Freezes the object at runtime using Object.freeze", isCorrect: false },
        ],
      },
      {
        text: "What is an assertion function in TypeScript?",
        code: `function assertIsString(val: any): asserts val is string {\n  if (typeof val !== 'string') throw new Error('Not a string');\n}`,
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Functions returning 'asserts condition' inform TypeScript that if the function returns without throwing, the asserted condition holds true for subsequent statements in the scope.",
        options: [
          { text: "Narrows the type in the remainder of the containing scope if the function returns without throwing", isCorrect: true },
          { text: "Runs only inside Jest unit tests", isCorrect: false },
          { text: "Catches all unhandled promise rejections automatically", isCorrect: false },
          { text: "Forces tsc to emit console.assert statements", isCorrect: false },
        ],
      },
      {
        text: "What is the difference between NoInfer<T> introduced in TypeScript 5.4 and standard generics?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.HARD,
        points: 2,
        explanation: "NoInfer<T> blocks inference on candidate arguments, forcing TypeScript to infer T only from other argument positions.",
        options: [
          { text: "Prevents TypeScript from using that specific parameter to infer the generic type T", isCorrect: true },
          { text: "Disables type checking on function arguments", isCorrect: false },
          { text: "Generates runtime validation guards", isCorrect: false },
          { text: "Forces T to always resolve to any", isCorrect: false },
        ],
      },
      {
        text: "How do you implement an exhaustive check in a switch statement on a discriminated union?",
        code: `function handle(action: Action) {\n  switch (action.type) {\n    case 'A': return;\n    case 'B': return;\n    default:\n      const _exhaustive: never = action;\n      return _exhaustive;\n  }\n}`,
        category: QuestionCategory.SYSTEM_DESIGN,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Assigning the unhandled value to a variable of type 'never' in default causes a compile-time error if any union member was missed.",
        options: [
          { text: "Assign the unhandled value to a variable of type 'never' in default case", isCorrect: true },
          { text: "Throw a runtime Error without type annotations", isCorrect: false },
          { text: "Use action.type as any in the default block", isCorrect: false },
          { text: "Use eslint-disable-next-line exhaustive-deps", isCorrect: false },
        ],
      },
      {
        text: "What is the result of Extract<'a' | 'b' | number, string>?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Extract<T, U> filters T down to only members assignable to U, extracting 'a' | 'b'.",
        options: [
          { text: "'a' | 'b'", isCorrect: true },
          { text: "number", isCorrect: false },
          { text: "string", isCorrect: false },
          { text: "never", isCorrect: false },
        ],
      },
      {
        text: "What does the 'override' keyword in a TypeScript class method accomplish?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "With 'noImplicitOverride' enabled, 'override' ensures the method actually overrides an existing method in the base class, preventing typos or broken refactors.",
        options: [
          { text: "Guarantees that a method exists in the superclass with the exact name being overridden", isCorrect: true },
          { text: "Replaces all calls to the superclass method across the codebase", isCorrect: false },
          { text: "Makes the method private to the child class", isCorrect: false },
          { text: "Allows changing the method signature arbitrarily without type checking", isCorrect: false },
        ],
      },
      {
        text: "What happens when you index an object type with a union of its keys?",
        code: `interface Person { name: string; age: number; }\ntype Value = Person[keyof Person];`,
        category: QuestionCategory.PROGRAMMING,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Person[keyof Person] produces a union of all property value types, which is string | number.",
        options: [
          { text: "string | number", isCorrect: true },
          { text: "[string, number]", isCorrect: false },
          { text: "{ name: string; age: number }", isCorrect: false },
          { text: "any", isCorrect: false },
        ],
      },
      {
        text: "What is the difference between moduleResolution 'bundler' vs 'node16'/'nodenext' in tsconfig.json?",
        category: QuestionCategory.SYSTEM_DESIGN,
        difficulty: QuestionDifficulty.HARD,
        points: 2,
        explanation: "'bundler' models resolution for tools like Vite/Next.js allowing extensionless imports while honoring 'exports' in package.json; 'node16' strictly enforces Node's ESM resolution including mandatory file extensions.",
        options: [
          { text: "'bundler' mimics bundlers (Vite/Next) allowing extensionless imports while respecting package.json exports; 'node16' strictly enforces Node ESM with file extensions", isCorrect: true },
          { text: "'bundler' compiles code to CommonJS while 'node16' always outputs AMD modules", isCorrect: false },
          { text: "'bundler' disables type-checking across external npm dependencies", isCorrect: false },
          { text: "'node16' is deprecated in favor of 'browser'", isCorrect: false },
        ],
      },
      {
        text: "What does the Awaited<T> utility type do?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Awaited<T> recursively unwraps Promises, mimicking the behavior of 'await' in async functions (e.g. Awaited<Promise<Promise<string>>> is string).",
        options: [
          { text: "Recursively unwraps Promise and thenable types to obtain their resolved value type", isCorrect: true },
          { text: "Converts synchronous functions into async promises", isCorrect: false },
          { text: "Pauses TypeScript compilation until async tasks complete", isCorrect: false },
          { text: "Replaces Promise.resolve with native callbacks", isCorrect: false },
        ],
      },
      {
        text: "Given a function with multiple overload signatures, which signature body implementation determines external caller types?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Only the overload signatures are visible to external callers. The implementation signature is invisible from the outside.",
        options: [
          { text: "The overload signatures are visible to callers; the implementation signature is hidden", isCorrect: true },
          { text: "The implementation signature overrides all overloads", isCorrect: false },
          { text: "TypeScript creates a union of all overload signatures and the implementation", isCorrect: false },
          { text: "Only the very first overload signature can ever be called", isCorrect: false },
        ],
      },
      {
        text: "What does the compiler flag 'isolatedModules' enforce?",
        category: QuestionCategory.SYSTEM_DESIGN,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "It ensures each file can be transpiled independently by single-file transpilers like Babel/esbuild/swc without cross-file type information (e.g. banning const enum or ambient namespaces).",
        options: [
          { text: "Ensures files can be transpiled safely by single-file transpilers like esbuild and Babel", isCorrect: true },
          { text: "Prevents any file from importing external node_modules", isCorrect: false },
          { text: "Sandboxes each file inside an isolated Docker container", isCorrect: false },
          { text: "Disables ECMAScript export statements", isCorrect: false },
        ],
      },
      {
        text: "How do you implement deep readonly in TypeScript?",
        code: `type DeepReadonly<T> = T extends Function ? T : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;`,
        category: QuestionCategory.PROBLEM_SOLVING,
        difficulty: QuestionDifficulty.HARD,
        points: 2,
        explanation: "Using recursive conditional mapped types that apply readonly to keys and recursively unwrap nested object properties while leaving primitives and functions intact.",
        options: [
          { text: "A recursive conditional mapped type traversing nested object structures", isCorrect: true },
          { text: "Applying Object.freeze(T) at compile time", isCorrect: false },
          { text: "Using readonly T[]", isCorrect: false },
          { text: "TypeScript has a built-in immutable keyword that automatically handles deep freeze", isCorrect: false },
        ],
      },
    ],
  },

  // ==========================================
  // 3. REACT FRONTEND ARCHITECTURE (30 Questions)
  // ==========================================
  {
    skillSlug: "react",
    title: "React Architecture, Hooks & Next.js Performance Assessment",
    slug: "react-architecture-hooks-assessment",
    description: "Evaluates comprehensive React knowledge: Reconciliation, Fiber architecture, Hook rules, Server Components, State modeling, Profiling, and Performance optimization.",
    durationMinutes: 45,
    totalQuestions: 30,
    passingScore: 70,
    difficulty: AssessmentDifficulty.ADVANCED,
    questions: [
      {
        text: "Why should you NOT use array indices as keys in dynamically rendered lists in React?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Using index as a key confuses React's reconciliation when items are added, removed, or reordered, leading to incorrect state mapping, input glitches, and poor render performance.",
        options: [
          { text: "Reordering, inserting, or deleting items will lead to incorrect state retention in child components and broken DOM updates", isCorrect: true },
          { text: "React will throw an unrecoverable fatal runtime Error", isCorrect: false },
          { text: "Array indices are converted to floating point numbers in Fiber", isCorrect: false },
          { text: "It prevents CSS styles from being applied to elements", isCorrect: false },
        ],
      },
      {
        text: "What is the primary role of the React Fiber architecture introduced in React 16?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.HARD,
        points: 2,
        explanation: "Fiber replaced the synchronous recursive stack reconciler with a virtual stack frame data structure enabling concurrent rendering, interruptible work, time-slicing, and prioritization.",
        options: [
          { text: "Enables incremental, interruptible rendering with priority-based scheduling", isCorrect: true },
          { text: "Compiles JSX to WebAssembly for native mobile performance", isCorrect: false },
          { text: "Replaces JavaScript Promises with RxJS observables inside components", isCorrect: false },
          { text: "Directly renders React components without the browser DOM", isCorrect: false },
        ],
      },
      {
        text: "What will happen if you call setState inside useEffect without an appropriate dependency array?",
        code: `useEffect(() => {\n  setCount(c => c + 1);\n});`,
        category: QuestionCategory.PROGRAMMING,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Without a dependency array, useEffect runs after every single render. Updating state triggers another render, causing an infinite re-render loop.",
        options: [
          { text: "It causes an infinite re-render loop exceeding max update depth", isCorrect: true },
          { text: "It runs only once on initial mount", isCorrect: false },
          { text: "It executes once every 1000 milliseconds", isCorrect: false },
          { text: "React ignores the setState call completely", isCorrect: false },
        ],
      },
      {
        text: "What is the key architectural difference between React Server Components (RSC) and standard Client Components?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "RSC execute exclusively on the server, have zero client bundle footprint, can directly query databases and file systems, but cannot use hooks, state, or browser DOM events.",
        options: [
          { text: "RSC execute only on the server, adding zero bytes to client JS bundle, with direct backend access", isCorrect: true },
          { text: "RSC can use useState and useEffect whereas client components cannot", isCorrect: false },
          { text: "RSC are compiled into WebSockets that stream canvas pixels to the screen", isCorrect: false },
          { text: "RSC only work when using Docker containers", isCorrect: false },
        ],
      },
      {
        text: "When is useMemo actually beneficial for performance optimization?",
        category: QuestionCategory.PROBLEM_SOLVING,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "useMemo is beneficial when caching computationally heavy calculations (e.g. sorting/filtering thousands of records) or preserving referential identity for objects passed to memoized children or hook dependency arrays.",
        options: [
          { text: "For expensive pure calculations or preserving referential stability for memoized children", isCorrect: true },
          { text: "On every single variable assignment inside any component", isCorrect: false },
          { text: "Exclusively for storing primitive boolean flags", isCorrect: false },
          { text: "To make asynchronous API calls without useEffect", isCorrect: false },
        ],
      },
      {
        text: "What does the useCallback hook return?",
        code: `const handleClick = useCallback(() => {\n  console.log(id);\n}, [id]);`,
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "useCallback returns a memoized version of the callback function that only changes referential identity when values in the dependency array change.",
        options: [
          { text: "A memoized callback function instance with stable referential identity", isCorrect: true },
          { text: "The return value of executing the callback function immediately", isCorrect: false },
          { text: "A Promise that resolves when the user clicks the element", isCorrect: false },
          { text: "A React ref object containing current", isCorrect: false },
        ],
      },
      {
        text: "What will the following code output to console on click?",
        code: `function Counter() {\n  const [count, setCount] = useState(0);\n  const handleClick = () => {\n    setCount(count + 1);\n    setCount(count + 1);\n    setCount(count + 1);\n  };\n  return <button onClick={handleClick}>{count}</button>;\n}`,
        category: QuestionCategory.PROGRAMMING,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Because count is captured in closure as 0 during that event tick, all three calls compute 0 + 1 = 1. Automatic batching applies the final update of 1.",
        options: [
          { text: "count becomes 1", isCorrect: true },
          { text: "count becomes 3", isCorrect: false },
          { text: "count becomes 0", isCorrect: false },
          { text: "React throws a StateBatchingError", isCorrect: false },
        ],
      },
      {
        text: "How do you correctly increment state sequentially based on prior state in multiple calls?",
        code: `setCount(prev => prev + 1);\nsetCount(prev => prev + 1);`,
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Passing an updater function (prev => prev + 1) enqueues state transitions that receive the most up-to-date pending state value.",
        options: [
          { text: "Pass an updater function (prev => prev + 1) to setState", isCorrect: true },
          { text: "Use async/await before setState", isCorrect: false },
          { text: "Wrap each setState in setTimeout(..., 0)", isCorrect: false },
          { text: "Call forceUpdate() between setState calls", isCorrect: false },
        ],
      },
      {
        text: "What is the purpose of React.useTransition hook introduced in React 18?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "useTransition allows marking state updates as non-urgent transitions, keeping the UI responsive and interactive (e.g. typing in an input) while expensive background renders occur.",
        options: [
          { text: "Marks non-urgent state updates as transitions that can be interrupted by urgent user inputs", isCorrect: true },
          { text: "Animates CSS opacity transitions between route transitions", isCorrect: false },
          { text: "Migrates class components to functional components automatically", isCorrect: false },
          { text: "Handles HTTP 302 redirects on client-side navigation", isCorrect: false },
        ],
      },
      {
        text: "What does the useId() hook solve in React 18+ SSR applications?",
        category: QuestionCategory.SYSTEM_DESIGN,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "useId() generates unique, deterministic identifiers that match between the server-rendered HTML and client hydration, eliminating hydration mismatch errors in accessible form inputs.",
        options: [
          { text: "Generates deterministic unique IDs that match between server rendering and client hydration", isCorrect: true },
          { text: "Generates MongoDB ObjectId strings on the client", isCorrect: false },
          { text: "Tracks user analytics session IDs across browser tabs", isCorrect: false },
          { text: "Encrypts form submission passwords", isCorrect: false },
        ],
      },
      {
        text: "What is a major pitfall of storing mutable objects in React state without immutability?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "React compares old and new state by Object.is() referential equality. Directly mutating an object retains the same memory reference, so React bails out of re-rendering.",
        options: [
          { text: "Object.is comparison sees the same memory reference and bails out of re-rendering", isCorrect: true },
          { text: "It causes memory fragmentation in WebAssembly", isCorrect: false },
          { text: "JavaScript freezes the object automatically", isCorrect: false },
          { text: "React deletes the component from the DOM tree", isCorrect: false },
        ],
      },
      {
        text: "What does useSyncExternalStore provide that useEffect + useState cannot reliably guarantee in concurrent React?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.HARD,
        points: 2,
        explanation: "It prevents 'tearing' (visual inconsistencies where different components render data from different versions of an external store in the same frame) during concurrent rendering.",
        options: [
          { text: "Prevents UI tearing by reading external store snapshots synchronously during concurrent renders", isCorrect: true },
          { text: "Synchronizes browser LocalStorage with Redis in real time", isCorrect: false },
          { text: "Allows client components to read SQL databases directly", isCorrect: false },
          { text: "Forces components to render at 120 FPS", isCorrect: false },
        ],
      },
      {
        text: "How should you handle errors in asynchronous event handlers or setTimeout callbacks within React components?",
        category: QuestionCategory.SYSTEM_DESIGN,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "React Error Boundaries only catch errors during rendering, lifecycle methods, and constructors. Asynchronous errors in event handlers must be handled with try...catch.",
        options: [
          { text: "Wrap with try...catch within the handler, because Error Boundaries only catch rendering errors", isCorrect: true },
          { text: "Error Boundaries automatically catch all asynchronous event errors without extra code", isCorrect: false },
          { text: "Use window.onerror = null to suppress them", isCorrect: false },
          { text: "Throwing inside event handlers automatically triggers the nearest Suspense boundary", isCorrect: false },
        ],
      },
      {
        text: "What is the difference between controlled and uncontrolled form inputs in React?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Controlled inputs have their current value driven by React state via value and onChange. Uncontrolled inputs store their value in the DOM itself, accessed via a ref.",
        options: [
          { text: "Controlled inputs are driven by React state via value/onChange; uncontrolled inputs maintain value in the DOM accessed via ref", isCorrect: true },
          { text: "Controlled inputs only work with TypeScript", isCorrect: false },
          { text: "Uncontrolled inputs cannot be submitted in HTML forms", isCorrect: false },
          { text: "Controlled inputs bypass HTML5 validation attributes", isCorrect: false },
        ],
      },
      {
        text: "What is the purpose of React.forwardRef?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "It allows a custom parent component to pass a ref down through a child component to expose a native DOM element or imperative handle.",
        options: [
          { text: "Passes a ref through a component to an underlying DOM node or child component", isCorrect: true },
          { text: "Forwards HTTP requests to proxy backends", isCorrect: false },
          { text: "Redirects the browser URL forward in history", isCorrect: false },
          { text: "Automatically memoizes functional components", isCorrect: false },
        ],
      },
      {
        text: "What does useImperativeHandle allow a child component to do?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "When used with forwardRef, it customizes and limits the instance value/methods exposed to the parent component ref instead of exposing the entire raw DOM node.",
        options: [
          { text: "Exposes a curated set of imperative methods/properties to the parent ref instead of raw DOM element", isCorrect: true },
          { text: "Disables React's declarative rendering pipeline", isCorrect: false },
          { text: "Allows child components to mutate parent state directly without props", isCorrect: false },
          { text: "Bypasses strict mode warnings", isCorrect: false },
        ],
      },
      {
        text: "Why does React execute component bodies twice in StrictMode during development?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "StrictMode intentionally double-invokes render functions, reducers, and initial effects in development to expose unintended side-effects and cleanup bugs before production.",
        options: [
          { text: "To help surface impure side-effects and missing effect cleanup logic", isCorrect: true },
          { text: "To benchmark CPU cache efficiency", isCorrect: false },
          { text: "Because React creates two concurrent Fiber trees for comparison", isCorrect: false },
          { text: "It is a known bug in React 18 that cannot be fixed", isCorrect: false },
        ],
      },
      {
        text: "How does Code Splitting with React.lazy and Suspense improve Initial Page Load performance?",
        category: QuestionCategory.PROBLEM_SOLVING,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "React.lazy dynamically imports component bundles on demand, reducing the initial JavaScript payload size that the browser must download, parse, and compile.",
        options: [
          { text: "Splits bundle into smaller chunks loaded on-demand, reducing initial JS payload size and Time to Interactive", isCorrect: true },
          { text: "Converts images into WebP format on the fly", isCorrect: false },
          { text: "Executes React components in a Web Worker thread", isCorrect: false },
          { text: "Eliminates the need for CSS files", isCorrect: false },
        ],
      },
      {
        text: "What does 'prop drilling' refer to, and which pattern solves it without external libraries?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "Passing props down through multiple layers of intermediate components that don't need them. It can be solved using React Context or component composition (passing children/slots).",
        options: [
          { text: "Passing props through intermediate layers that do not need them; solved by Context API or Component Composition", isCorrect: true },
          { text: "Validating props with TypeScript interfaces", isCorrect: false },
          { text: "Calling child component methods from parent components", isCorrect: false },
          { text: "Rendering list items with the spread operator", isCorrect: false },
        ],
      },
      {
        text: "What is the primary cause of React context causing unnecessary re-renders?",
        category: QuestionCategory.PROBLEM_SOLVING,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Whenever the Context value reference changes, every single component calling useContext(MyContext) will re-render, even if it only consumes an unchanged property of that context.",
        options: [
          { text: "Every subscriber re-renders whenever the context value reference changes, even for unused properties", isCorrect: true },
          { text: "Context values cannot store arrays or functions", isCorrect: false },
          { text: "Context bypasses React's virtual DOM reconciliation entirely", isCorrect: false },
          { text: "Context can only be used once per application root", isCorrect: false },
        ],
      },
      {
        text: "What is the recommended architecture to prevent Context re-render cascades?",
        category: QuestionCategory.SYSTEM_DESIGN,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Split monolithic context into smaller, focused contexts (e.g. StateContext and DispatchContext), memoize the provider value with useMemo, or use atomic state selectors.",
        options: [
          { text: "Split contexts into focused domain slices (e.g., separate state and dispatch) and memoize provider values", isCorrect: true },
          { text: "Convert all components into class components", isCorrect: false },
          { text: "Store all state in global window variables", isCorrect: false },
          { text: "Disable React StrictMode in production", isCorrect: false },
        ],
      },
      {
        text: "In Next.js App Router, how does Streaming SSR work with Suspense?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.HARD,
        points: 2,
        explanation: "The server renders the initial HTML shell immediately and streams chunks over the same HTTP response as asynchronous server components resolve their data.",
        options: [
          { text: "The server streams initial HTML layout immediately and streams subsequent component chunks as data resolves", isCorrect: true },
          { text: "Next.js converts React components into MP4 video streams", isCorrect: false },
          { text: "It requires opening a persistent WebSocket connection to the browser", isCorrect: false },
          { text: "It caches all database queries on Cloudflare edge workers indefinitely", isCorrect: false },
        ],
      },
      {
        text: "What is the difference between Server Actions and API Routes in Next.js?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Server Actions are asynchronous functions defined with 'use server' that can be called directly from client forms or buttons with automated progressive enhancement and cache revalidation.",
        options: [
          { text: "Server Actions are direct RPC functions called from UI components with integrated cache revalidation", isCorrect: true },
          { text: "API Routes can only return XML whereas Server Actions return JSON", isCorrect: false },
          { text: "Server Actions run inside the browser Web Worker", isCorrect: false },
          { text: "API routes do not support POST requests", isCorrect: false },
        ],
      },
      {
        text: "What will happen if a hook is placed inside a conditional if statement?",
        code: `if (condition) {\n  useEffect(() => {}, []);\n}`,
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "React relies on the order in which hooks are called across renders to maintain internal linked lists of hook state. Conditional calls corrupt this order and throw errors.",
        options: [
          { text: "Breaks the Rules of Hooks and corrupts React's internal fiber hook linked list across renders", isCorrect: true },
          { text: "React executes the hook only when condition is truthy without issues", isCorrect: false },
          { text: "The condition is automatically converted to a useMemo dependency", isCorrect: false },
          { text: "Next.js compiles the condition into a server action", isCorrect: false },
        ],
      },
      {
        text: "What does useLayoutEffect do differently from standard useEffect?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "useLayoutEffect fires synchronously after all DOM mutations but before the browser repaints the screen, preventing visual flicker during DOM measurements and adjustments.",
        options: [
          { text: "Fires synchronously after DOM mutations but before the browser paints, preventing visual layout shifts", isCorrect: true },
          { text: "Executes exclusively on the Node.js server during SSR", isCorrect: false },
          { text: "Only runs when the CSS Grid layout changes", isCorrect: false },
          { text: "Has no cleanup function support", isCorrect: false },
        ],
      },
      {
        text: "How does React memo() (HOC) perform equality comparisons on incoming props by default?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.EASY,
        points: 1,
        explanation: "React.memo performs a shallow equality comparison (Object.is) on the props object. Passing a custom areEqual function enables deep or customized comparisons.",
        options: [
          { text: "Shallow comparison (Object.is) on individual prop values", isCorrect: true },
          { text: "Deep recursive structural equality check", isCorrect: false },
          { text: "JSON.stringify string comparison", isCorrect: false },
          { text: "Compares only primitive values, ignoring object props", isCorrect: false },
        ],
      },
      {
        text: "What is an event pooling mechanism in React 16 and what happened to it in React 17+?",
        category: QuestionCategory.THEORY,
        difficulty: QuestionDifficulty.HARD,
        points: 1,
        explanation: "React 16 recycled SyntheticEvent objects for performance, requiring event.persist() to read them in async callbacks. React 17+ completely removed event pooling for modern JavaScript engines.",
        options: [
          { text: "SyntheticEvents were recycled for memory efficiency in 16; pooling was completely removed in 17+", isCorrect: true },
          { text: "It was a feature to batch DOM clicks; expanded to all events in 18+", isCorrect: false },
          { text: "Event pooling was renamed to Redux Toolkit in React 17", isCorrect: false },
          { text: "It prevented event bubbling across iframes", isCorrect: false },
        ],
      },
      {
        text: "What is the optimal pattern for handling large virtualized lists (e.g. 50,000 items) in React?",
        category: QuestionCategory.SYSTEM_DESIGN,
        difficulty: QuestionDifficulty.HARD,
        points: 2,
        explanation: "Windowing / Virtualization (using react-window/tanstack-virtual) renders only the DOM nodes currently visible inside the viewport window plus a small buffer, keeping DOM node count low.",
        options: [
          { text: "DOM windowing virtualization that renders only the items visible in the current scroll viewport", isCorrect: true },
          { text: "Rendering all 50,000 items into a single hidden table", isCorrect: false },
          { text: "Wrapping every list item with React.memo", isCorrect: false },
          { text: "Converting the list into an SVG canvas", isCorrect: false },
        ],
      },
      {
        text: "What does the 'revalidatePath' function do in Next.js?",
        category: QuestionCategory.BASIC_KNOWLEDGE,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "revalidatePath purges cached server-rendered data for a specific route path on demand, ensuring subsequent requests fetch and render fresh data.",
        options: [
          { text: "Purges the Next.js Data Cache for a specified route path on demand", isCorrect: true },
          { text: "Reloads the browser window via window.location.reload()", isCorrect: false },
          { text: "Checks if a URL path is accessible via DNS ping", isCorrect: false },
          { text: "Recompiles Tailwind CSS classes for that route", isCorrect: false },
        ],
      },
      {
        text: "What is the best way to structure state for an entity collection to enable O(1) lookup and clean updates?",
        category: QuestionCategory.PROBLEM_SOLVING,
        difficulty: QuestionDifficulty.MEDIUM,
        points: 1,
        explanation: "Normalized state structure (e.g. { byId: { [id]: Item }, allIds: string[] }) prevents nested loops, ensures O(1) item lookups, and eliminates duplicate data.",
        options: [
          { text: "Normalized dictionary state with an IDs array: { byId: Record<id, Entity>, allIds: string[] }", isCorrect: true },
          { text: "An unindexed array of nested objects searched via Array.prototype.find", isCorrect: false },
          { text: "A single comma-separated string of IDs", isCorrect: false },
          { text: "Converting the collection into a binary heap stored in localStorage", isCorrect: false },
        ],
      },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding comprehensive skill assessments...");

  for (const item of assessmentsData) {
    // Find skill
    const skill = await prisma.skill.findUnique({
      where: { slug: item.skillSlug },
    });

    if (!skill) {
      console.warn(`Skill with slug "${item.skillSlug}" not found. Skipping assessment "${item.title}".`);
      continue;
    }

    // Upsert Assessment
    const assessment = await prisma.assessment.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        description: item.description,
        durationMinutes: item.durationMinutes,
        totalQuestions: item.questions.length,
        passingScore: item.passingScore,
        difficulty: item.difficulty,
        skillId: skill.id,
      },
      create: {
        title: item.title,
        slug: item.slug,
        description: item.description,
        durationMinutes: item.durationMinutes,
        totalQuestions: item.questions.length,
        passingScore: item.passingScore,
        difficulty: item.difficulty,
        skillId: skill.id,
      },
    });

    console.log(`✅ Upserted Assessment: ${assessment.title} (${assessment.id})`);

    // Delete existing questions to cleanly re-seed
    await prisma.assessmentQuestion.deleteMany({
      where: { assessmentId: assessment.id },
    });

    // Insert questions with options
    for (let i = 0; i < item.questions.length; i++) {
      const q = item.questions[i];
      await prisma.assessmentQuestion.create({
        data: {
          assessmentId: assessment.id,
          questionText: q.text,
          codeSnippet: q.code || null,
          questionType: q.category,
          difficulty: q.difficulty,
          points: q.points,
          explanation: q.explanation,
          sortOrder: i + 1,
          options: {
            create: q.options.map((opt, optIndex) => ({
              optionText: opt.text,
              isCorrect: opt.isCorrect,
              sortOrder: optIndex + 1,
            })),
          },
        },
      });
    }

    console.log(`   └─ Seeded ${item.questions.length} questions for ${assessment.title}`);
  }

  console.log("🎉 All assessments seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding assessments:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
