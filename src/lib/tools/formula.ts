/**
 * ============================================================================
 * Safe formula evaluator — the engine that runs `expression` strings.
 * ============================================================================
 * AI-generated and DB-stored tools cannot ship a JS function, so they ship a
 * math expression string instead. We evaluate it with a hand-written
 * tokenizer + recursive-descent parser.
 *
 * SECURITY: This NEVER uses eval / new Function / with. Only:
 *   - numbers, the variables you pass in, and a fixed whitelist of functions
 *   - operators: + - * / % ^ ( ) and comparisons/logic (< > <= >= == != && || ! ?:)
 * Anything else throws. Booleans are represented as 1 / 0.
 *
 * Example expression: "(sellPrice - buyPrice) * amount"
 *                     "amount * price * (leverage > 0 ? 1 : 0)"
 *                     "max(0, (entry - stop) / entry * 100)"
 */

// ---- Whitelisted functions -------------------------------------------------

type MathFn = (...args: number[]) => number;

const FUNCTIONS: Record<string, MathFn> = {
  abs: Math.abs,
  ceil: Math.ceil,
  floor: Math.floor,
  round: (x, digits = 0) => {
    const f = Math.pow(10, digits);
    return Math.round(x * f) / f;
  },
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  pow: Math.pow,
  exp: Math.exp,
  log: Math.log,
  log10: Math.log10,
  log2: Math.log2,
  ln: Math.log,
  min: Math.min,
  max: Math.max,
  sign: Math.sign,
  trunc: Math.trunc,
  // clamp(value, lo, hi)
  clamp: (x, lo, hi) => Math.min(Math.max(x, lo), hi),
};

const CONSTANTS: Record<string, number> = {
  PI: Math.PI,
  E: Math.E,
};

// ---- Tokenizer -------------------------------------------------------------

type TokenType = "num" | "ident" | "op" | "paren" | "comma";

interface Token {
  type: TokenType;
  value: string;
}

const TWO_CHAR_OPS = new Set(["<=", ">=", "==", "!=", "&&", "||"]);
const ONE_CHAR_OPS = new Set([
  "+", "-", "*", "/", "%", "^", "<", ">", "!", "?", ":",
]);

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];

    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      i++;
      continue;
    }

    // Numbers: 123, 1.5, .5, 1e-3
    if ((ch >= "0" && ch <= "9") || (ch === "." && /[0-9]/.test(input[i + 1] ?? ""))) {
      let num = "";
      while (i < input.length && /[0-9.]/.test(input[i])) num += input[i++];
      if (input[i] === "e" || input[i] === "E") {
        num += input[i++];
        if (input[i] === "+" || input[i] === "-") num += input[i++];
        while (i < input.length && /[0-9]/.test(input[i])) num += input[i++];
      }
      if (Number.isNaN(Number(num))) throw new FormulaError(`Invalid number "${num}"`);
      tokens.push({ type: "num", value: num });
      continue;
    }

    // Identifiers: variable or function names
    if (/[a-zA-Z_]/.test(ch)) {
      let ident = "";
      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) ident += input[i++];
      tokens.push({ type: "ident", value: ident });
      continue;
    }

    if (ch === "(" || ch === ")") {
      tokens.push({ type: "paren", value: ch });
      i++;
      continue;
    }

    if (ch === ",") {
      tokens.push({ type: "comma", value: "," });
      i++;
      continue;
    }

    // Two-char then one-char operators
    const two = input.slice(i, i + 2);
    if (TWO_CHAR_OPS.has(two)) {
      tokens.push({ type: "op", value: two });
      i += 2;
      continue;
    }
    if (ONE_CHAR_OPS.has(ch)) {
      tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }

    throw new FormulaError(`Unexpected character "${ch}" at position ${i}`);
  }
  return tokens;
}

// ---- Parser (recursive descent) -------------------------------------------

export class FormulaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormulaError";
  }
}

class Parser {
  private pos = 0;
  constructor(
    private readonly tokens: Token[],
    private readonly vars: Record<string, number>,
  ) {}

