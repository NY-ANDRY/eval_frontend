# String Methods in TypeScript / JavaScript

This document lists the most common `String` methods used in TypeScript / JavaScript.

---

## 🔹 Length & Access

* `length` → size of string

```ts
"hello".length; // 5
```

* `charAt(index)` → character at position

```ts
"hello".charAt(1); // "e"
```

* `at(index)` → character with support for negative index

```ts
"hello".at(-1); // "o"
```

---

## 🔹 Search Methods

* `includes()` → checks if string contains value

```ts
"hello".includes("el"); // true
```

👉 Returns: `boolean` (true / false)

---

* `indexOf()` → first occurrence position

```ts
"hello".indexOf("l"); // 2
"hello".indexOf("z"); // -1
```

👉 Returns: `number`

* Found → index (0, 1, 2, ...)
* Not found → `-1`

---

* `lastIndexOf()` → last occurrence position

```ts
"hello".lastIndexOf("l"); // 3
"hello".lastIndexOf("z"); // -1
```

👉 Returns: `number`

* Found → index
* Not found → `-1`

---

* `startsWith()` → checks beginning

```ts
"hello".startsWith("he"); // true
```

👉 Returns: `boolean`

---

* `endsWith()` → checks ending

```ts
"hello".endsWith("lo"); // true
```

👉 Returns: `boolean`

## 🔹 Extraction Methods

* `slice(start, end)`

```ts
"hello".slice(1, 4); // "ell"
```

* `substring(start, end)`

```ts
"hello".substring(1, 4); // "ell"
```

* `substr(start, length)` *(deprecated)*

```ts
"hello".substr(1, 3); // "ell"
```

---

## 🔹 Transformation Methods

* `toUpperCase()`

```ts
"hello".toUpperCase(); // "HELLO"
```

* `toLowerCase()`

```ts
"HELLO".toLowerCase(); // "hello"
```

* `trim()` → remove spaces around

```ts
"  hi  ".trim(); // "hi"
```

* `trimStart()`

```ts
"  hi".trimStart();
```

* `trimEnd()`

```ts
"hi  ".trimEnd();
```

---

## 🔹 Replace Methods

* `replace()` → replace first match

```ts
"hello".replace("l", "x"); // "hexlo"
```

* `replaceAll()` → replace all matches

```ts
"hello".replaceAll("l", "x"); // "hexxo"
```

---

## 🔹 Split & Join

* `split()` → string to array

```ts
"a,b,c".split(","); // ["a", "b", "c"]
```

* `join()` → array to string

```ts
["a", "b", "c"].join("-"); // "a-b-c"
```

---

## 🔹 Padding

* `padStart()`

```ts
"5".padStart(3, "0"); // "005"
```

* `padEnd()`

```ts
"5".padEnd(3, "0"); // "500"
```

---

## 🔹 Repeat

* `repeat()`

```ts
"ha".repeat(3); // "hahaha"
```

---

## 🔹 Comparison

* `localeCompare()`

```ts
"a".localeCompare("b"); // -1
```

---

## 🔹 Normalization

* `normalize()`

```ts
"é".normalize("NFC");
```

---

## 🔹 Conversion

* `toString()`

```ts
(123).toString();
```

* `valueOf()`

```ts
"hello".valueOf();
```
