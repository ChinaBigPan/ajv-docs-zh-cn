function getBasicSideBar() {
    return [
        "",
        "validation",
        "cli",
        "pack",
        "keywords",
        "custom",
        "merge_patch",
        "async"
    ]
}

function getAPISideBar() {
    return ["api"]
}


module.exports= {
    title: 'Ajv',
    description: "Ajv: Another JSON Schema Validator。Node.js和浏览器中最快速的JSON Schema验证器。",
    base: "/ajv-docs-cn/",
    markdown: {
        lineNumbers: true,
        anchor: {
            permalink: false
        }
    },
    themeConfig: {
        activeHeaderLinks: true,
        displayAllHeaders: false,
        nav: [
            // {
            //     text: "主站",
            //     link: "http://www.febeacon.com"
            // },
            {
                text: "文档首页",
                link: "/"
            },
            {
                text: "API",
                link: "/routes/api/api.html"
            }
        ],
        sidebar: {
            "/routes/basic/": getBasicSideBar(),
            "/routes/api/": getAPISideBar()
        }
    },
    head: [
        ["link", {
            rel: "icon", href: "/images/favicon.ico"
        }]
    ]
}