  parse(): number {
    const value = this.ternary();
    if (this.pos < this.tokens.length) {
      throw new FormulaError(`Unexpected token "${this.peek()?.value}"`);
    }
    return value;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private eat(value?: string): Token {
    const tok = this.tokens[this.pos];
    if (!tok) throw new FormulaError("Unexpected end of expression");
    if (value !== undefined && tok.value !== value) {
      throw new FormulaError(`Expected "${value}" but got "${tok.value}"`);
    }
    this.pos++;
    return tok;
  }

  private isOp(value: string): boolean {
    const tok = this.peek();
    return !!tok && tok.type === "op" && tok.value === value;
  }

  // ternary := logicalOr ("?" ternary ":" ternary)?
  private ternary(): number {
    const cond = this.logicalOr();
    if (this.isOp("?")) {
      this.eat("?");
      const whenTrue = this.ternary();
      this.eat(":");
      const whenFalse = this.ternary();
      return cond ? whenTrue : whenFalse;
    }
    return cond;
  }

  private logicalOr(): number {
    let left = this.logicalAnd();
    while (this.isOp("||")) {
      this.eat("||");
      const right = this.logicalAnd();
      left = left || right ? 1 : 0;
    }
    return left;
  }

  private logicalAnd(): number {
    let left = this.equality();
    while (this.isOp("&&")) {
      this.eat("&&");
      const right = this.equality();
      left = left && right ? 1 : 0;
    }
    return left;
  }

  private equality(): number {
    let left = this.comparison();
    while (this.isOp("==") || this.isOp("!=")) {
      const op = this.eat().value;
      const right = this.comparison();
      left = (op === "==" ? left === right : left !== right) ? 1 : 0;
    }
    return left;
  }

  private comparison(): number {
    let left = this.additive();
    while (this.isOp("<") || this.isOp(">") || this.isOp("<=") || this.isOp(">=")) {
      const op = this.eat().value;
      const right = this.additive();
      const r =
        op === "<" ? left < right
        : op === ">" ? left > right
        : op === "<=" ? left <= right
        : left >= right;
      left = r ? 1 : 0;
    }
    return left;
  }

  private additive(): number {
    let left = this.multiplicative();
    while (this.isOp("+") || this.isOp("-")) {
      const op = this.eat().value;
      const right = this.multiplicative();
      left = op === "+" ? left + right : left - right;
    }
    return left;
  }

  private multiplicative(): number {
    let left = this.unary();
    while (this.isOp("*") || this.isOp("/") || this.isOp("%")) {
      const op = this.eat().value;
      const right = this.unary();
      left = op === "*" ? left * right : op === "/" ? left / right : left % right;
    }
    return left;
  }

  private unary(): number {
    if (this.isOp("-")) {
      this.eat("-");
      return -this.unary();
    }
    if (this.isOp("+")) {
      this.eat("+");
      return this.unary();
    }
    if (this.isOp("!")) {
      this.eat("!");
      return this.unary() ? 0 : 1;
    }
    return this.power();
  }

  // power := primary ("^" unary)?  — right associative
  private power(): number {
    const base = this.primary();
    if (this.isOp("^")) {
      this.eat("^");
      const exp = this.unary();
      return Math.pow(base, exp);
    }
    return base;
  }

  private primary(): number {
    const tok = this.peek();
    if (!tok) throw new FormulaError("Unexpected end of expression");

    if (tok.type === "num") {
      this.eat();
      return Number(tok.value);
    }

    if (tok.type === "paren" && tok.value === "(") {
      this.eat("(");
      const value = this.ternary();
      this.eat(")");
      return value;
    }

    if (tok.type === "ident") {
      this.eat();
      const name = tok.value;

      // Function call?
      if (this.peek()?.type === "paren" && this.peek()?.value === "(") {
        const fn = FUNCTIONS[name];
        if (!fn) throw new FormulaError(`Unknown function "${name}"`);
        this.eat("(");
        const args: number[] = [];
        if (!(this.peek()?.type === "paren" && this.peek()?.value === ")")) {
          args.push(this.ternary());
          while (this.peek()?.type === "comma") {
            this.eat();
            args.push(this.ternary());
          }
        }
        this.eat(")");
        return fn(...args);
      }

      // Constant?
      if (name in CONSTANTS) return CONSTANTS[name];

      // Variable
      if (name in this.vars) {
        const v = this.vars[name];
        return Number.isFinite(v) ? v : 0;
      }
      throw new FormulaError(`Unknown variable "${name}"`);
    }

    throw new FormulaError(`Unexpected token "${tok.value}"`);
  }
}

// ---- Public API ------------------------------------------------------------

/** Coerce arbitrary tool inputs into a numeric variable map for the parser. */
function toNumericVars(inputs: Record<string, number | string>): Record<string, number> {
  const vars: Record<string, number> = {};
  for (const [key, raw] of Object.entries(inputs)) {
    const n = typeof raw === "number" ? raw : parseFloat(String(raw));
    vars[key] = Number.isFinite(n) ? n : 0;
  }
  return vars;
}

/**
 * Evaluate a formula string against a set of inputs. Throws FormulaError on any
 * malformed / unsafe input. Result is always a finite number (NaN/Infinity → 0
 * would hide bugs, so we surface them as an error instead).
 */
export function evaluateExpression(
  expression: string,
  inputs: Record<string, number | string>,
): number {
  if (typeof expression !== "string" || expression.trim() === "") {
    throw new FormulaError("Empty expression");
  }
  const tokens = tokenize(expression);
  const parser = new Parser(tokens, toNumericVars(inputs));
  const result = parser.parse();
  if (!Number.isFinite(result)) {
    throw new FormulaError("Expression produced a non-finite result");
  }
  return result;
}

/**
 * Static validation used by the AI generator before persisting a tool: confirms
 * the expression parses and only references the tool's declared input names.
 */
export function validateExpression(
  expression: string,
  allowedVars: string[],
): { ok: true } | { ok: false; error: string } {
  try {
    const probe: Record<string, number> = {};
    for (const name of allowedVars) probe[name] = 1;
    evaluateExpression(expression, probe);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
