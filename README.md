# x-novel-parse

小说页内容以及目录提取

# 使用

安装
```shell
npm i x-novel-parse
# or
yarn add x-novel-parse
```

使用
```js
import { parseContent, parseCatalog } from 'x-novel-parse';

const res = parseContent(document);

```

# 功能及优点

项目代码极小，打包出的代码es6版本的代码(压缩后的)为2.1k. es5版本的代码为3k。

源码使用的是一种算法实现的数据结构，位于[datastructure.ts](./src/datastructure.ts)，而不是使用正则（代码里面无正则的使用），性能十分优秀。导出的函数是最小的实现，方便在函数运行前后进行性能上报，以及实现其他各种业务需求。
