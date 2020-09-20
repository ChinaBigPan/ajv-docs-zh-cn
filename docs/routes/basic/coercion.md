---
title: 强制类型转换
sidebarDepth: 2
---

# Ajv 类型强制转换

为了启用强制类型转换，将`coerceTypes`配置项传递给 Ajv，值为`true`或`array`(默认情况下为`false`)。

该强制类型转换和 JavaScript 并不相同：

- 按期望验证用户的输入。
- 该强制转换是可逆的。
- 正确地验证子级 schema 中需要不同类型的情况(比如在`anyOf`中)。

只有在存在`type`关键字的情况下才会强制转换，如果没有强制转换，验证就会失败。如果强制转换后的类型满足规则，则会继续验证其他关键字，否则验证就会失败。

如果`type`关键字允许多个类型，则强制转换只会在没有任何类型与数据匹配且存在某些值类型时发生(不可能从/到`object`/`array`强制转换)。在这种情况下，验证函数将尝试按顺序强制转换数据为每个类型，知道其中一些成功为止。

这些转换规则可能会产生一些意想不到的结果。Ajv 可以按需在 schema 中的不同点强制多次转换相同的值(这就是为什么强制转换必须可逆)。这在使用`of`时尤其明显，它必须测试所有的子级 schema。Ajv 将强制转换每个子级 schema 的类型，如果强制转换匹配多个子级 schema，可能会导致意外的失败。即使成功，Ajv 也不会回溯，因此您将获得最终强制转换后的类型，**即使它不是允许数据通过验证的类型**。如果可能的话，使用`anyOf`来构造您的 schema，它不会在遇到匹配的子级 schema 时立即验证后续的子级 schema。

可能的强制类型转换：

<table>
<thead>
<tr>
<th>类型转换→<br>转换类型↓</th>
<th align="center">string</th>
<th align="center">number</th>
<th align="center">boolean</th>
<th align="center">null</th>
<th align="center">array*</th>
</tr>
</thead>
<tbody>
<tr>
<td>string</td>
<td align="center">-</td>
<td align="center"><code>x</code>→<code>""+x</code></td>
<td align="center"><code>false</code>→<code>"false"</code><br><code>true</code>→<code>"true"</code></td>
<td align="center"><code>null</code>→<code>""</code></td>
<td align="center"><code>[x]</code>→<code>x</code></td>
</tr>
<tr>
<td>number /integer</td>
<td align="center">Valid number /<br>integer: <code>x</code>→<code>+x</code><br></td>
<td align="center">-</td>
<td align="center"><code>false</code>→<code>0</code><br><code>true</code>→<code>1</code></td>
<td align="center"><code>null</code>→<code>0</code></td>
<td align="center"><code>[x]</code>→<code>x</code></td>
</tr>
<tr>
<td>boolean</td>
<td align="center"><code>"false"</code>→<code>false</code><br><code>"true"</code>→<code>true</code><br><code>"abc"</code>⇸<br><code>""</code>⇸</td>
<td align="center"><code>0</code>→<code>false</code><br><code>1</code>→<code>true</code><br><code>x</code>⇸</td>
<td align="center">-</td>
<td align="center"><code>null</code>→<code>false</code></td>
<td align="center"><code>[false]</code>→<code>false</code><br><code>[true]</code>→<code>true</code></td>
</tr>
<tr>
<td>null</td>
<td align="center"><code>""</code>→<code>null</code><br><code>"null"</code>⇸<br><code>"abc"</code>⇸</td>
<td align="center"><code>0</code>→<code>null</code><br><code>x</code>⇸</td>
<td align="center"><code>false</code>→<code>null</code><br><code>true</code>⇸</td>
<td align="center">-</td>
<td align="center"><code>[null]</code>→<code>null</code></td>
</tr>
<tr>
<td>array*</td>
<td align="center"><code>x</code>→<code>[x]</code></td>
<td align="center"><code>x</code>→<code>[x]</code></td>
<td align="center"><code>false</code>→<code>[false]</code><br><code>true</code>→<code>[true]</code></td>
<td align="center"><code>null</code>→<code>[null]</code></td>
<td align="center">-</td>
</tr>
</tbody>
</table>

* 需要配置`{coerceTypes: 'array'}`

## 强制转换字符串

### 转换成数字

如果字符串是一个有效的数字，则可以强制转换为`number`，使用`+data`。

### 转换为整形

如果字符串是一个没有小数部分的有效数字(`data % 1 === 0`)，可以强制转换为`integer`。

### 转换为布尔类型

与 JavaScript 不同，只有这些字符串可以强制转换为`boolean`:

- `"true"` -> `true`
- `"false"` -> `false`

### 转换为 null 类型

空字符串强制转换为`null`，其他字符串则无效。

## 强制转换数字值

### 转换成字符串

使用`"" + data`转换，总是有效。

### 转换成布尔值

与 JavaScript 不同，只有这些数字可以强制转换为`boolean`:

- `1` -> `true`
- `0` -> `false`

### 转换为 null 类型

`0`强制转换为`null`，其他数字则无效。

## 强制转换布尔值

### 转换为字符串类型

- `true` -> `"true"`
- `false` -> `"false"`

### 转换为数字/整形

- `true` -> `1`
- `false` -> `0`
  
### 转换为 null 类型

`false`转换为`null`，`true`不能转换。

## 转换 null

### 转换为字符串类型

`null`转换为空字符串。

### 转换为数字/整形

`null`转换为`0`

### 转换为布尔值类型

`null`转换为`false`

## 与数组的转换

该强制转换需要配置`coerceTypes`的值为`"array"`。

如果存在值类型数据，并且需要数组，Ajv 将值类型数据包装在数组中。

如果一个数组有只有一个元素，并且所需的是值类型，Ajv 将把数组强制转换为单个元素。

- `"foo"` -> `[ "foo" ]`
- `[ "foo" ]` -> `"foo"`