# Как добавить новый инструмент

Каждый инструмент — это **один файл-конфиг**. Добавление = 2 шага.

## Шаг 1. Создай файл конфига

`src/lib/tools/configs/my-tool.ts`:

```ts
import type { ToolConfig } from "../types";
import { fmtUsd } from "@/lib/format";

const tool: ToolConfig = {
  slug: "my-tool",                     // URL: /tools/my-tool
  title: "My Crypto Tool",
  description: "Короткое описание того, что делает инструмент.",
  category: "trading",                 // trading|grid|portfolio|market|ai|dev|converters|defi|mining
  popular: true,                       // покажется в «Popular» (необязательно)
  seo: {
    keywords: ["ключевое слово", "crypto calculator"],
    description: "SEO-описание для поисковиков.",
  },
  inputs: [
    { name: "amount", label: "Amount", type: "number", suffix: "USD", default: 100 },
    { name: "rate", label: "Rate", type: "number", suffix: "%", default: 5 },
  ],
  resultLabel: "Result",
  resultUnit: "USD",
  compute: (i) => {
    const value = Number(i.amount) * (Number(i.rate) / 100);
    return { value: fmtUsd(value), breakdown: [{ label: "Detail", value: fmtUsd(value) }] };
  },
  faq: [
    { q: "Как это считается?", a: "Опиши формулу простыми словами." },
  ],
};

export default tool;
```

### Что можно возвращать из `compute`

- просто число или строку → `return 42;`
- или структуру с разбивкой:
  ```ts
  return {
    value: "123.45",
    unit: "USD",
    breakdown: [{ label: "Fees", value: "1.20", emphasis: true }],
    note: "Пояснение под результатом (необязательно).",
  };
  ```

### Типы полей ввода (`inputs`)

- `type: "number"` — число (можно `suffix`, `min`, `max`, `step`, `default`)
- `type: "text"` — строка
- `type: "select"` — выпадающий список: `options: [{ label, value }]`

## Шаг 2. Зарегистрируй инструмент

В `src/lib/tools/registry.ts` добавь импорт и строку в массив:

```ts
import myTool from "./configs/my-tool";
// ...
const builtinTools: ToolConfig[] = [
  // ...существующие,
  myTool,
];
```

## Готово

Страница `/tools/my-tool`, SEO-мета, JSON-LD, запись в `sitemap.xml` и внутренние
ссылки подхватятся автоматически. Дальше:

```bash
npm run build     # пересобрать статику
# залить папку out/ на хостинг
```

---

## Формула строкой (без функции)

Если хочешь конфиг, который легко хранить/копировать, вместо `compute` можно задать
`expression` — безопасную строку-формулу (её считает собственный парсер, без `eval`):

```ts
inputs: [{ name: "btc", label: "Bitcoin (BTC)", type: "number", default: 0.05 }],
expression: "btc * 100000000",
resultUnit: "sats",
```

Доступно в формулах: `+ - * / % ^ ( )`, сравнения `< > <= >= == !=`, логика
`&& || !`, тернарник `cond ? a : b` и функции `min, max, abs, sqrt, round, floor,
ceil, pow, log, clamp`. Переменные — только имена из `inputs`.
Пример живого инструмента на строке-формуле: `configs/satoshi-converter.ts`.
