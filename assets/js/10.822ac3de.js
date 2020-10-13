(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{355:function(t,e,a){"use strict";a.r(e);var s=a(43),n=Object(s.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"验证错误"}},[t._v("验证错误")]),t._v(" "),a("p",[a("a",{attrs:{href:"https://github.com/ajv-validator/ajv#validation-errors",target:"_blank",rel:"noopener noreferrer"}},[t._v("英文原地址"),a("OutboundLink")],1)]),t._v(" "),a("p",[t._v("在验证失败的情况下，Ajv 将错误数组分配各验证函数的"),a("code",[t._v("errors")]),t._v("属性(或在调用"),a("code",[t._v("validate")]),t._v("或"),a("code",[t._v("validateSchema")]),t._v("方法时分配给"),a("code",[t._v("Ajv")]),t._v("实例的"),a("code",[t._v("errors")]),t._v("属性)。在"),a("a",{attrs:{href:"https://github.com/ajv-validator/ajv#asynchronous-validation",target:"_blank",rel:"noopener noreferrer"}},[t._v("异步验证"),a("OutboundLink")],1),t._v("的情况下，返回拥有"),a("code",[t._v("errors")]),t._v("属性的"),a("code",[t._v("Ajv.ValidationError")]),t._v("错误的 rejected Promise。")]),t._v(" "),a("h2",{attrs:{id:"错误对象"}},[t._v("错误对象")]),t._v(" "),a("p",[t._v("每个错误对象都拥有下面的属性：")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"center"}},[t._v("属性")]),t._v(" "),a("th",[t._v("描述")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"center"}},[a("code",[t._v("keyword")])]),t._v(" "),a("td",[t._v("验证关键词")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"center"}},[a("code",[t._v("dataPath")])]),t._v(" "),a("td",[t._v("已验证的那部分数据的路径。默认情况下"),a("code",[t._v("dataPath")]),t._v("使用 JavaScript 的属性访问(如 "),a("code",[t._v('".prop[1].subProp"')]),t._v(")。当"),a("code",[t._v("jsonPointers")]),t._v("为"),a("code",[t._v("true")]),t._v("时，"),a("code",[t._v("dataPath")]),t._v("将使用 JSON 指针标准进行设置(如 "),a("code",[t._v('"/prop/1/subProp"')]),t._v(")")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"center"}},[a("code",[t._v("schemaPath")])]),t._v(" "),a("td",[t._v("验证失败的关键字的 schema 的路径(JSON 指针作为 URI 片段)。")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"center"}},[a("code",[t._v("params")])]),t._v(" "),a("td",[t._v("带有关于错误的附加信息的对象，可用于创建自定义错误消息(例如，使用"),a("a",{attrs:{href:"https://github.com/ajv-validator/ajv-i18n",target:"_blank",rel:"noopener noreferrer"}},[t._v("ajv-i18n"),a("OutboundLink")],1),t._v("包)。请参阅下面所有关键字设置的参数。")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"center"}},[a("code",[t._v("message")])]),t._v(" "),a("td",[t._v("标准错误消息(可以通过将配置项"),a("code",[t._v("messages")]),t._v("设置为"),a("code",[t._v("false")]),t._v("来排除)。")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"center"}},[a("code",[t._v("schema")])]),t._v(" "),a("td",[t._v("关键字的 schema (使用"),a("code",[t._v("verbose")]),t._v("配置项添加)。")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"center"}},[a("code",[t._v("parentSchema")])]),t._v(" "),a("td",[t._v("包含关键字的 schema (使用"),a("code",[t._v("verbose")]),t._v("配置项添加)。")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"center"}},[a("code",[t._v("data")])]),t._v(" "),a("td",[t._v("通过关键字验证数据(使用"),a("code",[t._v("verbose")]),t._v("配置项添加)。")])])])]),t._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[t._v("请注意")]),t._v(" "),a("p",[a("code",[t._v("propertyNames")]),t._v("关键字 schema 验证错误拥有指向对象的附加属性"),a("code",[t._v("propertyName")]),t._v("、"),a("code",[t._v("dataPath")]),t._v("。对每个属性名进行 schema 验证之后，如果无效，则会添加一个附加错误，其"),a("code",[t._v("keyword")]),t._v("属性和"),a("code",[t._v("propertyName")]),t._v("相等。")])]),t._v(" "),a("h2",{attrs:{id:"错误参数"}},[t._v("错误参数")]),t._v(" "),a("p",[t._v("错误中的"),a("code",[t._v("params")]),t._v("对象的属性取决于验证失败的关键字。")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("maxItems")]),t._v("、"),a("code",[t._v("minItems")]),t._v("、"),a("code",[t._v("maxLength")]),t._v("、"),a("code",[t._v("minLength")]),t._v("、"),a("code",[t._v("maxProperties")]),t._v("、"),a("code",[t._v("minProperties")]),t._v(" —— "),a("code",[t._v("limit")]),t._v("属性(关键字的 schema，数字类型)。")]),t._v(" "),a("li",[a("code",[t._v("additionalItems")]),t._v(" —— "),a("code",[t._v("limit")]),t._v("属性(如果"),a("code",[t._v("items")]),t._v("关键字是 schema 数组且"),a("code",[t._v("additionalItems")]),t._v("为"),a("code",[t._v("false")]),t._v("，则允许的最大项数量)。")]),t._v(" "),a("li",[a("code",[t._v("additionalProperties")]),t._v(" —— "),a("code",[t._v("additionalProperty")]),t._v("属性(该属性并未在"),a("code",[t._v("properties")]),t._v("和"),a("code",[t._v("patternProperties")]),t._v("关键字中使用)。")]),t._v(" "),a("li",[a("code",[t._v("dependencies")]),t._v(" - 属性：\n"),a("ul",[a("li",[a("code",[t._v("property")]),t._v("(依赖属性)。")]),t._v(" "),a("li",[a("code",[t._v("missingProperty")]),t._v("(所需缺少的依赖项 —— 目前只报告第一个)。")]),t._v(" "),a("li",[a("code",[t._v("deps")]),t._v("(所需的依赖，用逗号分隔的字符串列表)。")]),t._v(" "),a("li",[a("code",[t._v("depsCount")]),t._v("(所需依赖数)。")])])]),t._v(" "),a("li",[a("code",[t._v("format")]),t._v(" —— "),a("code",[t._v("format")]),t._v("属性(关键字的 schema)。")]),t._v(" "),a("li",[a("code",[t._v("maximum")]),t._v("、"),a("code",[t._v("minimum")]),t._v(" —— 属性：\n"),a("ul",[a("li",[a("code",[t._v("limit")]),t._v("(关键字的 schema，数字类型)。")]),t._v(" "),a("li",[a("code",[t._v("exclusive")]),t._v("("),a("code",[t._v("exclusiveMaximum")]),t._v("或"),a("code",[t._v("exclusiveMinimum")]),t._v("的 schema，布尔类型)。")]),t._v(" "),a("li",[a("code",[t._v("comparison")]),t._v("(比较运算，将位于左侧的数据与位于右侧限制条件进行比较；可以为"),a("code",[t._v('"<"')]),t._v("、"),a("code",[t._v('"<="')]),t._v("、"),a("code",[t._v('">"')]),t._v("、"),a("code",[t._v('">="')]),t._v("、字符串类型)。")])])]),t._v(" "),a("li",[a("code",[t._v("multipleOf")]),t._v(" - "),a("code",[t._v("multipleOf")]),t._v("属性(关键字的 schema)。")]),t._v(" "),a("li",[a("code",[t._v("pattern")]),t._v(" - "),a("code",[t._v("pattern")]),t._v("(关键字的 schema)。")]),t._v(" "),a("li",[a("code",[t._v("required")]),t._v(" - "),a("code",[t._v("missingProperty")]),t._v("属性(缺失的属性)。")]),t._v(" "),a("li",[a("code",[t._v("propertyNames")]),t._v(" - "),a("code",[t._v("propertyName")]),t._v("属性(无效的属性名称)。")]),t._v(" "),a("li",[a("code",[t._v("patternRequired")]),t._v(" - (ajv-keyword 中的)"),a("code",[t._v("missingPattern")]),t._v("属性(不匹配任何属性的必需通配符)。")]),t._v(" "),a("li",[a("code",[t._v("type")]),t._v(" - "),a("code",[t._v("type")]),t._v("属性(所需的类型，用逗号分隔的字符串列表)。")]),t._v(" "),a("li",[a("code",[t._v("uniqueItems")]),t._v(" - "),a("code",[t._v("i")]),t._v("和"),a("code",[t._v("j")]),t._v("属性(重复的索引项)。")]),t._v(" "),a("li",[a("code",[t._v("const")]),t._v(" - "),a("code",[t._v("allowedValue")]),t._v("属性指向的值(关键字的 schema)。")]),t._v(" "),a("li",[a("code",[t._v("enum")]),t._v(" - "),a("code",[t._v("allowedValue")]),t._v("属性指向的值的数组(关键字的 schema)。")]),t._v(" "),a("li",[a("code",[t._v("$ref")]),t._v(" - "),a("code",[t._v("ref")]),t._v("属性引用的 schema URI。")]),t._v(" "),a("li",[a("code",[t._v("oneOf")]),t._v(" - "),a("code",[t._v("passingSchemas")]),t._v("属性(传入 schema 的索引数组，如果没有传入 schema 则为空)。")]),t._v(" "),a("li",[t._v("自定义关键字(防止关键字定义不会产生错误) - "),a("code",[t._v("keyword")]),t._v("属性(关键字的名称)。")])]),t._v(" "),a("h2",{attrs:{id:"错误日志"}},[t._v("错误日志")]),t._v(" "),a("p",[t._v("在初始化 Ajv 时使用"),a("code",[t._v("logger")]),t._v("配置项将允许您定义自定义日志。这里您可以构建现有的日志。也可以使用其他的日志库，只要该库向外暴露了所需的方法即可。如果缺少所需的方法会抛出异常。")]),t._v(" "),a("ul",[a("li",[a("strong",[t._v("所需的方法：")]),a("code",[t._v("log")]),t._v("、"),a("code",[t._v("warn")]),t._v("、"),a("code",[t._v("error")])])]),t._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" otherLogger "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("OtherLogger")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" ajv "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Ajv")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  logger"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    log"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("bind")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("warn")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("warn")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      otherLogger"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("logWarn")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("apply")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("otherLogger"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" arguments"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("error")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("error")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      otherLogger"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("logError")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("apply")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("otherLogger"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" arguments"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n      console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("error")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("apply")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" arguments"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br"),a("span",{staticClass:"line-number"},[t._v("9")]),a("br"),a("span",{staticClass:"line-number"},[t._v("10")]),a("br"),a("span",{staticClass:"line-number"},[t._v("11")]),a("br"),a("span",{staticClass:"line-number"},[t._v("12")]),a("br"),a("span",{staticClass:"line-number"},[t._v("13")]),a("br")])])])}),[],!1,null,null,null);e.default=n.exports}}]);