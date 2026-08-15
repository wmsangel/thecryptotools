import { evaluateExpression, FormulaError } from "./formula";
import type {
  StructuredResult,
  ToolConfig,
  ToolInputs,
} from "./types";

export interface RunOutcome {
  ok: boolean;
  result?: StructuredResult;
  error?: string;
}

function prettyLabel(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

/** Normalize any formula return shape into a StructuredResult. */
function normalize(
  raw: number | string | StructuredResult,
  tool: ToolConfig,
): StructuredResult {
  if (typeof raw === "number" || typeof raw === "string") {
    return {
      value: raw,
      unit: tool.resultUnit,
      label: tool.resultLabel,
    };
  }
  return {
    ...raw,
    unit: raw.unit ?? tool.resultUnit,
    label: raw.label ?? tool.resultLabel,
  };
}

/**
 * Execute a tool against user inputs. Runs `compute` if present, otherwise the
 * safe `expression` evaluator. Never throws — errors are returned as data so the
 * UI can render them inline.
 */
export function runTool(tool: ToolConfig, inputs: ToolInputs): RunOutcome {
  try {
    // Guard: required numeric fields must be present & finite.
    for (const input of tool.inputs) {
      if (input.optional) continue;
      const v = inputs[input.name];
      if (v === "" || v === undefined || v === null) {
        return { ok: false, error: `Enter a value for "${input.label ?? prettyLabel(input.name)}"` };
      }
      if (input.type === "number" && !Number.isFinite(Number(v))) {
        return { ok: false, error: `"${input.label ?? prettyLabel(input.name)}" must be a number` };
      }
    }

    let raw: number | string | StructuredResult;
    if (typeof tool.compute === "function") {
      raw = tool.compute(inputs);
    } else if (typeof tool.expression === "string") {
      raw = evaluateExpression(tool.expression, inputs);
    } else {
      return { ok: false, error: "This tool has no formula configured." };
    }

    return { ok: true, result: normalize(raw, tool) };
  } catch (err) {
    const msg =
      err instanceof FormulaError
        ? err.message
        : err instanceof Error
          ? err.message
          : "Calculation failed";
    return { ok: false, error: msg };
  }
}

/** Build the initial inputs object from each input's `default`. */
export function defaultInputs(tool: ToolConfig): ToolInputs {
  const out: ToolInputs = {};
  for (const input of tool.inputs) {
    out[input.name] =
      input.default ?? (input.type === "number" ? "" : "");
  }
  return out;
}
