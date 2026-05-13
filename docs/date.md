# Date Methods in TypeScript / JavaScript

This document lists the most common `Date` methods used in TypeScript / JavaScript, including handling dates coming from `<input type="date">` and `<input type="datetime-local">`.

---

# 🔹 Create a Date

## `new Date()` → current date & time

```ts
const now = new Date();
console.log(now);
```

👉 Returns: `Date`

---

## `new Date(string)` → create from string

```ts
new Date("2025-07-14");
```

👉 Returns: `Date`

⚠️ Be careful with timezone issues depending on format.

---

## `new Date(year, monthIndex, day, hours, minutes, seconds, ms)`

⚠️ `monthIndex` starts at `0`

* January = `0`
* December = `11`

```ts
new Date(2025, 6, 14); // July 14, 2025
```

👉 Returns: `Date`

---

## `Date.now()` → current timestamp

```ts
Date.now();
```

👉 Returns: `number`

(milliseconds since `1970-01-01`)

---

# 🔹 HTML Input Date & DateTime

## `<input type="date">`

HTML:

```html
<input type="date" id="birthDate">
```

Returned value format:

```ts
"2025-07-14"
```

👉 Type: `string`

Format:

```txt
YYYY-MM-DD
```

Example:

```ts
const value = input.value;

console.log(value);
// "2025-07-14"
```

---

## Convert `<input type="date">` to `Date`

```ts
const date = new Date(input.value);
```

Example:

```ts
const value = "2025-07-14";

const date = new Date(value);

console.log(date);
```

👉 Returns: `Date`

---

## `<input type="datetime-local">`

HTML:

```html
<input type="datetime-local" id="meeting">
```

Returned value format:

```ts
"2025-07-14T15:30"
```

👉 Type: `string`

Format:

```txt
YYYY-MM-DDTHH:mm
```

Example:

```ts
const value = input.value;

console.log(value);
// "2025-07-14T15:30"
```

---

## Convert `<input type="datetime-local">` to `Date`

```ts
const date = new Date(input.value);
```

Example:

```ts
const value = "2025-07-14T15:30";

const date = new Date(value);

console.log(date);
```

👉 Returns: `Date`

---

## Convert `Date` → `<input type="date">` value

To set a date input value:

```ts
const date = new Date();

const value = date.toISOString().split("T")[0];

console.log(value);
// "2025-07-14"
```

👉 Returns: `string`

Format:

```txt
YYYY-MM-DD
```

Usage:

```ts
input.value = value;
```

⚠️ `toISOString()` uses UTC timezone.

Sometimes local timezone is safer:

```ts
const date = new Date();

const yyyy = date.getFullYear();
const mm = String(date.getMonth() + 1).padStart(2, "0");
const dd = String(date.getDate()).padStart(2, "0");

const formatted = `${yyyy}-${mm}-${dd}`;
```

---

## Convert `Date` → `<input type="datetime-local">`

```ts
const date = new Date();

const yyyy = date.getFullYear();
const mm = String(date.getMonth() + 1).padStart(2, "0");
const dd = String(date.getDate()).padStart(2, "0");

const hh = String(date.getHours()).padStart(2, "0");
const min = String(date.getMinutes()).padStart(2, "0");

const formatted =
  `${yyyy}-${mm}-${dd}T${hh}:${min}`;

console.log(formatted);
// "2025-07-14T15:30"
```

👉 Returns: `string`

Usage:

```ts
input.value = formatted;
```

---

# 🔹 Get Date Values

## `getFullYear()` → year

```ts
new Date().getFullYear();
```

👉 Returns: `number`

---

## `getMonth()` → month (`0 - 11`)

```ts
new Date().getMonth();
```

👉 Returns: `number`

⚠️ January = `0`

---

## `getDate()` → day of month (`1 - 31`)

```ts
new Date().getDate();
```

👉 Returns: `number`

---

## `getDay()` → weekday (`0 - 6`)

```ts
new Date().getDay();
```

👉 Returns: `number`

| Value | Day |
|--------|-----|
| 0 | Sunday |
| 1 | Monday |
| 6 | Saturday |

---

## `getHours()`

```ts
new Date().getHours();
```

👉 Returns: `number`

---

## `getMinutes()`

```ts
new Date().getMinutes();
```

👉 Returns: `number`

---

## `getSeconds()`

```ts
new Date().getSeconds();
```

👉 Returns: `number`

---

## `getMilliseconds()`

```ts
new Date().getMilliseconds();
```

👉 Returns: `number`

---

## `getTime()` → timestamp

```ts
new Date().getTime();
```

👉 Returns: `number`

---

# 🔹 Set Date Values

## `setFullYear(year)`

```ts
const d = new Date();

d.setFullYear(2030);
```

👉 Returns: `number`

(timestamp)

---

## `setMonth(monthIndex)`

```ts
d.setMonth(11);
```

👉 Returns: `number`

---

## `setDate(day)`

```ts
d.setDate(15);
```

👉 Returns: `number`

---

## `setHours(hours)`

```ts
d.setHours(18);
```

👉 Returns: `number`

---

## `setMinutes(minutes)`

```ts
d.setMinutes(30);
```

👉 Returns: `number`

---

## `setSeconds(seconds)`

```ts
d.setSeconds(45);
```

👉 Returns: `number`

---

## `setMilliseconds(ms)`

```ts
d.setMilliseconds(500);
```

👉 Returns: `number`

---

# 🔹 Formatting Methods

## `toString()`

```ts
new Date().toString();
```

👉 Returns: `string`

---

## `toDateString()`

```ts
new Date().toDateString();
```

👉 Returns: `string`

---

## `toTimeString()`

```ts
new Date().toTimeString();
```

👉 Returns: `string`

---

## `toISOString()`

```ts
new Date().toISOString();
```

👉 Returns: `string`

Example:

```txt
2025-07-14T12:30:00.000Z
```

---

## `toLocaleDateString()`

```ts
new Date().toLocaleDateString("fr-FR");
```

👉 Returns: `string`

---

## `toLocaleTimeString()`

```ts
new Date().toLocaleTimeString("fr-FR");
```

👉 Returns: `string`

---

## `toLocaleString()`

```ts
new Date().toLocaleString("fr-FR");
```

👉 Returns: `string`

---

# 🔹 Comparison

## Compare dates

```ts
const d1 = new Date("2025-01-01");
const d2 = new Date("2026-01-01");

d1.getTime() < d2.getTime();
```

👉 Returns: `boolean`

---

# 🔹 Validation

## Check if date is valid

```ts
const d = new Date("invalid");

isNaN(d.getTime());
```

👉 Returns: `boolean`

* `true` → invalid date
* `false` → valid date

---

# 🔹 Useful Examples

## Add days

```ts
const d = new Date();

d.setDate(d.getDate() + 7);
```

---

## Remove months

```ts
const d = new Date();

d.setMonth(d.getMonth() - 1);
```

---

## Difference between dates (days)

```ts
const d1 = new Date("2025-01-01");
const d2 = new Date("2025-01-10");

const diffMs =
  d2.getTime() - d1.getTime();

const diffDays =
  diffMs / (1000 * 60 * 60 * 24);

console.log(diffDays);
// 9
```